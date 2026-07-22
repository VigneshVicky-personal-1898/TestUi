// AI-ASSISTED: Cursor
// PROMPT: Clean Soft UI auth shell matching muted teal theme
// ACCEPTED-BY: vignesh
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, TextField, Button, Typography, Alert, Link, Stack, useTheme,
} from '@mui/material'
import { verifyOtpThunk, verifyMfaThunk } from '../../store'
import { aid, btn, field } from '../../utils/automation'
import AutomationHelpPanel from '../../components/common/AutomationHelpPanel'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email')
      return
    }
    setError('')
    setSent(true)
  }

  return (
    <AuthShell title="Forgot Password" pageId="forgot-password">
      {sent ? (
        <Alert severity="success" {...aid('forgot-password-alert-sent')}>
          Password reset link sent to {email}. (Demo: no email is actually sent.)
        </Alert>
      ) : (
        <Box
          component="form"
          name="forgot-password-form"
          onSubmit={handleSubmit}
          {...aid('forgot-password-form')}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} {...aid('forgot-password-alert-error')}>
              {error}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            {...field('forgot-password-email', 'email')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            {...btn('forgot-password-btn-submit', 'Send reset link')}
          >
            Send Reset Link
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/login" {...aid('forgot-password-link-login')}>
          Back to Login
        </Link>
      </Box>
    </AuthShell>
  )
}

export function OtpPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    if (value && index < 5) {
      document.getElementById(dyn('otp-digit', index + 1))?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Enter all 6 digits')
      return
    }
    setLoading(true)
    setError('')
    try {
      await dispatch(verifyOtpThunk({ otp: code })).unwrap()
      navigate('/dashboard')
    } catch (err) {
      setError(err || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="OTP Verification"
      subtitle="Enter the 6-digit code (demo: 123456)"
      pageId="otp"
    >
      {error && <Alert severity="error" sx={{ mb: 2 }} {...aid('otp-alert-error')}>{error}</Alert>}
      <Box component="form" name="otp-form" onSubmit={handleSubmit} {...aid('otp-form')}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 3, justifyContent: 'center' }}
          {...aid('otp-digits')}
        >
          {otp.map((digit, i) => {
            const digitId = dyn('otp-digit', i)
            return (
              <TextField
                key={digitId}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                {...field(digitId, `otpDigit${i}`)}
                slotProps={{
                  htmlInput: {
                    id: digitId,
                    name: `otpDigit${i}`,
                    'data-testid': digitId,
                    maxLength: 1,
                    inputMode: 'numeric',
                    style: { textAlign: 'center', fontSize: 24, width: 24 },
                  },
                }}
              />
            )
          })}
        </Stack>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          {...btn('otp-btn-submit', 'Verify OTP')}
        >
          Verify OTP
        </Button>
      </Box>
      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        sx={{ mt: 2 }}
        color="text.secondary"
        {...aid('otp-hint')}
      >
        Triggered for employee@testui.com login
      </Typography>
    </AuthShell>
  )
}

export function MfaPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await dispatch(verifyMfaThunk({ code })).unwrap()
      navigate('/dashboard')
    } catch (err) {
      setError(err || 'Invalid MFA code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Multi-Factor Authentication"
      subtitle="Enter authenticator code (demo: 654321)"
      pageId="mfa"
    >
      {error && <Alert severity="error" sx={{ mb: 2 }} {...aid('mfa-alert-error')}>{error}</Alert>}
      <Box component="form" name="mfa-form" onSubmit={handleSubmit} {...aid('mfa-form')}>
        <TextField
          fullWidth
          label="MFA Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          margin="normal"
          {...field('mfa-code', 'mfaCode')}
          slotProps={{
            htmlInput: {
              id: 'mfa-code',
              name: 'mfaCode',
              'data-testid': 'mfa-code',
              maxLength: 6,
              inputMode: 'numeric',
            },
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 2 }}
          {...btn('mfa-btn-submit', 'Verify MFA')}
        >
          Verify MFA
        </Button>
      </Box>
      <Typography
        variant="caption"
        display="block"
        textAlign="center"
        sx={{ mt: 2 }}
        color="text.secondary"
        {...aid('mfa-hint')}
      >
        Triggered for manager@testui.com login
      </Typography>
    </AuthShell>
  )
}

function AuthShell({ title, subtitle, children, pageId }) {
  const theme = useTheme()
  const raised = theme.customShadows?.neuRaised

  return (
    <Box
      {...aid(`${pageId}-page`)}
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 720 }}>
        <Card
          sx={{
            width: '100%',
            maxWidth: 420,
            mx: 'auto',
            boxShadow: raised,
            borderRadius: 3,
            bgcolor: 'background.default',
          }}
          elevation={0}
          {...aid(`${pageId}-card`)}
        >
          <CardContent sx={{ p: { xs: 3, sm: 3.5 } }}>
            <Typography
              variant="h5"
              fontWeight={700}
              gutterBottom
              textAlign="center"
              {...aid(`${pageId}-title`)}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 2 }}
                {...aid(`${pageId}-subtitle`)}
              >
                {subtitle}
              </Typography>
            )}
            {children}
          </CardContent>
        </Card>
        <Box sx={{ mt: 2.5 }}>
          <AutomationHelpPanel pageId={pageId} />
        </Box>
      </Box>
    </Box>
  )
}
