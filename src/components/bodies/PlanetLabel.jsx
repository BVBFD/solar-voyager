import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

export function PlanetLabel({ name, isSelected }) {
  const className = isSelected ? 'planet-label is-selected' : 'planet-label'
  const groupRef = useRef(null)
  const spanRef = useRef(null)
  const worldPositionRef = useRef(new Vector3())

  useFrame(({ camera }) => {
    if (!groupRef.current || !spanRef.current) {
      return
    }

    const distance = camera.position.distanceTo(
      groupRef.current.getWorldPosition(worldPositionRef.current),
    )
    const opacity = isSelected ? 1 : Math.max(0, 1 - (distance - 18) / 18)

    spanRef.current.style.opacity = opacity.toFixed(2)
    spanRef.current.style.transform = `scale(${isSelected ? 1 : Math.max(0.72, opacity)})`
  })

  return (
    <group ref={groupRef}>
      <Html center distanceFactor={9}>
        <span ref={spanRef} className={className}>
          {name}
        </span>
      </Html>
    </group>
  )
}
