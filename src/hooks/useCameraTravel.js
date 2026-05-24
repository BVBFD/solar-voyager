import { useCallback, useState } from 'react'
import { CAMERA_TARGET_SOURCES } from '../data/constants'

export function useCameraTravel(initialTargetId) {
  const [cameraTravel, setCameraTravel] = useState({
    cameraTarget: {
      bodyId: initialTargetId,
      source: CAMERA_TARGET_SOURCES.none,
    },
    isTraveling: false,
    reason: 'selection',
    targetId: initialTargetId,
    travelId: 0,
  })

  const startTravel = useCallback((targetId, options = {}) => {
    const cameraTarget = {
      bodyId: targetId,
      source: options.source ?? CAMERA_TARGET_SOURCES.userClick,
    }

    setCameraTravel((currentTravel) => ({
      cameraTarget,
      isTraveling: true,
      reason: options.reason ?? 'selection',
      targetId,
      travelId: currentTravel.travelId + 1,
    }))
  }, [])

  const completeTravel = useCallback((travelId) => {
    setCameraTravel((currentTravel) => {
      if (travelId != null && currentTravel.travelId !== travelId) {
        return currentTravel
      }

      return {
        ...currentTravel,
        isTraveling: false,
        reason: 'selection',
      }
    })
  }, [])

  return {
    cameraTarget: cameraTravel.cameraTarget,
    cameraTargetId: cameraTravel.cameraTarget.bodyId,
    cameraTravel,
    completeTravel,
    setCameraTargetId: startTravel,
    startTravel,
  }
}
