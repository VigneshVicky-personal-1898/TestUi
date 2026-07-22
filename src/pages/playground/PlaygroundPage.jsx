// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Box, Paper, Typography, Button, Stack, TextField, Tabs, Tab, Alert, MenuItem,
  Select, FormControl, InputLabel, Slider, Switch, FormControlLabel, Dialog,
  DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText,
  CircularProgress, Chip,
} from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn, field, control, select, option, optId } from '../../utils/automation'
import { mockRequest, setMockOffline } from '../../utils/mockApi'

const SECTIONS = [
  'Dynamic Locators',
  'Sync & Waits',
  'DOM Challenges',
  'Frames & Shadow',
  'SVG Canvas',
  'Mouse Keyboard',
  'Alerts Windows',
  'Lists Tables',
  'Network Flaky',
  'A11y Responsive',
]

function Section({ title, children, id }) {
  return (
    <Paper sx={{ p: 2, mb: 2 }} {...aid(id)}>
      <Typography variant="h6" gutterBottom {...aid(`${id}-title`)}>{title}</Typography>
      {children}
    </Paper>
  )
}

export default function PlaygroundPage() {
  const [tab, setTab] = useState(0)
  const [dynamicId] = useState(() => `dyn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`)
  const [randomClass] = useState(() => `cls_${Math.random().toString(36).slice(2, 8)}`)
  const [delayShow, setDelayShow] = useState(false)
  const [delayClickable, setDelayClickable] = useState(false)
  const [ajaxHtml, setAjaxHtml] = useState('')
  const [ajaxLoading, setAjaxLoading] = useState(false)
  const [scrollItems, setScrollItems] = useState(Array.from({ length: 30 }, (_, i) => i + 1))
  const [virtualOffset, setVirtualOffset] = useState(0)
  const [hiddenVisible, setHiddenVisible] = useState(false)
  const [btnEnabled, setBtnEnabled] = useState(false)
  const [staleKey, setStaleKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState('')
  const [customAlert, setCustomAlert] = useState(false)
  const [slider, setSlider] = useState(40)
  const [panelW, setPanelW] = useState(280)
  const [suggest, setSuggest] = useState('')
  const [dropdown, setDropdown] = useState('')
  const [flakyPass, setFlakyPass] = useState(0)
  const [offline, setOffline] = useState(false)
  const [contextPos, setContextPos] = useState(null)
  const [hoverMsg, setHoverMsg] = useState('Hover me')
  const [dbl, setDbl] = useState(0)
  const [keys, setKeys] = useState('')
  const [log, setLog] = useState([])
  const shadowRef = useRef(null)
  const canvasRef = useRef(null)
  const sentinel = useRef(null)
  const bigData = useMemo(() => Array.from({ length: 10000 }, (_, i) => ({ id: i + 1, name: `Row ${i + 1}` })), [])
  const virtualRows = bigData.slice(virtualOffset, virtualOffset + 20)

  const pushLog = (m) => setLog((l) => [`${new Date().toLocaleTimeString()} — ${m}`, ...l].slice(0, 12))

  useEffect(() => {
    const t1 = setTimeout(() => setDelayShow(true), 2000)
    const t2 = setTimeout(() => setDelayClickable(true), 3000)
    const t3 = setTimeout(() => setBtnEnabled(true), 2500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => setStaleKey((k) => k + 1), 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const host = shadowRef.current
    if (!host || host.shadowRoot) return
    const outer = host.attachShadow({ mode: 'open' })
    outer.innerHTML = `
      <style>.wrap{padding:8px;border:1px solid #0d47a1;border-radius:6px;font-family:sans-serif}</style>
      <div class="wrap" data-testid="pg-shadow-outer" id="pg-shadow-outer">
        Outer Shadow
        <div id="pg-shadow-inner-host"></div>
      </div>`
    const innerHost = outer.querySelector('#pg-shadow-inner-host')
    const inner = innerHost.attachShadow({ mode: 'open' })
    inner.innerHTML = `<button id="pg-shadow-nested-btn" data-testid="pg-shadow-nested-btn">Nested Shadow Click</button>
      <span id="pg-shadow-nested-msg" data-testid="pg-shadow-nested-msg"></span>`
    inner.querySelector('button').onclick = () => {
      inner.querySelector('#pg-shadow-nested-msg').textContent = 'Nested shadow OK'
    }
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    let drawing = false
    const start = (e) => { drawing = true; ctx.beginPath(); ctx.moveTo(e.offsetX, e.offsetY) }
    const move = (e) => { if (!drawing) return; ctx.lineTo(e.offsetX, e.offsetY); ctx.stroke() }
    const end = () => { drawing = false }
    c.addEventListener('mousedown', start)
    c.addEventListener('mousemove', move)
    c.addEventListener('mouseup', end)
    ctx.strokeStyle = '#0d47a1'
    ctx.lineWidth = 2
    return () => {
      c.removeEventListener('mousedown', start)
      c.removeEventListener('mousemove', move)
      c.removeEventListener('mouseup', end)
    }
  }, [])

  useEffect(() => {
    const el = sentinel.current
    if (!el) return undefined
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setScrollItems((prev) => [...prev, ...Array.from({ length: 15 }, (_, i) => prev.length + i + 1)])
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const loadAjax = () => {
    setAjaxLoading(true)
    setAjaxHtml('')
    setTimeout(() => {
      setAjaxHtml(`<div id="pg-ajax-content" data-testid="pg-ajax-content">AJAX loaded at ${new Date().toLocaleTimeString()}</div>`)
      setAjaxLoading(false)
    }, 1500)
  }

  const flakyClick = () => {
    const next = flakyPass + 1
    setFlakyPass(next)
    if (next % 3 !== 0) {
      pushLog('Flaky click failed (retry)')
      throw new Error('Flaky failure')
    }
    pushLog('Flaky click succeeded on attempt ' + next)
  }

  const suggestions = ['Apple', 'Apricot', 'Avocado', 'Banana', 'Blueberry', 'Cherry'].filter((s) =>
    s.toLowerCase().includes(suggest.toLowerCase())
  )

  return (
    <PageContainer pageId="playground-page">
      <PageHeader
        pageId="playground"
        title="Automation Playground"
        subtitle="100+ isolated scenarios for Selenium, Playwright, Cypress, WebDriverIO & AI automation interviews"
        breadcrumbs={['Automation Playground']}
      />

      <Alert severity="info" sx={{ mb: 2 }} {...aid('playground-intro')}>
        Prefer stable locators: <code>id</code> / <code>data-testid</code>. Dynamic sections intentionally break brittle XPath/CSS.
      </Alert>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2 }}
        {...aid('playground-tabs')}
      >
        {SECTIONS.map((s, i) => <Tab key={s} label={s} {...aid(`playground-tab-${i}`)} />)}
      </Tabs>

      {tab === 0 && (
        <>
          <Section title="Dynamic IDs / Random Classes / Changing Attributes" id="pg-dynamic">
            <Stack spacing={1}>
              <Button className={randomClass} {...btn('pg-btn-dynamic-stable')} id={dynamicId}>
                Stable testid · Dynamic id={dynamicId}
              </Button>
              <Typography variant="caption" {...aid('pg-dynamic-meta')}>class={randomClass} (changes on refresh)</Typography>
              <Button
                {...btn('pg-btn-changing-text')}
                id={`changing-text-${staleKey}`}
              >
                Text changes: tick {staleKey}
              </Button>
              <Box className={`css-rand-${staleKey % 5}`} {...aid('pg-changing-css')}>Changing CSS class wrapper</Box>
            </Stack>
          </Section>
          <Section title="Duplicate Elements / Complex Relative Targets" id="pg-duplicates">
            <Stack direction="row" spacing={1}>
              <Button {...btn('pg-btn-same-1')}>Same Label</Button>
              <Button {...btn('pg-btn-same-2')}>Same Label</Button>
              <Button {...btn('pg-btn-same-3')}>Same Label</Button>
            </Stack>
            <Typography sx={{ mt: 1 }} variant="body2" {...aid('pg-relative-parent')}>
              Parent <Button size="small" {...btn('pg-btn-relative-child')}>Relative child</Button>
            </Typography>
          </Section>
        </>
      )}

      {tab === 1 && (
        <>
          <Section title="Delayed Appearance / Clickability / Spinner" id="pg-waits">
            {!delayShow ? <CircularProgress {...aid('pg-spinner-delay')} /> : (
              <Button {...btn('pg-btn-delayed-appear')} onClick={() => pushLog('delayed appear clicked')}>I appeared after 2s</Button>
            )}
            <Button sx={{ ml: 1 }} disabled={!delayClickable} {...btn('pg-btn-delayed-clickable')} onClick={() => pushLog('delayed clickable')}>
              Enabled after 3s
            </Button>
            <Button sx={{ ml: 1 }} disabled={!btnEnabled} {...btn('pg-btn-disabled-to-enabled')}>Disabled → Enabled</Button>
          </Section>
          <Section title="AJAX / Explicit Wait Practice" id="pg-ajax">
            <Button {...btn('pg-btn-ajax')} onClick={loadAjax}>Load AJAX</Button>
            {ajaxLoading && <Typography {...aid('pg-ajax-loading')}>Loading AJAX…</Typography>}
            <Box sx={{ mt: 1 }} dangerouslySetInnerHTML={{ __html: ajaxHtml }} {...aid('pg-ajax-container')} />
          </Section>
          <Section title="Invisible → Visible / Hidden / Readonly" id="pg-visibility">
            <Button {...btn('pg-btn-reveal')} onClick={() => setHiddenVisible(true)}>Reveal Hidden</Button>
            <Box sx={{ display: hiddenVisible ? 'block' : 'none', mt: 1 }} {...aid('pg-hidden-element')}>I was hidden</Box>
            <Box sx={{ visibility: hiddenVisible ? 'visible' : 'hidden', mt: 1 }} {...aid('pg-invisible-element')}>visibility:hidden target</Box>
            <TextField sx={{ mt: 1, display: 'block' }} label="Read only" value="cannot edit" InputProps={{ readOnly: true }} {...field('pg-input-readonly', 'readonlyField')} />
          </Section>
        </>
      )}

      {tab === 2 && (
        <>
          <Section title="Overlapping Element / Stale Element" id="pg-overlap">
            <Box sx={{ position: 'relative', height: 80 }} {...aid('pg-overlap-box')}>
              <Button {...btn('pg-btn-underlap')} sx={{ position: 'absolute', left: 0 }}>Under</Button>
              <Box sx={{ position: 'absolute', left: 10, top: 0, width: 100, height: 40, bgcolor: 'rgba(13,71,161,0.35)' }} {...aid('pg-overlap-layer')} />
            </Box>
            <Alert key={staleKey} {...aid('pg-stale-element')}>Stale tick #{staleKey} — remounts every 2.5s</Alert>
          </Section>
          <Section title="Resizable Panel / Slider" id="pg-resize">
            <Box sx={{ width: panelW, p: 2, border: 1, borderColor: 'divider', resize: 'horizontal', overflow: 'auto' }} {...aid('pg-resizable-panel')}>
              Drag edge to resize (CSS resize)
            </Box>
            <Typography sx={{ mt: 1 }}>Slider: {slider}</Typography>
            <Slider value={slider} onChange={(_, v) => setSlider(v)} {...aid('pg-slider')} />
          </Section>
        </>
      )}

      {tab === 3 && (
        <>
          <Section title="Nested Open Shadow DOM" id="pg-shadow">
            <div ref={shadowRef} {...aid('pg-shadow-host')} />
          </Section>
          <Section title="iFrame inside Modal" id="pg-frame-modal">
            <Button {...btn('pg-btn-open-frame-modal')} onClick={() => setModalOpen(true)}>Open Modal + iframe</Button>
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth {...aid('pg-frame-modal-dialog')}>
              <DialogTitle>Frame in Modal</DialogTitle>
              <DialogContent>
                <Box component="iframe" title="modal-frame" name="pg-modal-frame" src="/automation/inner-frame.html"
                  sx={{ width: '100%', height: 220, border: 1, borderColor: 'divider' }} {...aid('pg-modal-frame')} />
              </DialogContent>
              <DialogActions>
                <Button {...btn('pg-btn-close-frame-modal')} onClick={() => setModalOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
            <Box component="iframe" title="pg-outer" name="pg-nested-outer" src="/automation/outer-frame.html"
              sx={{ width: '100%', height: 260, mt: 2, border: 1, borderColor: 'divider' }} {...aid('pg-nested-outer')} />
          </Section>
        </>
      )}

      {tab === 4 && (
        <>
          <Section title="SVG Icons / Map Shapes" id="pg-svg">
            <svg width="220" height="120" {...aid('pg-svg-root')}>
              <rect {...aid('pg-svg-rect')} x="10" y="10" width="70" height="70" fill="#0d47a1" />
              <circle {...aid('pg-svg-circle')} cx="140" cy="45" r="30" fill="#00838f" />
              <path {...aid('pg-svg-path')} d="M20 100 H200" stroke="#ed6c02" strokeWidth="3" />
            </svg>
          </Section>
          <Section title="Canvas Signature / Drawing" id="pg-canvas">
            <canvas ref={canvasRef} width={400} height={160} style={{ border: '1px solid #ccc', touchAction: 'none' }} {...aid('pg-canvas-signature')} />
            <Button sx={{ ml: 1 }} {...btn('pg-btn-canvas-clear')} onClick={() => {
              const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height)
            }}>Clear</Button>
          </Section>
        </>
      )}

      {tab === 5 && (
        <>
          <Section title="Hover / Right Click / Double Click / Keyboard" id="pg-mouse">
            <Button
              {...btn('pg-btn-hover')}
              onMouseEnter={() => setHoverMsg('Hovered!')}
              onMouseLeave={() => setHoverMsg('Hover me')}
            >{hoverMsg}</Button>
            <Button sx={{ ml: 1 }} {...btn('pg-btn-dbl')} onDoubleClick={() => setDbl((d) => d + 1)}>Double Click ({dbl})</Button>
            <Button
              sx={{ ml: 1 }}
              {...btn('pg-btn-context')}
              onContextMenu={(e) => { e.preventDefault(); setContextPos({ x: e.clientX, y: e.clientY }) }}
            >Right Click</Button>
            {contextPos && (
              <Paper sx={{ position: 'fixed', top: contextPos.y, left: contextPos.x, zIndex: 2000, p: 1 }} {...aid('pg-context-menu')}>
                <Button size="small" {...btn('pg-ctx-item-1')} onClick={() => setContextPos(null)}>Menu A</Button>
                <Button size="small" {...btn('pg-ctx-item-2')} onClick={() => setContextPos(null)}>Menu B</Button>
              </Paper>
            )}
            <TextField
              fullWidth
              sx={{ mt: 2 }}
              label="Keyboard capture"
              value={keys}
              onChange={(e) => setKeys(e.target.value)}
              onKeyDown={(e) => pushLog(`key ${e.key}`)}
              {...field('pg-input-keyboard', 'keyboard')}
            />
            <Typography variant="caption">Try Ctrl/Cmd shortcuts while focused</Typography>
          </Section>
          <Section title="Auto Suggest / Dynamic Dropdown" id="pg-suggest">
            <TextField fullWidth label="Auto suggest fruit" value={suggest} onChange={(e) => setSuggest(e.target.value)} {...field('pg-input-autosuggest', 'suggest')} />
            <List dense {...aid('pg-suggest-list')}>
              {suggestions.map((s) => (
                <ListItem key={s} button onClick={() => setSuggest(s)} {...aid(`pg-suggest-item-${s.toLowerCase()}`)}>
                  <ListItemText primary={s} />
                </ListItem>
              ))}
            </List>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel htmlFor="pg-select-dynamic">Dynamic Dropdown</InputLabel>
              <Select
                label="Dynamic Dropdown"
                value={dropdown}
                onChange={(e) => setDropdown(e.target.value)}
                {...select('pg-select-dynamic', 'pg-select-dynamic', 'Dynamic Dropdown')}
              >
                {['Alpha', 'Beta', 'Gamma', `Rand-${staleKey}`].map((o) => (
                  <MenuItem key={o} value={o} {...option(optId('pg-select-dynamic', o), o)}>{o}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Section>
        </>
      )}

      {tab === 6 && (
        <>
          <Section title="Browser Alerts / Custom / Toast / Random Modal" id="pg-alerts">
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
              <Button {...btn('pg-btn-alert')} onClick={() => window.alert('Basic alert')}>Alert</Button>
              <Button {...btn('pg-btn-confirm')} onClick={() => pushLog('confirm=' + window.confirm('Confirm?'))}>Confirm</Button>
              <Button {...btn('pg-btn-prompt')} onClick={() => pushLog('prompt=' + window.prompt('Enter', 'QA'))}>Prompt</Button>
              <Button {...btn('pg-btn-toast')} onClick={() => { setToast('Toast ' + Date.now()); setTimeout(() => setToast(''), 3000) }}>Toast</Button>
              <Button {...btn('pg-btn-sweet')} onClick={() => setCustomAlert(true)}>Custom Alert</Button>
              <Button {...btn('pg-btn-random-modal')} onClick={() => Math.random() > 0.3 && setModalOpen(true)}>Random Modal</Button>
              <Button {...btn('pg-btn-new-tab')} onClick={() => window.open('/automation/popup.html', '_blank')}>New Tab</Button>
              <Button {...btn('pg-btn-new-window')} onClick={() => window.open('/automation/popup.html', 'pg_win', 'width=480,height=360')}>New Window</Button>
              <Button {...btn('pg-btn-print')} onClick={() => window.print()}>Print Preview</Button>
            </Stack>
            {toast && <Alert sx={{ mt: 1 }} {...aid('pg-toast')}>{toast}</Alert>}
            <Dialog open={customAlert} onClose={() => setCustomAlert(false)} {...aid('pg-custom-alert')}>
              <DialogTitle>Custom / Sweet Alert</DialogTitle>
              <DialogContent>Custom modal alert for automation</DialogContent>
              <DialogActions>
                <Button {...btn('pg-custom-alert-ok')} onClick={() => setCustomAlert(false)}>OK</Button>
              </DialogActions>
            </Dialog>
          </Section>
        </>
      )}

      {tab === 7 && (
        <>
          <Section title="Infinite Scroll" id="pg-infinite">
            <Box sx={{ height: 200, overflow: 'auto', border: 1, borderColor: 'divider' }} {...aid('pg-infinite-container')}>
              <List dense>
                {scrollItems.map((n) => <ListItem key={n} {...aid(`pg-infinite-item-${n}`)}><ListItemText primary={`Item ${n}`} /></ListItem>)}
              </List>
              <Box ref={sentinel} sx={{ py: 1, textAlign: 'center' }} {...aid('pg-infinite-sentinel')}>…</Box>
            </Box>
          </Section>
          <Section title="Virtual List (10000 rows, windowed DOM)" id="pg-virtual">
            <Typography variant="caption">Showing rows {virtualOffset + 1}–{virtualOffset + virtualRows.length} of 10000</Typography>
            <Slider min={0} max={9980} step={20} value={virtualOffset} onChange={(_, v) => setVirtualOffset(v)} {...aid('pg-virtual-slider')} />
            <List dense sx={{ maxHeight: 220, overflow: 'auto', border: 1, borderColor: 'divider' }} {...aid('pg-virtual-list')}>
              {virtualRows.map((r) => <ListItem key={r.id} {...aid(`pg-virtual-row-${r.id}`)}><ListItemText primary={r.name} /></ListItem>)}
            </List>
          </Section>
        </>
      )}

      {tab === 8 && (
        <>
          <Section title="Network Delay / Offline / Retry / Flaky" id="pg-network">
            <FormControlLabel
              control={
                <Switch
                  checked={offline}
                  onChange={(e) => { setOffline(e.target.checked); setMockOffline(e.target.checked) }}
                  {...control('pg-switch-offline', 'pg-switch-offline', 'Offline')}
                />
              }
              label="Offline"
            />
            <Button sx={{ ml: 1 }} {...btn('pg-btn-slow-api')} onClick={async () => {
              pushLog('slow api start')
              try { await mockRequest({ scenario: 'success', delay: 2500 }); pushLog('slow api ok') }
              catch (e) { pushLog('slow api fail ' + e.message) }
            }}>Slow API (2.5s)</Button>
            <Button sx={{ ml: 1 }} {...btn('pg-btn-flaky')} onClick={() => { try { flakyClick() } catch { /* intentional */ } }}>Flaky Button</Button>
            <Button sx={{ ml: 1 }} {...btn('pg-btn-random-toast')} onClick={() => {
              if (Math.random() > 0.4) { setToast('Random toast'); setTimeout(() => setToast(''), 2000) }
            }}>Random Toast</Button>
            <Button sx={{ ml: 1 }} {...btn('pg-btn-random-alert')} onClick={() => { if (Math.random() > 0.5) window.alert('Random alert') }}>Random Alert</Button>
          </Section>
          <Section title="Captcha / OTP Dummy" id="pg-captcha-otp">
            <Typography {...aid('pg-captcha-text')} sx={{ fontFamily: 'monospace', letterSpacing: 3 }}>AUTO</Typography>
            <TextField size="small" label="Captcha" placeholder="AUTO" {...field('pg-input-captcha', 'captcha')} />
            <TextField size="small" sx={{ ml: 1 }} label="OTP" placeholder="999999" {...field('pg-input-otp', 'otp')} />
          </Section>
        </>
      )}

      {tab === 9 && (
        <>
          <Section title="Accessibility & Responsive" id="pg-a11y">
            <Button aria-label="Accessible playground action" {...btn('pg-btn-a11y')}>A11y Button</Button>
            <TextField sx={{ ml: 1 }} label="Labeled field" inputProps={{ 'aria-required': true }} {...field('pg-input-a11y', 'a11y')} />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }} {...aid('pg-viewport-hints')}>
              <Chip label="Desktop ≥1200" {...aid('pg-chip-desktop')} />
              <Chip label="Tablet 768" {...aid('pg-chip-tablet')} />
              <Chip label="Mobile 375" {...aid('pg-chip-mobile')} />
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>Resize viewport to practice responsive assertions.</Typography>
          </Section>
        </>
      )}

      <Paper sx={{ p: 2, mt: 2 }} {...aid('playground-event-log')}>
        <Typography variant="subtitle2">Event Log</Typography>
        <List dense>
          {log.map((l, i) => <ListItem key={i} {...aid(`playground-log-${i}`)}><ListItemText primary={l} /></ListItem>)}
        </List>
      </Paper>
    </PageContainer>
  )
}
