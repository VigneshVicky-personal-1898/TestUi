// AI-ASSISTED: Cursor
// PROMPT: Proxy /api/runner through Vite with automation middleware
// ACCEPTED-BY: vignesh
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
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

export default defineConfig({
  plugins: [react(), automationRunnerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    open: false,
  },
  preview: {
    port: 4173,
  },
})
