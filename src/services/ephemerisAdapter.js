const HORIZONS_NUMBER_PATTERN =
  /([+-]?(?:\d+\.?\d*|\.\d+)(?:[EeDd][+-]?\d+)?)/

function parseHorizonsNumber(value) {
  return Number(String(value).replace(/[Dd]/, 'E'))
}

function readPayloadNumber(payload, names) {
  const key = names.find((candidate) => payload?.[candidate] !== undefined)

  if (!key) {
    return 0
  }

  const value = payload[key]

  return typeof value === 'number' ? value : Number(value)
}

function readLabeledNumber(block, label) {
  const match = block.match(new RegExp(`${label}\\s*=\\s*${HORIZONS_NUMBER_PATTERN.source}`, 'i'))

  if (!match) {
    return 0
  }

  return parseHorizonsNumber(match[1])
}

function extractHorizonsDataBlock(result = '') {
  const start = result.indexOf('$$SOE')
  const end = result.indexOf('$$EOE')

  if (start >= 0 && end > start) {
    return result.slice(start, end)
  }

  return result
}

function extractEpoch(block, fallbackEpoch) {
  const lines = block
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  const epochLine = lines.find((line) => line.includes('= A.D.'))

  return epochLine ?? fallbackEpoch
}

function parseHorizonsVectorResult(result, fallbackEpoch) {
  const block = extractHorizonsDataBlock(result)

  return {
    epoch: extractEpoch(block, fallbackEpoch),
    xKm: readLabeledNumber(block, 'X'),
    yKm: readLabeledNumber(block, 'Y'),
    zKm: readLabeledNumber(block, 'Z'),
    vxKmPerSecond: readLabeledNumber(block, 'VX'),
    vyKmPerSecond: readLabeledNumber(block, 'VY'),
    vzKmPerSecond: readLabeledNumber(block, 'VZ'),
  }
}

function normalizeVectorPayload(payload, fallbackEpoch) {
  if (payload?.result) {
    return parseHorizonsVectorResult(payload.result, fallbackEpoch)
  }

  if (payload?.raw) {
    return normalizeVectorPayload(payload.raw, fallbackEpoch)
  }

  if (payload?.vector) {
    return normalizeVectorPayload(payload.vector, fallbackEpoch)
  }

  if (Array.isArray(payload?.vectors) && payload.vectors.length > 0) {
    return normalizeVectorPayload(payload.vectors[0], fallbackEpoch)
  }

  const positionKm = payload?.positionKm ?? payload?.position?.km
  const velocityKmPerSecond =
    payload?.velocityKmPerSecond ?? payload?.velocity?.kmPerSecond

  return {
    epoch: payload?.epoch ?? payload?.date ?? fallbackEpoch,
    xKm: Array.isArray(positionKm)
      ? positionKm[0]
      : readPayloadNumber(payload, ['xKm', 'x', 'X']),
    yKm: Array.isArray(positionKm)
      ? positionKm[1]
      : readPayloadNumber(payload, ['yKm', 'y', 'Y']),
    zKm: Array.isArray(positionKm)
      ? positionKm[2]
      : readPayloadNumber(payload, ['zKm', 'z', 'Z']),
    vxKmPerSecond: Array.isArray(velocityKmPerSecond)
      ? velocityKmPerSecond[0]
      : readPayloadNumber(payload, ['vxKmPerSecond', 'vx', 'VX']),
    vyKmPerSecond: Array.isArray(velocityKmPerSecond)
      ? velocityKmPerSecond[1]
      : readPayloadNumber(payload, ['vyKmPerSecond', 'vy', 'VY']),
    vzKmPerSecond: Array.isArray(velocityKmPerSecond)
      ? velocityKmPerSecond[2]
      : readPayloadNumber(payload, ['vzKmPerSecond', 'vz', 'VZ']),
  }
}

function buildBodyLookup(bodies = []) {
  return bodies.reduce((lookup, body) => {
    lookup.byBodyId.set(body.id, body)

    if (body.horizonsId) {
      lookup.byHorizonsId.set(body.horizonsId, body)
    }

    return lookup
  }, {
    byBodyId: new Map(),
    byHorizonsId: new Map(),
  })
}

export function adaptHorizonsVector(vector, bodyLookup) {
  const body =
    bodyLookup.byBodyId.get(vector.bodyId) ??
    bodyLookup.byHorizonsId.get(vector.horizonsId)
  const parsedVector = normalizeVectorPayload(vector, vector.epoch)

  return {
    bodyId: body?.id ?? vector.bodyId,
    horizonsId: vector.horizonsId,
    epoch: parsedVector.epoch,
    // App internals keep heliocentric physical kilometers.
    // Rendering compression is isolated in utils/vectorScale.js.
    positionKm: [parsedVector.xKm, parsedVector.yKm, parsedVector.zKm],
    velocityKmPerSecond: [
      parsedVector.vxKmPerSecond,
      parsedVector.vyKmPerSecond,
      parsedVector.vzKmPerSecond,
    ],
    source: vector.source ?? 'horizons-vector',
  }
}

export function adaptHorizonsResponseToVector(response, body) {
  // Keep all Horizons/proxy wire parsing in this adapter. Hooks and scene code
  // should only see normalized heliocentric km vectors.
  const parsedVector = normalizeVectorPayload(response, response?.date)

  return {
    bodyId: body.id,
    horizonsId: body.horizonsId ?? response.bodyId,
    epoch: parsedVector.epoch ?? response.date,
    // Horizons VECTORS with CENTER=500@10 gives Sun-centered coordinates.
    // The app keeps that heliocentric frame and later maps x/y/z into scene units.
    positionKm: [
      parsedVector.xKm ?? 0,
      parsedVector.yKm ?? 0,
      parsedVector.zKm ?? 0,
    ],
    velocityKmPerSecond: [
      parsedVector.vxKmPerSecond ?? 0,
      parsedVector.vyKmPerSecond ?? 0,
      parsedVector.vzKmPerSecond ?? 0,
    ],
    source: response.source ?? 'JPL Horizons',
  }
}

export function adaptHorizonsVectors(response, bodies = []) {
  const bodyLookup = buildBodyLookup(bodies)

  return (response?.vectors ?? []).map((vector) =>
    adaptHorizonsVector(vector, bodyLookup),
  )
}

export function indexEphemerisByBodyId(ephemerisVectors = []) {
  return ephemerisVectors.reduce((index, vector) => {
    if (vector.bodyId) {
      index[vector.bodyId] = vector
    }

    return index
  }, {})
}

export function mergeEphemerisWithBodies(bodies, ephemerisByBodyId = {}) {
  return bodies.map((body) => ({
    ...body,
    ephemeris: ephemerisByBodyId[body.id] ?? null,
  }))
}
