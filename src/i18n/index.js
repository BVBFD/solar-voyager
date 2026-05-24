import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ko from './locales/ko.json'

export const LANGUAGE_STORAGE_KEY = 'solar-voyager-language'
export const SUPPORTED_LANGUAGES = ['en', 'ko']

function getInitialLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)

  if (SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage
  }

  return navigator.language?.toLowerCase().startsWith('ko') ? 'ko' : 'en'
}

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  lng: getInitialLanguage(),
  resources: {
    en: { translation: en },
    ko: { translation: ko },
  },
})

export default i18n
