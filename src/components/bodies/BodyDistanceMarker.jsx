import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, Vector3 } from 'three'

function getMarkerOpacity(distance, isSelected) {
  if (isSelected) {
    return 0
  }

  if (distance < 18) {
    return 0
  }

  return Math.min(0.3, (distance - 18) / 48)
}

function createMarkerTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64

  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)

  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.72)')
  gradient.addColorStop(0.58, 'rgba(255,255,255,0.18)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, 64, 64)

  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function BodyDistanceMarker({ body, isSelected, radius }) {
  const materialRef = useRef(null)
  const spriteRef = useRef(null)
  const worldPositionRef = useRef(new Vector3())
  const markerTexture = useMemo(() => createMarkerTexture(), [])
  const markerScale = Math.min(1.15, Math.max(radius * 0.72, 0.24))

  useFrame(({ camera }) => {
    if (!spriteRef.current || !materialRef.current) {
      return
    }

    const distance = camera.position.distanceTo(
      spriteRef.current.getWorldPosition(worldPositionRef.current),
    )

    materialRef.current.opacity = getMarkerOpacity(distance, isSelected)
  })

  return (
    <sprite ref={spriteRef} scale={[markerScale, markerScale, 1]}>
      <spriteMaterial
        ref={materialRef}
        blending={AdditiveBlending}
        color={body.color}
        depthTest={false}
        depthWrite={false}
        map={markerTexture}
        opacity={0}
        transparent
      />
    </sprite>
  )
}
