import { ORBIT_SEGMENTS } from '../data/constants'

const FULL_ORBIT_RADIANS = Math.PI * 2

export const POSITION_MODE = {
  circularOrbitV1: 'circularOrbitV1',
  horizonsVectorV3: 'horizonsVectorV3',
}

export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180
}

export function getStableOrbitPhase(bodyId) {
  const hash = Array.from(bodyId).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  )

  return (hash % 360) * (Math.PI / 180)
}

export function calculateCircularOrbitPosition(body, elapsedDays) {
  const orbitalDistanceKm =
    body.actualAverageOrbitDistanceKm ?? body.actualAverageDistanceFromSunKm
  const orbitalPeriodDays = body.actualSiderealOrbitPeriodDays

  if (
    !orbitalDistanceKm ||
    !orbitalPeriodDays
  ) {
    return [0, 0, 0]
  }

  const phase = getStableOrbitPhase(body.id)

  // v1 is a simple circular orbit: elapsed days advance by period ratio.
  const angle =
    phase +
    (elapsedDays / orbitalPeriodDays) * FULL_ORBIT_RADIANS

  return [
    Math.cos(angle) * orbitalDistanceKm,
    0,
    Math.sin(angle) * orbitalDistanceKm,
  ]
}

export function calculateVectorPosition(ephemerisVector) {
  // v3 will use JPL vector positions normalized by the ephemeris adapter.
  return ephemerisVector?.positionKm ?? [0, 0, 0]
}

export function calculateBodyPositionKm({
  body,
  elapsedDays,
  ephemerisVector,
  mode = POSITION_MODE.circularOrbitV1,
}) {
  if (mode === POSITION_MODE.horizonsVectorV3) {
    return calculateVectorPosition(ephemerisVector)
  }

  return calculateCircularOrbitPosition(body, elapsedDays)
}

export function calculateBodySystemPositionKm({
  bodies,
  body,
  elapsedDays,
  ephemerisByBodyId,
  mode = POSITION_MODE.circularOrbitV1,
}) {
  const ephemerisVector = ephemerisByBodyId?.[body.id]

  if (mode === POSITION_MODE.horizonsVectorV3 && ephemerisVector) {
    return calculateVectorPosition(ephemerisVector)
  }

  const localPosition = calculateCircularOrbitPosition(body, elapsedDays)
  const parentBody = body.parentId
    ? bodies.find((candidate) => candidate.id === body.parentId)
    : null

  if (!parentBody) {
    return localPosition
  }

  const parentPosition = calculateBodySystemPositionKm({
    bodies,
    body: parentBody,
    elapsedDays,
    ephemerisByBodyId,
    mode,
  })

  return [
    parentPosition[0] + localPosition[0],
    parentPosition[1] + localPosition[1],
    parentPosition[2] + localPosition[2],
  ]
}

export function createCircularOrbitPoints(
  averageDistanceKm,
  segments = ORBIT_SEGMENTS,
) {
  return Array.from({ length: segments + 1 }, (_, index) => {
    const angle = (index / segments) * FULL_ORBIT_RADIANS

    return [
      Math.cos(angle) * averageDistanceKm,
      0,
      Math.sin(angle) * averageDistanceKm,
    ]
  })
}
