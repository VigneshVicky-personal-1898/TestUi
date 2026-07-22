// AI-ASSISTED: Cursor
// PROMPT: Clean Soft UI PageHeader without heavy raised chrome
// ACCEPTED-BY: vignesh
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Typography, Breadcrumbs, Link as MuiLink, useTheme } from '@mui/material'
import { hasPermission } from '../../store'
import { aid, dyn } from '../../utils/automation'
import AutomationHelpPanel from './AutomationHelpPanel'

export function PageContainer({ children, pageId, maxWidth = 1440 }) {
  return (
    <Box
      {...aid(pageId || 'page-container')}
      sx={{
        width: '100%',
        maxWidth,
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      {children}
    </Box>
  )
}

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs = [],
  pageId = 'page',
  showHelp = true,
  helpExpanded = false,
}) {
  return (
    <>
      <Box
        {...aid(dyn(pageId, 'header'))}
        sx={{
          mb: showHelp ? 2 : 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          minHeight: 48,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          {breadcrumbs.length > 0 && (
            <Breadcrumbs sx={{ mb: 0.5 }} {...aid(dyn(pageId, 'breadcrumbs'))}>
              <MuiLink
                component={Link}
                to="/dashboard"
                underline="hover"
                color="inherit"
                {...aid(dyn(pageId, 'breadcrumb-home'))}
              >
                Home
              </MuiLink>
              {breadcrumbs.map((b, i) => (
                <Typography
                  key={b}
                  color="text.primary"
                  fontWeight={600}
                  {...aid(dyn(pageId, 'breadcrumb', i + 1))}
                >
                  {b}
                </Typography>
              ))}
            </Breadcrumbs>
          )}
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 700, lineHeight: 1.3 }}
            {...aid(dyn(pageId, 'title'))}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
              {...aid(dyn(pageId, 'subtitle'))}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box
            {...aid(dyn(pageId, 'actions'))}
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              flexShrink: 0,
            }}
          >
            {actions}
          </Box>
        )}
      </Box>
      {showHelp && <AutomationHelpPanel pageId={pageId} defaultExpanded={helpExpanded} />}
    </>
  )
}

export function ProtectedRoute({ children, permission }) {
  const { user, token, sessionExpiry } = useSelector((s) => s.auth)
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (sessionExpiry && Date.now() > sessionExpiry) {
    return <Navigate to="/login" state={{ reason: 'session_expired' }} replace />
  }

  if (permission && !hasPermission(user.role, permission)) {
    return <Navigate to="/errors/403" replace />
  }

  return children
}

export function EmptyState({
  title = 'No data found',
  description = 'Try adjusting filters or create a new item.',
  action,
  testId = 'empty-state',
}) {
  const theme = useTheme()
  const insetSm = theme.customShadows?.neuInsetSm

  return (
    <Box
      {...aid(testId)}
      sx={{
        textAlign: 'center',
        py: 6,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        boxShadow: insetSm,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight={700} {...aid(`${testId}-title`)}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, maxWidth: 420 }}
        {...aid(`${testId}-description`)}
      >
        {description}
      </Typography>
      {action}
    </Box>
  )
}
