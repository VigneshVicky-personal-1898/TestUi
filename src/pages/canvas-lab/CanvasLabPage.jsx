// AI-ASSISTED: Cursor
// PROMPT: Canvas lab: signature, paint, annotation tools
// ACCEPTED-BY: vignesh

import { useEffect, useRef, useState } from 'react'
import { Box, Paper, Button, Stack, Slider, Typography } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn } from '../../utils/automation'

export default function CanvasLabPage() {
  const ref = useRef(null)
  const [color, setColor] = useState('#0d47a1')
  const [size, setSize] = useState(3)
  const [mode, setMode] = useState('draw')

  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    let drawing = false
    const pos = (e) => ({ x: e.offsetX, y: e.offsetY })
    const down = (e) => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y) }
    const move = (e) => {
      if (!drawing) return
      const p = pos(e)
      ctx.strokeStyle = mode === 'erase' ? '#ffffff' : color
      ctx.lineWidth = mode === 'erase' ? size * 4 : size
      ctx.lineCap = 'round'
      ctx.lineTo(p.x, p.y); ctx.stroke()
    }
    const up = () => { drawing = false }
    c.addEventListener('mousedown', down); c.addEventListener('mousemove', move); c.addEventListener('mouseup', up); c.addEventListener('mouseleave', up)
    return () => { c.removeEventListener('mousedown', down); c.removeEventListener('mousemove', move); c.removeEventListener('mouseup', up); c.removeEventListener('mouseleave', up) }
  }, [color, size, mode])

  const download = () => {
    const a = document.createElement('a'); a.href = ref.current.toDataURL('image/png'); a.download = 'canvas-annotation.png'; a.click()
  }

  return (
    <PageContainer pageId="canvas-lab-page">
      <PageHeader pageId="canvas-lab" title="Canvas Lab" subtitle="Signature, paint, annotation, export PNG" breadcrumbs={['Canvas']} />
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} alignItems="center">
        <Button variant={mode==='draw'?'contained':'outlined'} {...btn('canvas-btn-draw')} onClick={()=>setMode('draw')}>Draw</Button>
        <Button variant={mode==='erase'?'contained':'outlined'} {...btn('canvas-btn-erase')} onClick={()=>setMode('erase')}>Erase</Button>
        <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} id="canvas-color" data-testid="canvas-color" />
        <Typography variant="caption">Size</Typography>
        <Slider sx={{ width: 120 }} min={1} max={20} value={size} onChange={(_,v)=>setSize(v)} {...aid('canvas-size-slider')} />
        <Button {...btn('canvas-btn-clear')} onClick={()=>{ const c=ref.current; c.getContext('2d').clearRect(0,0,c.width,c.height) }}>Clear</Button>
        <Button variant="contained" {...btn('canvas-btn-download')} onClick={download}>Download PNG</Button>
      </Stack>
      <Paper sx={{ p: 1, display: 'inline-block' }} {...aid('canvas-lab-paper')}>
        <canvas ref={ref} width={720} height={360} id="canvas-lab-surface" data-testid="canvas-lab-surface" style={{ border: '1px solid #ccc', touchAction: 'none', background: '#fff' }} />
      </Paper>
    </PageContainer>
  )
}
