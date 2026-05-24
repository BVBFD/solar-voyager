import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SIMULATION_MODES } from '../../data/constants'
import { formatElapsedDays } from '../../utils/formatters'

const SPEED_UNITS = ['days', 'hours', 'minutes']
const MIN_SPEED_DAYS_PER_SECOND = 0
const MAX_SPEED_DAYS_PER_SECOND = 60

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

function convertToDaysPerSecond(value, unit) {
  if (unit === 'hours') {
    return value / 24
  }

  if (unit === 'minutes') {
    return value / 1440
  }

  return value
}

function convertFromDaysPerSecond(daysPerSecond, unit) {
  if (unit === 'hours') {
    return daysPerSecond * 24
  }

  if (unit === 'minutes') {
    return daysPerSecond * 1440
  }

  return daysPerSecond
}

function clampSpeed(value) {
  return Math.min(
    MAX_SPEED_DAYS_PER_SECOND,
    Math.max(MIN_SPEED_DAYS_PER_SECOND, value),
  )
}

function formatSpeedValue(value) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  if (value === 0) {
    return '0'
  }

  const absoluteValue = Math.abs(value)
  const fractionDigits = absoluteValue >= 10 ? 3 : absoluteValue >= 1 ? 4 : 8

  return value
    .toFixed(fractionDigits)
    .replace(/(\.\d*?)0+$/, '$1')
    .replace(/\.$/, '')
}

export function TimeControls({
  realAlignmentSnapshotTime,
  simulationMode = SIMULATION_MODES.simulationOrbit,
  simulationTime,
}) {
  const { t } = useTranslation()
  const [speedUnit, setSpeedUnit] = useState('days')
  const [speedInputDraft, setSpeedInputDraft] = useState(null)
  const speedDaysPerSecond = clampSpeed(simulationTime.timeScale)
  const convertedUnitSpeedValue = formatSpeedValue(
    convertFromDaysPerSecond(speedDaysPerSecond, speedUnit),
  )
  const speedInputValue = speedInputDraft ?? convertedUnitSpeedValue
  const speedLabel = `${formatSpeedValue(speedDaysPerSecond)} ${t(
    'time.daysPerSecond',
  )}`
  const convertedSpeedLabel = `${formatSpeedValue(speedDaysPerSecond)} ${t(
    'time.daysPerSecond',
  )}`
  const isRealAlignment = simulationMode === SIMULATION_MODES.realAlignment
  const timeValue = isRealAlignment
    ? t('time.locked')
    : formatElapsedDays(simulationTime.elapsedDays)
  const unitLabelKey = {
    days: 'time.daysPerSecond',
    hours: 'time.hoursPerSecond',
    minutes: 'time.minutesPerSecond',
  }

  const handleSpeedInputChange = (event) => {
    const nextValue = event.target.value

    setSpeedInputDraft(nextValue)

    if (nextValue.trim() === '') {
      return
    }

    const parsedValue = Number(nextValue)

    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      return
    }

    simulationTime.setTimeScale(
      clampSpeed(convertToDaysPerSecond(parsedValue, speedUnit)),
    )
  }

  const handleSpeedInputCommit = () => {
    setSpeedInputDraft(null)
  }

  const handleSpeedInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }
  }

  const handleSpeedUnitChange = (event) => {
    const nextUnit = event.target.value

    setSpeedUnit(nextUnit)
    setSpeedInputDraft(null)
  }

  const handleSpeedSliderChange = (event) => {
    const parsedValue = Number(event.target.value)

    if (!Number.isFinite(parsedValue)) {
      return
    }

    const nextSpeed = clampSpeed(parsedValue)

    setSpeedInputDraft(null)
    simulationTime.setTimeScale(nextSpeed)
  }

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
      <div className="time-speed" aria-disabled={isRealAlignment}>
        <span className="time-speed__title">
          {t('time.speed')} <output className="speed-value">{speedLabel}</output>
        </span>
        <div className="speed-control-row">
          <label className="speed-input-field">
            <span>{t('time.speedInput')}</span>
            <input
              disabled={isRealAlignment}
              inputMode="decimal"
              max={convertFromDaysPerSecond(
                MAX_SPEED_DAYS_PER_SECOND,
                speedUnit,
              )}
              min={convertFromDaysPerSecond(
                MIN_SPEED_DAYS_PER_SECOND,
                speedUnit,
              )}
              step="any"
              type="number"
              value={speedInputValue}
              onBlur={handleSpeedInputCommit}
              onChange={handleSpeedInputChange}
              onFocus={() => setSpeedInputDraft(speedInputValue)}
              onKeyDown={handleSpeedInputKeyDown}
            />
          </label>
          <label className="speed-unit-field">
            <span>{t('time.speedUnit')}</span>
            <select
              className="speed-unit-select"
              disabled={isRealAlignment}
              value={speedUnit}
              onChange={handleSpeedUnitChange}
            >
              {SPEED_UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {t(unitLabelKey[unit])}
                </option>
              ))}
            </select>
          </label>
        </div>
        <input
          disabled={isRealAlignment}
          aria-label={t('time.speed')}
          min={MIN_SPEED_DAYS_PER_SECOND}
          max={MAX_SPEED_DAYS_PER_SECOND}
          step="any"
          type="range"
          value={speedDaysPerSecond}
          onChange={handleSpeedSliderChange}
        />
        <span className="speed-converted-value">
          <span>{t('time.convertedSpeed')}</span>
          <output>{convertedSpeedLabel}</output>
        </span>
      </div>
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
