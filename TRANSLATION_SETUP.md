# Google Translate API Setup Guide

This guide will help you set up Google Translate API for automatic translation between English and Japanese in your CMS.

## Prerequisites

- Google Cloud Platform (GCP) account
- Billing enabled on your GCP project
- Basic knowledge of GCP console

## Step-by-Step Setup

### 1. Enable Google Cloud Translation API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create a new one)
3. Navigate to **APIs & Services** > **Library**
4. Search for "Cloud Translation API"
5. Click on "Cloud Translation API" and click **Enable**

### 2. Create API Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy the generated API key (you'll need this for your application)
4. **Important**: Click on the API key to configure it:
   - Set **Application restrictions** to "HTTP referrers" and add your domain
   - Set **API restrictions** to "Restrict key" and select "Cloud Translation API"

### 3. Set Up Billing (Required)

1. Go to **Billing** in the left sidebar
2. Link a billing account to your project
3. **Note**: Google Translate API has a free tier of 500,000 characters per month

### 4. Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your API key:

```env
VITE_GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
```

3. Replace `your_google_translate_api_key_here` with your actual API key

### 5. Install Dependencies

No additional dependencies are required. The translation service uses browser-native fetch API to communicate with Google Translate API directly.

## How It Works

### Automatic Translation Features

1. **Auto-Translate on Save**: When you save content in English, it automatically translates to Japanese
2. **Auto-Translate on Update**: When you update content, missing translations are automatically filled
3. **Batch Translation**: Translate all sections at once using the "Auto-Translate All" button
4. **Manual Translation**: Individual section translation is available

### Translation Logic

- If English content exists but Japanese is empty → Auto-translate to Japanese
- If Japanese content exists but English is empty → Auto-translate to English
- If both languages have content → No translation occurs (preserves manual translations)

### Usage in CMS

1. **Translation Status**: Check the translation status indicator in the CMS header
2. **Auto-Translate All**: Use the "Auto-Translate All" button to translate all sections at once
3. **Individual Translation**: Each section can be translated individually
4. **Language Toggle**: Switch between English and Japanese to view content

## API Costs

- **Free Tier**: 500,000 characters per month
- **Paid Tier**: $20 per million characters after free tier
- **Estimated Cost**: For a typical academic website, you might use 10,000-50,000 characters per month

## Security Best Practices

1. **Restrict API Key**: Always restrict your API key to specific domains and APIs
2. **Environment Variables**: Never commit API keys to version control
3. **Monitor Usage**: Set up billing alerts in GCP console
4. **Rate Limiting**: The service includes built-in rate limiting

## Troubleshooting

### Common Issues

1. **"Translation service not available"**
   - Check if API key is set in environment variables
   - Verify API key is correct
   - Ensure Cloud Translation API is enabled

2. **"API key not valid"**
   - Check API key restrictions
   - Verify billing is enabled
   - Ensure API key has proper permissions

3. **Translation errors**
   - Check internet connection
   - Verify text length (API has limits)
   - Check for special characters

### Debug Steps

1. Check browser console for error messages
2. Verify API key in environment variables
3. Test API key in GCP console
4. Check billing status in GCP

## Support

If you encounter issues:

1. Check the [Google Cloud Translation API documentation](https://cloud.google.com/translate/docs)
2. Review GCP console for API usage and errors
3. Check billing and quota limits
4. Contact Google Cloud support if needed

## Example Usage

```typescript
// Initialize translation service
import { TranslationService } from './services/translationService';

// Initialize with API key
TranslationService.initialize('your-api-key-here');

// Translate English to Japanese
const result = await TranslationService.translateToJapanese('Hello, world!');
console.log(result.translatedText); // "こんにちは、世界！"

// Auto-translate content
const section = {
  title: { en: 'Research', ja: '' },
  content: { en: 'My research focuses on...', ja: '' }
};

// This will automatically fill the Japanese translations
await CMSService.saveSection(section);
```

## Technical Implementation

The translation service uses:
- **Browser-native fetch API** for HTTP requests
- **Google Translate API v2** REST endpoint
- **No server-side dependencies** - works entirely in the browser
- **Automatic error handling** and retry logic 