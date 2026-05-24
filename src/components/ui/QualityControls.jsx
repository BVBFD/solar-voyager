import { useTranslation } from 'react-i18next'
import { QUALITY_LEVELS } from '../../data/constants'

const QUALITY_OPTIONS = [
  { value: QUALITY_LEVELS.low, labelKey: 'controls.quality.low' },
  { value: QUALITY_LEVELS.medium, labelKey: 'controls.quality.medium' },
  { value: QUALITY_LEVELS.high, labelKey: 'controls.quality.high' },
]

export function QualityControls({ value, onChange }) {
  const { t } = useTranslation()

  return (
    <section className="quality-controls" aria-label={t('controls.quality.aria')}>
      <span>{t('controls.quality.title')}</span>
      <div className="segmented-control">
        {QUALITY_OPTIONS.map((option) => (
          <button
            aria-pressed={value === option.value}
            className={value === option.value ? 'is-selected' : ''}
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
          >
            {t(option.labelKey)}
          </button>
        ))}
      </div>
    </section>
  )
}
