// AI-ASSISTED: Cursor
// PROMPT: Deploy-aware Test Runner with git artifact storage status
// ACCEPTED-BY: vignesh
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, FormControl,
  Grid, InputLabel, LinearProgress, List, ListItemButton, ListItemText,
  MenuItem, Select, Stack, Tab, Tabs, TextField, Typography, Accordion, AccordionSummary,
  AccordionDetails, ToggleButton, ToggleButtonGroup,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import RefreshIcon from '@mui/icons-material/Refresh'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { PageHeader } from '../../components/common/PageHeader'
import FrameworkDiagram from './FrameworkDiagram'
import { runnerApi } from '../../utils/runnerApi'
import { aid, btn, select, option, field, dyn, optId } from '../../utils/automation'

function statusColor(status) {
  if (status === 'passed') return 'success'
  if (status === 'failed') return 'error'
  if (status === 'running') return 'warning'
  return 'default'
}

function ClassBrowser({ packages }) {
  const entries = Object.entries(packages || {}).filter(([, list]) => list?.length)
  if (!entries.length) {
    return <Typography color="text.secondary">No Java classes discovered.</Typography>
  }
  return (
    <Box {...aid('runner-class-browser')}>
      {entries.map(([pkgKey, classes]) => (
        <Accordion key={pkgKey} disableGutters elevation={0} sx={{ mb: 1 }} {...aid(dyn('runner-pkg', pkgKey))}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} {...btn(dyn('runner-pkg-toggle', pkgKey), `Toggle ${pkgKey}`)}>
            <Typography fontWeight={700} sx={{ textTransform: 'capitalize' }}>
              {pkgKey} ({classes.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <List dense disablePadding>
              {classes.map((cls) => (
                <Box key={cls.fqcn} sx={{ mb: 1.25 }} {...aid(dyn('runner-class', cls.className))}>
                  <Typography variant="body2" fontWeight={700}>{cls.className}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                    {cls.fqcn}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.5}>
                    {(cls.methods || []).slice(0, 12).map((m) => (
                      <Chip key={m} size="small" label={m} {...aid(dyn('runner-method', cls.className, m))} />
                    ))}
                    {(cls.methods || []).length > 12 && (
                      <Chip size="small" label={`+${cls.methods.length - 12} more`} />
                    )}
                  </Stack>
                </Box>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default function TestRunnerPage() {
  const [tab, setTab] = useState(0)
  const [apiOk, setApiOk] = useState(null)
  const [framework, setFramework] = useState('selenium')
  const [catalog, setCatalog] = useState(null)
  const [structure, setStructure] = useState(null)
  const [artifacts, setArtifacts] = useState({ reports: [], screenshots: [], surefire: [] })
  const [suiteMode, setSuiteMode] = useState('application')
  const [selectedSuite, setSelectedSuite] = useState('')
  const [moduleName, setModuleName] = useState('')
  const [browser, setBrowser] = useState('chrome')
  const [headless, setHeadless] = useState(true)
  const [baseUrl, setBaseUrl] = useState(() => (
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173'
  ))
  const [gitSync, setGitSync] = useState(true)
  const [runnerConfig, setRunnerConfig] = useState(null)
  const [loadingMeta, setLoadingMeta] = useState(false)
  const [error, setError] = useState('')
  const [activeRun, setActiveRun] = useState(null)
  const [logs, setLogs] = useState([])
  const [history, setHistory] = useState([])
  const logEndRef = useRef(null)
  const esRef = useRef(null)

  const applicationSuites = catalog?.applicationSuites || []
  const moduleSuites = useMemo(() => {
    const all = catalog?.moduleSuites || []
    if (!moduleName) return all
    return all.filter((s) => s.category === moduleName || s.category.startsWith(`${moduleName}/`))
  }, [catalog, moduleName])

  const suiteOptions = suiteMode === 'module' ? moduleSuites : applicationSuites
  const selectedSuiteMeta = suiteOptions.find((s) => s.relativePath === selectedSuite)

  const refreshMeta = useCallback(async (fw = framework) => {
    setLoadingMeta(true)
    setError('')
    try {
      await runnerApi.health()
      setApiOk(true)
      const [cat, struct, arts, runs, cfg] = await Promise.all([
        runnerApi.catalog(fw),
        runnerApi.structure(fw),
        runnerApi.artifacts(fw),
        runnerApi.runs(),
        runnerApi.config().catch(() => null),
      ])
      setCatalog(cat)
      setStructure(struct)
      setArtifacts(arts)
      setHistory(runs.runs || [])
      if (cfg) {
        setRunnerConfig(cfg)
        setGitSync(Boolean(cfg.gitSync?.enabled))
      }      const firstApp = cat.applicationSuites?.[0]?.relativePath || ''
      setSelectedSuite((prev) => prev || firstApp)
      if (fw === 'selenium' && cat.modules?.length) {
        setModuleName((prev) => prev || cat.modules[0])
      }
    } catch (err) {
      setApiOk(false)
      setError(err.message || 'Runner API unavailable. Start the app with npm run dev.')
    } finally {
      setLoadingMeta(false)
    }
  }, [framework])

  useEffect(() => {
    refreshMeta(framework)
    return () => {
      if (esRef.current) esRef.current.close()
    }
  }, [framework, refreshMeta])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  useEffect(() => {
    if (suiteMode === 'application' && applicationSuites.length) {
      setSelectedSuite(applicationSuites[0].relativePath)
    }
  }, [suiteMode, applicationSuites])

  useEffect(() => {
    if (suiteMode === 'module' && moduleSuites.length) {
      const preferred = moduleSuites.find((s) => s.name === 'smoke') || moduleSuites[0]
      setSelectedSuite(preferred.relativePath)
    }
  }, [suiteMode, moduleName, moduleSuites])

  const attachStream = (runId) => {
    if (esRef.current) esRef.current.close()
    const es = new EventSource(runnerApi.streamUrl(runId))
    esRef.current = es
    es.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data)
        if (data.type === 'log') {
          setLogs((prev) => [...prev, data])
        }
        if (data.type === 'status' && data.run) {
          setActiveRun(data.run)
        }
        if (data.type === 'done' && data.run) {
          setActiveRun(data.run)
          setArtifacts(data.run.artifacts || artifacts)
          refreshMeta(framework)
          es.close()
        }
      } catch {
        // ignore malformed
      }
    }
    es.onerror = () => {
      // browser will retry; leave open while running
    }
  }

  const handleRun = async () => {
    setError('')
    setLogs([])
    try {
      const result = await runnerApi.start({
        framework,
        suiteXmlFile: selectedSuite,
        browser,
        headless,
        baseUrl,
        gitSync,
      })
      if (!result.ok) throw new Error(result.error || 'Failed to start')
      setActiveRun(result.run)
      setTab(1)
      attachStream(result.run.id)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleStop = async () => {
    if (!activeRun?.id) return
    try {
      await runnerApi.stop(activeRun.id)
    } catch (err) {
      setError(err.message)
    }
  }

  const running = activeRun?.status === 'running'

  return (
    <Box {...aid('runner-page')}>
      <PageHeader
        pageId="test-runner"
        title="Automation Test Runner"
        subtitle="Execute Selenium / Playwright TestNG suites from TestUi — view logs, reports, screenshots, and framework structure"
        breadcrumbs={['Test Runner']}
        actions={(
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refreshMeta(framework)}
            disabled={loadingMeta}
            {...btn('runner-btn-refresh', 'Refresh catalog')}
          >
            Refresh
          </Button>
        )}
      />

      {runnerConfig && (
        <Alert
          severity={runnerConfig.gitSync?.enabled ? 'success' : 'info'}
          sx={{ mb: 2 }}
          {...aid('runner-alert-deploy')}
        >
          Deployed runner stores each execution under <code>automation/runs/</code>.
          {' '}Git sync is <strong>{runnerConfig.gitSync?.enabled ? 'ON' : 'OFF'}</strong>
          {runnerConfig.gitSync?.repoUrl ? <> · repo <code>{runnerConfig.gitSync.repoUrl}</code></> : null}
          {'. '}
          Use the app URL as Base URL so suites hit this deployment.
        </Alert>
      )}
      {apiOk === false && (
        <Alert severity="error" sx={{ mb: 2 }} {...aid('runner-alert-api')}>
          Runner API is offline. Use <strong>npm run dev</strong> (Vite middleware) so `/api/runner` is available.
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')} {...aid('runner-alert-error')}>
          {error}
        </Alert>
      )}
      {loadingMeta && <LinearProgress sx={{ mb: 2 }} {...aid('runner-loading')} />}

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 2 }}
        {...aid('runner-tabs')}
      >
        <Tab label="Configure & Run" {...btn('runner-tab-configure', 'Configure and run')} />
        <Tab label="Live Logs" {...btn('runner-tab-logs', 'Live logs')} />
        <Tab label="Reports & Screenshots" {...btn('runner-tab-artifacts', 'Reports and screenshots')} />
        <Tab label="Framework Structure" {...btn('runner-tab-structure', 'Framework structure')} />
      </Tabs>

      {tab === 0 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card {...aid('runner-config-card')}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Execution settings</Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Framework</InputLabel>
                  <Select
                    label="Framework"
                    value={framework}
                    onChange={(e) => {
                      const next = e.target.value
                      setFramework(next)
                      setSuiteMode(next === 'playwright' ? 'application' : suiteMode)
                      setBrowser(next === 'playwright' ? 'chromium' : 'chrome')
                    }}
                    {...select('runner-framework', 'framework', 'Select framework')}
                  >
                    <MenuItem value="selenium" {...option(optId('runner-framework', 'selenium'), 'Selenium')}>
                      Selenium + TestNG (Java)
                    </MenuItem>
                    <MenuItem value="playwright" {...option(optId('runner-framework', 'playwright'), 'Playwright')}>
                      Playwright + TestNG (Java)
                    </MenuItem>
                  </Select>
                </FormControl>

                {framework === 'selenium' && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Suite scope</InputLabel>
                    <Select
                      label="Suite scope"
                      value={suiteMode}
                      onChange={(e) => setSuiteMode(e.target.value)}
                      {...select('runner-suite-mode', 'suiteMode', 'Suite scope')}
                    >
                      <MenuItem value="application" {...option(optId('runner-suite-mode', 'application'), 'Application')}>
                        Application suites
                      </MenuItem>
                      <MenuItem value="module" {...option(optId('runner-suite-mode', 'module'), 'Module')}>
                        Module suites
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}

                {framework === 'selenium' && suiteMode === 'module' && (
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Module</InputLabel>
                    <Select
                      label="Module"
                      value={moduleName}
                      onChange={(e) => setModuleName(e.target.value)}
                      {...select('runner-module', 'module', 'Select module')}
                    >
                      {(catalog?.modules || []).map((m) => (
                        <MenuItem key={m} value={m} {...option(optId('runner-module', m), m)}>{m}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Test suite</InputLabel>
                  <Select
                    label="Test suite"
                    value={selectedSuite}
                    onChange={(e) => setSelectedSuite(e.target.value)}
                    {...select('runner-suite', 'suite', 'Select test suite')}
                  >
                    {suiteOptions.map((s) => (
                      <MenuItem
                        key={s.relativePath}
                        value={s.relativePath}
                        {...option(optId('runner-suite', s.id), s.label)}
                      >
                        {s.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Browser</InputLabel>
                  <Select
                    label="Browser"
                    value={browser}
                    onChange={(e) => setBrowser(e.target.value)}
                    {...select('runner-browser', 'browser', 'Select browser')}
                  >
                    {(framework === 'playwright'
                      ? ['chromium', 'firefox', 'webkit']
                      : ['chrome', 'firefox', 'edge']
                    ).map((b) => (
                      <MenuItem key={b} value={b} {...option(optId('runner-browser', b), b)}>{b}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Base URL"
                  value={baseUrl}
                  onChange={(e) => setBaseUrl(e.target.value)}
                  sx={{ mb: 1 }}
                  {...field('runner-base-url', 'baseUrl')}
                />

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75 }}>
                  Browser mode
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={headless ? 'headless' : 'visible'}
                  onChange={(_, value) => {
                    if (value != null) setHeadless(value === 'headless')
                  }}
                  sx={{ mb: 1.5 }}
                  {...aid('runner-browser-mode')}
                >
                  <ToggleButton
                    value="visible"
                    {...btn('runner-mode-visible', 'Visible browser mode')}
                  >
                    Visible
                  </ToggleButton>
                  <ToggleButton
                    value="headless"
                    {...btn('runner-mode-headless', 'Headless browser mode')}
                  >
                    Headless
                  </ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  {headless
                    ? 'Runs without opening a browser window (good for CI / background runs).'
                    : 'Opens a real browser window so you can watch the automation (requires a display).'}
                </Typography>

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75 }}>
                  Save results to Git
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  fullWidth
                  value={gitSync ? 'on' : 'off'}
                  onChange={(_, value) => {
                    if (value != null) setGitSync(value === 'on')
                  }}
                  sx={{ mb: 1 }}
                  {...aid('runner-git-sync')}
                >
                  <ToggleButton value="on" {...btn('runner-git-on', 'Enable git sync')}>
                    Commit / push
                  </ToggleButton>
                  <ToggleButton value="off" {...btn('runner-git-off', 'Disable git sync')}>
                    Disk only
                  </ToggleButton>
                </ToggleButtonGroup>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  When enabled, logs/reports/screenshots under <code>automation/runs/&lt;id&gt;/</code> are
                  committed{runnerConfig?.gitSync?.push ? ' and pushed' : ''} to git (host must have
                  credentials). Requires <code>RUNNER_GIT_SYNC=true</code> on the server for push to work by default.
                </Typography>

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
                    onClick={handleRun}
                    disabled={running || !selectedSuite || apiOk === false}
                    {...btn('runner-btn-start', 'Start test run')}
                  >
                    Run Suite
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={handleStop}
                    disabled={!running}
                    {...btn('runner-btn-stop', 'Stop test run')}
                  >
                    Stop
                  </Button>
                </Stack>

                {selectedSuiteMeta && (
                  <Alert severity="info" sx={{ mt: 2 }} {...aid('runner-selected-suite-info')}>
                    Suite XML: <code>{selectedSuiteMeta.relativePath}</code>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ mb: 2 }} {...aid('runner-status-card')}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="h6" fontWeight={700}>Current run</Typography>
                  {activeRun && (
                    <Chip
                      label={activeRun.status}
                      color={statusColor(activeRun.status)}
                      {...aid('runner-status-chip')}
                    />
                  )}
                </Stack>
                {!activeRun ? (
                  <Typography color="text.secondary">No run started yet.</Typography>
                ) : (
                  <Box {...aid('runner-active-summary')}>
                    <Typography variant="body2"><strong>ID:</strong> {activeRun.id}</Typography>
                    <Typography variant="body2"><strong>Framework:</strong> {activeRun.framework}</Typography>
                    <Typography variant="body2">
                      <strong>Mode:</strong>{' '}
                      {activeRun.settings?.headless ? 'Headless' : 'Visible'}
                      {activeRun.settings?.browser ? ` · ${activeRun.settings.browser}` : ''}
                    </Typography>
                    {activeRun.storage?.path && (
                      <Typography variant="body2" {...aid('runner-storage-path')}>
                        <strong>Stored:</strong> <code>{activeRun.storage.path}</code>
                      </Typography>
                    )}
                    {activeRun.git && (
                      <Typography variant="body2" {...aid('runner-git-status')}>
                        <strong>Git:</strong>{' '}
                        {activeRun.git.skipped
                          ? `skipped (${activeRun.git.reason || 'disabled'})`
                          : activeRun.git.ok
                            ? `${activeRun.git.pushed ? 'pushed' : 'committed'}${activeRun.git.branch ? ` → ${activeRun.git.branch}` : ''}`
                            : `error — ${activeRun.git.error || 'failed'}`}
                      </Typography>
                    )}
                    <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                      <strong>Command:</strong> {activeRun.command}
                    </Typography>
                    {running && <LinearProgress sx={{ mt: 2 }} {...aid('runner-progress')} />}
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card {...aid('runner-history-card')}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Recent runs</Typography>
                {!history.length && <Typography color="text.secondary">No runs in this session.</Typography>}
                <List dense>
                  {history.slice(0, 8).map((r) => (
                    <ListItemButton
                      key={r.id}
                      onClick={async () => {
                        const full = await runnerApi.getRun(r.id)
                        setActiveRun(full)
                        setLogs(full.logs || [])
                        setTab(1)
                      }}
                      {...btn(dyn('runner-history', r.id), `Open run ${r.id}`)}
                    >
                      <ListItemText
                        primary={`${r.id} · ${r.framework} · ${r.status}`}
                        secondary={r.suiteXmlFile || r.profile || r.command}
                      />
                      <Chip size="small" label={r.status} color={statusColor(r.status)} />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {tab === 1 && (
        <Card {...aid('runner-logs-card')}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" fontWeight={700}>Live execution logs</Typography>
              <Chip label={`${logs.length} lines`} size="small" />
            </Stack>
            <Box
              {...aid('runner-log-console')}
              sx={{
                height: 480,
                overflow: 'auto',
                p: 1.5,
                borderRadius: 2,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: 12,
                lineHeight: 1.45,
                bgcolor: '#0f172a',
                color: '#e2e8f0',
                boxShadow: (t) => t.customShadows?.neuInsetSm,
              }}
            >
              {!logs.length && (
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  Logs appear here when a suite is running.
                </Typography>
              )}
              {logs.map((l, i) => (
                <Box
                  key={`${l.t}-${i}`}
                  component="div"
                  sx={{
                    color: l.stream === 'stderr' ? '#fca5a5' : l.stream === 'system' ? '#5eead4' : '#e2e8f0',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                  {...aid(dyn('runner-log-line', i + 1))}
                >
                  {l.line}
                </Box>
              ))}
              <div ref={logEndRef} />
            </Box>
          </CardContent>
        </Card>
      )}

      {tab === 2 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card {...aid('runner-reports-card')}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Extent / stored reports</Typography>
                {!(artifacts.storedReports?.length || artifacts.reports?.length) && (
                  <Typography color="text.secondary">No reports yet.</Typography>
                )}
                <List dense>
                  {[...(artifacts.storedReports || []), ...(artifacts.reports || [])].slice(0, 20).map((r) => (
                    <ListItemButton
                      key={`${r.kind || 'live'}-${r.name}`}
                      component="a"
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      {...btn(dyn('runner-report', r.name), `Open report ${r.name}`)}
                    >
                      <ListItemText primary={r.name} secondary={r.kind || 'live'} />
                      <OpenInNewIcon fontSize="small" />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card {...aid('runner-surefire-card')}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Surefire / TestNG</Typography>
                {!(artifacts.storedSurefire?.length || artifacts.surefire?.length) && (
                  <Typography color="text.secondary">No surefire reports yet.</Typography>
                )}
                <List dense>
                  {[...(artifacts.storedSurefire || []), ...(artifacts.surefire || [])].slice(0, 20).map((r) => (
                    <ListItemButton
                      key={`${r.kind || 'live'}-${r.name}`}
                      component="a"
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      {...btn(dyn('runner-surefire', r.name), `Open surefire ${r.name}`)}
                    >
                      <ListItemText primary={r.name} />
                      <OpenInNewIcon fontSize="small" />
                    </ListItemButton>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card {...aid('runner-screenshots-card')}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>Screenshots</Typography>
                {!(artifacts.storedScreenshots?.length || artifacts.screenshots?.length) && (
                  <Typography color="text.secondary">No screenshots yet.</Typography>
                )}
                <Stack spacing={1.5}>
                  {[...(artifacts.storedScreenshots || []), ...(artifacts.screenshots || [])].slice(0, 12).map((s) => (
                    <Box key={`${s.kind || 'live'}-${s.name}`} {...aid(dyn('runner-screenshot', s.name))}>
                      <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>{s.name}</Typography>
                      <Box component="a" href={s.url} target="_blank" rel="noreferrer" sx={{ display: 'block' }}>
                        <Box
                          component="img"
                          src={s.url}
                          alt={s.name}
                          sx={{
                            width: '100%',
                            maxHeight: 160,
                            objectFit: 'cover',
                            borderRadius: 2,
                            boxShadow: (t) => t.customShadows?.neuRaisedSm,
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      {tab === 3 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Card {...aid('runner-structure-card')}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {structure?.framework?.label || 'Framework'} design diagram
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Package root: <code>{structure?.framework?.packageRoot}</code>
                  {' · '}
                  Project: <code>{structure?.framework?.projectDir}</code>
                </Typography>
                <FrameworkDiagram structure={structure} frameworkId={framework} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Card {...aid('runner-classes-card')}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Java classes & methods
                </Typography>
                <Divider sx={{ mb: 1.5 }} />
                <ClassBrowser packages={structure?.packages || catalog?.packages} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}
