// AI-ASSISTED: Cursor
// PROMPT: Production Node server for TestUI + automation runner API
// ACCEPTED-BY: vignesh
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRunnerMiddleware } from './runner/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const PORT = Number(process.env.PORT || 4173)
const HOST = process.env.HOST || '0.0.0.0'

const runner = createRunnerMiddleware()

function mime(file) {
  if (file.endsWith('.html')) return 'text/html; charset=utf-8'
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8'
  if (file.endsWith('.css')) return 'text/css; charset=utf-8'
  if (file.endsWith('.svg')) return 'image/svg+xml'
  if (file.endsWith('.png')) return 'image/png'
  if (file.endsWith('.json')) return 'application/json; charset=utf-8'
  if (file.endsWith('.ico')) return 'image/x-icon'
  if (file.endsWith('.woff2')) return 'font/woff2'
  return 'application/octet-stream'
}

function sendFile(res, filePath) {
  res.statusCode = 200
  res.setHeader('Content-Type', mime(filePath))
  fs.createReadStream(filePath).pipe(res)
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.end()
    return
  }

  if (req.url?.startsWith('/api/runner')) {
    runner(req, res, () => {
      if (!res.writableEnded) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({ error: 'Not found' }))
      }
    })
    return
  }

  if (!fs.existsSync(DIST)) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('dist/ missing. Run: npm run build && npm start')
    return
  }

  const urlPath = decodeURIComponent((req.url || '/').split('?')[0])
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '')
  let filePath = path.join(DIST, safePath === '/' ? 'index.html' : safePath)

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html')
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    sendFile(res, filePath)
    return
  }

  const index = path.join(DIST, 'index.html')
  if (fs.existsSync(index)) {
    sendFile(res, index)
    return
  }

  res.statusCode = 404
  res.end('Not found')
})

server.listen(PORT, HOST, () => {
  console.log(`[testui] listening on http://${HOST}:${PORT}`)
  console.log(`[testui] runner API http://${HOST}:${PORT}/api/runner/health`)
  console.log(`[testui] git sync=${process.env.RUNNER_GIT_SYNC || 'false'}`)
})
