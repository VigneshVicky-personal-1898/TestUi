
//  Fix MUI labels overlapping values after demo fill

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import {
 Box, Card, CardContent, TextField, Button, Typography, Checkbox,
 FormControlLabel, Alert, Link, InputAdornment, IconButton, CircularProgress,
 useTheme,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { loginThunk, clearLoginError } from '../../store'
import { aid, btn, field, control } from '../../utils/automation'
import AutomationHelpPanel from '../../components/common/AutomationHelpPanel'
import LoginDemoCredentials from './LoginDemoCredetials'


export default function LoginPage() {
 const theme = useTheme()
 const dispatch = useDispatch()
 const navigate = useNavigate()
 const location = useLocation()
 const { loginError } = useSelector((s) => s.auth)
 const [showPassword, setShowPassword] = useState(false)
 const [loading, setLoading] = useState(false)
 const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
   defaultValues: { email: '', password: '', rememberMe: false, captcha: '' },
 })
 const raised = theme.customShadows?.neuRaised
 const insetSm = theme.customShadows?.neuInsetSm
 const emailValue = watch('email')
 const passwordValue = watch('password')
 const captchaValue = watch('captcha')


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
   setValue('email', account.email, { shouldDirty: true, shouldTouch: true })
   setValue('password', account.password, { shouldDirty: true, shouldTouch: true })
   setValue('captcha', 'TEST', { shouldDirty: true, shouldTouch: true })
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
     <Box
       sx={{
         width: '100%',
         maxWidth: 920,
         display: 'grid',
         gap: 2.5,
         gridTemplateColumns: { xs: '1fr', md: '420px 1fr' },
         alignItems: 'start',
         justifyContent: 'center',
       }}
       {...aid('login-layout')}
     >
       <Card
         sx={{
           width: '100%',
           maxWidth: 420,
           mx: { xs: 'auto', md: 0 },
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
               name={emailReg.name}
               inputRef={emailReg.ref}
               onChange={emailReg.onChange}
               onBlur={emailReg.onBlur}
               value={emailValue}
               slotProps={{
                 inputLabel: { shrink: Boolean(emailValue) },
                 htmlInput: {
                   id: 'login-email',
                   name: 'email',
                   'data-testid': 'login-email',
                 },
               }}
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
               name={passwordReg.name}
               inputRef={passwordReg.ref}
               onChange={passwordReg.onChange}
               onBlur={passwordReg.onBlur}
               value={passwordValue}
               slotProps={{
                 inputLabel: { shrink: Boolean(passwordValue) },
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
                 name={captchaReg.name}
                 inputRef={captchaReg.ref}
                 onChange={captchaReg.onChange}
                 onBlur={captchaReg.onBlur}
                 value={captchaValue}
                 slotProps={{
                   inputLabel: { shrink: Boolean(captchaValue) },
                   htmlInput: {
                     id: 'login-captcha',
                     name: 'captcha',
                     'data-testid': 'login-captcha',
                   },
                 }}
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
                   name={rememberReg.name}
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
         </CardContent>
       </Card>


       <Box sx={{ width: '100%', maxWidth: { xs: 420, md: 'none' }, mx: { xs: 'auto', md: 0 } }}>
         <LoginDemoCredentials onSelect={fillDemo} />
       </Box>
     </Box>


     <Box sx={{ width: '100%', maxWidth: 920, mt: 2.5 }}>
       <AutomationHelpPanel pageId="login" />
     </Box>
   </Box>
 )
}



