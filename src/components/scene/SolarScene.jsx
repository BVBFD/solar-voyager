import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'
import { CONTROL_MODES } from '../../data/constants'
import { BodySystem } from '../bodies/BodySystem'
import { CameraController } from '../camera/CameraController'
import { Lighting } from './Lighting'
import { PostProcessing } from './PostProcessing'
import { StarField } from './StarField'

export function SolarScene({
  bodies,
  elapsedDays,
  selectedBodyId,
  cameraTarget,
  controlMode,
  ephemerisByBodyId,
  onActivateFlight,
  onFlightTelemetryChange,
  onSelectBody,
  positionMode,
  registerFlightCleanup,
  registerPointerLockElement,
  scaleMode,
  bloom,
  quality,
  cameraTravel,
  onTravelComplete,
  smallBodyFields,
}) {
  return (
    <div
      className="solar-scene"
      aria-label="3D solar system simulator"
      onPointerDown={(event) => {
        if (
          controlMode === CONTROL_MODES.flightReady &&
          event.target?.tagName === 'CANVAS'
        ) {
          onActivateFlight?.()
        }
      }}
    >
      <Canvas
        camera={{ position: [0, 16, 38], fov: 54 }}
        dpr={[1, 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
          gl.outputColorSpace = SRGBColorSpace
        }}
      >
        <color attach="background" args={['#02040a']} />
        <Lighting />
        <StarField quality={quality} />
        <BodySystem
          bodies={bodies}
          elapsedDays={elapsedDays}
          ephemerisByBodyId={ephemerisByBodyId}
          selectedBodyId={selectedBodyId}
          onSelectBody={onSelectBody}
          positionMode={positionMode}
          quality={quality}
          scaleMode={scaleMode}
          smallBodyFields={smallBodyFields}
        />
        <CameraController
          bodies={bodies}
          controlMode={controlMode}
          elapsedDays={elapsedDays}
          ephemerisByBodyId={ephemerisByBodyId}
          onTravelComplete={onTravelComplete}
          onFlightTelemetryChange={onFlightTelemetryChange}
          positionMode={positionMode}
          registerFlightCleanup={registerFlightCleanup}
          registerPointerLockElement={registerPointerLockElement}
          scaleMode={scaleMode}
          cameraTarget={cameraTarget}
          travel={cameraTravel}
        />
        <PostProcessing bloom={bloom} quality={quality} />
      </Canvas>
    </div>
  )
}
