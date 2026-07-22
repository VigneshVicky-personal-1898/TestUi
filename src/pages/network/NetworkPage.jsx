// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Paper, Button, Stack, Typography, Slider, Switch, FormControlLabel,
  Skeleton, Alert, CircularProgress, Card, CardContent, Grid,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { PageHeader } from '../../components/common/PageHeader'
import { setNetworkDelay, setOffline, setLoading } from '../../store'
import { aid, btn, control, dyn } from '../../utils/automation'

export default function NetworkPage() {
  const dispatch = useDispatch()
  const { networkDelay, offline, loading } = useSelector((s) => s.ui)
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  const fetchData = async (shouldFail = false) => {
    setError(false)
    dispatch(setLoading(true))
    setData(null)
    try {
      await new Promise((r) => setTimeout(r, networkDelay || 1000))
      if (offline) throw new Error('Offline')
      if (shouldFail || (attempt === 0 && Math.random() > 0.7)) {
        throw new Error('Network request failed')
      }
      setData([
        { id: 1, name: 'Alpha Metric', value: 42 },
        { id: 2, name: 'Beta Metric', value: 87 },
        { id: 3, name: 'Gamma Metric', value: 15 },
      ])
      setAttempt((a) => a + 1)
    } catch {
      setError(true)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <Box {...aid('network-page')}>
      <PageHeader
        pageId="network"
        title="Network Simulation"
        subtitle="Loading screen, skeleton loader, retry button, offline banner"
        breadcrumbs={['Network Sim']}
      />

      <Paper sx={{ p: 3, mb: 2 }} {...aid('network-controls')}>
        <Typography gutterBottom>Simulated Network Delay: {networkDelay}ms</Typography>
        <Slider
          value={networkDelay}
          onChange={(_, v) => dispatch(setNetworkDelay(v))}
          min={0}
          max={5000}
          step={100}
          valueLabelDisplay="auto"
          {...aid('network-delay-slider')}
          sx={{ maxWidth: 400, mb: 2 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={offline}
              onChange={(e) => dispatch(setOffline(e.target.checked))}
              {...control('offline-toggle', 'offline-toggle', 'Simulate offline mode')}
            />
          }
          label="Simulate Offline Mode (shows banner)"
        />
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button variant="contained" onClick={() => fetchData(false)} {...btn('network-fetch')}>
            Fetch Data
          </Button>
          <Button variant="outlined" color="error" onClick={() => fetchData(true)} {...btn('network-fetch-fail')}>
            Force Fail
          </Button>
        </Stack>
      </Paper>

      {loading && (
        <Box {...aid('loading-screen')} sx={{ textAlign: 'center', py: 4 }}>
          <CircularProgress {...aid('loading-spinner')} />
          <Typography sx={{ mt: 1 }}>Loading... ({networkDelay || 1000}ms delay)</Typography>
        </Box>
      )}

      {loading && (
        <Grid container spacing={2} {...aid('skeleton-loader')} sx={{ mb: 2 }}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" {...aid(dyn('skeleton-title', i))} />
                  <Skeleton variant="rectangular" height={80} sx={{ my: 1 }} />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {error && !loading && (
        <Alert
          severity="error"
          {...aid('network-alert-error')}
          action={
            <Button color="inherit" startIcon={<RefreshIcon />} onClick={() => fetchData(false)} {...btn('network-btn-retry')}>
              Retry
            </Button>
          }
        >
          Request failed. Click Retry to try again.
        </Alert>
      )}

      {data && !loading && (
        <Grid container spacing={2} {...aid('network-data')}>
          {data.map((d) => (
            <Grid key={d.id} size={{ xs: 12, md: 4 }}>
              <Card {...aid(dyn('metric-card', d.id))}>
                <CardContent>
                  <Typography variant="h6">{d.name}</Typography>
                  <Typography variant="h3">{d.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
}
