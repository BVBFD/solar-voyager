import { CONTROL_MODES } from '../../data/constants'
import { FreeFlightController } from './FreeFlightController'
import { ObservatoryCameraController } from './ObservatoryCameraController'

export function CameraController({
  bodies,
  cameraTarget,
  controlMode,
  elapsedDays,
  ephemerisByBodyId,
  onFlightTelemetryChange,
  onTravelComplete,
  positionMode,
  registerFlightCleanup,
  registerPointerLockElement,
  scaleMode,
  travel,
}) {
  const isObservatoryEnabled = controlMode === CONTROL_MODES.orbit
  const isReturnToOrbitTravel =
    controlMode === CONTROL_MODES.transitioning &&
    travel?.reason === 'returnToOrbit'
  const canUseObservatoryController = isObservatoryEnabled || isReturnToOrbitTravel

  return (
    <>
      <ObservatoryCameraController
        bodies={bodies}
        cameraTarget={cameraTarget}
        canTransition={canUseObservatoryController}
        elapsedDays={elapsedDays}
        enabled={isObservatoryEnabled}
        ephemerisByBodyId={ephemerisByBodyId}
        onTravelComplete={onTravelComplete}
        positionMode={positionMode}
        scaleMode={scaleMode}
        travel={travel}
      />
      <FreeFlightController
        bodies={bodies}
        controlMode={controlMode}
        elapsedDays={elapsedDays}
        ephemerisByBodyId={ephemerisByBodyId}
        onTelemetryChange={onFlightTelemetryChange}
        positionMode={positionMode}
        registerFlightCleanup={registerFlightCleanup}
        registerPointerLockElement={registerPointerLockElement}
        scaleMode={scaleMode}
      />
    </>
  )
}
