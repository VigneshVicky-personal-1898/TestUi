// AI-ASSISTED: Cursor
// PROMPT: Live dashboard with websocket metrics, widget drag/drop, resize, save layout
// ACCEPTED-BY: vignesh

import { useEffect, useState, useCallback } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Box, Paper, Typography, Button, Grid, Stack, Chip, Slider } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { subscribeMockWs } from '../../utils/mockWs'
import { aid, btn } from '../../utils/automation'

const DEFAULT = [
  { id: 'w-revenue', title: 'Revenue', key: 'revenue', w: 4 },
  { id: 'w-orders', title: 'Orders', key: 'orders', w: 4 },
  { id: 'w-users', title: 'Users', key: 'users', w: 4 },
  { id: 'w-conversion', title: 'Conversion %', key: 'conversion', w: 6 },
]

function Widget({ item, metrics, index, move, onResize }) {
  const ref = useCallback((node) => {}, [])
  const [, drop] = useDrop({
    accept: 'WIDGET',
    hover(drag) { if (drag.index !== index) { move(drag.index, index); drag.index = index } },
  })
  const [{ isDragging }, drag] = useDrag({ type: 'WIDGET', item: { id: item.id, index }, collect: (m) => ({ isDragging: m.isDragging() }) })
  return (
    <Grid size={{ xs: 12, md: item.w }} ref={(n) => drag(drop(n))} sx={{ opacity: isDragging ? 0.4 : 1 }}>
      <Paper sx={{ p: 2, cursor: 'grab', height: '100%' }} {...aid(`dash-live-widget-${item.id}`)}>
        <Typography variant="overline">{item.title}</Typography>
        <Typography variant="h4" {...aid(`dash-live-value-${item.key}`)}>{metrics[item.key] ?? '—'}</Typography>
        <Typography variant="caption">Drag to reorder · Resize width</Typography>
        <Slider size="small" min={3} max={12} step={1} value={item.w} onChange={(_, v) => onResize(item.id, v)} {...aid(`dash-live-resize-${item.id}`)} />
      </Paper>
    </Grid>
  )
}

export default function DashboardLivePage() {
  const [metrics, setMetrics] = useState({ revenue: 0, orders: 0, users: 0, conversion: 0 })
  const [widgets, setWidgets] = useState(() => {
    try { return JSON.parse(localStorage.getItem('testui_dash_layout') || 'null') || DEFAULT } catch { return DEFAULT }
  })
  const [live, setLive] = useState(true)
  const [lastTs, setLastTs] = useState('')

  useEffect(() => {
    if (!live) return undefined
    return subscribeMockWs((msg) => {
      if (msg.type === 'metric') {
        setMetrics(msg.metrics)
        setLastTs(msg.ts)
      }
    })
  }, [live])

  const move = (from, to) => setWidgets((prev) => {
    const next = [...prev]; const [r] = next.splice(from, 1); next.splice(to, 0, r); return next
  })
  const onResize = (id, w) => setWidgets((prev) => prev.map((x) => x.id === id ? { ...x, w } : x))
  const save = () => { localStorage.setItem('testui_dash_layout', JSON.stringify(widgets)) }
  const reset = () => { setWidgets(DEFAULT); localStorage.removeItem('testui_dash_layout') }

  return (
    <DndProvider backend={HTML5Backend}>
      <PageContainer pageId="dashboard-live-page">
        <PageHeader pageId="dashboard-live" title="Live Dashboard" subtitle="Realtime websocket metrics, widget drag-drop, resize, save layout"
          breadcrumbs={['Live Dashboard']}
          actions={<>
            <Chip label={live ? 'LIVE' : 'PAUSED'} color={live ? 'success' : 'default'} {...aid('dash-live-status')} />
            <Button {...btn('dash-live-btn-toggle')} onClick={() => setLive(!live)}>{live ? 'Pause' : 'Resume'}</Button>
            <Button variant="contained" {...btn('dash-live-btn-save')} onClick={save}>Save Layout</Button>
            <Button {...btn('dash-live-btn-reset')} onClick={reset}>Reset</Button>
          </>}
        />
        <Typography variant="caption" {...aid('dash-live-timestamp')}>Last update: {lastTs || 'waiting…'}</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }} {...aid('dash-live-grid')}>
          {widgets.map((w, i) => (
            <Widget key={w.id} item={w} metrics={metrics} index={i} move={move} onResize={onResize} />
          ))}
        </Grid>
      </PageContainer>
    </DndProvider>
  )
}
