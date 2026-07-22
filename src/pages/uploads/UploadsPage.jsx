// AI-ASSISTED: Cursor
// PROMPT: Advanced upload: multi, drag-drop, progress, cancel, resume, crop, compress
// ACCEPTED-BY: vignesh

import { useRef, useState } from 'react'
import { Box, Paper, Button, Typography, LinearProgress, Stack, List, ListItem, ListItemText, IconButton, Slider } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CancelIcon from '@mui/icons-material/Cancel'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn } from '../../utils/automation'

export default function UploadsPage() {
  const inputRef = useRef()
  const [files, setFiles] = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [cropScale, setCropScale] = useState(1)
  const [preview, setPreview] = useState(null)

  const addFiles = (list) => {
    const arr = Array.from(list || []).map((f) => ({
      id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name, size: f.size, progress: 0, status: 'queued', file: f, cancelled: false,
    }))
    setFiles((prev) => [...arr, ...prev])
    arr.forEach((item) => simulateUpload(item.id))
    const img = arr.find((a) => a.file.type.startsWith('image/'))
    if (img) setPreview(URL.createObjectURL(img.file))
  }

  const simulateUpload = (id) => {
    const tick = () => {
      setFiles((prev) => prev.map((f) => {
        if (f.id !== id || f.cancelled || f.status === 'done') return f
        const progress = Math.min(100, f.progress + 8 + Math.random() * 12)
        return { ...f, progress, status: progress >= 100 ? 'done' : 'uploading' }
      }))
      setFiles((prev) => {
        const f = prev.find((x) => x.id === id)
        if (f && !f.cancelled && f.progress < 100) setTimeout(tick, 250)
        return prev
      })
    }
    setTimeout(tick, 200)
  }

  const cancel = (id) => setFiles((prev) => prev.map((f) => f.id === id ? { ...f, cancelled: true, status: 'cancelled' } : f))
  const resume = (id) => setFiles((prev) => prev.map((f) => f.id === id ? { ...f, cancelled: false, status: 'uploading' } : f).map((f) => { if (f.id === id) setTimeout(() => simulateUpload(id), 0); return f }))

  const compressHint = preview ? Math.round(100 / cropScale) + '% estimated' : '—'

  return (
    <PageContainer pageId="uploads-page">
      <PageHeader pageId="uploads" title="Advanced Uploads" subtitle="Multiple, drag-drop, progress, cancel, resume, crop, compress" breadcrumbs={['Uploads']} />
      <Paper
        sx={{ p: 4, border: '2px dashed', borderColor: dragOver ? 'primary.main' : 'divider', textAlign: 'center', mb: 2 }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
        {...aid('uploads-dropzone')}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        <Typography>Drag & drop files here</Typography>
        <Button sx={{ mt: 1 }} variant="contained" component="label" startIcon={<CloudUploadIcon />} {...btn('uploads-btn-browse')}>
          Browse Multiple
          <input ref={inputRef} hidden multiple type="file" onChange={(e) => addFiles(e.target.files)} {...aid('uploads-input-file')} />
        </Button>
      </Paper>
      <List {...aid('uploads-list')}>
        {files.map((f) => (
          <ListItem key={f.id} {...aid(`uploads-item-${f.id}`)}
            secondaryAction={<>
              {f.status === 'uploading' && <IconButton {...btn(`uploads-btn-cancel-${f.id}`)} onClick={() => cancel(f.id)}><CancelIcon /></IconButton>}
              {f.status === 'cancelled' && <Button size="small" {...btn(`uploads-btn-resume-${f.id}`)} onClick={() => resume(f.id)}>Resume</Button>}
            </>}
          >
            <ListItemText primary={f.name} secondary={`${f.status} · ${(f.size/1024).toFixed(1)} KB · ${Math.round(f.progress)}%`} />
            <Box sx={{ width: 180, ml: 2 }}><LinearProgress variant="determinate" value={f.progress} {...aid(`uploads-progress-${f.id}`)} /></Box>
          </ListItem>
        ))}
      </List>
      {preview && (
        <Paper sx={{ p: 2, mt: 2 }} {...aid('uploads-crop-panel')}>
          <Typography variant="subtitle2">Image Crop / Compress (demo)</Typography>
          <Box component="img" src={preview} alt="crop" sx={{ maxWidth: 280, transform: `scale(${cropScale})`, transformOrigin: 'top left', display: 'block', my: 1 }} {...aid('uploads-crop-image')} />
          <Slider min={0.5} max={2} step={0.1} value={cropScale} onChange={(_, v) => setCropScale(v)} {...aid('uploads-crop-slider')} />
          <Typography variant="caption" {...aid('uploads-compress-hint')}>Compress estimate: {compressHint}</Typography>
        </Paper>
      )}
    </PageContainer>
  )
}
