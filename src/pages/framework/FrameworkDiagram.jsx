
//  Smooth user-friendly Framework architecture story diagram

import { useMemo, useState } from 'react'
import {
 Box, Typography, Stack, Chip, Paper, Divider, Collapse, Button, alpha, useTheme,
} from '@mui/material'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import ScienceIcon from '@mui/icons-material/Science'
import WebAssetIcon from '@mui/icons-material/WebAsset'
import LayersIcon from '@mui/icons-material/Layers'
import SettingsEthernetIcon from '@mui/icons-material/SettingsEthernet'
import LanguageIcon from '@mui/icons-material/Language'
import AppsIcon from '@mui/icons-material/Apps'
import HearingIcon from '@mui/icons-material/Hearing'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import SouthIcon from '@mui/icons-material/South'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { aid, btn, dyn } from '../../utils/automation'


/** Plain-language guide so any user can follow how a test run works. */
const STEP_META = {
 suites: {
   icon: PlaylistAddCheckIcon,
   title: '1. Choose a Test Suite',
   plain: 'A suite XML file decides which tests to run (smoke, regression, module, etc.).',
   color: '#0d9488',
 },
 tests: {
   icon: ScienceIcon,
   title: '2. Run Test Classes',
   plain: 'TestNG executes the Java test methods listed in that suite.',
   color: '#0284c7',
 },
 pages: {
   icon: WebAssetIcon,
   title: '3. Talk to Page Objects',
   plain: 'Tests call Page Objects (POM) instead of raw locators — cleaner and reusable.',
   color: '#ca8a04',
 },
 core: {
   icon: LayersIcon,
   title: '4. Share Common Actions',
   plain: 'BasePage / core helpers hold shared clicks, waits, and assertions.',
   color: '#64748b',
 },
 driver: {
   icon: SettingsEthernetIcon,
   title: '5. Create the Browser Driver',
   plain: 'Driver factory / manager starts Chrome, Firefox, Edge, or Chromium.',
   color: '#db2777',
 },
 browser: {
   icon: LanguageIcon,
   title: '6. Control the Browser',
   plain: 'The real browser opens and follows the automation commands.',
   color: '#ea580c',
 },
 app: {
   icon: AppsIcon,
   title: '7. Exercise the Application',
   plain: 'The browser hits TestUi (your app under test) and verifies the UI.',
   color: '#0f766e',
 },
}


const SUPPORT_META = {
 listeners: {
   icon: HearingIcon,
   title: 'Listeners & Data Providers',
   plain: 'Hook into test start/finish, pass data into tests, and react to failures.',
   color: '#7c3aed',
 },
 utils: {
   icon: PhotoCameraIcon,
   title: 'Reports & Screenshots',
   plain: 'Extent reports, logs, and screenshots capture what happened during the run.',
   color: '#16a34a',
 },
}


function StepCard({ id, node, meta, active, onHover, index }) {
 const theme = useTheme()
 const Icon = meta.icon
 const raised = theme.customShadows?.neuRaised
 const raisedSm = theme.customShadows?.neuRaisedSm


 return (
   <Paper
     elevation={0}
     onMouseEnter={() => onHover(id)}
     onMouseLeave={() => onHover(null)}
     onFocus={() => onHover(id)}
     onBlur={() => onHover(null)}
     tabIndex={0}
     sx={{
       position: 'relative',
       p: { xs: 2, sm: 2.25 },
       borderRadius: 3,
       bgcolor: 'background.default',
       boxShadow: active ? raised : raisedSm,
       borderLeft: `5px solid ${meta.color}`,
       transform: active ? 'translateY(-2px) scale(1.01)' : 'none',
       transition: 'transform 0.28s ease, box-shadow 0.28s ease, background-color 0.28s ease',
       outline: 'none',
       backgroundImage: active
         ? `linear-gradient(135deg, ${alpha(meta.color, 0.08)} 0%, transparent 55%)`
         : 'none',
       animation: `fwFadeUp 0.45s ease ${index * 0.06}s both`,
       '@keyframes fwFadeUp': {
         from: { opacity: 0, transform: 'translateY(12px)' },
         to: { opacity: 1, transform: 'translateY(0)' },
       },
       '&:focus-visible': {
         boxShadow: raised,
         outline: `2px solid ${meta.color}`,
         outlineOffset: 2,
       },
     }}
     {...aid(dyn('framework-diagram-node', id))}
   >
     <Stack direction="row" spacing={1.75} alignItems="flex-start">
       <Box
         sx={{
           width: 44,
           height: 44,
           borderRadius: 2,
           flexShrink: 0,
           display: 'grid',
           placeItems: 'center',
           color: meta.color,
           bgcolor: alpha(meta.color, 0.12),
           boxShadow: theme.customShadows?.neuInsetSm,
         }}
         {...aid(dyn('framework-diagram-icon', id))}
       >
         <Icon fontSize="small" />
       </Box>
       <Box sx={{ minWidth: 0, flex: 1 }}>
         <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
           {meta.title}
         </Typography>
         <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.55 }}>
           {meta.plain}
         </Typography>
         {node?.label && (
           <Chip
             size="small"
             label={String(node.label).replace(/\n/g, ' · ')}
             sx={{ mt: 1.25, maxWidth: '100%' }}
             {...aid(dyn('framework-diagram-node-meta', id))}
           />
         )}
       </Box>
     </Stack>
   </Paper>
 )
}


