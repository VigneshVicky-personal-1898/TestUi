// AI-ASSISTED: Cursor
// PROMPT: Runner API config stored-runs and artifact endpoints for deploy
// ACCEPTED-BY: vignesh
import fs from 'node:fs'
import {
 listFrameworks,
 buildCatalog,
 buildStructureDiagram,
 listFrameworkArtifacts,
 resolveArtifactPath,
 readProjectSource,
} from './catalog.js'
import {
 startRun,
 listRuns,
 getRunPublic,
 stopRun,
 subscribe,
 getRunnerConfig,
} from './runManager.js'
import { listStoredRuns, resolveStoredArtifact } from './artifactStore.js'


function sendJson(res, status, body) {
 const payload = JSON.stringify(body)
 res.statusCode = status
 res.setHeader('Content-Type', 'application/json; charset=utf-8')
 res.setHeader('Cache-Control', 'no-store')
 res.end(payload)
}


function readBody(req) {
 return new Promise((resolve, reject) => {
   const chunks = []
   req.on('data', (c) => chunks.push(c))
   req.on('end', () => {
     const raw = Buffer.concat(chunks).toString('utf8')
     if (!raw) return resolve({})
     try {
       resolve(JSON.parse(raw))
     } catch (err) {
       reject(err)
     }
   })
   req.on('error', reject)
 })
}


function parseUrl(req) {
 const host = req.headers.host || 'localhost'
 return new URL(req.url, `http://${host}`)
}


function mimeFor(file) {
 if (file.endsWith('.html')) return 'text/html; charset=utf-8'
 if (file.endsWith('.xml')) return 'application/xml; charset=utf-8'
 if (file.endsWith('.json')) return 'application/json; charset=utf-8'
 if (file.endsWith('.png')) return 'image/png'
 if (file.endsWith('.jpg') || file.endsWith('.jpeg')) return 'image/jpeg'
 if (file.endsWith('.webp')) return 'image/webp'
 if (file.endsWith('.log') || file.endsWith('.txt')) return 'text/plain; charset=utf-8'
 return 'application/octet-stream'
}


/**
* Vite / Connect middleware: mounts under /api/runner
*/
export function createRunnerMiddleware() {
 return async function runnerMiddleware(req, res, next) {
   try {
     const url = parseUrl(req)
     if (!url.pathname.startsWith('/api/runner')) return next()


     const path = url.pathname.replace(/\/+$/, '') || '/'


     if (req.method === 'GET' && path === '/api/runner/health') {
       return sendJson(res, 200, { ok: true, ...getRunnerConfig() })
     }


     if (req.method === 'GET' && path === '/api/runner/config') {
       return sendJson(res, 200, getRunnerConfig())
     }


     if (req.method === 'GET' && path === '/api/runner/frameworks') {
       return sendJson(res, 200, { frameworks: listFrameworks() })
     }


     if (req.method === 'GET' && path === '/api/runner/catalog') {
       const framework = url.searchParams.get('framework') || 'selenium'
       const catalog = buildCatalog(framework)
       if (catalog.error) return sendJson(res, 404, catalog)
       return sendJson(res, 200, catalog)
     }


     if (req.method === 'GET' && path === '/api/runner/structure') {
       const framework = url.searchParams.get('framework') || 'selenium'
       const structure = buildStructureDiagram(framework)
       if (structure.error) return sendJson(res, 404, structure)
       return sendJson(res, 200, structure)
     }


     if (req.method === 'GET' && path === '/api/runner/source') {
       const framework = url.searchParams.get('framework') || 'selenium'
       const type = url.searchParams.get('type') || 'java'
       const filePath = url.searchParams.get('path') || ''
       const source = readProjectSource(framework, type, filePath)
       if (source.error) return sendJson(res, 404, source)
       return sendJson(res, 200, source)
     }


     if (req.method === 'GET' && path === '/api/runner/artifacts') {
       const framework = url.searchParams.get('framework') || 'selenium'
       return sendJson(res, 200, listFrameworkArtifacts(framework))
     }


     if (req.method === 'GET' && path === '/api/runner/artifact') {
       const framework = url.searchParams.get('framework') || 'selenium'
       const kind = url.searchParams.get('kind')
       const file = url.searchParams.get('file')
       const full = resolveArtifactPath(framework, kind, file)
       if (!full) return sendJson(res, 404, { error: 'Artifact not found' })
       res.statusCode = 200
       res.setHeader('Content-Type', mimeFor(full))
       res.setHeader('Cache-Control', 'no-store')
       fs.createReadStream(full).pipe(res)
       return undefined
     }


     if (req.method === 'GET' && path === '/api/runner/stored-runs') {
       return sendJson(res, 200, { runs: listStoredRuns() })
     }


     if (req.method === 'GET' && path === '/api/runner/stored-artifact') {
       const runId = url.searchParams.get('runId')
       const kind = url.searchParams.get('kind')
       const file = url.searchParams.get('file')
       const full = resolveStoredArtifact(runId, kind, file)
       if (!full) return sendJson(res, 404, { error: 'Stored artifact not found' })
       res.statusCode = 200
       res.setHeader('Content-Type', mimeFor(full))
       res.setHeader('Cache-Control', 'no-store')
       fs.createReadStream(full).pipe(res)
       return undefined
     }


     if (req.method === 'GET' && path === '/api/runner/runs') {
       return sendJson(res, 200, { runs: listRuns() })
     }


     if (req.method === 'POST' && path === '/api/runner/runs') {
       const body = await readBody(req)
       const result = startRun(body)
       return sendJson(res, result.ok ? 201 : 400, result)
     }


     const runMatch = path.match(/^\/api\/runner\/runs\/([^/]+)$/)
     if (req.method === 'GET' && runMatch) {
       const run = getRunPublic(runMatch[1])
       if (!run) return sendJson(res, 404, { error: 'Run not found' })
       return sendJson(res, 200, run)
     }


     const stopMatch = path.match(/^\/api\/runner\/runs\/([^/]+)\/stop$/)
     if (req.method === 'POST' && stopMatch) {
       return sendJson(res, 200, stopRun(stopMatch[1]))
     }


     const streamMatch = path.match(/^\/api\/runner\/runs\/([^/]+)\/stream$/)
     if (req.method === 'GET' && streamMatch) {
       res.writeHead(200, {
         'Content-Type': 'text/event-stream',
         'Cache-Control': 'no-cache',
         Connection: 'keep-alive',
       })
       res.write('\n')
       const ok = subscribe(streamMatch[1], res)
       if (!ok) {
         res.write(`data: ${JSON.stringify({ type: 'error', error: 'Run not found' })}\n\n`)
         res.end()
       }
       return undefined
     }


     return sendJson(res, 404, { error: 'Unknown runner endpoint' })
   } catch (err) {
     return sendJson(res, 500, { error: err.message || 'Runner API error' })
   }
 }
}



