import { useCallback, useEffect, useState } from 'react'
import { SIMULATION_DEFAULTS, SIMULATION_MODES } from '../data/constants'

export function useSimulationTime(
  simulationMode = SIMULATION_MODES.simulationOrbit,
  initialTimeScale = SIMULATION_DEFAULTS.timeScale,
) {
  const [elapsedDays, setElapsedDays] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [timeScale, setTimeScale] = useState(initialTimeScale)
  const isRealAlignment = simulationMode === SIMULATION_MODES.realAlignment

  useEffect(() => {
    if (!isPlaying || isRealAlignment) {
      return undefined
    }

    let frameId = 0
    let previousTime = performance.now()

    const tick = (currentTime) => {
      const deltaSeconds = (currentTime - previousTime) / 1000
      previousTime = currentTime
      setElapsedDays((value) => value + deltaSeconds * timeScale)
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frameId)
  }, [isPlaying, isRealAlignment, timeScale])

  const resetTime = useCallback(() => {
    setElapsedDays(0)
  }, [])

  return {
    elapsedDays,
    isPlaying,
    setIsPlaying,
    timeScale,
    setTimeScale,
    resetTime,
  }
}
