// AI-ASSISTED: Cursor
// PROMPT: Advanced auth: SSO, OAuth, JWT, lock, biometric, concurrent login
// ACCEPTED-BY: vignesh

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Paper, Grid, Typography, Button, TextField, Stack, Alert, Chip, Switch,
  FormControlLabel, LinearProgress, Divider, List, ListItem, ListItemText, Slider,
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import MicrosoftIcon from '@mui/icons-material/Microsoft'
import FingerprintIcon from '@mui/icons-material/Fingerprint'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import DevicesIcon from '@mui/icons-material/Devices'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn, field } from '../../utils/automation'
import { logout } from '../../store'

const POLICY = { minLength: 10, requireUpper: true, requireNumber: true, requireSpecial: true }

function scorePassword(pw) {
  let s = 0
  if (pw.length >= POLICY.minLength) s += 25
  if (/[A-Z]/.test(pw)) s += 25
  if (/[0-9]/.test(pw)) s += 25
  if (/[^A-Za-z0-9]/.test(pw)) s += 25
  return s
}

export default function AuthAdvancedPage() {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.user)
  const [jwtExpiry, setJwtExpiry] = useState(Date.now() + 45000)
  const [refreshToken, setRefreshToken] = useState('rt_' + Date.now())
  const [accessToken, setAccessToken] = useState('at_' + Date.now())
  const [rememberDevice, setRememberDevice] = useState(localStorage.getItem('testui_device') === '1')
  const [deviceAuthCode, setDeviceAuthCode] = useState('')
  const [deviceApproved, setDeviceApproved] = useState(false)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState(null)
  const [policyPw, setPolicyPw] = useState('')
  const [sessions, setSessions] = useState([
    { id: 's1', device: 'Chrome / Linux', ip: '10.0.0.12', current: true },
    { id: 's2', device: 'Mobile Safari / iOS', ip: '10.0.0.44', current: false },
  ])
  const [oauthLog, setOauthLog] = useState('')
  const [bioStatus, setBioStatus] = useState('idle')
  const remaining = Math.max(0, Math.ceil((jwtExpiry - Date.now()) / 1000))
  const locked = lockedUntil && Date.now() < lockedUntil
  const strength = scorePassword(policyPw)

  useEffect(() => {
    const id = setInterval(() => setJwtExpiry((e) => e), 500)
    return () => clearInterval(id)
  }, [])

  const refreshAccessToken = () => {
    setAccessToken('at_' + Date.now())
    setRefreshToken('rt_' + Date.now())
    setJwtExpiry(Date.now() + 45000)
    setOauthLog('Access token refreshed via refresh token')
  }

  const simulateFail = () => {
    if (locked) return
    const next = failedAttempts + 1
    setFailedAttempts(next)
    if (next >= 3) {
      setLockedUntil(Date.now() + 30000)
      setOauthLog('Account locked for 30s after 3 failed attempts')
    }
  }

  const approveDevice = () => {
    if (deviceAuthCode === 'DEVICE-OK') {
      setDeviceApproved(true)
      setOauthLog('Device authorized')
    } else setOauthLog('Invalid device code. Use DEVICE-OK')
  }

  const toggleRemember = (v) => {
    setRememberDevice(v)
    localStorage.setItem('testui_device', v ? '1' : '0')
  }

  const forceLogoutOthers = () => {
    setSessions((s) => s.filter((x) => x.current))
    setOauthLog('Force logout: other sessions terminated')
  }

  return (
    <PageContainer pageId="auth-advanced-page">
      <PageHeader pageId="auth-advanced" title="Advanced Authentication" subtitle="SSO, OAuth, JWT, refresh token, lockout, biometric, concurrent sessions" breadcrumbs={['Auth Advanced']} />
      {oauthLog && <Alert sx={{ mb: 2 }} onClose={() => setOauthLog('')} {...aid('auth-adv-log')}>{oauthLog}</Alert>}
      {locked && <Alert severity="error" sx={{ mb: 2 }} {...aid('auth-adv-lockout')}>Account locked until {new Date(lockedUntil).toLocaleTimeString()}</Alert>}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }} {...aid('auth-adv-sso')}>
            <Typography variant="h6" gutterBottom>SSO / OAuth</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Button startIcon={<GoogleIcon />} variant="outlined" {...btn('auth-adv-btn-sso-google')} onClick={() => setOauthLog('SSO Google mock login started (OAuth redirect simulated)')}>Google SSO</Button>
              <Button startIcon={<MicrosoftIcon />} variant="outlined" {...btn('auth-adv-btn-sso-microsoft')} onClick={() => setOauthLog('SSO Microsoft mock login started')}>Microsoft SSO</Button>
              <Button variant="contained" {...btn('auth-adv-btn-oauth')} onClick={() => setOauthLog('OAuth authorization code flow simulated')}>OAuth Authorize</Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }} {...aid('auth-adv-jwt')}>
            <Typography variant="h6" gutterBottom>JWT / Refresh Token</Typography>
            <Typography variant="body2" {...aid('auth-adv-access-token')}>Access: {accessToken}</Typography>
            <Typography variant="body2" {...aid('auth-adv-refresh-token')}>Refresh: {refreshToken}</Typography>
            <Typography variant="body2" color={remaining < 10 ? 'error' : 'text.secondary'} {...aid('auth-adv-jwt-expiry')}>
              Expires in: {remaining}s {remaining === 0 ? '(EXPIRED)' : ''}
            </Typography>
            <LinearProgress variant="determinate" value={Math.min(100, (remaining / 45) * 100)} sx={{ my: 1 }} {...aid('auth-adv-jwt-progress')} />
            <Button {...btn('auth-adv-btn-refresh-token')} onClick={refreshAccessToken} disabled={locked}>Refresh Token</Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }} {...aid('auth-adv-device')}>
            <Typography variant="h6" gutterBottom>Device Auth / Remember Device</Typography>
            <FormControlLabel control={<Switch checked={rememberDevice} onChange={(e) => toggleRemember(e.target.checked)} {...aid('auth-adv-remember-device')} />} label="Remember this device" />
            <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
              <TextField size="small" label="Device code" value={deviceAuthCode} onChange={(e) => setDeviceAuthCode(e.target.value)} {...field('auth-adv-device-code', 'deviceCode')} />
              <Button {...btn('auth-adv-btn-device-approve')} onClick={approveDevice}>Authorize</Button>
            </Stack>
            <Chip sx={{ mt: 1 }} color={deviceApproved ? 'success' : 'default'} label={deviceApproved ? 'Device trusted' : 'Device not trusted'} {...aid('auth-adv-device-status')} />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }} {...aid('auth-adv-lock')}>
            <Typography variant="h6" gutterBottom>Account Lock / Password Policy</Typography>
            <Typography variant="body2">Failed attempts: {failedAttempts}/3</Typography>
            <Button sx={{ mt: 1, mr: 1 }} color="error" {...btn('auth-adv-btn-fail-login')} onClick={simulateFail} disabled={locked}>Simulate Failed Login</Button>
            <Button {...btn('auth-adv-btn-reset-attempts')} onClick={() => { setFailedAttempts(0); setLockedUntil(null) }}>Reset Attempts</Button>
            <Divider sx={{ my: 2 }} />
            <TextField fullWidth type="password" label="New password (policy check)" value={policyPw} onChange={(e) => setPolicyPw(e.target.value)} {...field('auth-adv-password-policy', 'policyPassword')} />
            <LinearProgress sx={{ mt: 1 }} variant="determinate" value={strength} color={strength < 75 ? 'warning' : 'success'} {...aid('auth-adv-password-strength')} />
            <Typography variant="caption">Min 10, upper, number, special — strength {strength}%</Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }} {...aid('auth-adv-sessions')}>
            <Typography variant="h6" gutterBottom><DevicesIcon fontSize="small" /> Concurrent Sessions</Typography>
            <List dense>
              {sessions.map((s) => (
                <ListItem key={s.id} {...aid(`auth-adv-session-${s.id}`)} secondaryAction={s.current ? <Chip size="small" label="Current" color="primary" /> : null}>
                  <ListItemText primary={s.device} secondary={s.ip} />
                </ListItem>
              ))}
            </List>
            <Button startIcon={<LogoutIcon />} {...btn('auth-adv-btn-force-logout')} onClick={forceLogoutOthers}>Force Logout Other Devices</Button>
            <Button sx={{ ml: 1 }} color="error" {...btn('auth-adv-btn-logout-all')} onClick={() => dispatch(logout())}>Logout Everywhere</Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 2 }} {...aid('auth-adv-biometric')}>
            <Typography variant="h6" gutterBottom>Biometric Login UI</Typography>
            <Button startIcon={<FingerprintIcon />} variant="contained" {...btn('auth-adv-btn-biometric')} onClick={() => {
              setBioStatus('scanning')
              setTimeout(() => setBioStatus('success'), 1200)
            }}>Scan Fingerprint</Button>
            <Typography sx={{ mt: 1 }} {...aid('auth-adv-biometric-status')}>Status: {bioStatus}</Typography>
            {bioStatus === 'scanning' && <LinearProgress sx={{ mt: 1 }} {...aid('auth-adv-biometric-progress')} />}
          </Paper>
        </Grid>
      </Grid>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>Logged in as {user?.email}</Typography>
    </PageContainer>
  )
}
