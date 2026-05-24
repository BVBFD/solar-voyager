import { useCallback, useMemo, useRef, useState } from 'react'
import { REAL_ALIGNMENT_TARGETS } from '../data/bodyIds'
import {
  fetchBodyVector,
  isDirectHorizonsEnabled,
} from '../services/horizonsClient'
import {
  fetchBodyVectorViaProxy,
  isHorizonsProxyConfigured,
} from '../services/horizonsProxyClient'
import {
  adaptHorizonsResponseToVector,
  indexEphemerisByBodyId,
} from '../services/ephemerisAdapter'
import { calculateBodySystemPositionKm } from '../utils/orbitalMath'

const J2000_UTC_MS = Date.UTC(2000, 0, 1, 12, 0, 0)
const DAY_MS = 86400000
const REAL_ALIGNMENT_TARGET_ID_SET = new Set(
  REAL_ALIGNMENT_TARGETS.map((target) => target.id),
)

const SOURCE_LABELS = {
  error: 'Real alignment unavailable',
  fallback: 'Mock circular orbit fallback',
  idle: 'Animated circular model',
  loading: 'Loading JPL Horizons',
  success: 'JPL Horizons VECTORS',
}

const INITIAL_STATE = {
  active: false,
  error: null,
  errorMessage: null,
  fallback: false,
  requestedAt: null,
  sourceLabel: SOURCE_LABELS.idle,
  status: 'idle',
  transport: 'none',
  updatedAt: null,
  vectorsByBodyId: {},
}

function getDaysSinceJ2000(date) {
  return (new Date(date).getTime() - J2000_UTC_MS) / DAY_MS
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error)
}

function createCircularFallbackVectors(allBodies, targetBodies, date, error) {
  const elapsedDays = getDaysSinceJ2000(date)

  return targetBodies.map((body) => ({
    bodyId: body.id,
    error,
    epoch: new Date(date).toISOString(),
    horizonsId: body.horizonsId,
    positionKm: calculateBodySystemPositionKm({
      bodies: allBodies,
      body,
      elapsedDays,
      ephemerisByBodyId: {},
    }),
    source: 'mock-circular-fallback',
    velocityKmPerSecond: [0, 0, 0],
  }))
}

function getRealAlignmentTargetBodies(bodies) {
  return bodies.filter(
    (body) => body.horizonsId && REAL_ALIGNMENT_TARGET_ID_SET.has(body.id),
  )
}

async function fetchBodyVectorWithAvailableTransport(body, date, signal) {
  if (isHorizonsProxyConfigured()) {
    return {
      response: await fetchBodyVectorViaProxy(body.horizonsId, date, {
        signal,
      }),
      transport: 'proxy',
    }
  }

  if (isDirectHorizonsEnabled()) {
    return {
      response: await fetchBodyVector(body.horizonsId, date, {
        signal,
      }),
      transport: 'direct',
    }
  }

  throw new Error(
    'No live Horizons transport configured. Set VITE_HORIZONS_PROXY_URL for a backend proxy or VITE_HORIZONS_DIRECT=true for direct browser testing.',
  )
}

export function useEphemerisData(bodies) {
  const [state, setState] = useState(INITIAL_STATE)
  const abortControllerRef = useRef(null)
  const requestIdRef = useRef(0)

  const resetToSimulationOrbit = useCallback(() => {
    requestIdRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setState(INITIAL_STATE)
  }, [])

  const loadCurrentRealAlignment = useCallback(async () => {
    const requestedAt = new Date()
    const targetBodies = getRealAlignmentTargetBodies(bodies)
    const requestId = requestIdRef.current + 1
    const abortController = new AbortController()

    requestIdRef.current = requestId
    abortControllerRef.current?.abort()
    abortControllerRef.current = abortController

    if (targetBodies.length === 0) {
      setState({
        ...INITIAL_STATE,
        errorMessage: 'No Real Alignment targets are available.',
        requestedAt: requestedAt.toISOString(),
        sourceLabel: SOURCE_LABELS.error,
        status: 'error',
      })

      return 'error'
    }

    setState((currentState) => ({
      ...currentState,
      active: true,
      error: null,
      errorMessage: null,
      fallback: false,
      requestedAt: requestedAt.toISOString(),
      sourceLabel: SOURCE_LABELS.loading,
      status: 'loading',
      transport: isHorizonsProxyConfigured()
        ? 'proxy'
        : isDirectHorizonsEnabled()
          ? 'direct'
          : 'mock-circular-fallback',
    }))

    try {
      const responses = await Promise.all(
        targetBodies.map((body) =>
          fetchBodyVectorWithAvailableTransport(
            body,
            requestedAt,
            abortController.signal,
          ).then(({ response, transport }) => ({ body, response, transport })),
        ),
      )

      if (requestId !== requestIdRef.current) {
        return 'aborted'
      }

      const vectors = responses.map(({ body, response }) =>
        adaptHorizonsResponseToVector(response, body),
      )
      const transport = responses[0]?.transport ?? 'unknown'

      setState({
        active: true,
        error: null,
        errorMessage: null,
        fallback: false,
        requestedAt: requestedAt.toISOString(),
        sourceLabel: SOURCE_LABELS.success,
        status: 'success',
        transport,
        updatedAt: new Date().toISOString(),
        vectorsByBodyId: indexEphemerisByBodyId(vectors),
      })

      return 'success'
    } catch (error) {
      if (error?.name === 'AbortError') {
        return 'aborted'
      }

      const fallbackVectors = createCircularFallbackVectors(
        bodies,
        targetBodies,
        requestedAt,
        error,
      )

      if (requestId !== requestIdRef.current) {
        return 'aborted'
      }

      setState({
        active: true,
        error,
        errorMessage: getErrorMessage(error),
        fallback: true,
        requestedAt: requestedAt.toISOString(),
        sourceLabel: SOURCE_LABELS.fallback,
        status: 'fallback',
        transport: 'mock-circular-fallback',
        updatedAt: new Date().toISOString(),
        vectorsByBodyId: indexEphemerisByBodyId(fallbackVectors),
      })

      return 'fallback'
    } finally {
      if (requestId === requestIdRef.current) {
        abortControllerRef.current = null
      }
    }
  }, [bodies])

  return useMemo(
    () => ({
      ...state,
      loadCurrentRealAlignment,
      resetToSimulationOrbit,
    }),
    [loadCurrentRealAlignment, resetToSimulationOrbit, state],
  )
}
