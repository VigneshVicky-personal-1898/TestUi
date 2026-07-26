
//  Separate demo credentials panel for Login page

import {
 Box, Card, CardContent, Chip, Stack, Typography, useTheme,
} from '@mui/material'
import { DEMO_USERS } from '../../data/mockData'
import { aid, dyn } from '../../utils/automation'


const ROLE_HINTS = {
 admin: 'Full access',
 manager: 'MFA code: 654321',
 employee: 'OTP code: 123456',
 viewer: 'Read-only',
}


export const DEMO_ACCOUNTS = DEMO_USERS.map((u) => ({
 email: u.email,
 password: u.password,
 name: u.name,
 role: u.role,
 roleLabel: u.role.charAt(0).toUpperCase() + u.role.slice(1),
 hint: ROLE_HINTS[u.role] || '',
 demoId: `login-demo-${u.role}`,
}))


export default function LoginDemoCredentials({ onSelect }) {
 const theme = useTheme()
 const raised = theme.customShadows?.neuRaised
 const insetSm = theme.customShadows?.neuInsetSm


 return (
   <Card
     elevation={0}
     sx={{
       width: '100%',
       boxShadow: raised,
       borderRadius: 3,
       bgcolor: 'background.default',
     }}
     {...aid('login-demo-credentials-card')}
   >
     <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
       <Typography variant="h6" fontWeight={700} gutterBottom {...aid('login-demo-title')}>
         Demo Accounts
       </Typography>
       <Typography
         variant="caption"
         color="text.secondary"
         display="block"
         sx={{ mb: 1.5 }}
         {...aid('login-demo-hint')}
       >
         Click a row to fill the login form · Captcha: <strong>TEST</strong>
       </Typography>


       <Stack spacing={1} {...aid('login-demo-accounts')}>
         {DEMO_ACCOUNTS.map((a) => (
           <Box
             key={a.demoId}
             component="button"
             type="button"
             onClick={() => onSelect?.(a)}
             {...aid(a.demoId)}
             sx={{
               all: 'unset',
               cursor: 'pointer',
               display: 'block',
               width: '100%',
               boxSizing: 'border-box',
               p: 1.25,
               borderRadius: 2,
               boxShadow: insetSm,
               bgcolor: 'background.default',
               transition: 'box-shadow 0.15s ease, transform 0.15s ease',
               '&:hover': {
                 boxShadow: raised,
                 transform: 'translateY(-1px)',
               },
               '&:focus-visible': {
                 outline: '2px solid',
                 outlineColor: 'primary.main',
                 outlineOffset: 2,
               },
             }}
           >
             <Stack
               direction="row"
               alignItems="center"
               justifyContent="space-between"
               spacing={1}
               sx={{ mb: 0.5 }}
             >
               <Typography variant="body2" fontWeight={700}>
                 {a.name}
               </Typography>
               <Chip
                 size="small"
                 label={a.roleLabel}
                 color={a.role === 'admin' ? 'primary' : 'default'}
                 {...aid(dyn('login-demo-role', a.role))}
               />
             </Stack>
             <Typography
               variant="caption"
               color="text.secondary"
               component="div"
               sx={{
                 fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                 lineHeight: 1.6,
               }}
               {...aid(dyn('login-demo-creds', a.role))}
             >
               <Box component="span" display="block">
                 Email: {a.email}
               </Box>
               <Box component="span" display="block">
                 Password: {a.password}
               </Box>
               {a.hint && (
                 <Box component="span" display="block" sx={{ mt: 0.25 }}>
                   {a.hint}
                 </Box>
               )}
             </Typography>
           </Box>
         ))}
       </Stack>
     </CardContent>
   </Card>
 )
}



