import { useState } from 'react'
import { SolarScene } from './components/scene/SolarScene'
import { AppShell } from './components/ui/AppShell'
import {
  BLOOM_DEFAULTS,
  CAMERA_TARGET_SOURCES,
  CONTROL_MODES,
  RENDER_DEFAULTS,
  SIMULATION_DEFAULTS,
  SIMULATION_MODES,
} from './data/constants'
import { SELECTABLE_BODIES, SMALL_BODY_FIELDS } from './data/bodies'
import { useCameraTravel } from './hooks/useCameraTravel'
import { useControlMode } from './hooks/useControlMode'
import { useEphemerisData } from './hooks/useEphemerisData'
import { useSelectedBody } from './hooks/useSelectedBody'
import { useSimulationTime } from './hooks/useSimulationTime'
import { POSITION_MODE } from './utils/orbitalMath'

function App() {
  const [scaleMode, setScaleMode] = useState(SIMULATION_DEFAULTS.scaleMode)
  const [bloomSettings, setBloomSettings] = useState(BLOOM_DEFAULTS)
  const [quality, setQuality] = useState(RENDER_DEFAULTS.quality)
  const [flightTelemetry, setFlightTelemetry] = useState({
    distanceToNearest: 0,
    nearestBodyName: 'Sun',
    speed: 0,
  })
  const controlMode = useControlMode()
  const [simulationMode, setSimulationMode] = useState(
    SIMULATION_MODES.simulationOrbit,
  )
  const simulationTime = useSimulationTime(simulationMode)
  const ephemerisData = useEphemerisData(SELECTABLE_BODIES)
  const positionMode = simulationMode === SIMULATION_MODES.realAlignment
    ? POSITION_MODE.horizonsVectorV3
    : POSITION_MODE.circularOrbitV1
  const { selectedBody, selectedBodyId, setSelectedBodyId } =
    useSelectedBody(SIMULATION_DEFAULTS.selectedBodyId)
  const {
    cameraTarget,
    cameraTravel,
    completeTravel,
    startTravel,
  } = useCameraTravel('sun')
  const isObservatoryMode = controlMode.mode === CONTROL_MODES.orbit

  const handleSelectBody = (bodyId) => {
    setSelectedBodyId(bodyId)

    const isReturnToSunLocked =
      cameraTravel.isTraveling &&
      cameraTravel.cameraTarget?.source === CAMERA_TARGET_SOURCES.returnToSun

    if (
      isObservatoryMode &&
      !isReturnToSunLocked
    ) {
      startTravel(bodyId, { source: CAMERA_TARGET_SOURCES.userClick })
    }
  }

  const handleReturnToSun = () => {
    setSelectedBodyId('sun')
    controlMode.prepareOrbitReturn()
    startTravel('sun', {
      reason: 'returnToOrbit',
      source: CAMERA_TARGET_SOURCES.returnToSun,
    })
  }

  const handleLoadRealAlignment = async () => {
    const result = await ephemerisData.loadCurrentRealAlignment()

    if (result === 'success' || result === 'fallback') {
      setSimulationMode(SIMULATION_MODES.realAlignment)

      if (isObservatoryMode) {
        startTravel(selectedBodyId ?? 'sun', {
          source: CAMERA_TARGET_SOURCES.autoFocus,
        })
      }
    }
  }

  const handleReturnToSimulationOrbit = () => {
    ephemerisData.resetToSimulationOrbit()
    setSimulationMode(SIMULATION_MODES.simulationOrbit)

    if (isObservatoryMode) {
      startTravel(selectedBodyId ?? 'sun', {
        source: CAMERA_TARGET_SOURCES.autoFocus,
      })
    }
  }

  const handleExitToOrbit = () => {
    controlMode.prepareOrbitReturn()
    startTravel(selectedBodyId ?? 'sun', {
      reason: 'returnToOrbit',
      source: CAMERA_TARGET_SOURCES.autoFocus,
    })
  }

  const handleTravelComplete = (completedTravel) => {
    const travelReason = completedTravel?.reason ?? cameraTravel.reason

    completeTravel(completedTravel?.travelId)

    if (travelReason === 'returnToOrbit') {
      controlMode.completeOrbitReturn()
    }
  }

  const handleBloomSettingsChange = (settings) => {
    setBloomSettings((currentSettings) => ({
      ...currentSettings,
      ...settings,
    }))
  }

  return (
    <AppShell
      bloom={bloomSettings}
      bodies={SELECTABLE_BODIES}
      controlMode={controlMode.mode}
      controlModeError={controlMode.error}
      ephemerisData={ephemerisData}
      flightTelemetry={flightTelemetry}
      onActivateFlight={controlMode.activateFlight}
      onBloomChange={handleBloomSettingsChange}
      onEnterFlightReady={() => {
        completeTravel()
        controlMode.enterFlightReady()
      }}
      onExitToOrbit={handleExitToOrbit}
      onLoadRealAlignment={handleLoadRealAlignment}
      onQualityChange={setQuality}
      onResetRealAlignment={handleReturnToSimulationOrbit}
      onReturnToSun={handleReturnToSun}
      selectedBody={selectedBody}
      selectedBodyId={selectedBodyId}
      onSelectBody={handleSelectBody}
      quality={quality}
      scaleMode={scaleMode}
      onScaleModeChange={setScaleMode}
      simulationTime={simulationTime}
      simulationMode={simulationMode}
      realAlignmentSnapshotTime={
        ephemerisData.requestedAt ?? ephemerisData.updatedAt
      }
      travel={cameraTravel}
    >
      <SolarScene
        bodies={SELECTABLE_BODIES}
        cameraTravel={cameraTravel}
        cameraTarget={cameraTarget}
        controlMode={controlMode.mode}
        elapsedDays={simulationTime.elapsedDays}
        selectedBodyId={selectedBodyId}
        ephemerisByBodyId={ephemerisData.vectorsByBodyId}
        onActivateFlight={controlMode.activateFlight}
        onTravelComplete={handleTravelComplete}
        onFlightTelemetryChange={setFlightTelemetry}
        onSelectBody={handleSelectBody}
        positionMode={positionMode}
        quality={quality}
        registerFlightCleanup={controlMode.registerFlightCleanup}
        registerPointerLockElement={controlMode.registerPointerLockElement}
        scaleMode={scaleMode}
        smallBodyFields={SMALL_BODY_FIELDS}
        bloom={bloomSettings}
      />
    </AppShell>
  )
}

export default App
