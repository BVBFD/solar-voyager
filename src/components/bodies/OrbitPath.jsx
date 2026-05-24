import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import { createCircularOrbitPoints, POSITION_MODE } from '../../utils/orbitalMath'
import { scaleBodyOrbitPosition } from '../../utils/vectorScale'

export function OrbitPath({ body, scaleMode }) {
  const orbitDistanceKm =
    body.actualAverageOrbitDistanceKm ?? body.actualAverageDistanceFromSunKm
  const points = useMemo(
    () =>
      createCircularOrbitPoints(orbitDistanceKm).map(
        (point) =>
          scaleBodyOrbitPosition(
            point,
            scaleMode,
            POSITION_MODE.circularOrbitV1,
            body,
          ),
      ),
    [body, orbitDistanceKm, scaleMode],
  )

  if (!orbitDistanceKm) {
    return null
  }

  return (
    <Line
      points={points}
      color="#334155"
      lineWidth={1}
      transparent
      opacity={0.45}
    />
  )
}
