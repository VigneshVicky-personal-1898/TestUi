// AI-ASSISTED: Cursor
// PROMPT: Mock API simulator for delay, status codes, retry, rate-limit, offline
// ACCEPTED-BY: vignesh

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

let forceOffline = false
let rateLimitRemaining = 20
let rateLimitResetAt = Date.now() + 60000

export function setMockOffline(v) {
  forceOffline = v
}

export function getMockOffline() {
  return forceOffline
}

/**
 * Simulate HTTP-like responses without a backend.
 * @param {object} options
 * @param {'success'|'404'|'401'|'403'|'500'|'503'|'timeout'|'rate_limit'} options.scenario
 * @param {number} [options.delay=800]
 * @param {any} [options.data]
 */
export async function mockRequest({ scenario = 'success', delay = 800, data = null } = {}) {
  if (forceOffline || !navigator.onLine) {
    await sleep(Math.min(delay, 300))
    const err = new Error('Network offline')
    err.status = 0
    err.code = 'OFFLINE'
    throw err
  }

  if (Date.now() > rateLimitResetAt) {
    rateLimitRemaining = 20
    rateLimitResetAt = Date.now() + 60000
  }

  if (scenario === 'rate_limit' || rateLimitRemaining <= 0) {
    await sleep(delay)
    rateLimitRemaining = 0
    const err = new Error('Too Many Requests')
    err.status = 429
    err.code = 'RATE_LIMIT'
    err.retryAfter = Math.ceil((rateLimitResetAt - Date.now()) / 1000)
    throw err
  }

  rateLimitRemaining -= 1

  if (scenario === 'timeout') {
    await sleep(delay + 5000)
    const err = new Error('Request timeout')
    err.status = 408
    err.code = 'TIMEOUT'
    throw err
  }

  await sleep(delay)

  const statusMap = {
    success: 200,
    '404': 404,
    '401': 401,
    '403': 403,
    '500': 500,
    '503': 503,
  }

  const status = statusMap[scenario] ?? 200
  if (status >= 400) {
    const err = new Error(`Mock API error ${status}`)
    err.status = status
    err.code = `HTTP_${status}`
    throw err
  }

  return {
    status: 200,
    ok: true,
    data: data ?? { message: 'OK', ts: new Date().toISOString(), remaining: rateLimitRemaining },
  }
}

export async function mockRequestWithRetry(options, { retries = 2, backoff = 400 } = {}) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await mockRequest(options)
    } catch (err) {
      lastError = err
      if (attempt === retries) break
      if (err.status === 401 || err.status === 403 || err.status === 404) break
      await sleep(backoff * (attempt + 1))
    }
  }
  throw lastError
}

/** Fake server-side table query */
export function mockServerTable({ rows, page = 0, pageSize = 10, sortBy, sortDir = 'asc', filters = {}, search = '' }) {
  let result = [...rows]
  if (search) {
    const q = search.toLowerCase()
    result = result.filter((r) => JSON.stringify(r).toLowerCase().includes(q))
  }
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== '' && val !== 'all') {
      result = result.filter((r) => String(r[key]).toLowerCase() === String(val).toLowerCase())
    }
  })
  if (sortBy) {
    result.sort((a, b) => {
      const av = a[sortBy]
      const bv = b[sortBy]
      if (av === bv) return 0
      const cmp = av > bv ? 1 : -1
      return sortDir === 'desc' ? -cmp : cmp
    })
  }
  const total = result.length
  const start = page * pageSize
  return {
    data: result.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  }
}
