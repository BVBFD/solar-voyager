import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Euler, MathUtils, Vector3 } from 'three'
import { CONTROL_MODES, SCALE_MODES } from '../../data/constants'
import { useKeyboardFlightControls } from '../../hooks/useKeyboardFlightControls'
import { scaleRadius } from '../../utils/scale'
import { calculateBodySystemScenePosition } from '../../utils/vectorScale'

const SPEED_BY_SCALE_MODE = {
  [SCALE_MODES.visualScale]: 7.2,
  [SCALE_MODES.compressedRealScale]: 10.5,
  [SCALE_MODES.realScalePlaceholder]: 8.4,
}
const LOOK_SENSITIVITY = 0.002
const MIN_PITCH = -Math.PI / 2 + 0.08
const MAX_PITCH = Math.PI / 2 - 0.08
const TELEMETRY_INTERVAL_SECONDS = 0.16

function isMobileLikeDevice() {
  if (typeof window === 'undefined') {
    return false
  }

  return (
    window.matchMedia?.('(pointer: coarse)').matches ||
    window.innerWidth < 760
  )
}

function getBodySafetySpheres({
  bodies,
  elapsedDays,
  ephemerisByBodyId,
  positionMode,
  scaleMode,
}) {
  return bodies.map((body) => {
    const position = new Vector3(
      ...calculateBodySystemScenePosition({
        bodies,
        body,
        elapsedDays,
        ephemerisByBodyId,
        mode: positionMode,
        scaleMode,
      }),
    )
    const radius = scaleRadius(body.actualMeanRadiusKm, scaleMode, body.type)

    return {
      id: body.id,
      name: body.name,
      position,
      radius,
      // Soft collision keeps free flight from clipping through bodies.
      safeRadius: Math.max(radius + 0.42, radius * 1.45),
      dampingRadius: Math.max(radius + 4, radius * 7),
    }
  })
}

function getNearestBodyContext(cameraPosition, safetySpheres) {
  let nearestBody = null
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const sphere of safetySpheres) {
    const centerDistance = cameraPosition.distanceTo(sphere.position)
    const surfaceDistance = Math.max(0, centerDistance - sphere.radius)

    if (surfaceDistance < nearestDistance) {
      nearestBody = sphere
      nearestDistance = surfaceDistance
    }
  }

  return {
    distanceToNearest: nearestDistance,
    nearestBody,
  }
}

function getDistanceSpeedFactor(cameraPosition) {
  const distanceFromSun = cameraPosition.length()

  // Farther from the Sun the scene has larger empty spans, so flight speed grows
  // gently with distance while staying bounded for close planetary inspection.
  return MathUtils.clamp(0.65 + Math.sqrt(distanceFromSun) / 12, 0.65, 2.8)
}

function getProximitySpeedFactor(distanceToNearest, nearestBody) {
  if (!nearestBody) {
    return 1
  }

  const usableRange = Math.max(0.001, nearestBody.dampingRadius - nearestBody.safeRadius)
  const normalizedRange = MathUtils.clamp(
    (distanceToNearest - nearestBody.safeRadius) / usableRange,
    0,
    1,
  )

  // Close approaches should feel precise instead of overshooting the planet.
  return MathUtils.lerp(0.18, 1, normalizedRange)
}

