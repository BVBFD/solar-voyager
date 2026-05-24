import { useMemo, useState } from 'react'
import { SIMULATION_DEFAULTS } from '../data/constants'
import { SELECTABLE_BODIES } from '../data/bodies'

export function useSelectedBody(
  initialBodyId = SIMULATION_DEFAULTS.selectedBodyId,
) {
  const [selectedBodyId, setSelectedBodyId] = useState(initialBodyId)

  const selectedBody = useMemo(
    () =>
      SELECTABLE_BODIES.find((body) => body.id === selectedBodyId) ??
      SELECTABLE_BODIES[0],
    [selectedBodyId],
  )

  return {
    selectedBody,
    selectedBodyId,
    setSelectedBodyId,
  }
}
