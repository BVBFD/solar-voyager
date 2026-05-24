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

  if (!body.hasCloudLayer && !cloudTexture) {
    return null
  }

  return (
    <mesh ref={cloudRef} scale={[scale, scale, scale]}>
      <sphereGeometry args={[radius, segments[0], segments[1]]} />
      <meshPhysicalMaterial
        alphaMap={cloudTexture ?? undefined}
        color="#ffffff"
        depthTest
        depthWrite={false}
        map={cloudTexture ?? undefined}
        opacity={cloudTexture ? opacity : opacity * 0.65}
        roughness={1}
        transparent
      />
    </mesh>
  )
}