export function FreeFlightController({
  bodies,
  controlMode,
  elapsedDays,
  ephemerisByBodyId,
  onTelemetryChange,
  positionMode,
  registerFlightCleanup,
  registerPointerLockElement,
  scaleMode,
}) {
  const velocityRef = useRef(new Vector3())
  const lookEulerRef = useRef(new Euler(0, 0, 0, 'YXZ'))
  const telemetryTimerRef = useRef(0)
  const [isMobile] = useState(() => isMobileLikeDevice())
  const { camera, gl } = useThree()
  const isFlightActive =
    controlMode === CONTROL_MODES.flightActive && !isMobile
  const keysRef = useKeyboardFlightControls(isFlightActive)
  const baseSpeed =
    SPEED_BY_SCALE_MODE[scaleMode] ?? SPEED_BY_SCALE_MODE[SCALE_MODES.visualScale]
  const safetySpheres = useMemo(
    () =>
      getBodySafetySpheres({
        bodies,
        elapsedDays,
        ephemerisByBodyId,
        positionMode,
        scaleMode,
      }),
    [bodies, elapsedDays, ephemerisByBodyId, positionMode, scaleMode],
  )

  useEffect(() => {
    registerPointerLockElement?.(gl.domElement)

    return () => registerPointerLockElement?.(null)
  }, [gl.domElement, registerPointerLockElement])

  useEffect(() => {
    const cleanupFlightControllerState = () => {
      keysRef.current.clear()
      velocityRef.current.set(0, 0, 0)
      telemetryTimerRef.current = 0
      onTelemetryChange?.({
        distanceToNearest: 0,
        nearestBodyName: 'Sun',
        speed: 0,
      })
    }

    return registerFlightCleanup?.(cleanupFlightControllerState)
  }, [keysRef, onTelemetryChange, registerFlightCleanup])

  useEffect(() => {
    if (!isFlightActive) {
      return undefined
    }

    lookEulerRef.current.setFromQuaternion(camera.quaternion)

    const handleMouseMove = (event) => {
      if (document.pointerLockElement !== gl.domElement) {
        return
      }

      const euler = lookEulerRef.current
      euler.setFromQuaternion(camera.quaternion)
      euler.y -= event.movementX * LOOK_SENSITIVITY
      euler.x = MathUtils.clamp(
        euler.x - event.movementY * LOOK_SENSITIVITY,
        MIN_PITCH,
        MAX_PITCH,
      )
      camera.quaternion.setFromEuler(euler)
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [camera, gl.domElement, isFlightActive])

  useFrame((_, delta) => {
    telemetryTimerRef.current += delta
    const { distanceToNearest, nearestBody } = getNearestBodyContext(
      camera.position,
      safetySpheres,
    )

    if (
      onTelemetryChange &&
      telemetryTimerRef.current >= TELEMETRY_INTERVAL_SECONDS
    ) {
      telemetryTimerRef.current = 0
      onTelemetryChange({
        distanceToNearest,
        nearestBodyName: nearestBody?.name ?? 'Unknown',
        speed: velocityRef.current.length(),
      })
    }

    if (!isFlightActive) {
      velocityRef.current.multiplyScalar(Math.exp(-delta * 5))
      return
    }

    const keys = keysRef.current
    const forward = new Vector3()
    const right = new Vector3(1, 0, 0)
    const up = new Vector3(0, 1, 0)
    const move = new Vector3()

    camera.getWorldDirection(forward)
    forward.normalize()
    right.applyQuaternion(camera.quaternion).normalize()

    if (keys.has('KeyW') || keys.has('ArrowUp')) move.add(forward)
    if (keys.has('KeyS') || keys.has('ArrowDown')) move.sub(forward)
    if (keys.has('KeyA') || keys.has('ArrowLeft')) move.sub(right)
    if (keys.has('KeyD') || keys.has('ArrowRight')) move.add(right)
    if (keys.has('KeyE')) move.add(up)
    if (keys.has('KeyQ')) move.sub(up)

    const boost = keys.has('ShiftLeft') || keys.has('ShiftRight') ? 3.2 : 1
    const distanceFactor = getDistanceSpeedFactor(camera.position)
    const proximityFactor = getProximitySpeedFactor(distanceToNearest, nearestBody)
    const adjustedSpeed = baseSpeed * distanceFactor * proximityFactor
    const targetVelocity =
      move.lengthSq() > 0
        ? move.normalize().multiplyScalar(adjustedSpeed * boost)
        : new Vector3()

    if (keys.has('Space')) {
      velocityRef.current.multiplyScalar(Math.exp(-delta * 9))
    } else {
      velocityRef.current.lerp(targetVelocity, 1 - Math.exp(-delta * 8))
    }

    camera.position.addScaledVector(velocityRef.current, delta)

    for (const sphere of safetySpheres) {
      const distance = camera.position.distanceTo(sphere.position)

      if (distance < sphere.safeRadius) {
        const pushDirection = camera.position
          .clone()
          .sub(sphere.position)
          .normalize()

        if (pushDirection.lengthSq() === 0) {
          pushDirection.set(1, 0, 0)
        }

        camera.position.copy(
          sphere.position.clone().addScaledVector(pushDirection, sphere.safeRadius),
        )
        velocityRef.current.multiplyScalar(0.25)
      }
    }
  })

  return null
}
