
//  Friendlier architecture tab copy for Framework module

import { useEffect, useMemo, useState } from 'react'
import {
 Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, List, ListItemButton,
 ListItemText, Stack, Tab, Tabs, Typography, Accordion, AccordionSummary, AccordionDetails,
 TextField, InputAdornment,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import FrameworkDiagram from './FrameworkDiagram'
import { runnerApi } from '../../utils/runnerApi'
import { aid, btn, dyn, field } from '../../utils/automation'


function CodeViewer({ title, pathLabel, language, content, loading, empty, testId }) {
 return (
   <Box {...aid(testId || 'framework-code-viewer')}>
     <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }} flexWrap="wrap" gap={1}>
       <Typography variant="subtitle1" fontWeight={700}>{title}</Typography>
       {pathLabel && (
         <Typography variant="caption" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
           <code>{pathLabel}</code>
         </Typography>
       )}
       {language && <Chip size="small" label={language} />}
     </Stack>
     {loading ? (
       <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
         <CircularProgress size={28} />
       </Box>
     ) : (
       <Box
         component="pre"
         sx={{
           m: 0,
           p: 2,
           maxHeight: 520,
           overflow: 'auto',
           borderRadius: 2,
           fontSize: 12.5,
           lineHeight: 1.5,
           fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
           whiteSpace: 'pre',
           bgcolor: '#0f172a',
           color: '#e2e8f0',
           boxShadow: (t) => t.customShadows?.neuInsetSm,
         }}
         {...aid(`${testId || 'framework-code'}-body`)}
       >
         {content || empty || 'Select an item to view source.'}
       </Box>
     )}
   </Box>
 )
}


function groupSuitesByFolder(suites) {
 const groups = new Map()
 for (const s of suites) {
   const folder = s.folderPath || (s.relativePath.includes('/suites/')
     ? s.relativePath.split('/suites/')[1]?.split('/').slice(0, -1).join('/') || '(suites root)'
     : '(suites root)')
   const key = folder || '(suites root)'
   if (!groups.has(key)) groups.set(key, [])
   groups.get(key).push(s)
 }
 return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
}


