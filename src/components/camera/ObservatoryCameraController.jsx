import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { Vector3 } from 'three'
import { CAMERA_TARGET_SOURCES } from '../../data/constants'
import { scaleRadius } from '../../utils/scale'
import { calculateBodySystemScenePosition } from '../../utils/vectorScale'

function getBodyScenePosition({
  bodies,
  body,
  elapsedDays,
  ephemerisByBodyId,
  positionMode,
  scaleMode,
}) {
  return new Vector3(
    ...calculateBodySystemScenePosition({
      bodies,
      body,
      elapsedDays,
      ephemerisByBodyId,
      mode: positionMode,
      scaleMode,
    }),
  )
}

function getCameraOffset(body, scaleMode, source) {
  const radius = scaleRadius(body.actualMeanRadiusKm, scaleMode, body.type)

  if (source === CAMERA_TARGET_SOURCES.returnToSun || body.type === 'star') {
    const overviewDistance = Math.max(38, radius * 22)

    return new Vector3(0, overviewDistance * 0.46, overviewDistance)
  }

  const distance = Math.max(2.1, Math.min(22, radius * 8.5))

  return new Vector3(distance, distance * 0.42, distance * 1.18)
}

function resolveTargetBody(bodies, cameraTarget) {
  return (
    bodies.find((body) => body.id === cameraTarget?.bodyId) ??
    bodies.find((body) => body.id === 'sun') ??
    bodies[0] ??
    null
  )
}

export function ObservatoryCameraController({
  bodies,
  cameraTarget,
  canTransition,
  elapsedDays,
  enabled,
  ephemerisByBodyId,
  onTravelComplete,
  positionMode,
  scaleMode,
  travel,
}) {
  const controlsRef = useRef(null)
  const elapsedDaysRef = useRef(elapsedDays)
  const appliedTravelIdRef = useRef(null)
  const { camera } = useThree()

  useEffect(() => {
    elapsedDaysRef.current = elapsedDays
  }, [elapsedDays])

  useEffect(() => {
    const controls = controlsRef.current
    const body = resolveTargetBody(bodies, cameraTarget)

    if (
      !controls ||
      !body ||
      !canTransition ||
      !travel?.isTraveling ||
      appliedTravelIdRef.current === travel.travelId
    ) {
      return
    }

    const target = getBodyScenePosition({
      bodies,
      body,
      elapsedDays: elapsedDaysRef.current,
      ephemerisByBodyId,
      positionMode,
      scaleMode,
    })
    const cameraPosition = target
      .clone()
      .add(getCameraOffset(body, scaleMode, cameraTarget?.source))

    appliedTravelIdRef.current = travel.travelId

    camera.position.copy(cameraPosition)
    camera.lookAt(target)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()

    controls.target.copy(target)
    controls.update()

    onTravelComplete?.(travel)
  }, [
    bodies,
    camera,
    cameraTarget,
    canTransition,
    ephemerisByBodyId,
    onTravelComplete,
    positionMode,
    scaleMode,
    travel,
  ])

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={enabled}
      enableDamping
      dampingFactor={0.08}
      enablePan
      enableRotate
      enableZoom
      maxDistance={2200}
      minDistance={0.02}
      panSpeed={0.85}
      rotateSpeed={0.65}
      zoomSpeed={0.9}
    />
  )
}
