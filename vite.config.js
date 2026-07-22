// AI-ASSISTED: Cursor
// PROMPT: Vite base path + port 7173 for local and GitHub Pages (/TestUi/)
// ACCEPTED-BY: vignesh
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { createRunnerMiddleware } from './server/runner/index.js'


function automationRunnerPlugin() {
 return {
   name: 'testui-automation-runner',
   configureServer(server) {
     server.middlewares.use(createRunnerMiddleware())
   },
   configurePreviewServer(server) {
     server.middlewares.use(createRunnerMiddleware())
   },
 }
}


/** Copy index.html → 404.html so GitHub Pages deep links load the SPA. */
function githubPagesSpaFallback(base) {
 return {
   name: 'testui-gh-pages-spa-fallback',
   closeBundle() {
     if (!base || base === '/') {
       return
     }
     const dist = path.resolve(__dirname, 'dist')
     const indexHtml = path.join(dist, 'index.html')
     const notFoundHtml = path.join(dist, '404.html')
     if (fs.existsSync(indexHtml)) {
       fs.copyFileSync(indexHtml, notFoundHtml)
     }
   },
 }
}


export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), '')
 // Local / default: `/`  |  GitHub Pages: `/TestUi/` via --mode gh-pages or VITE_BASE_PATH
 const base = env.VITE_BASE_PATH || (mode === 'gh-pages' ? '/TestUi/' : '/')


 return {
   base,
   plugins: [react(), automationRunnerPlugin(), githubPagesSpaFallback(base)],
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
     },
   },
   server: {
     port: Number(env.VITE_DEV_PORT || 7173),
     open: false,
   },
   preview: {
     port: Number(env.VITE_PREVIEW_PORT || 4173),
   },
 }
})
