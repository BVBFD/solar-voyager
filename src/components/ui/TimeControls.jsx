import { useTranslation } from 'react-i18next'
import { SIMULATION_MODES } from '../../data/constants'
import {
  formatElapsedDays,
  formatSpeedDaysPerSecond,
} from '../../utils/formatters'

function formatUtcMinute(value) {
  if (!value) {
    return '--'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '--'
  }

  const pad = (part) => String(part).padStart(2, '0')

  return [
    date.getUTCFullYear(),
    '-',
    pad(date.getUTCMonth() + 1),
    '-',
    pad(date.getUTCDate()),
    ' ',
    pad(date.getUTCHours()),
    ':',
    pad(date.getUTCMinutes()),
    ' UTC',
  ].join('')
}

export function TimeControls({
  realAlignmentSnapshotTime,
  simulationMode = SIMULATION_MODES.simulationOrbit,
  simulationTime,
}) {
  const { t } = useTranslation()
  const speedLabel = formatSpeedDaysPerSecond(simulationTime.timeScale)
  const isRealAlignment = simulationMode === SIMULATION_MODES.realAlignment
  const timeValue = isRealAlignment
    ? t('time.locked')
    : formatElapsedDays(simulationTime.elapsedDays)

  return (
    <section className={isRealAlignment ? 'time-controls is-locked' : 'time-controls'}>
      <div className="time-controls__header">
        <span>{t('time.title')}</span>
        <output className="time-value">{timeValue}</output>
      </div>
      <div className="time-controls__actions">
        <button
          disabled={isRealAlignment}
          type="button"
          onClick={() => simulationTime.setIsPlaying((value) => !value)}
        >
          {simulationTime.isPlaying ? t('time.pause') : t('time.play')}
        </button>
        <button
          disabled={isRealAlignment}
          type="button"
          onClick={simulationTime.resetTime}
        >
          {t('time.reset')}
        </button>
      </div>
      <label className="time-speed" aria-disabled={isRealAlignment}>
        <span>
          {t('time.speed')} <output className="speed-value">{speedLabel}</output>
        </span>
        <input
          disabled={isRealAlignment}
          min="0"
          max="60"
          step="1"
          type="range"
          value={simulationTime.timeScale}
          onChange={(event) =>
            simulationTime.setTimeScale(Number(event.target.value))
          }
        />
      </label>
      {isRealAlignment ? (
        <p className="time-controls__lock">
          <strong>{t('time.lockedToRealAlignment')}</strong>
          <span>
            {t('time.lastUpdated')}: {formatUtcMinute(realAlignmentSnapshotTime)}
          </span>
        </p>
      ) : null}
    </section>
  )
}
