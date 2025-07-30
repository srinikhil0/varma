/**
 * Translation Service for Dynamic Content Only
 * 
 * This service is used ONLY for translating dynamic content (user's personal information, 
 * research details, etc.) from English to Japanese.
 * 
 * Static content (UI labels, buttons, form labels, etc.) uses hardcoded Japanese 
 * translations in src/config/staticContent.ts to avoid unnecessary API calls and 
 * ensure consistent, high-quality translations.
 */

export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
  fromCache?: boolean;
}

interface TranslationMemory {
  [key: string]: {
    [targetLang: string]: {
      text: string;
      timestamp: number;
      confidence: number;
    };
  };
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

export class TranslationService {
  private static apiKey: string = '';
  private static baseUrl = 'https://translation.googleapis.com/language/translate/v2';
  private static translationMemory: TranslationMemory = {};
  private static readonly CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
  private static readonly SIMILARITY_THRESHOLD = 0.8; // 80% similarity for fuzzy matching

  // Initialize the translation service
  static initialize(apiKey: string) {
    this.apiKey = apiKey;
    this.loadTranslationMemory();
  }

  // Load translation memory from localStorage
  private static loadTranslationMemory() {
    try {
      const stored = localStorage.getItem('translationMemory');
      if (stored) {
        this.translationMemory = JSON.parse(stored);
        this.cleanExpiredCache();
      }
    } catch (error) {
      console.warn('Failed to load translation memory:', error);
    }
  }

  // Save translation memory to localStorage
  private static saveTranslationMemory() {
    try {
      localStorage.setItem('translationMemory', JSON.stringify(this.translationMemory));
    } catch (error) {
      console.warn('Failed to save translation memory:', error);
    }
  }

  // Clean expired cache entries
  private static cleanExpiredCache() {
    const now = Date.now();
    Object.keys(this.translationMemory).forEach(key => {
      Object.keys(this.translationMemory[key]).forEach(lang => {
        if (now - this.translationMemory[key][lang].timestamp > this.CACHE_DURATION) {
          delete this.translationMemory[key][lang];
        }
      });
      if (Object.keys(this.translationMemory[key]).length === 0) {
        delete this.translationMemory[key];
      }
    });
  }

  // Generate cache key for text
  private static getCacheKey(text: string, sourceLang: string, targetLang: string): string {
    return `${sourceLang}:${targetLang}:${text.toLowerCase().trim()}`;
  }

  // Check translation memory for existing translation
  private static getFromMemory(text: string, sourceLang: string, targetLang: string): string | null {
    const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
    const cached = this.translationMemory[cacheKey];
    
    if (cached && cached[targetLang]) {
      const entry = cached[targetLang];
      if (Date.now() - entry.timestamp < this.CACHE_DURATION) {
        return entry.text;
      }
    }
    
    return null;
  }

  // Save translation to memory
  private static saveToMemory(text: string, sourceLang: string, targetLang: string, translatedText: string, confidence: number = 1.0) {
    const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
    if (!this.translationMemory[cacheKey]) {
      this.translationMemory[cacheKey] = {};
    }
    
    this.translationMemory[cacheKey][targetLang] = {
      text: translatedText,
      timestamp: Date.now(),
      confidence
    };
    
    this.saveTranslationMemory();
  }

  // Calculate text similarity (simple implementation)
  private static calculateSimilarity(text1: string, text2: string): number {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  // Find similar translations in memory
  private static findSimilarTranslation(text: string, sourceLang: string, targetLang: string): string | null {
    const normalizedText = text.toLowerCase().trim();
    
    for (const cacheKey in this.translationMemory) {
      const [cachedSourceLang, cachedTargetLang, cachedText] = cacheKey.split(':');
      
      if (cachedSourceLang === sourceLang && cachedTargetLang === targetLang) {
        const similarity = this.calculateSimilarity(normalizedText, cachedText);
        if (similarity >= this.SIMILARITY_THRESHOLD) {
          return this.translationMemory[cacheKey][targetLang].text;
        }
      }
    }
    
    return null;
  }

  // Check if translation service is initialized
  static isInitialized(): boolean {
    return !!this.apiKey;
  }

  // Translate text from English to Japanese with memory
  static async translateToJapanese(text: string): Promise<TranslationResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Translation service not initialized. Please provide API key.');
      }

      // Check memory first
      const cachedTranslation = this.getFromMemory(text, 'en', 'ja');
      if (cachedTranslation) {
        return {
          translatedText: cachedTranslation,
          detectedLanguage: 'en',
          confidence: 1.0,
          fromCache: true
        };
      }

      // Check for similar translations
      const similarTranslation = this.findSimilarTranslation(text, 'en', 'ja');
      if (similarTranslation) {
        this.saveToMemory(text, 'en', 'ja', similarTranslation, 0.9);
        return {
          translatedText: similarTranslation,
          detectedLanguage: 'en',
          confidence: 0.9,
          fromCache: true
        };
      }

