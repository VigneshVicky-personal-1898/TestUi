
//  Top-level Framework module page for structure suites diagram

import { useCallback, useEffect, useState } from 'react'
import {
 Alert, Box, Button, FormControl, InputLabel, LinearProgress, MenuItem, Select, Stack,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import { PageHeader } from '../../components/common/PageHeader'
import FrameworkExplorer from './FrameworkExplorer'
import { runnerApi } from '../../utils/runnerApi'
import { aid, btn, select, option, optId } from '../../utils/automation'


export default function FrameworkPage() {
 const [framework, setFramework] = useState('selenium')
 const [catalog, setCatalog] = useState(null)
 const [structure, setStructure] = useState(null)
 const [apiOk, setApiOk] = useState(null)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState('')


 const refresh = useCallback(async (fw = framework, { silent = false } = {}) => {
   if (!silent) {
     setLoading(true)
     setError('')
   }
   try {
     await runnerApi.health()
     setApiOk(true)
     const [cat, struct] = await Promise.all([
       runnerApi.catalog(fw),
       runnerApi.structure(fw),
     ])
     setCatalog(cat)
     setStructure(struct)
   } catch (err) {
     setApiOk(false)
     if (!silent) {
       setError(err.message || 'Runner API unavailable. Start the app with npm run dev.')
     }
   } finally {
     if (!silent) setLoading(false)
   }
 }, [framework])


 const silentRefresh = useCallback(() => {
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
         Folder scan API is offline. Use <strong>npm run dev</strong> so suites and Java sources can be read from disk.
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



