// AI-ASSISTED: Cursor
// PROMPT: Add pageId so Automation Help appears on Error Pages
// ACCEPTED-BY: vignesh
import { Link as RouterLink, Routes, Route, useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Paper, Stack } from '@mui/material'
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined'
import LockIcon from '@mui/icons-material/Lock'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import InboxIcon from '@mui/icons-material/Inbox'
import { PageHeader, EmptyState } from '../../components/common/PageHeader'
import { aid, btn } from '../../utils/automation'

function ErrorCard({ code, title, description, icon: Icon, testId }) {
  const navigate = useNavigate()
  return (
    <Box
      {...aid(testId)}
      sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}
    >
      <Box>
        <Icon sx={{ fontSize: 72, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h1" fontWeight={800} color="primary" {...aid('error-code')}>{code}</Typography>
        <Typography variant="h5" gutterBottom {...aid('error-title')}>{title}</Typography>
        <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>{description}</Typography>
        <Stack direction="row" spacing={1} justifyContent="center">
          <Button variant="contained" onClick={() => navigate('/dashboard')} {...btn('error-go-home')}>Go Home</Button>
          <Button variant="outlined" onClick={() => navigate(-1)} {...btn('error-go-back')}>Go Back</Button>
        </Stack>
      </Box>
    </Box>
  )
}

function ErrorsIndex() {
  return (
    <Box {...aid('errors-index')}>
      <PageHeader
        pageId="errors"
        title="Error Pages"
        subtitle="404, 403, 500, empty state, no data"
        breadcrumbs={['Error Pages']}
      />
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" useFlexGap>
        <Button component={RouterLink} to="/errors/404" variant="outlined" {...btn('link-404')}>View 404</Button>
        <Button component={RouterLink} to="/errors/403" variant="outlined" {...btn('link-403')}>View 403</Button>
        <Button component={RouterLink} to="/errors/500" variant="outlined" {...btn('link-500')}>View 500</Button>
        <Button component={RouterLink} to="/errors/empty" variant="outlined" {...btn('link-empty')}>View Empty State</Button>
        <Button component={RouterLink} to="/errors/nodata" variant="outlined" {...btn('link-nodata')}>View No Data</Button>
      </Stack>
    </Box>
  )
}

function EmptyPage() {
  return (
    <Paper sx={{ mt: 2 }} {...aid('empty-state-page')}>
      <EmptyState
        title="Nothing here yet"
        description="This empty state is perfect for testing empty UI assertions."
        action={<Button variant="contained" {...btn('empty-cta')}>Create First Item</Button>}
      />
    </Paper>
  )
}

function NoDataPage() {
  return (
    <Box {...aid('no-data-page')} sx={{ textAlign: 'center', py: 10 }}>
      <InboxIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" {...aid('no-data-title')}>No Data Available</Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>There is currently no data matching your criteria.</Typography>
      <Button variant="outlined" {...btn('no-data-refresh')}>Refresh</Button>
    </Box>
  )
}

export function NotFoundPage() {
  return (
    <ErrorCard
      code="404"
      title="Page Not Found"
      description="The page you are looking for does not exist or has been moved."
      icon={SearchOffIcon}
      testId="error-404-page"
    />
  )
}

export function ForbiddenPage() {
  return (
    <ErrorCard
      code="403"
      title="Access Denied"
      description="You do not have permission to view this resource. Contact your administrator."
      icon={LockIcon}
      testId="error-403-page"
    />
  )
}

export function ServerErrorPage() {
  return (
    <ErrorCard
      code="500"
      title="Internal Server Error"
      description="Something went wrong on our end. Please try again later."
      icon={ErrorOutlinedIcon}
      testId="error-500-page"
    />
  )
}

export default function ErrorsPage() {
  return (
    <Routes>
      <Route index element={<ErrorsIndex />} />
      <Route path="404" element={<NotFoundPage />} />
      <Route path="403" element={<ForbiddenPage />} />
      <Route path="500" element={<ServerErrorPage />} />
      <Route path="empty" element={<><PageHeader pageId="errors" title="Empty State" showHelp={false} /><EmptyPage /></>} />
      <Route path="nodata" element={<><PageHeader pageId="errors" title="No Data" showHelp={false} /><NoDataPage /></>} />
    </Routes>
  )
}