function Connector({ active }) {
 return (
   <Box
     sx={{
       display: 'flex',
       justifyContent: 'center',
       py: 0.5,
       color: active ? 'primary.main' : 'text.disabled',
       transition: 'color 0.25s ease, transform 0.25s ease',
       transform: active ? 'translateY(2px)' : 'none',
     }}
     aria-hidden
     {...aid('framework-diagram-connector')}
   >
     <SouthIcon
       fontSize="small"
       sx={{
         animation: active ? 'fwBounce 0.9s ease infinite' : 'none',
         '@keyframes fwBounce': {
           '0%, 100%': { transform: 'translateY(0)', opacity: 0.7 },
           '50%': { transform: 'translateY(4px)', opacity: 1 },
         },
       }}
     />
   </Box>
 )
}


export default function FrameworkDiagram({ structure, frameworkId }) {
 const theme = useTheme()
 const [hoverId, setHoverId] = useState(null)
 const [showTech, setShowTech] = useState(false)


 const byId = useMemo(
   () => Object.fromEntries((structure?.nodes || []).map((n) => [n.id, n])),
   [structure],
 )


 const steps = useMemo(
   () => ['suites', 'tests', 'pages', 'core', 'driver', 'browser', 'app']
     .map((id) => ({ id, node: byId[id], meta: STEP_META[id] }))
     .filter((s) => s.node && s.meta),
   [byId],
 )


 const support = useMemo(
   () => ['listeners', 'utils']
     .map((id) => ({ id, node: byId[id], meta: SUPPORT_META[id] }))
     .filter((s) => s.node && s.meta),
   [byId],
 )


 if (!structure?.nodes?.length) {
   return (
     <Typography color="text.secondary" {...aid('framework-diagram-empty')}>
       Framework structure not available.
     </Typography>
   )
 }


 const counts = structure.counts || {}
 const fwLabel = structure.framework?.label || 'Automation framework'


 return (
   <Box {...aid(dyn('framework-diagram', frameworkId))}>
     <Paper
       elevation={0}
       sx={{
         p: { xs: 2, sm: 2.5 },
         mb: 2.5,
         borderRadius: 3,
         bgcolor: 'background.default',
         boxShadow: theme.customShadows?.neuInsetSm,
         backgroundImage: `linear-gradient(120deg, ${alpha(theme.palette.primary.main, 0.08)}, transparent 60%)`,
       }}
       {...aid('framework-diagram-intro')}
     >
       <Typography variant="h6" fontWeight={700} gutterBottom>
         How a test run flows
       </Typography>
       <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720, lineHeight: 1.6 }}>
         Follow the steps top to bottom — from picking a suite file to driving the browser against{' '}
         <strong>{fwLabel}</strong>. Hover any step for a soft highlight. Supporting tools
         (listeners & reports) sit beside the main path.
       </Typography>
       <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.75 }} {...aid('framework-diagram-counts')}>
         <Chip color="primary" label={`${counts.pages ?? 0} page objects`} />
         <Chip color="primary" label={`${counts.tests ?? 0} test classes`} />
         <Chip label={`${counts.applicationSuites ?? 0} app suites`} />
         <Chip label={`${counts.moduleSuites ?? 0} module suites`} />
         <Chip label={`${counts.modules ?? 0} modules`} />
       </Stack>
     </Paper>


     <Box
       sx={{
         display: 'grid',
         gap: 2,
         gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.4fr) minmax(260px, 0.8fr)' },
         alignItems: 'start',
       }}
     >
       <Box {...aid('framework-diagram-flow')}>
         <Typography variant="overline" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
           Main path
         </Typography>
         {steps.map((step, idx) => (
           <Box key={step.id}>
             <StepCard
               id={step.id}
               node={step.node}
               meta={step.meta}
               active={hoverId === step.id}
               onHover={setHoverId}
               index={idx}
             />
             {idx < steps.length - 1 && (
               <Connector active={hoverId === step.id || hoverId === steps[idx + 1]?.id} />
             )}
           </Box>
         ))}
       </Box>


       <Stack spacing={1.5} {...aid('framework-diagram-side')}>
         <Typography variant="overline" color="text.secondary">
           Always running alongside
         </Typography>
         {support.map((item, idx) => {
           const Icon = item.meta.icon
           const active = hoverId === item.id
           return (
             <Paper
               key={item.id}
               elevation={0}
               onMouseEnter={() => setHoverId(item.id)}
               onMouseLeave={() => setHoverId(null)}
               sx={{
                 p: 2,
                 borderRadius: 3,
                 bgcolor: 'background.default',
                 boxShadow: active ? theme.customShadows?.neuRaised : theme.customShadows?.neuRaisedSm,
                 borderTop: `4px solid ${item.meta.color}`,
                 transition: 'transform 0.28s ease, box-shadow 0.28s ease',
                 transform: active ? 'translateY(-2px)' : 'none',
                 animation: `fwFadeUp 0.45s ease ${0.2 + idx * 0.08}s both`,
                 '@keyframes fwFadeUp': {
                   from: { opacity: 0, transform: 'translateY(12px)' },
                   to: { opacity: 1, transform: 'translateY(0)' },
                 },
               }}
               {...aid(dyn('framework-diagram-node', item.id))}
             >
               <Stack direction="row" spacing={1.5} alignItems="flex-start">
                 <Box
                   sx={{
                     width: 40,
                     height: 40,
                     borderRadius: 2,
                     display: 'grid',
                     placeItems: 'center',
                     color: item.meta.color,
                     bgcolor: alpha(item.meta.color, 0.12),
                   }}
                 >
                   <Icon fontSize="small" />
                 </Box>
                 <Box>
                   <Typography variant="subtitle2" fontWeight={700}>
                     {item.meta.title}
                   </Typography>
                   <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.55 }}>
                     {item.meta.plain}
                   </Typography>
                 </Box>
               </Stack>
             </Paper>
           )
         })}


         <Paper
           elevation={0}
           sx={{
             p: 2,
             borderRadius: 3,
             bgcolor: 'background.default',
             boxShadow: theme.customShadows?.neuInsetSm,
           }}
           {...aid('framework-diagram-layers')}
         >
           <Typography variant="subtitle2" fontWeight={700} gutterBottom>
             Package folders
           </Typography>
           <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.25 }}>
             These folders map to the steps above.
           </Typography>
           <Stack direction="row" flexWrap="wrap" gap={0.75}>
             {(structure.layers || []).map((layer) => (
               <Chip
                 key={layer.id}
                 size="small"
                 label={layer.label}
                 title={layer.path}
                 {...aid(dyn('framework-layer', layer.id))}
               />
             ))}
           </Stack>
         </Paper>
       </Stack>
     </Box>


     <Divider sx={{ my: 2.5 }} />


     <Button
       size="small"
       endIcon={showTech ? <ExpandLessIcon /> : <ExpandMoreIcon />}
       onClick={() => setShowTech((v) => !v)}
       {...btn('framework-diagram-tech-toggle', showTech ? 'Hide technical view' : 'Show technical view')}
     >
       {showTech ? 'Hide technical view' : 'Show technical view (advanced)'}
     </Button>
     <Collapse in={showTech}>
       <Box
         component="pre"
         sx={{
           mt: 1.5,
           p: 2,
           borderRadius: 2,
           fontSize: 12,
           overflow: 'auto',
           fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
           boxShadow: theme.customShadows?.neuInsetSm,
           bgcolor: 'background.default',
         }}
         {...aid('framework-diagram-mermaid')}
       >
         {structure.mermaid || 'No technical diagram available.'}
       </Box>
     </Collapse>
   </Box>
 )
}



