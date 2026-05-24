import { useMemo, useRef } from 'react'
import { Detailed } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending } from 'three'
import { Atmosphere } from './Atmosphere'
import { BodyDistanceMarker } from './BodyDistanceMarker'
import { CloudLayer } from './CloudLayer'
import { PlanetLabel } from './PlanetLabel'
import { PlanetMaterial } from './PlanetMaterial'
import { SaturnRing } from './SaturnRing'
import { calculateBodyPositionKm, degreesToRadians } from '../../utils/orbitalMath'
import { scaleRadius } from '../../utils/scale'
import { scaleBodyOrbitPosition } from '../../utils/vectorScale'
import { hasTexturePath, TEXTURE_KEYS } from '../../utils/textureLoader'

const PLANET_LOD_LEVELS = [
  { distance: 0, heightSegments: 48, widthSegments: 80 },
  { distance: 28, heightSegments: 32, widthSegments: 48 },
  { distance: 64, heightSegments: 18, widthSegments: 28 },
]

function createRingPoints(radius, segments = 96) {
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

function SelectionRing({ color, radius }) {
  const points = useMemo(() => createRingPoints(radius), [radius])

  return (
    <lineLoop rotation={[Math.PI / 2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        blending={AdditiveBlending}
        color={color}
        depthWrite={false}
        opacity={0.68}
        transparent
      />
    </lineLoop>
  )
}

function PlanetSurface({ body, onSelectBody, radius }) {
  return (
    <Detailed distances={PLANET_LOD_LEVELS.map((level) => level.distance)}>
      {PLANET_LOD_LEVELS.map((level) => (
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
          <PlanetMaterial body={body} radius={radius} />
        </mesh>
      ))}
    </Detailed>
  )
}

export function Planet({
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
  const hasRingTexture = hasTexturePath(body, TEXTURE_KEYS.ring)

  useFrame((_, delta) => {
    if (surfaceRef.current) {
      const direction = body.actualSiderealRotationPeriodHours < 0 ? -1 : 1
      const rotationSpeed = Math.min(
        1.8,
        Math.max(0.05, 24 / Math.abs(body.actualSiderealRotationPeriodHours)),
      )

      surfaceRef.current.rotation.y += delta * direction * rotationSpeed
    }
  })

  return (
    <group position={position}>
      <group rotation={[0, 0, axialTilt]}>
        <group ref={surfaceRef}>
          <PlanetSurface
            body={body}
            onSelectBody={onSelectBody}
            radius={radius}
          />
        </group>
        <CloudLayer body={body} radius={radius} />
        <Atmosphere body={body} radius={radius} />
        {body.hasRings || hasRingTexture ? (
          <SaturnRing body={body} radius={radius} />
        ) : null}
      </group>
      {isSelected ? (
        <SelectionRing color="#67e8f9" radius={radius * 1.58} />
      ) : null}
      <BodyDistanceMarker body={body} isSelected={isSelected} radius={radius} />
      <PlanetLabel body={body} isSelected={isSelected} radius={radius} />
      {children}
    </group>
  )
}
