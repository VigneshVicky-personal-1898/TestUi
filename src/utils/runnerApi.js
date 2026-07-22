// AI-ASSISTED: Cursor
// PROMPT: Runner client helpers with source file fetch for structure tab
// ACCEPTED-BY: vignesh


const BASE = '/api/runner'


async function request(path, options = {}) {
 const res = await fetch(`${BASE}${path}`, {
   headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
   ...options,
 })
 const data = await res.json().catch(() => ({}))
 if (!res.ok) {
   throw new Error(data.error || data.message || `Request failed (${res.status})`)
 }
 return data
}


export const runnerApi = {
 health: () => request('/health'),
 config: () => request('/config'),
 frameworks: () => request('/frameworks'),
 catalog: (framework) => request(`/catalog?framework=${encodeURIComponent(framework)}`),
 structure: (framework) => request(`/structure?framework=${encodeURIComponent(framework)}`),
 source: (framework, type, filePath) => request(
   `/source?framework=${encodeURIComponent(framework)}&type=${encodeURIComponent(type)}&path=${encodeURIComponent(filePath)}`,
 ),
 artifacts: (framework) => request(`/artifacts?framework=${encodeURIComponent(framework)}`),
 storedRuns: () => request('/stored-runs'),
 runs: () => request('/runs'),
 getRun: (id) => request(`/runs/${encodeURIComponent(id)}`),
 start: (body) => request('/runs', { method: 'POST', body: JSON.stringify(body) }),
 stop: (id) => request(`/runs/${encodeURIComponent(id)}/stop`, { method: 'POST', body: '{}' }),
 streamUrl: (id) => `${BASE}/runs/${encodeURIComponent(id)}/stream`,
}