      // Call Google Translate API
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'ja',
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.translations && data.data.translations.length > 0) {
        const translatedText = data.data.translations[0].translatedText;
        
        // Save to memory
        this.saveToMemory(text, 'en', 'ja', translatedText);
        
        return {
          translatedText,
          detectedLanguage: 'en',
          confidence: 1.0
        };
      } else {
        throw new Error('No translation data received');
      }
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text to Japanese');
    }
  }

  // Translate text from Japanese to English with memory
  static async translateToEnglish(text: string): Promise<TranslationResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Translation service not initialized. Please provide API key.');
      }

      // Check memory first
      const cachedTranslation = this.getFromMemory(text, 'ja', 'en');
      if (cachedTranslation) {
        return {
          translatedText: cachedTranslation,
          detectedLanguage: 'ja',
          confidence: 1.0,
          fromCache: true
        };
      }

      // Check for similar translations
      const similarTranslation = this.findSimilarTranslation(text, 'ja', 'en');
      if (similarTranslation) {
        this.saveToMemory(text, 'ja', 'en', similarTranslation, 0.9);
        return {
          translatedText: similarTranslation,
          detectedLanguage: 'ja',
          confidence: 0.9,
          fromCache: true
        };
      }

      // Call Google Translate API
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'ja',
          target: 'en',
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.translations && data.data.translations.length > 0) {
        const translatedText = data.data.translations[0].translatedText;
        
        // Save to memory
        this.saveToMemory(text, 'ja', 'en', translatedText);
        
        return {
          translatedText,
          detectedLanguage: 'ja',
          confidence: 1.0
        };
      } else {
        throw new Error('No translation data received');
      }
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('Failed to translate text to English');
    }
  }

  // Auto-detect language and translate to target language with memory
  static async autoTranslate(text: string, targetLanguage: 'en' | 'ja'): Promise<TranslationResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Translation service not initialized. Please provide API key.');
      }

      // Call Google Translate API with auto-detection
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.data && data.data.translations && data.data.translations.length > 0) {
        const translation = data.data.translations[0];
        const detectedLanguage = translation.detectedSourceLanguage || 'auto-detected';
        
        // Save to memory
        this.saveToMemory(text, detectedLanguage, targetLanguage, translation.translatedText);
        
        return {
          translatedText: translation.translatedText,
          detectedLanguage,
          confidence: 1.0
        };
      } else {
        throw new Error('No translation data received');
      }
    } catch (error) {
      console.error('Auto-translation error:', error);
      throw new Error(`Failed to auto-translate text to ${targetLanguage}`);
    }
  }

  // Batch translate multiple texts with memory optimization
  static async batchTranslate(
    texts: string[], 
    fromLanguage: 'en' | 'ja', 
    toLanguage: 'en' | 'ja'
  ): Promise<TranslationResult[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Translation service not initialized. Please provide API key.');
      }

      const results: TranslationResult[] = [];
      const textsToTranslate: string[] = [];
      const textIndices: number[] = [];

      // Check memory for each text
      texts.forEach((text, index) => {
        const cachedTranslation = this.getFromMemory(text, fromLanguage, toLanguage);
        if (cachedTranslation) {
          results[index] = {
            translatedText: cachedTranslation,
            detectedLanguage: fromLanguage,
            confidence: 1.0,
            fromCache: true
          };
        } else {
          textsToTranslate.push(text);
          textIndices.push(index);
        }
      });

      // If all texts were cached, return immediately
      if (textsToTranslate.length === 0) {
        return results;
      }

      // Translate remaining texts in batches
      const batchSize = 10;
      for (let i = 0; i < textsToTranslate.length; i += batchSize) {
        const batch = textsToTranslate.slice(i, i + batchSize);
        
        const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: batch,
            source: fromLanguage,
            target: toLanguage,
            format: 'text'
          })
        });

        if (!response.ok) {
          throw new Error(`Translation API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as GoogleTranslateResponse;
        
        if (data.data && data.data.translations) {
          batch.forEach((text, batchIndex) => {
            const translation = data.data.translations[batchIndex];
            const originalIndex = textIndices[i + batchIndex];
            
            // Save to memory
            this.saveToMemory(text, fromLanguage, toLanguage, translation.translatedText);
            
            results[originalIndex] = {
              translatedText: translation.translatedText,
              detectedLanguage: fromLanguage,
              confidence: 1.0
            };
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Batch translation error:', error);
      throw new Error('Failed to batch translate texts');
    }
  }

  // Clear translation memory
  static clearMemory(): void {
    this.translationMemory = {};
    localStorage.removeItem('translationMemory');
  }

  // Get memory statistics
  static getMemoryStats(): { totalEntries: number; totalSize: number } {
    const totalEntries = Object.keys(this.translationMemory).length;
    const totalSize = new Blob([JSON.stringify(this.translationMemory)]).size;
    return { totalEntries, totalSize };
  }
} 