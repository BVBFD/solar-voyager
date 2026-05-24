export const HORIZONS_CLIENT_MODE = 'direct'
export const HORIZONS_MOCK_MODE = 'mock'
export const HORIZONS_API_URL = 'https://ssd.jpl.nasa.gov/api/horizons.api'
// 500@10 asks Horizons for vectors centered on the Sun.
// Keeping the service heliocentric avoids mixing Earth-observer and Sun-centered frames.
export const HORIZONS_VECTOR_CENTER = '500@10'

const HORIZONS_STEP_MINUTES = 1
const DIRECT_HORIZONS_ENV_FLAG = 'true'

function pad(value) {
  return String(value).padStart(2, '0')
}

export function formatHorizonsUtcDate(date) {
  const utcDate = date instanceof Date ? date : new Date(date)
  const month = utcDate.toLocaleString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  })

  return `${utcDate.getUTCFullYear()}-${month}-${pad(
    utcDate.getUTCDate(),
  )} ${pad(utcDate.getUTCHours())}:${pad(utcDate.getUTCMinutes())}`
}

export function createHorizonsRequest({
  horizonsId,
  bodyId,
  startDate,
  stopDate,
  stepSize = '1d',
}) {
  return {
    horizonsId,
    bodyId,
    startDate,
    stopDate,
    stepSize,
    center: HORIZONS_VECTOR_CENTER,
    output: 'vectors',
  }
}

export function createHorizonsVectorUrl({
  bodyId,
  date,
  center = HORIZONS_VECTOR_CENTER,
}) {
  const startDate = new Date(date)
  const stopDate = new Date(startDate.getTime() + HORIZONS_STEP_MINUTES * 60000)
  const params = new URLSearchParams({
    format: 'json',
    COMMAND: `'${bodyId}'`,
    OBJ_DATA: 'NO',
    MAKE_EPHEM: 'YES',
    EPHEM_TYPE: 'VECTORS',
    CENTER: `'${center}'`,
    START_TIME: `'${formatHorizonsUtcDate(startDate)}'`,
    STOP_TIME: `'${formatHorizonsUtcDate(stopDate)}'`,
    STEP_SIZE: `'${HORIZONS_STEP_MINUTES}m'`,
    VEC_TABLE: '2',
  })

  return `${HORIZONS_API_URL}?${params.toString()}`
}

export function isDirectHorizonsEnabled() {
  return import.meta.env?.VITE_HORIZONS_DIRECT === DIRECT_HORIZONS_ENV_FLAG
}

export async function fetchHorizonsVectorsMock(requests) {
  const requestList = Array.isArray(requests) ? requests : [requests]

  return {
    source: HORIZONS_MOCK_MODE,
    center: HORIZONS_VECTOR_CENTER,
    generatedAt: new Date().toISOString(),
    vectors: requestList.map((request, index) => ({
      bodyId: request.bodyId,
      horizonsId: request.horizonsId,
      epoch: request.startDate,
      // Mock vectors keep the Horizons-shaped data contract while API work is isolated.
      xKm: 0,
      yKm: 0,
      zKm: 0,
      vxKmPerSecond: 0,
      vyKmPerSecond: 0,
      vzKmPerSecond: 0,
      mockSequence: index,
    })),
  }
}

export async function fetchBodyVector(bodyId, date, options = {}) {
  if (!isDirectHorizonsEnabled() && !options.allowDirect) {
    throw new Error(
      'Direct JPL Horizons browser calls are disabled. Configure VITE_HORIZONS_PROXY_URL or set VITE_HORIZONS_DIRECT=true.',
    )
  }

  const url = createHorizonsVectorUrl({ bodyId, date })
  const response = await fetch(url, {
    method: 'GET',
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`JPL Horizons request failed: ${response.status}`)
  }

  const payload = await response.json()

  if (payload.error) {
    throw new Error(payload.error)
  }

  return {
    bodyId,
    center: HORIZONS_VECTOR_CENTER,
    date: new Date(date).toISOString(),
    raw: payload,
    requestUrl: url,
    source: 'JPL Horizons',
  }
}

export async function fetchHorizonsEphemeris(request) {
  // TODO: Route live calls through a server proxy/backend API to avoid browser CORS.
  // This mock keeps the service contract stable while the proxy is introduced.
  return fetchHorizonsVectorsMock(request)
}
