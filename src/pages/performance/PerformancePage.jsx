// AI-ASSISTED: Cursor
// PROMPT: Performance: 10k rows, lazy load, infinite scroll, network/CPU delay simulation
// ACCEPTED-BY: vignesh

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { Box, Paper, Typography, Button, Slider, List, ListItem, ListItemText, CircularProgress, Stack } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn } from '../../utils/automation'

export default function PerformancePage() {
  const big = useMemo(() => Array.from({ length: 10000 }, (_, i) => ({ id: i+1, label: `Perf row #${i+1}` })), [])
  const [visible, setVisible] = useState(50)
  const [delay, setDelay] = useState(0)
  const [cpuBusy, setCpuBusy] = useState(false)
  const [pending, startTransition] = useTransition()
  const [items, setItems] = useState(big.slice(0, 50))
  const sentinel = useRef(null)

  useEffect(() => {
    const el = sentinel.current
    if (!el) return undefined
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startTransition(() => {
          setVisible((v) => {
            const next = Math.min(v + 50, 10000)
            setTimeout(() => setItems(big.slice(0, next)), delay)
            return next
          })
        })
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [big, delay])

  const burnCpu = () => {
    setCpuBusy(true)
    setTimeout(() => {
      const start = performance.now()
      while (performance.now() - start < 800) { /* busy wait */ }
      setCpuBusy(false)
    }, 10)
  }

  const leakSim = () => {
    window.__testuiLeak = window.__testuiLeak || []
    window.__testuiLeak.push(new Array(100000).fill('leak'))
  }

  return (
    <PageContainer pageId="performance-page">
      <PageHeader pageId="performance" title="Performance Lab" subtitle="10000 rows, lazy/infinite load, network delay, CPU delay, memory leak sim" breadcrumbs={['Performance']} />
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} alignItems="center">
        <Typography>Load delay ms: {delay}</Typography>
        <Slider sx={{ width: 200 }} min={0} max={2000} step={100} value={delay} onChange={(_,v)=>setDelay(v)} {...aid('perf-delay-slider')} />
        <Button {...btn('perf-btn-cpu')} onClick={burnCpu}>CPU Delay</Button>
        <Button color="warning" {...btn('perf-btn-leak')} onClick={leakSim}>Memory Leak Sim</Button>
        {(pending || cpuBusy) && <CircularProgress size={20} {...aid('perf-loading')} />}
      </Stack>
      <Paper sx={{ height: 360, overflow: 'auto' }} {...aid('perf-list-container')}>
        <List dense>
          {items.map(r => <ListItem key={r.id} {...aid(`perf-row-${r.id}`)}><ListItemText primary={r.label} /></ListItem>)}
        </List>
        <Box ref={sentinel} sx={{ py: 2, textAlign: 'center' }} {...aid('perf-sentinel')}>
          Showing {visible} / 10000
        </Box>
      </Paper>
    </PageContainer>
  )
}
