import { useRef } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useTranslation } from 'react-i18next'
import { Vector3 } from 'three'
import { getBodyName } from '../../utils/bodyI18n'
import { getBodyLabelIcon } from '../../utils/bodyLabelIcons'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function getLabelPosition(radius, body) {
  const isMinor = body?.type && !['star', 'planet'].includes(body.type)

  if (isMinor) {
    const labelOffset = clamp(radius * 0.45, 0.1, 0.28)
    const sideOffset = clamp(radius * 0.26, 0.06, 0.18)

    if (body.id === 'phobos') {
      return [-sideOffset, radius + labelOffset, 0]
    }

    if (body.id === 'deimos') {
      return [sideOffset, radius + labelOffset + 0.06, 0]
    }

    return [sideOffset, radius + labelOffset, 0]
  }

  const labelOffset = clamp(radius * 0.55, 0.16, 0.52)
  const sideOffset = clamp(radius * 0.34, 0.08, 0.36)

  return [sideOffset, radius + labelOffset, 0]
}

export function PlanetLabel({ body, isSelected, name, radius = 0 }) {
  const { t } = useTranslation()
  const bodyName = body?.name ?? name
  const translatedName = body ? getBodyName(body, t) : bodyName
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
  const labelPosition = getLabelPosition(radius, body)
  const icon = getBodyLabelIcon(body ?? { name: bodyName })

  useFrame(({ camera }) => {
    if (!groupRef.current || !spanRef.current) {
      return
    }

    const distance = camera.position.distanceTo(
      groupRef.current.getWorldPosition(worldPositionRef.current),
    )
    const fadeStart = isMinor ? 8 : 18
    const fadeRange = isMinor ? 8 : 18
    const opacity = isSelected
      ? isMinor ? 0.82 : 0.94
      : Math.max(0, 1 - (distance - fadeStart) / fadeRange)
    const minScale = isMinor ? 0.48 : 0.62
    const scale = isSelected
      ? isMinor ? 0.88 : 0.94
      : clamp(opacity, minScale, isMinor ? 0.72 : 0.88)

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
