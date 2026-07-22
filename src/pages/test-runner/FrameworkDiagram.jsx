// AI-ASSISTED: Cursor
// PROMPT: Soft UI framework architecture diagram for Selenium/Playwright
// ACCEPTED-BY: vignesh
import { Box, Typography, Stack, Chip, Paper, Divider } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { aid, dyn } from '../../utils/automation'

const GROUP_COLORS = {
  suite: '#0d9488',
  test: '#0284c7',
  support: '#7c3aed',
  pom: '#ca8a04',
  core: '#64748b',
  driver: '#db2777',
  utils: '#16a34a',
  browser: '#ea580c',
  target: '#0f766e',
}

export default function FrameworkDiagram({ structure, frameworkId }) {
  if (!structure?.nodes?.length) {
    return (
      <Typography color="text.secondary" {...aid('runner-diagram-empty')}>
        Framework structure not available.
      </Typography>
    )
  }

  const flow = ['suites', 'tests', 'pages', 'core', 'driver', 'browser', 'app']
  const side = ['listeners', 'utils']
  const byId = Object.fromEntries(structure.nodes.map((n) => [n.id, n]))

  return (
    <Box {...aid(dyn('runner-diagram', frameworkId))}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        Architecture flow
      </Typography>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.25}
        alignItems="stretch"
        sx={{ mb: 2.5, flexWrap: { md: 'nowrap' }, overflowX: { md: 'auto' }, pb: 1 }}
        {...aid('runner-diagram-flow')}
      >
        {flow.map((id, idx) => {
          const node = byId[id]
          if (!node) return null
          const color = GROUP_COLORS[node.group] || '#64748b'
          return (
            <Stack key={id} direction="row" alignItems="center" spacing={1.25} sx={{ flexShrink: 0 }}>
              <Paper
                elevation={0}
                sx={{
                  px: 2,
                  py: 1.5,
                  minWidth: 130,
                  textAlign: 'center',
                  borderLeft: `4px solid ${color}`,
                }}
                {...aid(dyn('runner-diagram-node', id))}
              >
                <Typography variant="body2" fontWeight={700} sx={{ whiteSpace: 'pre-line' }}>
                  {node.label}
                </Typography>
              </Paper>
              {idx < flow.length - 1 && (
                <ArrowForwardIcon color="action" sx={{ display: { xs: 'none', md: 'block' } }} />
              )}
            </Stack>
          )
        })}
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2.5 }} {...aid('runner-diagram-side')}>
        {side.map((id) => {
          const node = byId[id]
          if (!node) return null
          const color = GROUP_COLORS[node.group] || '#64748b'
          return (
            <Paper
              key={id}
              elevation={0}
              sx={{ flex: 1, px: 2, py: 1.5, borderLeft: `4px solid ${color}` }}
              {...aid(dyn('runner-diagram-node', id))}
            >
              <Typography variant="caption" color="text.secondary" fontWeight={700}>
                Cross-cutting
              </Typography>
              <Typography variant="body2" fontWeight={700} sx={{ whiteSpace: 'pre-line' }}>
                {node.label}
              </Typography>
            </Paper>
          )
        })}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
        Package layers
      </Typography>
      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }} {...aid('runner-diagram-layers')}>
        {(structure.layers || []).map((layer) => (
          <Chip
            key={layer.id}
            label={`${layer.label}`}
            title={layer.path}
            {...aid(dyn('runner-layer', layer.id))}
          />
        ))}
      </Stack>

      <Stack direction="row" flexWrap="wrap" gap={1} {...aid('runner-diagram-counts')}>
        <Chip color="primary" label={`Pages ${structure.counts?.pages ?? 0}`} />
        <Chip color="primary" label={`Tests ${structure.counts?.tests ?? 0}`} />
        <Chip label={`App suites ${structure.counts?.applicationSuites ?? 0}`} />
        <Chip label={`Module suites ${structure.counts?.moduleSuites ?? 0}`} />
        <Chip label={`Modules ${structure.counts?.modules ?? 0}`} />
      </Stack>

      {structure.mermaid && (
        <Box
          component="pre"
          sx={{
            mt: 2.5,
            p: 2,
            borderRadius: 2,
            fontSize: 12,
            overflow: 'auto',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            boxShadow: (t) => t.customShadows?.neuInsetSm,
            bgcolor: 'background.default',
          }}
          {...aid('runner-diagram-mermaid')}
        >
          {structure.mermaid}
        </Box>
      )}
    </Box>
  )
}
