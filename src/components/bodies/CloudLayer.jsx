import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TEXTURE_KEYS } from '../../utils/textureLoader'
import { useTextureSet } from '../../hooks/useTextureSet'

export function CloudLayer({
  body,
  opacity = 0.34,
  radius,
  rotationSpeed = 0.08,
  scale = 1.025,
  segments = [48, 24],
}) {
  const cloudRef = useRef(null)
  const { textures } = useTextureSet(body)
  const cloudTexture = textures[TEXTURE_KEYS.cloud]

  useFrame((_, delta) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * rotationSpeed
    }
  })

  if (!cloudTexture) {
    return null
  }

  return (
    <mesh ref={cloudRef} scale={[scale, scale, scale]}>
      <sphereGeometry args={[radius, segments[0], segments[1]]} />
      <meshPhysicalMaterial
        alphaMap={cloudTexture ?? undefined}
        alphaTest={0.04}
        color="#ffffff"
        depthTest
        depthWrite={false}
        opacity={opacity}
        roughness={1}
        transparent
      />
    </mesh>
  )
}
