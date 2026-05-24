import { useTranslation } from 'react-i18next'
import { SCALE_MODES } from '../../data/constants'

const SCALE_OPTIONS = [
  {
    value: SCALE_MODES.visualScale,
    labelKey: 'controls.scale.visual',
    descriptionKey: 'controls.scale.descriptions.visualScale',
  },
  {
    value: SCALE_MODES.compressedRealScale,
    labelKey: 'controls.scale.compressed',
    descriptionKey: 'controls.scale.descriptions.compressedRealScale',
  },
  {
    value: SCALE_MODES.realScalePlaceholder,
    labelKey: 'controls.scale.realDraft',
    descriptionKey: 'controls.scale.descriptions.realScalePlaceholder',
  },
]

export function ScaleToggle({ value, onChange }) {
  const { t } = useTranslation()
  const selectedOption =
    SCALE_OPTIONS.find((option) => option.value === value) ?? SCALE_OPTIONS[0]

  return (
    <section className="scale-toggle" aria-label={t('controls.scale.aria')}>
      <span>{t('controls.scale.title')}</span>
      <div className="segmented-control">
        {SCALE_OPTIONS.map((option) => (
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
      <p>{t(selectedOption.descriptionKey)}</p>
    </section>
  )
}
