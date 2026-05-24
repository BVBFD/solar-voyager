import {
  SCALE_MODES,
} from '../data/constants'
import {
  calculateCircularOrbitPosition,
  calculateVectorPosition,
  POSITION_MODE,
} from './orbitalMath'
import { scaleDistance, scalePosition } from './scale'

const DEFAULT_CHILD_ORBIT_MULTIPLIERS = {
  moon: 5.5,
}

const VISUAL_PLANET_MIN_ORBIT_DISTANCE = {
  mercury: 3.3,
  venus: 3.95,
  earth: 4.6,
  mars: 5.45,
}

const VISUAL_MOON_MIN_ORBIT_DISTANCE = {
  phobos: 0.42,
  deimos: 0.58,
}

function clampHorizontalDistance(position, minDistance) {
  const [x, y, z] = position
  const horizontalDistance = Math.hypot(x, z)

  if (!minDistance || horizontalDistance === 0 || horizontalDistance >= minDistance) {
    return position
  }

  const ratio = minDistance / horizontalDistance

  return [x * ratio, y, z * ratio]
}

export function scaleVectorPosition(positionKm, scaleMode) {
  const [x = 0, y = 0, z = 0] = positionKm ?? [0, 0, 0]
  const distanceKm = Math.hypot(x, y, z)

  if (distanceKm === 0) {
    return [0, 0, 0]
  }

  const scaledDistance = scaleDistance(distanceKm, scaleMode)
  const ratio = scaledDistance / distanceKm

  // Input: physical heliocentric km from Horizons VECTORS (CENTER=500@10).
  // Output: render-only scene units. Never feed scene units back into services,
  // because visual compression intentionally breaks physical distance scale.
  // Direction is preserved, while the radial length is compressed for visibility.
  return [x * ratio, y * ratio, z * ratio]
}

export function scalePositionForMode(positionKm, scaleMode, positionMode) {
  if (positionMode === POSITION_MODE.horizonsVectorV3) {
    return scaleVectorPosition(positionKm, scaleMode)
  }

  return scalePosition(positionKm, scaleMode)
}

export function scaleBodyOrbitPosition(
  positionKm,
  scaleMode,
  positionMode,
  body,
) {
  const scaledPosition = scalePositionForMode(positionKm, scaleMode, positionMode)
  const multiplier =
    body.visualOrbitMultiplier ??
    (body.parentId ? DEFAULT_CHILD_ORBIT_MULTIPLIERS[body.type] ?? 1 : 1)

  const displayPosition = [
    scaledPosition[0] * multiplier,
    scaledPosition[1] * multiplier,
    scaledPosition[2] * multiplier,
  ]

  if (scaleMode !== SCALE_MODES.visualScale) {
    return displayPosition
  }

  if (body.type === 'planet' && body.parentId === 'sun') {
    return clampHorizontalDistance(
      displayPosition,
      VISUAL_PLANET_MIN_ORBIT_DISTANCE[body.id],
    )
  }

  if (body.type === 'moon') {
    return clampHorizontalDistance(
      displayPosition,
      VISUAL_MOON_MIN_ORBIT_DISTANCE[body.id],
    )
  }

  return displayPosition
}

function getLocalBodyPositionKm({
  body,
  ephemerisByBodyId,
  elapsedDays,
  mode,
}) {
  const vector = ephemerisByBodyId?.[body.id]
  const parentVector = body.parentId ? ephemerisByBodyId?.[body.parentId] : null

  if (mode === POSITION_MODE.horizonsVectorV3 && vector) {
    const positionKm = calculateVectorPosition(vector)

    if (!parentVector) {
      return positionKm
    }

    const parentPositionKm = calculateVectorPosition(parentVector)

    return [
      positionKm[0] - parentPositionKm[0],
      positionKm[1] - parentPositionKm[1],
      positionKm[2] - parentPositionKm[2],
    ]
  }

  return calculateCircularOrbitPosition(body, elapsedDays)
}

export function calculateBodySystemScenePosition({
  bodies,
  body,
  elapsedDays,
  ephemerisByBodyId,
  mode = POSITION_MODE.circularOrbitV1,
  scaleMode,
}) {
  const localPositionKm = getLocalBodyPositionKm({
    body,
    elapsedDays,
    ephemerisByBodyId,
    mode,
  })
  const localScenePosition = scaleBodyOrbitPosition(
    localPositionKm,
    scaleMode,
    mode,
    body,
  )
  const parentBody = body.parentId
    ? bodies.find((candidate) => candidate.id === body.parentId)
    : null

  if (!parentBody) {
    return localScenePosition
  }

  const parentScenePosition = calculateBodySystemScenePosition({
    bodies,
    body: parentBody,
    elapsedDays,
    ephemerisByBodyId,
    mode,
    scaleMode,
  })

  return [
    parentScenePosition[0] + localScenePosition[0],
    parentScenePosition[1] + localScenePosition[1],
    parentScenePosition[2] + localScenePosition[2],
  ]
}
