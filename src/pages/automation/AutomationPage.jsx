// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh
import { useEffect, useRef, useState } from 'react'
import {
  Box, Paper, Typography, Button, Stack, TextField, Divider, Alert, Menu, MenuItem,
  Tooltip,
} from '@mui/material'
import { PageHeader } from '../../components/common/PageHeader'
import { aid, btn, field, option } from '../../utils/automation'

function ShadowDomHost() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host || host.shadowRoot) return
    const shadow = host.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        .shadow-btn { background:#0d47a1; color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer; }
        .shadow-input { padding:8px; border:1px solid #ccc; border-radius:4px; margin-right:8px; }
        .shadow-msg { margin-top:8px; color:#2e7d32; font-family:sans-serif; }
      </style>
      <div data-testid="shadow-root-content" id="shadow-root-content">
        <input class="shadow-input" data-testid="shadow-input" placeholder="Shadow DOM input" id="shadow-input" />
        <button class="shadow-btn" data-testid="shadow-button" id="shadow-button">Shadow Click</button>
        <div class="shadow-msg" data-testid="shadow-message" id="shadow-message"></div>
      </div>
    `
    const shadowBtn = shadow.querySelector('[data-testid="shadow-button"]')
    const input = shadow.querySelector('[data-testid="shadow-input"]')
    const msg = shadow.querySelector('[data-testid="shadow-message"]')
    shadowBtn.addEventListener('click', () => {
      msg.textContent = `Shadow clicked with: ${input.value || '(empty)'}`
    })
  }, [])

  return <div ref={hostRef} {...aid('shadow-host')} />
}

export default function AutomationPage() {
  const [alertLog, setAlertLog] = useState('')
  const [hoverText, setHoverText] = useState('Hover me')
  const [dblClickCount, setDblClickCount] = useState(0)
  const [contextMenu, setContextMenu] = useState(null)
  const [keys, setKeys] = useState('')
  const [staleTick, setStaleTick] = useState(0)
  const [ajaxData, setAjaxData] = useState(null)
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const id = setInterval(() => setStaleTick((t) => t + 1), 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0d47a1'
    ctx.fillRect(20, 20, 120, 80)
    ctx.fillStyle = '#00838f'
    ctx.beginPath()
    ctx.arc(220, 60, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = '16px sans-serif'
    ctx.fillText('Canvas Element', 30, 65)
  }, [])

  const triggerAlert = () => {
    // eslint-disable-next-line no-alert
    window.alert('This is a JS alert')
    setAlertLog('alert accepted')
  }

  const triggerConfirm = () => {
    // eslint-disable-next-line no-alert
    const ok = window.confirm('Confirm this action?')
    setAlertLog(ok ? 'confirm accepted' : 'confirm dismissed')
  }

  const triggerPrompt = () => {
    // eslint-disable-next-line no-alert
    const val = window.prompt('Enter a value', 'Playwright')
    setAlertLog(`prompt: ${val}`)
  }

  const openWindow = () => {
    window.open('/automation/popup.html', 'testui_popup', 'width=500,height=400')
  }

  const openTab = () => {
    window.open('/automation/popup.html', '_blank')
  }

  const loadAjax = () => {
    setAjaxLoading(true)
    setAjaxData(null)
    setTimeout(() => {
      setAjaxData({ message: 'AJAX loaded successfully', ts: new Date().toISOString() })
      setAjaxLoading(false)
    }, 1500)
  }

  return (
    <Box {...aid('automation-page')}>
      <PageHeader
        pageId="automation"
        title="Automation Lab"
        subtitle="Frames, nested frames, windows, alerts, shadow DOM, SVG, canvas, mouse/keyboard, stale elements, AJAX"
        breadcrumbs={['Automation Lab']}
      />

      <Stack spacing={2}>
        <Paper sx={{ p: 2 }} {...aid('alerts-section')}>
          <Typography variant="h6" gutterBottom>Alerts</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button onClick={triggerAlert} {...btn('btn-alert')}>JS Alert</Button>
            <Button onClick={triggerConfirm} {...btn('btn-confirm')}>JS Confirm</Button>
            <Button onClick={triggerPrompt} {...btn('btn-prompt')}>JS Prompt</Button>
          </Stack>
          {alertLog && <Alert sx={{ mt: 1 }} {...aid('alert-log')}>{alertLog}</Alert>}
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('windows-section')}>
          <Typography variant="h6" gutterBottom>Windows & Tabs</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="contained" onClick={openWindow} {...btn('btn-new-window')}>Open New Window</Button>
            <Button variant="outlined" onClick={openTab} {...btn('btn-new-tab')}>Open New Tab</Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('frames-section')}>
          <Typography variant="h6" gutterBottom>Frames & Nested Frames</Typography>
          <Box
            component="iframe"
            title="outer-frame"
            src="/automation/outer-frame.html"
            sx={{ width: '100%', height: 280, border: 1, borderColor: 'divider', borderRadius: 1 }}
            {...aid('outer-frame')}
          />
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('shadow-section')}>
          <Typography variant="h6" gutterBottom>Shadow DOM</Typography>
          <ShadowDomHost />
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('mouse-section')}>
          <Typography variant="h6" gutterBottom>Mouse Actions</Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              onMouseEnter={() => setHoverText('Hovered!')}
              onMouseLeave={() => setHoverText('Hover me')}
              {...btn('btn-hover')}
            >
              {hoverText}
            </Button>
            <Button
              variant="outlined"
              onDoubleClick={() => setDblClickCount((c) => c + 1)}
              {...btn('btn-dblclick')}
            >
              Double Click ({dblClickCount})
            </Button>
            <Button
              variant="outlined"
              onContextMenu={(e) => { e.preventDefault(); setContextMenu(e.currentTarget) }}
              {...btn('btn-rightclick')}
            >
              Right Click Me
            </Button>
          </Stack>
          <Menu
            open={Boolean(contextMenu)}
            anchorEl={contextMenu}
            onClose={() => setContextMenu(null)}
            {...aid('context-menu')}
          >
            <MenuItem onClick={() => setContextMenu(null)} {...option('ctx-copy', 'Copy')}>Copy</MenuItem>
            <MenuItem onClick={() => setContextMenu(null)} {...option('ctx-paste', 'Paste')}>Paste</MenuItem>
            <MenuItem onClick={() => setContextMenu(null)} {...option('ctx-delete', 'Delete')}>Delete</MenuItem>
          </Menu>
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('keyboard-section')}>
          <Typography variant="h6" gutterBottom>Keyboard Actions</Typography>
          <TextField
            fullWidth
            label="Type here (captures keys)"
            value={keys}
            onChange={(e) => setKeys(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === 'a') {
                // allow select all
              }
            }}
            {...field('keyboard-input')}
            helperText={`Length: ${keys.length}`}
          />
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('svg-canvas-section')}>
          <Typography variant="h6" gutterBottom>SVG & Canvas</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box {...aid('svg-container')}>
              <svg width="200" height="120" {...aid('svg-element')}>
                <rect x="10" y="10" width="80" height="80" fill="#0d47a1" {...aid('svg-rect')} />
                <circle cx="150" cy="50" r="35" fill="#00838f" {...aid('svg-circle')} />
                <text x="20" y="110" fill="#333" fontSize="12" {...aid('svg-text')}>SVG Shapes</text>
              </svg>
            </Box>
            <canvas ref={canvasRef} width={300} height={120} style={{ border: '1px solid #ccc' }} {...aid('canvas-element')} />
          </Stack>
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('dynamic-section')}>
          <Typography variant="h6" gutterBottom>Dynamic / Stale / AJAX</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Element below re-renders every 3s (stale element practice):
          </Typography>
          <Alert severity="info" key={staleTick} {...aid('stale-element')}>
            Dynamic content tick #{staleTick} — {new Date().toLocaleTimeString()}
          </Alert>
          <Divider sx={{ my: 2 }} />
          <Button onClick={loadAjax} disabled={ajaxLoading} {...btn('ajax-load')}>
            {ajaxLoading ? 'Loading AJAX...' : 'Trigger AJAX Load'}
          </Button>
          <Box sx={{ mt: 1 }} {...aid('ajax-result')}>
            {ajaxLoading && <Typography {...aid('ajax-loading')}>Loading...</Typography>}
            {ajaxData && (
              <Alert severity="success" {...aid('ajax-success')}>
                {ajaxData.message} @ {ajaxData.ts}
              </Alert>
            )}
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" gutterBottom>Dynamic XPath / Relative Locator targets:</Typography>
          <Stack direction="row" spacing={1}>
            {/* Intentionally mismatched id vs data-testid for relative locator practice */}
            <Button {...btn('dyn-btn-1')} id="dynamic-btn-primary">Primary</Button>
            <Button className="secondary-action" {...btn('dyn-btn-2')}>Secondary</Button>
            <Tooltip title="Relative to secondary">
              <Button {...btn('dyn-btn-3')}>Relative Target</Button>
            </Tooltip>
          </Stack>
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('a11y-section')}>
          <Typography variant="h6" gutterBottom>Accessibility Sample</Typography>
          <Button {...btn('a11y-button', 'Accessible submit button')}>Accessible Button</Button>
          <TextField
            label="Accessible Field"
            aria-required="true"
            helperText={<span id="a11y-help">Required field for a11y checks</span>}
            {...field('a11y-input')}
            slotProps={{
              htmlInput: {
                id: 'a11y-input',
                name: 'a11y-input',
                'data-testid': 'a11y-input',
                'aria-describedby': 'a11y-help',
              },
            }}
            sx={{ ml: 2, mt: { xs: 2, sm: 0 } }}
          />
        </Paper>
      </Stack>
    </Box>
  )
}
