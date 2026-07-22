// AI-ASSISTED: Cursor
// PROMPT: Framework Structure explorer for suite XML and Java source
// ACCEPTED-BY: vignesh
import { useEffect, useMemo, useState } from 'react'
import {
 Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, List, ListItemButton,
 ListItemText, Stack, Tab, Tabs, Typography, Accordion, AccordionSummary, AccordionDetails,
 TextField, InputAdornment,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'
import FrameworkDiagram from './FrameworkDiagram'
import { runnerApi } from '../../utils/runnerApi'
import { aid, btn, dyn, field } from '../../utils/automation'


function CodeViewer({ title, pathLabel, language, content, loading, empty, testId }) {
 return (
   <Box {...aid(testId || 'runner-code-viewer')}>
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
         {...aid(`${testId || 'runner-code'}-body`)}
       >
         {content || empty || 'Select an item to view source.'}
       </Box>
     )}
   </Box>
 )
}


export default function FrameworkStructurePanel({ framework, structure, catalog }) {
 const [subTab, setSubTab] = useState(0)
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
   return suites.filter((s) => s.label.toLowerCase().includes(q) || s.relativePath.toLowerCase().includes(q))
 }, [suites, suiteFilter])


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


 useEffect(() => {
   setSelectedSuite(null)
   setSelectedClass(null)
   setSuiteSource(null)
   setJavaSource(null)
   setSourceError('')
 }, [framework])


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
   <Box {...aid('runner-structure-panel')}>
     <Tabs
       value={subTab}
       onChange={(_, v) => setSubTab(v)}
       sx={{ mb: 2 }}
       {...aid('runner-structure-subtabs')}
     >
       <Tab label="Diagram" {...btn('runner-structure-tab-diagram', 'Architecture diagram')} />
       <Tab label="Suite XML" {...btn('runner-structure-tab-suites', 'Suite XML files')} />
       <Tab label="Java code" {...btn('runner-structure-tab-java', 'Java source code')} />
     </Tabs>


     {sourceError && (
       <Typography color="error" variant="body2" sx={{ mb: 1 }} {...aid('runner-source-error')}>
         {sourceError}
       </Typography>
     )}


     {subTab === 0 && (
       <Card {...aid('runner-structure-card')}>
         <CardContent>
           <Typography variant="h6" fontWeight={700} gutterBottom>
             {structure?.framework?.label || 'Framework'} design diagram
           </Typography>
           <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
             Package root: <code>{structure?.framework?.packageRoot}</code>
             {' · '}
             Project: <code>{structure?.framework?.projectDir}</code>
           </Typography>
           <FrameworkDiagram structure={structure} frameworkId={framework} />
         </CardContent>
       </Card>
     )}


     {subTab === 1 && (
       <Grid container spacing={2}>
         <Grid size={{ xs: 12, md: 4 }}>
           <Card {...aid('runner-suites-list-card')} sx={{ height: '100%' }}>
             <CardContent>
               <Typography variant="h6" fontWeight={700} gutterBottom>
                 Suite files ({filteredSuites.length})
               </Typography>
               <TextField
                 size="small"
                 fullWidth
                 placeholder="Filter suites…"
                 value={suiteFilter}
                 onChange={(e) => setSuiteFilter(e.target.value)}
                 sx={{ mb: 1.5 }}
                 {...field('runner-suite-filter', 'suiteFilter')}
                 slotProps={{
                   input: {
                     startAdornment: (
                       <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                     ),
                   },
                 }}
               />
               <List dense sx={{ maxHeight: 560, overflow: 'auto' }} {...aid('runner-suites-list')}>
                 {filteredSuites.map((s) => (
                   <ListItemButton
                     key={s.relativePath}
                     selected={selectedSuite?.relativePath === s.relativePath}
                     onClick={() => loadSuite(s)}
                     {...btn(dyn('runner-suite-file', s.id), `Open suite ${s.label}`)}
                   >
                     <ListItemText
                       primary={s.label}
                       secondary={s.relativePath}
                       primaryTypographyProps={{ fontSize: 13, fontWeight: 650 }}
                       secondaryTypographyProps={{ fontSize: 11 }}
                     />
                   </ListItemButton>
                 ))}
                 {!filteredSuites.length && (
                   <Typography color="text.secondary" variant="body2">No suites match.</Typography>
                 )}
               </List>
             </CardContent>
           </Card>
         </Grid>
         <Grid size={{ xs: 12, md: 8 }}>
           <Card {...aid('runner-suite-xml-card')}>
             <CardContent>
               <CodeViewer
                 title={selectedSuite ? selectedSuite.label : 'Suite XML'}
                 pathLabel={suiteSource?.path || selectedSuite?.relativePath}
                 language={suiteSource?.language || 'xml'}
                 content={suiteSource?.content}
                 loading={loadingSuite}
                 empty="Select a suite file on the left to view its TestNG XML."
                 testId="runner-suite-xml"
               />
             </CardContent>
           </Card>
         </Grid>
       </Grid>
     )}


     {subTab === 2 && (
       <Grid container spacing={2}>
         <Grid size={{ xs: 12, md: 4 }}>
           <Card {...aid('runner-java-list-card')} sx={{ height: '100%' }}>
             <CardContent>
               <Typography variant="h6" fontWeight={700} gutterBottom>
                 Java classes
               </Typography>
               <TextField
                 size="small"
                 fullWidth
                 placeholder="Filter classes / methods…"
                 value={javaFilter}
                 onChange={(e) => setJavaFilter(e.target.value)}
                 sx={{ mb: 1.5 }}
                 {...field('runner-java-filter', 'javaFilter')}
                 slotProps={{
                   input: {
                     startAdornment: (
                       <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                     ),
                   },
                 }}
               />
               <Box sx={{ maxHeight: 560, overflow: 'auto' }} {...aid('runner-java-tree')}>
                 {filteredPackages.map(([pkgKey, classes]) => (
                   <Accordion key={pkgKey} disableGutters elevation={0} sx={{ mb: 1 }} {...aid(dyn('runner-pkg', pkgKey))}>
                     <AccordionSummary
                       expandIcon={<ExpandMoreIcon />}
                       {...btn(dyn('runner-pkg-toggle', pkgKey), `Toggle ${pkgKey}`)}
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
                             {...btn(dyn('runner-class', cls.className), `Open ${cls.className}`)}
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
           <Card {...aid('runner-java-source-card')}>
             <CardContent>
               {selectedClass && (
                 <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 1.5 }} {...aid('runner-class-methods')}>
                   {(selectedClass.methods || []).slice(0, 16).map((m) => (
                     <Chip key={m} size="small" label={m} {...aid(dyn('runner-method', selectedClass.className, m))} />
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
                 testId="runner-java-source"
               />
             </CardContent>
           </Card>
         </Grid>
       </Grid>
     )}
   </Box>
 )
}



