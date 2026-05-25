import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CONTROL_MODES } from '../../data/constants'
import { getBodyName } from '../../utils/bodyI18n'

function formatFlightNumber(value, digits = 1) {
  if (!Number.isFinite(value)) {
    return '--'
  }

  return value.toFixed(digits)
}

export function FlightModeOverlay({
  controlMode,
  error,
  telemetry,
  onActivateFlight,
  onExitToOrbit,
}) {
  const { t } = useTranslation()
  const [isLaunching, setIsLaunching] = useState(false)
  const previousModeRef = useRef(controlMode)
  const nearestBodyName = telemetry?.nearestBodyName
    ? getBodyName(telemetry.nearestBodyName, t)
    : '--'

  useEffect(() => {
    const previousMode = previousModeRef.current

    if (
      controlMode === CONTROL_MODES.flightActive &&
      previousMode !== CONTROL_MODES.flightPaused
    ) {
      setIsLaunching(true)

      const timerId = window.setTimeout(() => {
        setIsLaunching(false)
      }, 1000)

      previousModeRef.current = controlMode
      return () => window.clearTimeout(timerId)
    }

    previousModeRef.current = controlMode
    setIsLaunching(false)
    return undefined
  }, [controlMode])

  if (controlMode === CONTROL_MODES.flightReady) {
    return (
      <div className="flight-mode-overlay" aria-live="polite">
        <section
          className="flight-mode-overlay__card"
          onClick={onActivateFlight}
        >
          <p className="eyebrow">{t('flight.readyEyebrow')}</p>
          <h2>{t('flight.readyTitle')}</h2>
          <p>{t('flight.readyBody')}</p>
          <div className="flight-mode-overlay__actions">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onActivateFlight?.()
              }}
            >
              {t('flight.launchAction')}
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onExitToOrbit?.()
              }}
            >
              {t('mode.cancel')}
            </button>
          </div>
          {error ? (
            <p className="flight-mode-overlay__error">
              {t(error, { defaultValue: error })}
            </p>
          ) : null}
        </section>
      </div>
    )
  }

  if (controlMode === CONTROL_MODES.transitioning) {
    return (
      <div className="flight-mode-overlay is-blocking" aria-live="polite">
        <section className="flight-mode-overlay__card">
          <p className="eyebrow">{t('flight.controlsEyebrow')}</p>
          <h2>{t('flight.switchingTitle')}</h2>
          <p>{t('flight.switchingBody')}</p>
        </section>
      </div>
    )
  }

  if (controlMode === CONTROL_MODES.flightPaused) {
    return (
      <div className="flight-mode-overlay is-blocking" aria-live="polite">
        <section className="flight-mode-overlay__card">
          <p className="eyebrow">{t('flight.pausedEyebrow')}</p>
          <h2>{t('flight.pausedTitle')}</h2>
          <p>{t('flight.pausedBody')}</p>
          <div className="flight-mode-overlay__stats">
            <span>{t('flight.nearest')}</span>
            <strong>{nearestBodyName}</strong>
            <span>{t('flight.distance')}</span>
            <strong>
              {formatFlightNumber(telemetry?.distanceToNearest, 2)} u
            </strong>
          </div>
          <div className="flight-mode-overlay__actions">
            <button type="button" onClick={onActivateFlight}>
              {t('mode.resumeFlight')}
            </button>
            <button type="button" onClick={onExitToOrbit}>
              {t('mode.exitToOrbit')}
            </button>
          </div>
          {error ? (
            <p className="flight-mode-overlay__error">
              {t(error, { defaultValue: error })}
            </p>
          ) : null}
        </section>
      </div>
    )
  }

  if (controlMode === CONTROL_MODES.flightActive) {
    return (
      <>
        {isLaunching ? (
          <div className="flight-launch-cue" aria-hidden="true">
            <span>{t('flight.launchCue')}</span>
          </div>
        ) : null}
        <div
          className={
            isLaunching
              ? 'flight-crosshair is-launching'
              : 'flight-crosshair'
          }
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
        </div>
        <aside className="flight-mode-hud" aria-label={t('flight.hudTitle')}>
          <strong>{t('flight.hudTitle')}</strong>
          <dl>
            <div>
              <dt>{t('flight.speed')}</dt>
              <dd>{formatFlightNumber(telemetry?.speed, 2)} u/s</dd>
            </div>
            <div>
              <dt>{t('flight.nearest')}</dt>
              <dd>{nearestBodyName}</dd>
            </div>
            <div>
              <dt>{t('flight.distance')}</dt>
              <dd>{formatFlightNumber(telemetry?.distanceToNearest, 2)} u</dd>
            </div>
          </dl>
          <span>{t('flight.move')}</span>
          <span>{t('flight.mouse')}</span>
          <span>{t('flight.vertical')}</span>
          <span>{t('flight.boost')}</span>
          <span>{t('flight.brake')}</span>
          <span>{t('flight.escape')}</span>
          <button type="button" onClick={onExitToOrbit}>
            {t('mode.exitFlight')}
          </button>
        </aside>
      </>
    )
  }

  return null
}
