import { DoubleSide } from 'three'
import { useTextureSet } from '../../hooks/useTextureSet'
import { TEXTURE_KEYS } from '../../utils/textureLoader'

const FALLBACK_RINGS = [
  { inner: 1.42, outer: 1.58, color: '#f4dfae', opacity: 0.42 },
  { inner: 1.64, outer: 1.76, color: '#b99763', opacity: 0.34 },
  { inner: 1.83, outer: 2.05, color: '#fff2c7', opacity: 0.38 },
  { inner: 2.12, outer: 2.36, color: '#8b7350', opacity: 0.28 },
  { inner: 2.45, outer: 2.68, color: '#ecd6a5', opacity: 0.24 },
]

function ProceduralRingBands({ radius }) {
  return (
    <group>
      {FALLBACK_RINGS.map((ring) => (
        <mesh key={`${ring.inner}-${ring.outer}`} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * ring.inner, radius * ring.outer, 160]} />
          <meshStandardMaterial
            color={ring.color}
            depthTest
            depthWrite={false}
            opacity={ring.opacity}
            roughness={0.92}
            side={DoubleSide}
            transparent
          />
        </mesh>
      ))}
    </group>
  )
}

function TexturedRing({ radius, texture }) {

  if (!texture) {
    return <ProceduralRingBands radius={radius} />
  }

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.42, radius * 2.72, 192]} />
      <meshStandardMaterial
        alphaMap={texture}
        map={texture}
        color="#f6dfac"
        depthTest
        depthWrite={false}
        opacity={0.78}
        roughness={0.86}
        side={DoubleSide}
        transparent
      />
    </mesh>
  )
}

export function SaturnRing({ body, radius }) {
  const { paths, textures } = useTextureSet(body)
  const fallback = <ProceduralRingBands radius={radius} />

  if (!paths[TEXTURE_KEYS.ring]) {
    return fallback
  }

  return (
    <TexturedRing radius={radius} texture={textures[TEXTURE_KEYS.ring]} />
  )
}
