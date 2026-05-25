import {
  ASTRONOMICAL_UNIT_KM,
  EARTH_RADIUS_KM,
  SCALE_MODES,
} from '../data/constants'

const VISUAL_DISTANCE_UNITS_PER_AU = 4.2
const VISUAL_RADIUS_UNITS_PER_EARTH = 0.32

export function scaleDistance(distanceKm, mode = SCALE_MODES.visualScale) {
  const sign = Math.sign(distanceKm)
  const distanceAu = Math.abs(distanceKm) / ASTRONOMICAL_UNIT_KM

  if (distanceKm === 0) {
    return 0
  }

  switch (mode) {
    case SCALE_MODES.visualScale:
      // Visual scale prioritizes readability: distances are square-root compressed.
      return sign * Math.sqrt(distanceAu) * VISUAL_DISTANCE_UNITS_PER_AU
    default:
      return sign * Math.sqrt(distanceAu) * VISUAL_DISTANCE_UNITS_PER_AU
  }
}

export function scaleRadius(
  radiusKm,
  mode = SCALE_MODES.visualScale,
  bodyType = 'planet',
) {
  const earthRatio = radiusKm / EARTH_RADIUS_KM

  switch (mode) {
    case SCALE_MODES.visualScale:
      if (bodyType === 'star') {
        return 1.32
      }

      if (bodyType === 'moon' || bodyType === 'dwarfPlanet') {
        return Math.max(0.032, Math.cbrt(earthRatio) * 0.22)
      }

      // Cube-root compression keeps rocky planets clickable beside gas giants.
      return Math.max(0.16, Math.cbrt(earthRatio) * VISUAL_RADIUS_UNITS_PER_EARTH)
    default:
      return scaleRadius(radiusKm, SCALE_MODES.visualScale, bodyType)
  }
}

export function scalePosition(positionKm, mode = SCALE_MODES.visualScale) {
  const [x, y, z] = positionKm
  const horizontalDistance = Math.hypot(x, z)

  if (horizontalDistance === 0) {
    return [0, y, 0]
  }

  const scaledDistance = scaleDistance(horizontalDistance, mode)
  const ratio = scaledDistance / horizontalDistance

  return [x * ratio, y, z * ratio]
}
