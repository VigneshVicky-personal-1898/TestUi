// AI-ASSISTED: Cursor
// PROMPT: Charts gallery: bar pie donut line area radar scatter gauge + export
// ACCEPTED-BY: vignesh

import { Box, Paper, Grid, Typography, Button, Stack } from '@mui/material'
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { CHART_SALES } from '../../data/mockData'
import { aid, btn } from '../../utils/automation'

const COLORS = ['#0d47a1', '#00838f', '#2e7d32', '#ed6c02', '#9c27b0']
const pie = [{ name: 'A', value: 40 }, { name: 'B', value: 25 }, { name: 'C', value: 20 }, { name: 'D', value: 15 }]
const radar = [{ subject: 'Sales', A: 120 }, { subject: 'Marketing', A: 98 }, { subject: 'Dev', A: 86 }, { subject: 'Support', A: 99 }, { subject: 'Ops', A: 85 }]
const scatter = CHART_SALES.map((d) => ({ x: d.orders, y: d.sales }))

export default function ChartsGalleryPage() {
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(CHART_SALES, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'chart-data.json'; a.click()
  }
  return (
    <PageContainer pageId="charts-gallery-page">
      <PageHeader pageId="charts-gallery" title="Charts Gallery" subtitle="Bar, Pie, Donut, Line, Area, Radar, Scatter, Gauge — tooltip/legend/export"
        breadcrumbs={['Charts']} actions={<Button {...btn('charts-btn-export')} onClick={exportJson}>Export Chart Data</Button>} />
      <Grid container spacing={2}>
        {[
          ['bar', <BarChart data={CHART_SALES}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="sales" fill="#0d47a1" /></BarChart>],
          ['line', <LineChart data={CHART_SALES}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line dataKey="orders" stroke="#00838f" /></LineChart>],
          ['area', <AreaChart data={CHART_SALES}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="users" stroke="#2e7d32" fill="#a5d6a7" /></AreaChart>],
          ['pie', <PieChart><Pie data={pie} dataKey="value" nameKey="name" outerRadius={80} label>{pie.map((_,i)=><Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart>],
          ['donut', <PieChart><Pie data={pie} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80}>{pie.map((_,i)=><Cell key={i} fill={COLORS[i]} />)}</Pie><Tooltip /><Legend /></PieChart>],
          ['radar', <RadarChart data={radar}><PolarGrid /><PolarAngleAxis dataKey="subject" /><PolarRadiusAxis /><Radar dataKey="A" stroke="#0d47a1" fill="#0d47a1" fillOpacity={0.4} /><Tooltip /></RadarChart>],
          ['scatter', <ScatterChart><CartesianGrid /><XAxis dataKey="x" name="orders" /><YAxis dataKey="y" name="sales" /><Tooltip /><Scatter data={scatter} fill="#9c27b0" /></ScatterChart>],
        ].map(([name, chart]) => (
          <Grid key={name} size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, height: 300 }} {...aid(`charts-${name}-card`)}>
              <Typography variant="subtitle1" gutterBottom>{name.toUpperCase()}</Typography>
              <Box sx={{ height: 230 }} {...aid(`charts-${name}`)}><ResponsiveContainer width="100%" height="100%">{chart}</ResponsiveContainer></Box>
            </Paper>
          </Grid>
        ))}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2, height: 300 }} {...aid('charts-gauge-card')}>
            <Typography variant="subtitle1">GAUGE</Typography>
            <Box sx={{ height: 230, display: 'grid', placeItems: 'center' }} {...aid('charts-gauge')}>
              <Box sx={{ width: 160, height: 80, borderRadius: '160px 160px 0 0', bgcolor: '#e3f2fd', position: 'relative', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', bottom: 0, left: '50%', width: 4, height: 70, bgcolor: '#0d47a1', transformOrigin: 'bottom', transform: 'translateX(-50%) rotate(35deg)' }} />
              </Box>
              <Typography variant="h5">72%</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </PageContainer>
  )
}
