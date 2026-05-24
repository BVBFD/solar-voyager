import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useTranslation } from 'react-i18next'
import { Vector3 } from 'three'
import { getBodyLabelIcon } from '../../utils/bodyLabelIcons'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getLabelPosition(radius) {
  const labelOffset = clamp(radius * 0.55, 0.16, 0.52)
  const sideOffset = clamp(radius * 0.34, 0.08, 0.36)

  return [sideOffset, radius + labelOffset, 0]
}

export function PlanetLabel({ body, isSelected, name, radius = 0 }) {
  const { t } = useTranslation()
  const bodyName = body?.name ?? name
  const translatedName = body?.id
    ? t(`bodies.${body.id}.name`, { defaultValue: bodyName })
    : bodyName
  const isMinor = body?.type && !['star', 'planet'].includes(body.type)
  const className = [
    'planet-label',
    isSelected ? 'planet-label--selected is-selected' : '',
    isMinor ? 'planet-label--minor' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const groupRef = useRef(null)
  const spanRef = useRef(null)
  const worldPositionRef = useRef(new Vector3())
  const labelPosition = getLabelPosition(radius)
  const icon = getBodyLabelIcon(body ?? { name: bodyName })

  useFrame(({ camera }) => {
    if (!groupRef.current || !spanRef.current) {
      return
    }

    const distance = camera.position.distanceTo(
      groupRef.current.getWorldPosition(worldPositionRef.current),
    )
    const fadeStart = isMinor ? 10 : 18
    const fadeRange = isMinor ? 10 : 18
    const opacity = isSelected
      ? 1
      : Math.max(0, 1 - (distance - fadeStart) / fadeRange)
    const minScale = isMinor ? 0.58 : 0.68
    const scale = isSelected ? 1 : clamp(opacity, minScale, 0.94)

    spanRef.current.style.opacity = opacity.toFixed(2)
    spanRef.current.style.transform = `scale(${scale})`
  })

  return (
    <group ref={groupRef} position={labelPosition}>
      <Html center distanceFactor={7.5}>
        <span ref={spanRef} aria-label={translatedName} className={className}>
          <span className="planet-label__icon" aria-hidden="true">
            {icon}
          </span>
          <span className="planet-label__name">{translatedName}</span>
        </span>
      </Html>
    </group>
  )
}
