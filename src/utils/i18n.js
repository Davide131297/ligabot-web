import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Sprachdateien importieren
const resources = {
  en: {
    translation: {
      "home": "Home",
    }
  },
  de: {
    translation: {
      "home": "Startseite",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie']
    },
    interpolation: {
      escapeValue: false // React already does escaping
    }
});

// Sprache beim Initialisieren setzen
const storedLanguage = localStorage.getItem('Language');
if (storedLanguage) {
  i18n.changeLanguage(storedLanguage);
}

export default i18n;