export default function FrameworkExplorer({
 framework,
 structure,
 catalog,
 onRefresh,
 refreshing,
}) {
 const [section, setSection] = useState(0)
 const [suiteFilter, setSuiteFilter] = useState('')
 const [javaFilter, setJavaFilter] = useState('')
 const [selectedSuite, setSelectedSuite] = useState(null)
 const [selectedClass, setSelectedClass] = useState(null)
 const [suiteSource, setSuiteSource] = useState(null)
 const [javaSource, setJavaSource] = useState(null)
 const [loadingSuite, setLoadingSuite] = useState(false)
 const [loadingJava, setLoadingJava] = useState(false)
 const [sourceError, setSourceError] = useState('')


 const suites = useMemo(() => {
   const app = structure?.applicationSuites || catalog?.applicationSuites || []
   const mod = structure?.moduleSuites || catalog?.moduleSuites || []
   return [...app, ...mod]
 }, [structure, catalog])


 const filteredSuites = useMemo(() => {
   const q = suiteFilter.trim().toLowerCase()
   if (!q) return suites
   return suites.filter((s) =>
     s.label.toLowerCase().includes(q)
     || s.relativePath.toLowerCase().includes(q)
     || (s.folderPath || '').toLowerCase().includes(q),
   )
 }, [suites, suiteFilter])


 const suiteFolders = useMemo(() => groupSuitesByFolder(filteredSuites), [filteredSuites])


 const packages = structure?.packages || catalog?.packages || {}


 const filteredPackages = useMemo(() => {
   const q = javaFilter.trim().toLowerCase()
   const entries = Object.entries(packages).filter(([, list]) => list?.length)
   if (!q) return entries
   return entries
     .map(([key, list]) => [
       key,
       list.filter((cls) =>
         cls.className.toLowerCase().includes(q)
         || cls.fqcn.toLowerCase().includes(q)
         || (cls.methods || []).some((m) => m.toLowerCase().includes(q)),
       ),
     ])
     .filter(([, list]) => list.length)
 }, [packages, javaFilter])


 const suitesRoot = catalog?.framework?.suitesRoot
   || structure?.framework?.suitesRoot
   || 'automation/*/src/test/resources/suites'


 useEffect(() => {
   setSelectedSuite(null)
   setSelectedClass(null)
   setSuiteSource(null)
   setJavaSource(null)
   setSourceError('')
 }, [framework])


 useEffect(() => {
   if (typeof onRefresh !== 'function') return undefined
   const id = setInterval(() => onRefresh(), 8000)
   return () => clearInterval(id)
 }, [onRefresh])


 const loadSuite = async (suite) => {
   setSelectedSuite(suite)
   setLoadingSuite(true)
   setSourceError('')
   try {
     const data = await runnerApi.source(framework, 'suite', suite.relativePath)
     setSuiteSource(data)
   } catch (err) {
     setSuiteSource(null)
     setSourceError(err.message)
   } finally {
     setLoadingSuite(false)
   }
 }


 const loadJava = async (cls) => {
   setSelectedClass(cls)
   setLoadingJava(true)
   setSourceError('')
   try {
     const data = await runnerApi.source(framework, 'java', cls.sourcePath)
     setJavaSource(data)
   } catch (err) {
     setJavaSource(null)
     setSourceError(err.message)
   } finally {
     setLoadingJava(false)
   }
 }


 return (
   <Box {...aid('framework-explorer')}>
     <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap" useFlexGap>
       <Chip
         size="small"
         icon={<FolderOpenIcon />}
         label="Live from project folders"
         color="success"
         variant="outlined"
         {...aid('framework-source-chip')}
       />
       <Typography variant="caption" color="text.secondary" {...aid('framework-suites-root')}>
         Scanning <code>{suitesRoot}</code>
         {refreshing ? ' · refreshing…' : ' · auto-refreshes when files change'}
       </Typography>
     </Stack>


     <Tabs
       value={section}
       onChange={(_, v) => setSection(v)}
       sx={{ mb: 2 }}
       variant="scrollable"
       allowScrollButtonsMobile
       {...aid('framework-sections')}
     >
       <Tab
         label="Java Project Structure"
         {...btn('framework-tab-java', 'Java project structure')}
       />
       <Tab
         label="Test Suites"
         {...btn('framework-tab-suites', 'Test suites')}
       />
       <Tab
         label="Framework Architecture Diagram"
         {...btn('framework-tab-diagram', 'Framework architecture diagram')}
       />
     </Tabs>


     {sourceError && (
       <Typography color="error" variant="body2" sx={{ mb: 1 }} {...aid('framework-source-error')}>
         {sourceError}
       </Typography>
     )}


     {section === 0 && (
       <Grid container spacing={2}>
         <Grid size={{ xs: 12, md: 4 }}>
           <Card {...aid('framework-java-list-card')} sx={{ height: '100%' }}>
             <CardContent>
               <Typography variant="h6" fontWeight={700} gutterBottom>
                 Java packages
               </Typography>
               <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                 Discovered from src/main/java and src/test/java folders.
               </Typography>
               <TextField
                 size="small"
                 fullWidth
                 placeholder="Filter classes / methods…"
                 value={javaFilter}
                 onChange={(e) => setJavaFilter(e.target.value)}
                 sx={{ mb: 1.5 }}
                 {...field('framework-java-filter', 'javaFilter')}
                 slotProps={{
                   input: {
                     startAdornment: (
                       <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                     ),
                   },
                 }}
               />
               <Box sx={{ maxHeight: 560, overflow: 'auto' }} {...aid('framework-java-tree')}>
                 {filteredPackages.map(([pkgKey, classes]) => (
                   <Accordion key={pkgKey} disableGutters elevation={0} sx={{ mb: 1 }} {...aid(dyn('framework-pkg', pkgKey))}>
                     <AccordionSummary
                       expandIcon={<ExpandMoreIcon />}
                       {...btn(dyn('framework-pkg-toggle', pkgKey), `Toggle ${pkgKey}`)}
                     >
                       <Typography fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                         {pkgKey} ({classes.length})
                       </Typography>
                     </AccordionSummary>
                     <AccordionDetails sx={{ pt: 0 }}>
                       <List dense disablePadding>
                         {classes.map((cls) => (
                           <ListItemButton
                             key={cls.fqcn}
                             selected={selectedClass?.fqcn === cls.fqcn}
                             onClick={() => loadJava(cls)}
                             {...btn(dyn('framework-class', cls.className), `Open ${cls.className}`)}
                           >
                             <ListItemText
                               primary={cls.className}
                               secondary={cls.sourcePath || cls.fqcn}
                               primaryTypographyProps={{ fontSize: 13, fontWeight: 650 }}
                               secondaryTypographyProps={{ fontSize: 11 }}
                             />
                           </ListItemButton>
                         ))}
                       </List>
                     </AccordionDetails>
                   </Accordion>
                 ))}
                 {!filteredPackages.length && (
                   <Typography color="text.secondary" variant="body2">No classes match.</Typography>
                 )}
               </Box>
             </CardContent>
           </Card>
         </Grid>
         <Grid size={{ xs: 12, md: 8 }}>
           <Card {...aid('framework-java-source-card')}>
             <CardContent>
               {selectedClass && (
                 <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1.5 }} {...aid('framework-class-methods')}>
                   {(selectedClass.methods || []).slice(0, 16).map((m) => (
                     <Chip key={m} size="small" label={m} {...aid(dyn('framework-method', selectedClass.className, m))} />
                   ))}
                 </Stack>
               )}
               <Divider sx={{ mb: 1.5 }} />
               <CodeViewer
                 title={selectedClass ? selectedClass.className : 'Java source'}
                 pathLabel={javaSource?.path || selectedClass?.sourcePath}
                 language={javaSource?.language || 'java'}
                 content={javaSource?.content}
                 loading={loadingJava}
                 empty="Select a Java class on the left to view its source code."
                 testId="framework-java-source"
               />
             </CardContent>
           </Card>
         </Grid>
       </Grid>
     )}


     {section === 1 && (
       <Grid container spacing={2}>
         <Grid size={{ xs: 12, md: 4 }}>
           <Card {...aid('framework-suites-list-card')} sx={{ height: '100%' }}>
             <CardContent>
               <Typography variant="h6" fontWeight={700} gutterBottom>
                 Suite files ({filteredSuites.length})
               </Typography>
               <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                 Only XML files present under the suites folder are listed.
               </Typography>
               <TextField
                 size="small"
                 fullWidth
                 placeholder="Filter suites…"
                 value={suiteFilter}
                 onChange={(e) => setSuiteFilter(e.target.value)}
                 sx={{ mb: 1.5 }}
                 {...field('framework-suite-filter', 'suiteFilter')}
                 slotProps={{
                   input: {
                     startAdornment: (
                       <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                     ),
                   },
                 }}
               />
               <Box sx={{ maxHeight: 560, overflow: 'auto' }} {...aid('framework-suites-list')}>
                 {suiteFolders.map(([folder, items]) => (
                   <Accordion
                     key={folder}
                     defaultExpanded={suiteFolders.length <= 4}
                     disableGutters
                     elevation={0}
                     sx={{ mb: 1 }}
                     {...aid(dyn('framework-suite-folder', folder))}
                   >
                     <AccordionSummary
                       expandIcon={<ExpandMoreIcon />}
                       {...btn(dyn('framework-suite-folder-toggle', folder), `Toggle ${folder}`)}
                     >
                       <Typography fontWeight={700} fontSize={13}>
                         {folder}/ ({items.length})
                       </Typography>
                     </AccordionSummary>
                     <AccordionDetails sx={{ pt: 0 }}>
                       <List dense disablePadding>
                         {items.map((s) => (
                           <ListItemButton
                             key={s.relativePath}
                             selected={selectedSuite?.relativePath === s.relativePath}
                             onClick={() => loadSuite(s)}
                             {...btn(dyn('framework-suite-file', s.id), `Open suite ${s.label}`)}
                           >
                             <ListItemText
                               primary={s.name}
                               secondary={s.relativePath}
                               primaryTypographyProps={{ fontSize: 13, fontWeight: 650 }}
                               secondaryTypographyProps={{ fontSize: 11 }}
                             />
                           </ListItemButton>
                         ))}
                       </List>
                     </AccordionDetails>
                   </Accordion>
                 ))}
                 {!filteredSuites.length && (
                   <Typography color="text.secondary" variant="body2">No suites match.</Typography>
                 )}
               </Box>
             </CardContent>
           </Card>
         </Grid>
         <Grid size={{ xs: 12, md: 8 }}>
           <Card {...aid('framework-suite-xml-card')}>
             <CardContent>
               <CodeViewer
                 title={selectedSuite ? selectedSuite.label : 'Suite XML'}
                 pathLabel={suiteSource?.path || selectedSuite?.relativePath}
                 language={suiteSource?.language || 'xml'}
                 content={suiteSource?.content}
                 loading={loadingSuite}
                 empty="Select a suite file on the left to view its TestNG XML."
                 testId="framework-suite-xml"
               />
             </CardContent>
           </Card>
         </Grid>
       </Grid>
     )}


     {section === 2 && (
       <Card {...aid('framework-diagram-card')}>
         <CardContent>
           <Typography variant="h6" fontWeight={700} gutterBottom>
             {structure?.framework?.label || 'Framework'} — architecture at a glance
           </Typography>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
             A simple story of how suites, tests, page objects, and the browser work together.
             {' '}Project: <code>{structure?.framework?.projectDir}</code>
             {structure?.framework?.packageRoot ? <> · package <code>{structure.framework.packageRoot}</code></> : null}
           </Typography>
           <FrameworkDiagram structure={structure} frameworkId={framework} />
         </CardContent>
       </Card>
     )}
   </Box>
 )
}



