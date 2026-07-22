// AI-ASSISTED: Cursor
// PROMPT: Add option() automation attrs to API sim scenario MenuItems
// ACCEPTED-BY: vignesh

import { useState } from 'react'
import { Box, Paper, Button, Stack, Typography, Alert, MenuItem, TextField, Chip } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { mockRequest, mockRequestWithRetry, setMockOffline, getMockOffline } from '../../utils/mockApi'
import { aid, btn, field, option, optId } from '../../utils/automation'

const SCENARIOS = ['success', '404', '401', '403', '500', '503', 'timeout', 'rate_limit']

export default function ApiSimPage() {
  const [scenario, setScenario] = useState('success')
  const [delay, setDelay] = useState(800)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [offline, setOffline] = useState(getMockOffline())
  const [useRetry, setUseRetry] = useState(false)

  const run = async () => {
    setLoading(true); setResult(null); setError(null)
    try {
      const fn = useRetry ? mockRequestWithRetry : mockRequest
      const res = await fn({ scenario, delay: Number(delay) })
      setResult(res)
    } catch (e) {
      setError({ message: e.message, status: e.status, code: e.code, retryAfter: e.retryAfter })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer pageId="api-sim-page">
      <PageHeader pageId="api-sim" title="API Simulation" subtitle="Mock delay, 401/403/404/500/503, timeout, rate limit, offline, retry" breadcrumbs={['API Simulation']} />
      <Paper sx={{ p: 3 }} {...aid('api-sim-panel')}>
        <Stack spacing={2} maxWidth={520}>
          <TextField select label="Scenario" value={scenario} onChange={(e) => setScenario(e.target.value)} {...field('api-sim-scenario', 'scenario')}>
            {SCENARIOS.map((s) => <MenuItem key={s} value={s} {...option(optId('api-sim-scenario', s))}>{s}</MenuItem>)}
          </TextField>
          <TextField type="number" label="Delay (ms)" value={delay} onChange={(e) => setDelay(e.target.value)} {...field('api-sim-delay', 'delay')} />
          <Stack direction="row" spacing={1}>
            <Button variant={offline ? 'contained' : 'outlined'} color="warning" {...btn('api-sim-btn-offline')} onClick={() => { const v = !offline; setOffline(v); setMockOffline(v) }}>
              {offline ? 'Offline ON' : 'Go Offline'}
            </Button>
            <Button variant={useRetry ? 'contained' : 'outlined'} {...btn('api-sim-btn-retry-toggle')} onClick={() => setUseRetry(!useRetry)}>
              Retry {useRetry ? 'ON' : 'OFF'}
            </Button>
            <Button variant="contained" disabled={loading} {...btn('api-sim-btn-send')} onClick={run}>{loading ? 'Calling…' : 'Send Request'}</Button>
          </Stack>
          {loading && <Chip label="Request in flight" color="info" {...aid('api-sim-loading')} />}
          {result && <Alert severity="success" {...aid('api-sim-success')}><pre style={{ margin: 0 }}>{JSON.stringify(result, null, 2)}</pre></Alert>}
          {error && <Alert severity="error" {...aid('api-sim-error')}><pre style={{ margin: 0 }}>{JSON.stringify(error, null, 2)}</pre></Alert>}
        </Stack>
      </Paper>
    </PageContainer>
  )
}
