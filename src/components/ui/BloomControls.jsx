import { useTranslation } from 'react-i18next'

export function BloomControls({ bloom, onChange }) {
  const { t } = useTranslation()
  const strengthValue = bloom.strength.toFixed(2)
  const radiusValue = bloom.radius.toFixed(2)

  return (
    <section className="bloom-controls" aria-label={t('controls.bloom.aria')}>
      <label className="toggle-row">
        <span>{t('controls.bloom.title')}</span>
        <input
          checked={bloom.enabled}
          type="checkbox"
          onChange={(event) => onChange({ enabled: event.target.checked })}
        />
      </label>
      <label>
        <span>{t('controls.bloom.strength', { value: strengthValue })}</span>
        <input
          disabled={!bloom.enabled}
          max="0.9"
          min="0"
          step="0.01"
          type="range"
          value={bloom.strength}
          onChange={(event) =>
            onChange({ strength: Number(event.target.value) })
          }
        />
      </label>
      <label>
        <span>{t('controls.bloom.radius', { value: radiusValue })}</span>
        <input
          disabled={!bloom.enabled}
          max="0.75"
          min="0"
          step="0.01"
          type="range"
          value={bloom.radius}
          onChange={(event) => onChange({ radius: Number(event.target.value) })}
        />
      </label>
    </section>
  )
}
