import { useTranslation } from 'react-i18next'
import { CONTROL_MODES } from '../../data/constants'

export function ModeSwitcher({
  controlMode,
  onActivateFlight,
  onEnterFlightReady,
  onExitToOrbit,
}) {
  const { t } = useTranslation()

  if (controlMode === CONTROL_MODES.transitioning) {
    return (
      <button className="mode-toggle" disabled type="button">
        {t('mode.switching')}
      </button>
    )
  }

  if (controlMode === CONTROL_MODES.flightReady) {
    return (
      <span className="mode-switcher">
        <button className="mode-toggle" type="button" onClick={onActivateFlight}>
          {t('mode.clickCanvasToLaunch')}
        </button>
        <button type="button" onClick={onExitToOrbit}>
          {t('mode.cancel')}
        </button>
      </span>
    )
  }

  if (controlMode === CONTROL_MODES.flightActive) {
    return (
      <button className="mode-toggle" type="button" onClick={onExitToOrbit}>
        {t('mode.exitFlight')}
      </button>
    )
  }

  if (controlMode === CONTROL_MODES.flightPaused) {
    return (
      <span className="mode-switcher">
        <button className="mode-toggle" type="button" onClick={onActivateFlight}>
          {t('mode.resumeFlight')}
        </button>
        <button type="button" onClick={onExitToOrbit}>
          {t('mode.exitToOrbit')}
        </button>
      </span>
    )
  }

  return (
    <button className="mode-toggle" type="button" onClick={onEnterFlightReady}>
      {t('mode.enterFreeFlight')}
    </button>
  )
}
