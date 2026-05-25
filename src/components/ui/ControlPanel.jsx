import { useTranslation } from 'react-i18next'
import { BloomControls } from './BloomControls'
import { QualityControls } from './QualityControls'

export function ControlPanel({
  bloom,
  onBloomChange,
  onQualityChange,
  quality,
}) {
  const { t } = useTranslation()

  return (
    <section className="control-panel" aria-label={t('controls.simulation')}>
      <QualityControls value={quality} onChange={onQualityChange} />
      <BloomControls bloom={bloom} onChange={onBloomChange} />
    </section>
  )
}
