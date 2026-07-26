import { useCallback, useEffect, useState } from 'react'
import {
 Alert, Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Select, Stack,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { PageHeader } from '../../components/common/PageHeader'
import FrameworkExplorer from './FrameworkExplorer'
import { getRunnerMode, runnerApi } from '../../utils/runnerApi'
import { aid, btn, select, option, optId } from '../../utils/automation'


export default function FrameworkPage() {
 const [framework, setFramework] = useState('selenium')
 const [catalog, setCatalog] = useState(null)
 const [structure, setStructure] = useState(null)
 const [apiOk, setApiOk] = useState(null)
 const [runnerMode, setRunnerMode] = useState('unknown')
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')


 const refresh = useCallback(async (fw = framework, { silent = false } = {}) => {
   if (!silent) {
     setLoading(true)
     setError('')
   }
   try {
     await runnerApi.health()
     const mode = getRunnerMode()
     setRunnerMode(mode)
     setApiOk(mode === 'api' || mode === 'static')
     const [cat, struct] = await Promise.all([
       runnerApi.catalog(fw),
       runnerApi.structure(fw),
     ])
     setCatalog(cat)
     setStructure(struct)
   } catch (err) {
     setApiOk(false)
     setRunnerMode(getRunnerMode())
     if (!silent) {
       setError(err.message || 'Folder browse unavailable on this host.')
     }
   } finally {
     if (!silent) setLoading(false)
   }
 }, [framework])


 const silentRefresh = useCallback(() => {
   if (getRunnerMode() !== 'api') return
   refresh(framework, { silent: true })
 }, [framework, refresh])


 useEffect(() => {
   refresh(framework)
 }, [framework, refresh])


 return (
   <Box {...aid('framework-page')}>
     <PageHeader
       pageId="framework"
       title="Framework"
       subtitle="Browse Java project structure, TestNG suites, and architecture — live from project folders"
       breadcrumbs={['Framework']}
       actions={(
         <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
           <FormControl size="small" sx={{ minWidth: 200 }}>
             <InputLabel>Framework</InputLabel>
             <Select
               label="Framework"
               value={framework}
               onChange={(e) => setFramework(e.target.value)}
               {...select('framework-select', 'framework', 'Select framework')}
             >
               <MenuItem value="selenium" {...option(optId('framework-select', 'selenium'), 'Selenium')}>
                 Selenium + TestNG
               </MenuItem>
               <MenuItem value="playwright" {...option(optId('framework-select', 'playwright'), 'Playwright')}>
                 Playwright + TestNG
               </MenuItem>
             </Select>
           </FormControl>
           <Button
             variant="outlined"
             startIcon={<RefreshIcon />}
             onClick={() => refresh(framework)}
             disabled={loading}
             {...btn('framework-btn-refresh', 'Refresh framework catalog')}
           >
             Refresh
           </Button>
         </Stack>
       )}
     />


     {apiOk === false && (
       <Alert severity="error" sx={{ mb: 2 }} {...aid('framework-alert-api')}>
         Folder browse is offline on this git/static host (no Node <code>/api/runner</code>).
         {' '}Redeploy with <strong>npm run build:gh-pages</strong> so a <code>runner-static</code> snapshot is included.
         {' '}For live disk scanning locally, use <strong>npm run dev</strong> → <code>http://localhost:7173</code>.
       </Alert>
     )}
     {apiOk && runnerMode === 'static' && (
       <Alert severity="info" sx={{ mb: 2 }} {...aid('framework-alert-static')}>
         Git/static host mode: showing a <strong>browse-only snapshot</strong> of suites and Java sources.
         {' '}Live folder updates and <strong>Run Suite</strong> need <code>npm run dev</code> (or a Node deploy).
       </Alert>
     )}
     {apiOk && runnerMode === 'api' && (
       <Alert severity="success" sx={{ mb: 2 }} {...aid('framework-alert-live')}>
         Live folder scan is connected — lists update from project directories on disk.
       </Alert>
     )}
     {error && (
       <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')} {...aid('framework-alert-error')}>
         {error}
       </Alert>
     )}
     {loading && <LinearProgress sx={{ mb: 2 }} {...aid('framework-loading')} />}


     <FrameworkExplorer
       framework={framework}
       structure={structure}
       catalog={catalog}
       onRefresh={silentRefresh}
       refreshing={loading}
     />
   </Box>
 )
}



