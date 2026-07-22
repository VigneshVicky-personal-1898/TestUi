// AI-ASSISTED: Cursor
// PROMPT: Clean Soft UI Login with restrained shadows
// ACCEPTED-BY: vignesh
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
  Box, Card, CardContent, TextField, Button, Typography, Checkbox,
  FormControlLabel, Alert, Link, InputAdornment, IconButton, CircularProgress,
  Divider, Stack, Chip, useTheme,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { loginThunk, clearLoginError } from '../../store'
import { aid, btn, field, control } from '../../utils/automation'
import AutomationHelpPanel from '../../components/common/AutomationHelpPanel'

const DEMO_ACCOUNTS = [
  { email: 'admin@gmail.com', password: 'admin@123', role: 'Admin', demoId: 'login-demo-admin' },
  { email: 'manager@testui.com', password: 'Manager@123', role: 'Manager (MFA)', demoId: 'login-demo-manager' },
  { email: 'employee@testui.com', password: 'Employee@123', role: 'Employee (OTP)', demoId: 'login-demo-employee' },
  { email: 'viewer@testui.com', password: 'Viewer@123', role: 'Viewer', demoId: 'login-demo-viewer' },
]

export default function LoginPage() {
  const theme = useTheme()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { loginError } = useSelector((s) => s.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '', rememberMe: false, captcha: '' },
  })
  const raised = theme.customShadows?.neuRaised
  const insetSm = theme.customShadows?.neuInsetSm

  const reason = location.state?.reason
  const emailReg = register('email', {
    required: 'Email is required',
    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email format' },
  })
  const passwordReg = register('password', {
    required: 'Password is required',
    minLength: { value: 6, message: 'Minimum 6 characters' },
  })
  const captchaReg = register('captcha', { required: 'Captcha is required' })
  const rememberReg = register('rememberMe')

  const onSubmit = async (data) => {
    setLoading(true)
    dispatch(clearLoginError())
    try {
      const result = await dispatch(loginThunk(data)).unwrap()
      if (result.step === 'otp') navigate('/otp')
      else if (result.step === 'mfa') navigate('/mfa')
      else navigate(location.state?.from?.pathname || '/dashboard')
    } catch {
      // error handled in store
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (account) => {
    setValue('email', account.email)
    setValue('password', account.password)
    setValue('captcha', 'TEST')
  }

  return (
    <Box
      {...aid('login-page')}
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          boxShadow: raised,
          borderRadius: 3,
          bgcolor: 'background.default',
        }}
        elevation={0}
        {...aid('login-card')}
      >
        <CardContent sx={{ p: { xs: 3, sm: 3.5 } }}>
          <Box sx={{ textAlign: 'center', mb: 2.5 }} {...aid('login-brand')}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 2,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                display: 'grid',
                placeItems: 'center',
                mx: 'auto',
                mb: 1.5,
                boxShadow: raised,
              }}
              {...aid('login-brand-icon')}
            >
              <LockOutlinedIcon />
            </Box>
            <Typography variant="h5" fontWeight={700} {...aid('login-title')}>
              TestUi
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} {...aid('login-subtitle')}>
              Enterprise Automation Practice Lab
            </Typography>
          </Box>

          {reason === 'session_expired' && (
            <Alert severity="warning" sx={{ mb: 2 }} {...aid('login-alert-session-expired')}>
              Your session has expired. Please log in again.
            </Alert>
          )}
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }} {...aid('login-alert-error')}>{loginError}</Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            {...aid('login-form')}
            name="login-form"
          >
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              autoComplete="username"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...field('login-email', 'email')}
              inputRef={emailReg.ref}
              onChange={emailReg.onChange}
              onBlur={emailReg.onBlur}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              margin="normal"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...field('login-password', 'password')}
              inputRef={passwordReg.ref}
              onChange={passwordReg.onChange}
              onBlur={passwordReg.onBlur}
              slotProps={{
                htmlInput: {
                  id: 'login-password',
                  name: 'password',
                  'data-testid': 'login-password',
                },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        {...btn('login-btn-toggle-password', showPassword ? 'Hide password' : 'Show password')}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box
              {...aid('login-captcha-box')}
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                boxShadow: insetSm,
                bgcolor: 'background.default',
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontFamily: 'monospace', letterSpacing: 4, userSelect: 'none', fontStyle: 'italic', fontWeight: 700 }}
                {...aid('login-captcha-text')}
              >
                TEST
              </Typography>
              <TextField
                size="small"
                label="Captcha"
                placeholder="Enter TEST"
                sx={{ flex: 1, minWidth: 120 }}
                error={!!errors.captcha}
                helperText={errors.captcha?.message}
                {...field('login-captcha', 'captcha')}
                inputRef={captchaReg.ref}
                onChange={captchaReg.onChange}
                onBlur={captchaReg.onBlur}
              />
            </Box>

            <FormControlLabel
              sx={{ mt: 1 }}
              control={
                <Checkbox
                  {...control('login-remember-me', 'rememberMe')}
                  inputRef={rememberReg.ref}
                  onChange={rememberReg.onChange}
                  onBlur={rememberReg.onBlur}
                />
              }
              label="Remember Me"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              {...btn('login-btn-submit', 'Sign in')}
              sx={{ mt: 2, mb: 1, py: 1.1, borderRadius: 2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" {...aid('login-loading-spinner')} /> : 'Sign In'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                color="primary"
                fontWeight={650}
                {...aid('login-link-forgot-password')}
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={650}>Demo Accounts</Typography>
          </Divider>
          <Stack
            direction="row"
            useFlexGap
            spacing={1}
            sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
            {...aid('login-demo-accounts')}
          >
            {DEMO_ACCOUNTS.map((a) => (
              <Chip
                key={a.demoId}
                label={a.role}
                size="small"
                onClick={() => fillDemo(a)}
                {...aid(a.demoId)}
                clickable
              />
            ))}
          </Stack>
        </CardContent>
      </Card>
      <Box sx={{ width: '100%', maxWidth: 720, mt: 2.5 }}>
        <AutomationHelpPanel pageId="login" />
      </Box>
    </Box>
  )
}
