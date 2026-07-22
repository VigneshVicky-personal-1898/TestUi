// AI-ASSISTED: Cursor
// PROMPT: App entry point with Redux-ready React 19 root mount
// ACCEPTED-BY: vignesh
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
