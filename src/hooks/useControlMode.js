import { useCallback, useEffect, useRef, useState } from 'react'
import { CONTROL_MODES } from '../data/constants'

const CONTROL_TRANSITION_MS = 220

export function useControlMode() {
  const [mode, setModeState] = useState(CONTROL_MODES.orbit)
  const [error, setError] = useState(null)
  const modeRef = useRef(mode)
  const pointerLockElementRef = useRef(null)
  const transitionTimerRef = useRef(null)
  const activationSourceRef = useRef(CONTROL_MODES.flightReady)
  const exitToObservatoryRequestedRef = useRef(false)
  const holdObservatoryUntilTravelRef = useRef(false)
  const cleanupHandlersRef = useRef(new Set())

  const setMode = useCallback((nextMode) => {
    modeRef.current = nextMode
    setModeState(nextMode)
  }, [])

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current)
      transitionTimerRef.current = null
    }
  }, [])

  const transitionTo = useCallback(
    (nextMode) => {
      clearTransitionTimer()
      setMode(CONTROL_MODES.transitioning)
      transitionTimerRef.current = window.setTimeout(() => {
        transitionTimerRef.current = null
        setMode(nextMode)
      }, CONTROL_TRANSITION_MS)
    },
    [clearTransitionTimer, setMode],
  )

  const registerPointerLockElement = useCallback((element) => {
    pointerLockElementRef.current = element
  }, [])

  const registerFlightCleanup = useCallback((cleanupHandler) => {
    cleanupHandlersRef.current.add(cleanupHandler)

    return () => {
      cleanupHandlersRef.current.delete(cleanupHandler)
    }
  }, [])

  const cleanupFlightState = useCallback(({ exitPointerLock = true } = {}) => {
    setError(null)
    activationSourceRef.current = CONTROL_MODES.flightReady

    document.body.classList.remove(
      'is-free-flight',
      'is-flight-active',
      'is-flight-paused',
    )

    for (const cleanupHandler of cleanupHandlersRef.current) {
      cleanupHandler()
    }

    if (
      exitPointerLock &&
      document.pointerLockElement &&
      document.exitPointerLock
    ) {
      try {
        document.exitPointerLock()
      } catch (error) {
        console.warn('[controls] Pointer lock cleanup failed.', error)
      }
    }
  }, [])

  const enterFlightReady = useCallback(() => {
    exitToObservatoryRequestedRef.current = false
    holdObservatoryUntilTravelRef.current = false
    cleanupFlightState({ exitPointerLock: true })
    transitionTo(CONTROL_MODES.flightReady)
  }, [cleanupFlightState, transitionTo])

  const exitToOrbit = useCallback(() => {
    exitToObservatoryRequestedRef.current = true
    holdObservatoryUntilTravelRef.current = false
    cleanupFlightState({ exitPointerLock: true })

    if (document.pointerLockElement) {
      setMode(CONTROL_MODES.transitioning)
      return
    }

    transitionTo(CONTROL_MODES.orbit)
  }, [cleanupFlightState, setMode, transitionTo])

  const prepareOrbitReturn = useCallback(() => {
    exitToObservatoryRequestedRef.current = true
    holdObservatoryUntilTravelRef.current = true
    cleanupFlightState({ exitPointerLock: true })
    setMode(CONTROL_MODES.transitioning)
  }, [cleanupFlightState, setMode])

  const completeOrbitReturn = useCallback(() => {
    exitToObservatoryRequestedRef.current = false
    holdObservatoryUntilTravelRef.current = false
    clearTransitionTimer()
    cleanupFlightState({ exitPointerLock: false })
    setMode(CONTROL_MODES.orbit)
  }, [cleanupFlightState, clearTransitionTimer, setMode])

  const handlePointerLockError = useCallback(
    (event) => {
      clearTransitionTimer()

      const retryLabel =
        activationSourceRef.current === CONTROL_MODES.flightPaused
          ? 'flight.errors.pointerLockBlockedResume'
          : 'flight.errors.pointerLockBlockedLaunch'

      setError(retryLabel)
      exitToObservatoryRequestedRef.current = false
      holdObservatoryUntilTravelRef.current = false
      setMode(activationSourceRef.current)
      console.warn('[controls] Pointer lock request failed.', event)
    },
    [clearTransitionTimer, setMode],
  )

  const activateFlight = useCallback(() => {
    const currentMode = modeRef.current

    if (
      currentMode !== CONTROL_MODES.flightReady &&
      currentMode !== CONTROL_MODES.flightPaused
    ) {
      return
    }

    const targetElement = pointerLockElementRef.current

    if (!targetElement?.requestPointerLock) {
      setError('flight.errors.pointerLockUnsupported')
      setMode(currentMode)
      return
    }

    activationSourceRef.current = currentMode
    exitToObservatoryRequestedRef.current = false
    holdObservatoryUntilTravelRef.current = false
    setError(null)
    setMode(CONTROL_MODES.transitioning)

    try {
      const lockRequest = targetElement.requestPointerLock()

      if (lockRequest?.catch) {
        lockRequest.catch(handlePointerLockError)
      }
    } catch (requestError) {
      handlePointerLockError(requestError)
    }
  }, [handlePointerLockError, setMode])

  const handlePointerLockChange = useCallback(() => {
    const targetElement = pointerLockElementRef.current
    const currentPointerLockElement = document.pointerLockElement
    const isLocked =
      Boolean(targetElement) && currentPointerLockElement === targetElement

    if (isLocked) {
      setError(null)
      exitToObservatoryRequestedRef.current = false
      holdObservatoryUntilTravelRef.current = false
      transitionTo(CONTROL_MODES.flightActive)
      return
    }

    if (exitToObservatoryRequestedRef.current) {
      exitToObservatoryRequestedRef.current = false
      cleanupFlightState({ exitPointerLock: false })

      if (!holdObservatoryUntilTravelRef.current) {
        transitionTo(CONTROL_MODES.orbit)
      }

      return
    }

    if (
      modeRef.current === CONTROL_MODES.flightActive ||
      modeRef.current === CONTROL_MODES.transitioning
    ) {
      cleanupFlightState({ exitPointerLock: false })
      transitionTo(CONTROL_MODES.flightPaused)
    }
  }, [cleanupFlightState, transitionTo])

  useEffect(() => {
    document.addEventListener('pointerlockchange', handlePointerLockChange)
    document.addEventListener('pointerlockerror', handlePointerLockError)

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
      document.removeEventListener('pointerlockerror', handlePointerLockError)
      clearTransitionTimer()
    }
  }, [clearTransitionTimer, handlePointerLockChange, handlePointerLockError])

  useEffect(() => {
    document.body.classList.toggle(
      'is-free-flight',
      mode === CONTROL_MODES.flightReady ||
        mode === CONTROL_MODES.flightActive ||
        mode === CONTROL_MODES.flightPaused,
    )
    document.body.classList.toggle(
      'is-flight-active',
      mode === CONTROL_MODES.flightActive,
    )
    document.body.classList.toggle(
      'is-flight-paused',
      mode === CONTROL_MODES.flightPaused,
    )

    return () => {
      document.body.classList.remove(
        'is-free-flight',
        'is-flight-active',
        'is-flight-paused',
      )
    }
  }, [mode])

  return {
    activateFlight,
    cleanupFlightState,
    completeOrbitReturn,
    enterFlightReady,
    error,
    exitToOrbit,
    handlePointerLockChange,
    handlePointerLockError,
    mode,
    prepareOrbitReturn,
    registerFlightCleanup,
    registerPointerLockElement,
  }
}
