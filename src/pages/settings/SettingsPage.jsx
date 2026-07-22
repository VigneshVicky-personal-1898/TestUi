// AI-ASSISTED: Cursor
// PROMPT: Migrate Settings interactive controls to automation helpers
// ACCEPTED-BY: vignesh
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Paper, Typography, TextField, Button, Stack, FormControl, InputLabel,
  Select, MenuItem, Divider, Alert, ToggleButtonGroup, ToggleButton,
  Switch, FormControlLabel, Slider,
} from '@mui/material'
import { PageHeader } from '../../components/common/PageHeader'
import { setThemeMode, setLanguage, updateProfile } from '../../store'
import { aid, btn, field, control, select, option, optId } from '../../utils/automation'

export default function SettingsPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { themeMode, language } = useSelector((s) => s.ui)
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', department: user?.department || '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [highContrast, setHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [autoSave, setAutoSave] = useState(true)

  const saveProfile = () => {
    dispatch(updateProfile(profile))
    setMsg('Profile updated')
    setTimeout(() => setMsg(''), 2500)
  }

  const changePassword = () => {
    setErr('')
    if (passwords.current !== 'Admin@123' && passwords.current.length < 6) {
      setErr('Current password is incorrect (demo hint: use your login password or any 6+ chars for non-admin)')
      return
    }
    if (passwords.next.length < 8) {
      setErr('New password must be at least 8 characters')
      return
    }
    if (passwords.next !== passwords.confirm) {
      setErr('Passwords do not match')
      return
    }
    setMsg('Password changed successfully (demo)')
    setPasswords({ current: '', next: '', confirm: '' })
    setTimeout(() => setMsg(''), 2500)
  }

  return (
    <Box {...aid('settings-page')}>
      <PageHeader pageId="settings" title="Settings" subtitle="Theme, language, profile, and password" breadcrumbs={['Settings']} />
      {msg && <Alert severity="success" sx={{ mb: 2 }} {...aid('settings-success')}>{msg}</Alert>}
      {err && <Alert severity="error" sx={{ mb: 2 }} {...aid('settings-error')}>{err}</Alert>}

      <Stack spacing={2}>
        <Paper sx={{ p: 3 }} {...aid('settings-appearance')}>
          <Typography variant="h6" gutterBottom>Appearance</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Theme Switch</Typography>
          <ToggleButtonGroup
            exclusive
            value={themeMode}
            onChange={(_, v) => v && dispatch(setThemeMode(v))}
            {...aid('theme-switch')}
          >
            <ToggleButton value="light" {...aid('theme-light')}>Light</ToggleButton>
            <ToggleButton value="dark" {...aid('theme-dark')}>Dark</ToggleButton>
          </ToggleButtonGroup>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1 }}>Language Switch</Typography>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel htmlFor="language-switch">Language</InputLabel>
            <Select
              label="Language"
              value={language}
              onChange={(e) => dispatch(setLanguage(e.target.value))}
              {...select('language-switch')}
            >
              <MenuItem value="en" {...option(optId('language-switch', 'en'))}>English</MenuItem>
              <MenuItem value="es" {...option(optId('language-switch', 'es'))}>Español</MenuItem>
              <MenuItem value="fr" {...option(optId('language-switch', 'fr'))}>Français</MenuItem>
            </Select>
          </FormControl>
        </Paper>

        <Paper sx={{ p: 3 }} {...aid('settings-accessibility')}>
          <Typography variant="h6" gutterBottom>Accessibility & Autosave</Typography>
          <FormControlLabel
            control={<Switch checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} {...control('settings-switch-contrast')} />}
            label="High Contrast preview"
          />
          <Typography variant="body2" sx={{ mt: 1 }}>Font size: {fontSize}%</Typography>
          <Slider min={80} max={160} value={fontSize} onChange={(_, v) => setFontSize(v)} {...aid('settings-font-slider')} sx={{ maxWidth: 320 }} />
          <FormControlLabel
            control={<Switch checked={autoSave} onChange={(e) => setAutoSave(e.target.checked)} {...control('settings-switch-autosave')} />}
            label="Auto Save"
          />
          <Typography variant="caption" display="block" color="text.secondary">
            Keyboard navigation: use Tab across settings controls. See Accessibility Lab for full a11y scenarios.
          </Typography>
        </Paper>

        <Paper sx={{ p: 3 }} {...aid('settings-profile')}>
          <Typography variant="h6" gutterBottom>Profile</Typography>
          <Stack spacing={2} maxWidth={420}>
            <TextField label="Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} {...field('profile-name', 'name')} />
            <TextField label="Email" value={user?.email || ''} disabled {...field('profile-email', 'email')} />
            <TextField label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} {...field('profile-phone', 'phone')} />
            <TextField label="Department" value={profile.department} onChange={(e) => setProfile({ ...profile, department: e.target.value })} {...field('profile-department', 'department')} />
            <Button variant="contained" onClick={saveProfile} {...btn('profile-save', 'Save Profile')}>Save Profile</Button>
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }} {...aid('settings-password')}>
          <Typography variant="h6" gutterBottom>Change Password</Typography>
          <Stack spacing={2} maxWidth={420}>
            <TextField type="password" label="Current Password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} {...field('password-current', 'current')} />
            <TextField type="password" label="New Password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} {...field('password-new', 'next')} />
            <TextField type="password" label="Confirm Password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} {...field('password-confirm', 'confirm')} />
            <Button variant="contained" onClick={changePassword} {...btn('password-save', 'Update Password')}>Update Password</Button>
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="caption" color="text.secondary">Role: {user?.role}</Typography>
        </Paper>
      </Stack>
    </Box>
  )
}
