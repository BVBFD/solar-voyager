import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ControlPanel } from './ControlPanel'
import { FlightModeOverlay } from './FlightModeOverlay'
import { InfoPanel } from './InfoPanel'
import { LanguageToggle } from './LanguageToggle'
import { ModeSwitcher } from './ModeSwitcher'
import { PlanetList } from './PlanetList'
import { TimeControls } from './TimeControls'
import { CONTROL_MODES, SIMULATION_MODES } from '../../data/constants'

const SCALE_LABEL_KEYS = {
  visualScale: 'controls.scale.visual',
  compressedRealScale: 'controls.scale.compressed',
  realScalePlaceholder: 'controls.scale.realDraft',
}

const QUALITY_LABEL_KEYS = {
  low: 'controls.quality.low',
  medium: 'controls.quality.medium',
  high: 'controls.quality.high',
}

const EPHEMERIS_STATUS_LABEL_KEYS = {
  error: 'ui.ephemerisStatus.error',
  fallback: 'ui.ephemerisStatus.fallback',
  idle: 'ui.ephemerisStatus.idle',
  loading: 'ui.ephemerisStatus.loading',
  success: 'ui.ephemerisStatus.success',
}

const SIMULATION_MODE_LABEL_KEYS = {
  [SIMULATION_MODES.realAlignment]: 'ui.simulationModes.realAlignment',
  [SIMULATION_MODES.simulationOrbit]: 'ui.simulationModes.simulationOrbit',
}

