import { useEffect, useMemo } from 'react'
import { BufferAttribute, BufferGeometry } from 'three'
import { QUALITY_LEVELS } from '../../data/constants'
import { scaleVectorPosition } from '../../utils/vectorScale'

const FIELD_COUNTS = {
  [QUALITY_LEVELS.low]: {
    'asteroid-belt': 320,
    'kuiper-belt': 220,
    'comet-trails': 80,
  },
  [QUALITY_LEVELS.medium]: {
    'asteroid-belt': 900,
    'kuiper-belt': 620,
    'comet-trails': 150,
  },
  [QUALITY_LEVELS.high]: {
    'asteroid-belt': 1800,
    'kuiper-belt': 1400,
    'comet-trails': 260,
  },
}

const FIELD_RENDER_PROFILES = {
  [QUALITY_LEVELS.low]: {
    opacityMultiplier: 0.9,
    pointSize: 0.018,
    trailSize: 0.024,
  },
  [QUALITY_LEVELS.medium]: {
    opacityMultiplier: 1,
    pointSize: 0.018,
    trailSize: 0.024,
  },
  [QUALITY_LEVELS.high]: {
    opacityMultiplier: 0.66,
    pointSize: 0.014,
    trailSize: 0.019,
  },
}

function createSeededRandom(seedText) {
  let seed = Array.from(seedText).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  )

  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

function createBeltPoint(field, random) {
  const angle = random() * Math.PI * 2
  const distanceKm =
    field.innerDistanceKm +
    (field.outerDistanceKm - field.innerDistanceKm) * random()
  const verticalOffset = (random() - 0.5) * field.verticalSpreadKm

  return [
    Math.cos(angle) * distanceKm,
    verticalOffset,
    Math.sin(angle) * distanceKm,
  ]
}

function createCometTrailPoint(field, random, index, count) {
  const trailProgress = index / Math.max(1, count - 1)
  const angle = trailProgress * Math.PI * 1.55 + random() * 0.08
  const distanceKm =
    field.innerDistanceKm +
    (field.outerDistanceKm - field.innerDistanceKm) * trailProgress
  const verticalOffset = Math.sin(trailProgress * Math.PI * 3) * field.verticalSpreadKm

  return [
    Math.cos(angle) * distanceKm,
    verticalOffset * (0.35 + random() * 0.35),
    Math.sin(angle) * distanceKm * 0.42,
  ]
}

function createFieldGeometry(field, quality, scaleMode) {
  const qualityCounts =
    FIELD_COUNTS[quality] ?? FIELD_COUNTS[QUALITY_LEVELS.medium]
  const count = qualityCounts[field.id] ?? 240
  const random = createSeededRandom(`${field.id}-${quality}`)
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const pointKm =
      field.fieldKind === 'cometTrails'
        ? createCometTrailPoint(field, random, index, count)
        : createBeltPoint(field, random)
    const point = scaleVectorPosition(pointKm, scaleMode)

    positions[index * 3] = point[0]
    positions[index * 3 + 1] = point[1] * 0.22
    positions[index * 3 + 2] = point[2]
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  return geometry
}

export function SmallBodyField({ field, quality, scaleMode }) {
  const geometry = useMemo(
    () => createFieldGeometry(field, quality, scaleMode),
    [field, quality, scaleMode],
  )
  const renderProfile =
    FIELD_RENDER_PROFILES[quality] ??
    FIELD_RENDER_PROFILES[QUALITY_LEVELS.medium]
  const pointSize =
    field.fieldKind === 'cometTrails'
      ? renderProfile.trailSize
      : renderProfile.pointSize

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <points geometry={geometry}>
      <pointsMaterial
        color={field.color}
        depthWrite={false}
        opacity={field.opacity * renderProfile.opacityMultiplier}
        size={pointSize}
        sizeAttenuation
        transparent
      />
    </points>
  )
}
