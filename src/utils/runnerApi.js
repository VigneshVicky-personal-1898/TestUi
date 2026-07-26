

import { getViteBaseUrl } from '../config/appBase'


/** Live runner (local npm run dev / Node server). */
const API_BASE = '/api/runner'


/** Snapshot under public/runner-static (GitHub Pages / offline browse). */
function staticBase() {
 const base = getViteBaseUrl() || '/'
 return `${base}runner-static`.replace(/([^:]\/)\/{2,}/g, '$1')
}


let mode = 'unknown' // 'api' | 'static' | 'offline'


export function getRunnerMode() {
 return mode
}


function looksLikeHtml(contentType, bodyText) {
 const ct = (contentType || '').toLowerCase()
 if (ct.includes('text/html')) return true
 const head = String(bodyText || '').trim().slice(0, 64).toLowerCase()
 return head.startsWith('<!doctype') || head.startsWith('<html')
}


async function apiRequest(path, options = {}) {
 const res = await fetch(`${API_BASE}${path}`, {
   headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
   ...options,
 })
 const raw = await res.text()
 if (looksLikeHtml(res.headers.get('content-type'), raw)) {
   throw new Error(`Runner API unavailable (${res.status})`)
 }
 let data = {}
 try {
   data = raw ? JSON.parse(raw) : {}
 } catch {
   throw new Error(`Runner API returned non-JSON (${res.status})`)
 }
 if (!res.ok) {
   throw new Error(data.error || data.message || `Request failed (${res.status})`)
 }
 return data
}


async function staticFetch(relPath) {
 const url = `${staticBase()}/${relPath}`.replace(/([^:]\/)\/{2,}/g, '$1')
 const res = await fetch(url, { cache: 'no-cache' })
 const raw = await res.text()
 if (!res.ok || looksLikeHtml(res.headers.get('content-type'), raw)) {
   throw new Error(`Static snapshot missing (${res.status}): ${relPath}`)
 }
 return { res, raw }
}


async function staticJson(relPath) {
 const { raw } = await staticFetch(relPath)
 return JSON.parse(raw)
}


async function staticText(relPath) {
 const { raw } = await staticFetch(relPath)
 return raw
}


async function probeHealth() {
 try {
   const data = await apiRequest('/health')
   if (!data || data.ok !== true) {
     throw new Error('Invalid runner health payload')
   }
   mode = 'api'
   return data
 } catch {
   try {
     const manifest = await staticJson('manifest.json')
     if (!manifest || manifest.mode !== 'static') {
       throw new Error('Invalid static manifest')
     }
     mode = 'static'
     return {
       ok: true,
       mode: 'static',
       note: 'Using runner-static snapshot (browse-only on GitHub Pages / git static host).',
       generatedAt: manifest.generatedAt,
     }
   } catch {
     mode = 'offline'
     throw new Error(
       'Folder browse is offline on this host. GitHub Pages needs a runner-static snapshot (npm run build:gh-pages). Local live scan needs npm run dev.',
     )
   }
 }
}


async function ensureMode() {
 if (mode === 'unknown') {
   await probeHealth().catch(() => {})
 }
}


async function catalog(framework) {
 await ensureMode()
 if (mode === 'api') {
   try {
     return await apiRequest(`/catalog?framework=${encodeURIComponent(framework)}`)
   } catch {
     mode = 'static'
   }
 }
 if (mode !== 'static') {
   throw new Error('Catalog unavailable (no live API and no static snapshot).')
 }
 const data = await staticJson(`${framework}/catalog.json`)
 return { ...data, source: data.source || 'static-snapshot' }
}


async function structure(framework) {
 await ensureMode()
 if (mode === 'api') {
   try {
     return await apiRequest(`/structure?framework=${encodeURIComponent(framework)}`)
   } catch {
     mode = 'static'
   }
 }
 if (mode !== 'static') {
   throw new Error('Structure unavailable (no live API and no static snapshot).')
 }
 return staticJson(`${framework}/structure.json`)
}


async function source(framework, type, filePath) {
 await ensureMode()
 if (mode === 'api') {
   try {
     return await apiRequest(
       `/source?framework=${encodeURIComponent(framework)}&type=${encodeURIComponent(type)}&path=${encodeURIComponent(filePath)}`,
     )
   } catch (err) {
     // Prefer static browse on hosts without a live runner.
     try {
       await staticJson('manifest.json')
       mode = 'static'
     } catch {
       throw err
     }
   }
 }
 if (mode !== 'static') {
   throw new Error('Source unavailable (no live API and no static snapshot).')
 }
 const normalized = String(filePath || '').replace(/^\/+/, '')
 const content = await staticText(`${framework}/files/${normalized}`)
 return {
   framework,
   type,
   path: normalized,
   language: type === 'suite' ? 'xml' : 'java',
   size: content.length,
   content,
   source: 'static-snapshot',
 }
}


export const runnerApi = {
 health: () => probeHealth(),
 config: async () => {
   await ensureMode()
   if (mode === 'api') return apiRequest('/config')
   return {
     mode: 'static',
     gitSync: { enabled: false },
     note: 'Browse-only snapshot. Run Suite needs a host with npm run dev / Node runner.',
   }
 },
 frameworks: async () => {
   await ensureMode()
   if (mode === 'api') return apiRequest('/frameworks')
   const manifest = await staticJson('manifest.json')
   return { frameworks: manifest.frameworks || [] }
 },
 catalog,
 structure,
 source,
 artifacts: async (framework) => {
   await ensureMode()
   if (mode === 'api') return apiRequest(`/artifacts?framework=${encodeURIComponent(framework)}`)
   return { reports: [], screenshots: [], surefire: [], mode: 'static' }
 },
 storedRuns: async () => {
   await ensureMode()
   if (mode === 'api') return apiRequest('/stored-runs')
   return { runs: [] }
 },
 runs: async () => {
   await ensureMode()
   if (mode === 'api') return apiRequest('/runs')
   return { runs: [] }
 },
 getRun: (id) => apiRequest(`/runs/${encodeURIComponent(id)}`),
 start: async (body) => {
   await ensureMode()
   if (mode === 'static' || mode === 'offline') {
     return Promise.reject(new Error('Run Suite requires a live runner (npm run dev / Node server). GitHub Pages is browse-only.'))
   }
   return apiRequest('/runs', { method: 'POST', body: JSON.stringify(body) })
 },
 stop: (id) => apiRequest(`/runs/${encodeURIComponent(id)}/stop`, { method: 'POST', body: '{}' }),
 streamUrl: (id) => `${API_BASE}/runs/${encodeURIComponent(id)}/stream`,
}



