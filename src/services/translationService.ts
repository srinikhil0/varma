export interface TranslationResult {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
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

  // Initialize the translation service
  static initialize(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Translate text from English to Japanese
  static async translateToJapanese(text: string): Promise<TranslationResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Translation service not initialized. Please provide API key.');
      }

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
        return {
          translatedText: data.data.translations[0].translatedText,
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

  // Translate text from Japanese to English
  static async translateToEnglish(text: string): Promise<TranslationResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Translation service not initialized. Please provide API key.');
      }

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
        return {
          translatedText: data.data.translations[0].translatedText,
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

  // Auto-detect language and translate to target language
  static async autoTranslate(text: string, targetLanguage: 'en' | 'ja'): Promise<TranslationResult> {
    try {
      if (!this.apiKey) {
        throw new Error('Translation service not initialized. Please provide API key.');
      }

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
        return {
          translatedText: translation.translatedText,
          detectedLanguage: translation.detectedSourceLanguage || 'auto-detected',
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

  // Batch translate multiple texts
  static async batchTranslate(
    texts: string[], 
    fromLanguage: 'en' | 'ja', 
    toLanguage: 'en' | 'ja'
  ): Promise<TranslationResult[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Translation service not initialized. Please provide API key.');
      }

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: texts,
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
        return data.data.translations.map((translation) => ({
          translatedText: translation.translatedText,
          detectedLanguage: fromLanguage,
          confidence: 1.0
        }));
      } else {
        throw new Error('No translation data received');
      }
    } catch (error) {
      console.error('Batch translation error:', error);
      throw new Error('Failed to batch translate texts');
    }
  }

  // Check if translation service is initialized
  static isInitialized(): boolean {
    return !!this.apiKey;
  }

  // Get API key (for debugging purposes)
  static getApiKey(): string | null {
    return this.apiKey || null;
  }
} 