// lib/services/translateApi.js
import axios from 'axios';

const GOOGLE_TRANSLATE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

/**
 * Translates text to English using Google Cloud Translation API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (default: 'en')
 * @returns {Promise<{translatedText: string, detectedLanguage: string, originalText: string}>}
 */
export async function translateToEnglish(text, targetLang = 'en') {
  if (!text || text.trim() === '') {
    throw new Error('Text is required for translation');
  }

  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.error('Google Translate API key is not configured');
    // Return original text if API key is missing
    return {
      translatedText: text,
      detectedLanguage: 'en',
      originalText: text,
      isTranslated: false
    };
  }

  try {
    const response = await axios.post(
      TRANSLATE_API_URL,
      null,
      {
        params: {
          key: GOOGLE_TRANSLATE_API_KEY,
          q: text,
          target: targetLang,
          format: 'text'
        }
      }
    );

    const translation = response.data.data.translations[0];
    const detectedLang = translation.detectedSourceLanguage || 'en';
    
    return {
      translatedText: translation.translatedText,
      detectedLanguage: detectedLang,
      originalText: text,
      isTranslated: detectedLang !== targetLang
    };
  } catch (error) {
    console.error('Translation API error:', error.response?.data || error.message);
    
    // Fallback: return original text if translation fails
    return {
      translatedText: text,
      detectedLanguage: 'unknown',
      originalText: text,
      isTranslated: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

/**
 * Detects the language of the given text
 * @param {string} text - Text to detect language
 * @returns {Promise<{language: string, confidence: number}>}
 */
export async function detectLanguage(text) {
  if (!text || text.trim() === '') {
    throw new Error('Text is required for language detection');
  }

  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.error('Google Translate API key is not configured');
    return { language: 'en', confidence: 0 };
  }

  try {
    const response = await axios.post(
      `${TRANSLATE_API_URL}/detect`,
      null,
      {
        params: {
          key: GOOGLE_TRANSLATE_API_KEY,
          q: text
        }
      }
    );

    const detection = response.data.data.detections[0][0];
    return {
      language: detection.language,
      confidence: detection.confidence
    };
  } catch (error) {
    console.error('Language detection error:', error.response?.data || error.message);
    return { language: 'en', confidence: 0 };
  }
}

/**
 * Batch translate multiple texts
 * @param {string[]} texts - Array of texts to translate
 * @param {string} targetLang - Target language code
 * @returns {Promise<Array>}
 */
export async function batchTranslate(texts, targetLang = 'en') {
  if (!texts || texts.length === 0) {
    return [];
  }

  if (!GOOGLE_TRANSLATE_API_KEY) {
    return texts.map(text => ({
      translatedText: text,
      originalText: text,
      isTranslated: false
    }));
  }

  try {
    const response = await axios.post(
      TRANSLATE_API_URL,
      null,
      {
        params: {
          key: GOOGLE_TRANSLATE_API_KEY,
          q: texts,
          target: targetLang,
          format: 'text'
        }
      }
    );

    return response.data.data.translations.map((translation, index) => ({
      translatedText: translation.translatedText,
      detectedLanguage: translation.detectedSourceLanguage || 'en',
      originalText: texts[index],
      isTranslated: (translation.detectedSourceLanguage || 'en') !== targetLang
    }));
  } catch (error) {
    console.error('Batch translation error:', error.response?.data || error.message);
    return texts.map(text => ({
      translatedText: text,
      originalText: text,
      isTranslated: false,
      error: error.message
    }));
  }
}