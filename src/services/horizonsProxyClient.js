function getProxyEndpoint() {
  return import.meta.env?.VITE_HORIZONS_PROXY_URL ?? null
}

export function isHorizonsProxyConfigured() {
  return Boolean(getProxyEndpoint())
}

function createProxyRequestBody(bodyId, date) {
  return {
    bodyId,
    date: new Date(date).toISOString(),
    // The proxy should request Horizons VECTORS with CENTER=500@10, then return
    // either raw Horizons JSON or a normalized vector payload.
    frame: 'heliocentric-sun-centered',
  }
}

export async function fetchBodyVectorViaProxy(bodyId, date, options = {}) {
  const endpoint = getProxyEndpoint()

  if (!endpoint) {
    throw new Error('Horizons proxy is not configured.')
  }

  const response = await fetch(endpoint, {
    body: JSON.stringify(createProxyRequestBody(bodyId, date)),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    signal: options.signal,
  })

  if (!response.ok) {
    throw new Error(`Horizons proxy request failed: ${response.status}`)
  }

  return {
    bodyId,
    date: new Date(date).toISOString(),
    raw: await response.json(),
    source: 'JPL Horizons proxy',
    transport: 'proxy',
  }
}
