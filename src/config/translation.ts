// Translation service configuration
export const TRANSLATION_CONFIG = {
  // Google Translate API Key - Set this in your environment variables
  API_KEY: import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || '',
  
  // Default languages
  DEFAULT_SOURCE_LANGUAGE: 'en',
  DEFAULT_TARGET_LANGUAGE: 'ja',
  
  // Translation settings
  AUTO_TRANSLATE_ON_SAVE: true,
  AUTO_TRANSLATE_ON_UPDATE: true,
  
  // Batch translation settings
  BATCH_SIZE: 10, // Number of texts to translate in one batch
  
  // Error handling
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
};

// Initialize translation service with API key
export const initializeTranslationService = () => {
  if (TRANSLATION_CONFIG.API_KEY) {
    import('../services/translationService').then(({ TranslationService }) => {
      TranslationService.initialize(TRANSLATION_CONFIG.API_KEY);
      console.log('Translation service initialized successfully');
    });
    return true;
  } else {
    console.warn('Google Translate API key not found. Auto-translation will be disabled.');
    return false;
  }
}; 