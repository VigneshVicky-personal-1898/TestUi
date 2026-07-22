// AI-ASSISTED: Cursor
// PROMPT: Browser APIs: clipboard, notification, geo, camera, mic, fullscreen, permissions
// ACCEPTED-BY: vignesh

import { useState } from 'react'
import { Box, Paper, Button, Stack, Typography, Alert, Grid } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn } from '../../utils/automation'

export default function BrowserApisPage() {
  const [log, setLog] = useState('')
  const [perm, setPerm] = useState({})

  const copy = async () => {
    await navigator.clipboard.writeText('TestUi clipboard sample ' + Date.now())
    setLog('Copied to clipboard')
  }
  const readClip = async () => {
    try { setLog('Clipboard: ' + await navigator.clipboard.readText()) } catch (e) { setLog('Clipboard read denied: ' + e.message) }
  }
  const notify = async () => {
    if (Notification.permission !== 'granted') {
      const p = await Notification.requestPermission()
      setPerm((x) => ({ ...x, notification: p }))
      if (p !== 'granted') { setLog('Notification permission: ' + p); return }
    }
    new Notification('TestUi', { body: 'Mock push notification for automation' })
    setLog('Notification fired')
  }
  const geo = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLog(`Lat ${pos.coords.latitude}, Lng ${pos.coords.longitude}`),
      (err) => setLog('Geo error: ' + err.message),
    )
  }
  const cam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach((t) => t.stop())
      setLog('Camera permission granted (stream stopped)')
      setPerm((x) => ({ ...x, camera: 'granted' }))
    } catch (e) { setLog('Camera: ' + e.message); setPerm((x) => ({ ...x, camera: 'denied' })) }
  }
  const mic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((t) => t.stop())
      setLog('Microphone permission granted')
      setPerm((x) => ({ ...x, microphone: 'granted' }))
    } catch (e) { setLog('Mic: ' + e.message) }
  }
  const full = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
    else await document.exitFullscreen()
    setLog('Fullscreen toggled')
  }
  const capture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      stream.getTracks().forEach((t) => t.stop())
      setLog('Screen capture permission granted')
    } catch (e) { setLog('Screen capture: ' + e.message) }
  }

  return (
    <PageContainer pageId="browser-apis-page">
      <PageHeader pageId="browser-apis" title="Browser APIs" subtitle="Clipboard, Notification, Geolocation, Camera, Mic, Fullscreen, Screen Capture" breadcrumbs={['Browser APIs']} />
      {log && <Alert sx={{ mb: 2 }} {...aid('browser-apis-log')}>{log}</Alert>}
      <Grid container spacing={2}>
        {[
          ['browser-apis-btn-clipboard-write', 'Clipboard Write', copy],
          ['browser-apis-btn-clipboard-read', 'Clipboard Read', readClip],
          ['browser-apis-btn-notify', 'Notification API', notify],
          ['browser-apis-btn-geo', 'Geolocation', geo],
          ['browser-apis-btn-camera', 'Camera Permission', cam],
          ['browser-apis-btn-mic', 'Microphone', mic],
          ['browser-apis-btn-fullscreen', 'Fullscreen', full],
          ['browser-apis-btn-capture', 'Screen Capture', capture],
        ].map(([id, label, fn]) => (
          <Grid key={id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, height: '100%' }} {...aid(id + '-card')}>
              <Typography variant="subtitle2" gutterBottom>{label}</Typography>
              <Button fullWidth variant="outlined" {...btn(id)} onClick={fn}>Run</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Typography sx={{ mt: 2 }} variant="body2" {...aid('browser-apis-perm')}>Permissions: {JSON.stringify(perm)}</Typography>
    </PageContainer>
  )
}
