import { useMemo, useRef } from 'react'
import { Detailed } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import { Atmosphere } from './Atmosphere'
import { BodyDistanceMarker } from './BodyDistanceMarker'
import { CloudLayer } from './CloudLayer'
import { PlanetLabel } from './PlanetLabel'
import { PlanetMaterial } from './PlanetMaterial'
import { calculateBodyPositionKm, degreesToRadians } from '../../utils/orbitalMath'
import { scaleRadius } from '../../utils/scale'
import { scaleBodyOrbitPosition } from '../../utils/vectorScale'
import {
  getTexturePath,
  TEXTURE_KEYS,
} from '../../utils/textureLoader'

const EARTH_LOD_LEVELS = [
  { distance: 0, heightSegments: 56, widthSegments: 96 },
  { distance: 26, heightSegments: 40, widthSegments: 72 },
  { distance: 58, heightSegments: 24, widthSegments: 40 },
]

function createRingPoints(radius, segments = 112) {
  const positions = new Float32Array(segments * 3)

  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2
    const offset = index * 3

    positions[offset] = Math.cos(angle) * radius
    positions[offset + 1] = 0
    positions[offset + 2] = Math.sin(angle) * radius
  }

  return positions
}

function EarthFallbackMaterial({ body }) {
  return (
    <meshPhysicalMaterial
      color="#2b82d9"
      clearcoat={0.18}
      emissive={body.visualEmissive}
      metalness={0}
      roughness={0.72}
    />
  )
}

function EarthSurface({ body, onSelectBody, radius }) {
  const albedoTexturePath = getTexturePath(body, TEXTURE_KEYS.albedo)

  return (
    <Detailed distances={EARTH_LOD_LEVELS.map((level) => level.distance)}>
      {EARTH_LOD_LEVELS.map((level) => (
        <mesh
          key={level.distance}
          onClick={(event) => {
            event.stopPropagation()
            onSelectBody(body.id)
          }}
        >
          <sphereGeometry
            args={[radius, level.widthSegments, level.heightSegments]}
          />
          {albedoTexturePath ? (
            <PlanetMaterial body={body} radius={radius} />
          ) : (
            <EarthFallbackMaterial body={body} />
          )}
        </mesh>
      ))}
    </Detailed>
  )
}

function EarthHighlightRing({ radius }) {
  const points = useMemo(() => createRingPoints(radius * 1.66), [radius])

  return (
    <lineLoop rotation={[Math.PI / 2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        blending={AdditiveBlending}
        color="#8bd8ff"
        depthWrite={false}
        opacity={0.66}
        transparent
      />
    </lineLoop>
  )
}

export function Earth({
  body,
  children,
  elapsedDays,
  ephemerisVector,
  isSelected,
  onSelectBody,
  positionMode,
  scaleMode,
}) {
  const surfaceRef = useRef(null)
  const orbitPosition = calculateBodyPositionKm({
    body,
    elapsedDays,
    ephemerisVector,
    mode: positionMode,
  })
  const position = scaleBodyOrbitPosition(
    orbitPosition,
    scaleMode,
    positionMode,
    body,
  )
  const radius = scaleRadius(body.actualMeanRadiusKm, scaleMode, body.type)
  const axialTilt = degreesToRadians(body.axialTiltDeg ?? 0)

  useFrame((_, delta) => {
    if (surfaceRef.current) {
      const rotationSpeed = Math.min(
        1.8,
        Math.max(0.05, 24 / Math.abs(body.actualSiderealRotationPeriodHours)),
      )

      surfaceRef.current.rotation.y += delta * rotationSpeed
    }
  })

  return (
    <group position={position}>
      <group rotation={[0, 0, axialTilt]}>
        <group ref={surfaceRef}>
          <EarthSurface
            body={body}
            onSelectBody={onSelectBody}
            radius={radius}
          />
        </group>
        <CloudLayer
          body={body}
          opacity={0.42}
          radius={radius}
          rotationSpeed={0.16}
          scale={1.032}
          segments={[64, 32]}
        />
        <Atmosphere body={body} radius={radius} />
      </group>
      {isSelected ? <EarthHighlightRing radius={radius} /> : null}
      <BodyDistanceMarker body={body} isSelected={isSelected} radius={radius} />
      <PlanetLabel body={body} isSelected={isSelected} radius={radius} />
      {children}
    </group>
  )
}
