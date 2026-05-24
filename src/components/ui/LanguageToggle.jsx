import { useTranslation } from 'react-i18next'
import { LANGUAGE_STORAGE_KEY } from '../../i18n'

const LANGUAGE_OPTIONS = [
  { value: 'en', labelKey: 'ui.english' },
  { value: 'ko', labelKey: 'ui.korean' },
]

export function LanguageToggle() {
  const { i18n, t } = useTranslation()

  const handleLanguageChange = (language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    i18n.changeLanguage(language)
  }

  return (
    <div className="language-toggle" aria-label={t('ui.language')}>
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          aria-pressed={i18n.resolvedLanguage === option.value}
          className={i18n.resolvedLanguage === option.value ? 'is-selected' : ''}
          key={option.value}
          type="button"
          onClick={() => handleLanguageChange(option.value)}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  )
}