export function AppShell({
  bloom,
  children,
  bodies,
  controlMode = CONTROL_MODES.orbit,
  controlModeError,
  ephemerisData,
  flightTelemetry,
  onActivateFlight,
  onBloomChange,
  onEnterFlightReady,
  onExitToOrbit,
  onLoadRealAlignment,
  onQualityChange,
  onResetRealAlignment,
  onReturnToSun,
  selectedBody,
  selectedBodyId,
  onSelectBody,
  quality,
  scaleMode,
  onScaleModeChange,
  simulationTime,
  simulationMode = SIMULATION_MODES.simulationOrbit,
  realAlignmentSnapshotTime,
  travel,
}) {
  const { t } = useTranslation()
  const [isMissionOpen, setIsMissionOpen] = useState(true)
  const controlModeLabel =
    {
      [CONTROL_MODES.orbit]: t('controlModes.orbit'),
      [CONTROL_MODES.flightReady]: t('controlModes.flightReady'),
      [CONTROL_MODES.flightActive]: t('controlModes.flightActive'),
      [CONTROL_MODES.flightPaused]: t('controlModes.flightPaused'),
      [CONTROL_MODES.transitioning]: t('controlModes.transitioning'),
    }[controlMode] ?? t('controlModes.orbit')
  const travelLabel =
    {
      [CONTROL_MODES.flightReady]: t('travel.flightReady'),
      [CONTROL_MODES.flightActive]: t('travel.flightActive'),
      [CONTROL_MODES.flightPaused]: t('travel.flightPaused'),
      [CONTROL_MODES.transitioning]: t('travel.transitioning'),
    }[controlMode] ??
    (travel?.isTraveling
      ? t('travel.travelingTo', {
          body: selectedBody?.name ?? t('ui.solarSystem'),
        })
      : t('travel.orbiting', {
          body: selectedBody?.name ?? t('ui.solarSystem'),
        }))
  const isRealAlignmentLoading = ephemerisData?.status === 'loading'
  const isSimulationOrbit =
    simulationMode === SIMULATION_MODES.simulationOrbit
  const isRealAlignment =
    simulationMode === SIMULATION_MODES.realAlignment
  const ephemerisStatus = ephemerisData?.status ?? 'idle'
  const ephemerisStatusLabel = t(
    EPHEMERIS_STATUS_LABEL_KEYS[ephemerisStatus] ??
      EPHEMERIS_STATUS_LABEL_KEYS.idle,
  )
  const simulationModeLabel = t(
    SIMULATION_MODE_LABEL_KEYS[simulationMode] ??
      SIMULATION_MODE_LABEL_KEYS[SIMULATION_MODES.simulationOrbit],
  )
  const fallbackNotice =
    simulationMode === SIMULATION_MODES.realAlignment &&
    ephemerisData?.status === 'fallback'
      ? t('ui.realAlignmentFallback')
      : null
  const scaleModeLabel = t(SCALE_LABEL_KEYS[scaleMode] ?? SCALE_LABEL_KEYS.visualScale)
  const qualityLabel = t(QUALITY_LABEL_KEYS[quality] ?? QUALITY_LABEL_KEYS.medium)

  return (
    <div className="app-shell">
      <main className="app-shell__scene">{children}</main>

      <aside
        className={
          isMissionOpen
            ? 'app-shell__panel app-shell__panel--left'
            : 'app-shell__panel app-shell__panel--left is-collapsed'
        }
      >
        <header className="app-shell__header">
          <div>
            <p className="eyebrow">{t('ui.missionControl')}</p>
            <h1>{t('app.name')}</h1>
          </div>
          <button
            className="panel-toggle"
            type="button"
            onClick={() => setIsMissionOpen((value) => !value)}
          >
            {isMissionOpen ? t('ui.hide') : t('ui.open')}
          </button>
        </header>
        {isMissionOpen ? (
          <>
            <PlanetList
              bodies={bodies}
              selectedBodyId={selectedBodyId}
              onSelectBody={onSelectBody}
            />
            <ControlPanel
              bloom={bloom}
              onBloomChange={onBloomChange}
              onQualityChange={onQualityChange}
              quality={quality}
              scaleMode={scaleMode}
              onScaleModeChange={onScaleModeChange}
            />
          </>
        ) : null}
      </aside>

      <div className="mission-status">
        <span>{travelLabel}</span>
        <code>{controlModeLabel}</code>
        <code>{simulationModeLabel}</code>
        {ephemerisData?.status === 'loading' ||
        ephemerisData?.status === 'error' ? (
          <code>{ephemerisStatusLabel}</code>
        ) : null}
        {fallbackNotice ? <code>{fallbackNotice}</code> : null}
        <code>{scaleModeLabel}</code>
        <code>{qualityLabel}</code>
        <button
          className="real-alignment-toggle"
          disabled={isRealAlignment || isRealAlignmentLoading}
          type="button"
          onClick={onLoadRealAlignment}
        >
          {isRealAlignmentLoading ? t('ui.loading') : t('ui.nowRealAlignment')}
        </button>
        <button
          type="button"
          disabled={isSimulationOrbit || isRealAlignmentLoading}
          onClick={onResetRealAlignment}
        >
          {t('ui.simulationOrbit')}
        </button>
        <ModeSwitcher
          controlMode={controlMode}
          onActivateFlight={onActivateFlight}
          onEnterFlightReady={onEnterFlightReady}
          onExitToOrbit={onExitToOrbit}
        />
        <button type="button" onClick={onReturnToSun}>
          {t('ui.returnToSun')}
        </button>
        <LanguageToggle />
      </div>

      <aside className="app-shell__panel app-shell__panel--right">
        <InfoPanel
          body={selectedBody}
          ephemerisData={ephemerisData}
          key={selectedBody?.id}
        />
      </aside>

      <div className="time-dock">
        <TimeControls
          realAlignmentSnapshotTime={realAlignmentSnapshotTime}
          simulationMode={simulationMode}
          simulationTime={simulationTime}
        />
      </div>

      <FlightModeOverlay
        controlMode={controlMode}
        error={controlModeError}
        telemetry={flightTelemetry}
        onActivateFlight={onActivateFlight}
        onExitToOrbit={onExitToOrbit}
      />
    </div>
  )
}
