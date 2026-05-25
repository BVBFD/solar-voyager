import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import { QUALITY_LEVELS } from '../../data/constants'

const STAR_QUALITY = {
  [QUALITY_LEVELS.low]: { far: 850, near: 120 },
  [QUALITY_LEVELS.medium]: { far: 1700, near: 240 },
  [QUALITY_LEVELS.high]: { far: 3200, near: 420 },
}

const STAR_RENDER_PROFILES = {
  [QUALITY_LEVELS.low]: {
    farOpacity: 0.82,
    farSize: 0.065,
    nearOpacity: 0.9,
    nearSize: 0.13,
  },
  [QUALITY_LEVELS.medium]: {
    farOpacity: 1,
    farSize: 0.065,
    nearOpacity: 1,
    nearSize: 0.13,
  },
  [QUALITY_LEVELS.high]: {
    farOpacity: 0.64,
    farSize: 0.052,
    nearOpacity: 0.68,
    nearSize: 0.104,
  },
}

function createSeededRandom(seed) {
  let value = seed

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296
    return value / 4294967296
  }
}

function createStarPositions(count, radius, depth, seed) {
  const random = createSeededRandom(seed)
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const theta = random() * Math.PI * 2
    const phi = Math.acos(2 * random() - 1)
    const distance = radius - random() * depth
    const offset = index * 3

    positions[offset] = Math.sin(phi) * Math.cos(theta) * distance
    positions[offset + 1] = Math.cos(phi) * distance
    positions[offset + 2] = Math.sin(phi) * Math.sin(theta) * distance
  }

  return positions
}

function StarLayer({
  color,
  count,
  depth,
  opacity,
  parallax,
  radius,
  seed,
  size,
}) {
  const groupRef = useRef(null)
  const { camera } = useThree()
  const positions = useMemo(
    () => createStarPositions(count, radius, depth, seed),
    [count, depth, radius, seed],
  )

  useFrame(() => {
    if (groupRef.current) {
      // Small inverse camera follow creates a subtle parallax cue without moving geometry every frame.
      groupRef.current.position.set(
        camera.position.x * parallax,
        camera.position.y * parallax,
        camera.position.z * parallax,
      )
    }
  })

  return (
    <points ref={groupRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        blending={AdditiveBlending}
        color={color}
        depthWrite={false}
        opacity={opacity}
        size={size}
        sizeAttenuation
        transparent
      />
    </points>
  )
}

export function StarField({ quality = QUALITY_LEVELS.medium }) {
  const counts = STAR_QUALITY[quality] ?? STAR_QUALITY[QUALITY_LEVELS.medium]
  const profile =
    STAR_RENDER_PROFILES[quality] ??
    STAR_RENDER_PROFILES[QUALITY_LEVELS.medium]

  return (
    <group>
      <StarLayer
        color="#8fb8ff"
        count={counts.far}
        depth={70}
        opacity={profile.farOpacity}
        parallax={0.012}
        radius={150}
        seed={11}
        size={profile.farSize}
      />
      <StarLayer
        color="#ffffff"
        count={counts.near}
        depth={34}
        opacity={profile.nearOpacity}
        parallax={0.035}
        radius={80}
        seed={29}
        size={profile.nearSize}
      />
    </group>
  )
}
