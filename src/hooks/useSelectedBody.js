import { useMemo, useState } from 'react'
import { SELECTABLE_BODIES } from '../data/bodies'

export function useSelectedBody(initialBodyId = null) {
  const [selectedBodyId, setSelectedBodyId] = useState(initialBodyId)

  const selectedBody = useMemo(
    () =>
      selectedBodyId
        ? SELECTABLE_BODIES.find((body) => body.id === selectedBodyId) ?? null
        : null,
    [selectedBodyId],
  )

  return {
    selectedBody,
    selectedBodyId,
    setSelectedBodyId,
  }
}
