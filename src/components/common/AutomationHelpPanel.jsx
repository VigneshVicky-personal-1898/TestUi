// AI-ASSISTED: Cursor
// PROMPT: Clean Soft UI Automation Help panel styling
// ACCEPTED-BY: vignesh
import { useEffect, useState } from 'react'
import {
  Accordion, AccordionSummary, AccordionDetails, Box, Typography, Chip, Stack,
  Tabs, Tab, Paper, List, ListItem, ListItemText, Divider, IconButton, Tooltip,
  Button,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import { getAutomationHelp } from '../../data/automationHelp'
import { aid, dyn, btn, iconBtn } from '../../utils/automation'

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

function CodeBlock({ code, testId, copyId, maxHeight = 320, compact = false }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return undefined
    const t = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(t)
  }, [copied])

  const handleCopy = async () => {
    try {
      await copyText(code)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Box
      {...aid(`${testId}-wrap`)}
      sx={{
        position: 'relative',
        borderRadius: 1,
        bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(0,0,0,0.35)' : '#0f172a'),
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={0.5}
        sx={{
          px: 1,
          py: 0.5,
          borderBottom: '1px solid rgba(148,163,184,0.25)',
        }}
        {...aid(`${testId}-toolbar`)}
      >
        {compact ? (
          <Tooltip title={copied ? 'Copied!' : 'Copy code'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              {...iconBtn(copyId, copied ? 'Copied' : 'Copy code example')}
              sx={{ color: copied ? '#4ade80' : '#e2e8f0' }}
            >
              {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            size="small"
            variant="text"
            onClick={handleCopy}
            startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
            {...btn(copyId, copied ? 'Copied' : 'Copy code example')}
            sx={{
              color: copied ? '#4ade80' : '#e2e8f0',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 12,
              minWidth: 0,
              px: 1,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        )}
      </Stack>

      <Box
        component="pre"
        {...aid(testId)}
        sx={{
          m: 0,
          p: 1.5,
          color: '#e2e8f0',
          fontSize: 11.5,
          lineHeight: 1.55,
          overflow: 'auto',
          maxHeight,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {code}
      </Box>
    </Box>
  )
}

/**
 * Collapsible Information / Help section explaining automation concepts for a page.
 * Content is resolved from `automationHelp` catalog by `pageId`.
 * Use `compact` in the sidebar for Modules / Advanced Modules menu help.
 */
export default function AutomationHelpPanel({ pageId, defaultExpanded = false, compact = false }) {
  const help = getAutomationHelp(pageId)
  const [tab, setTab] = useState(0)
  const rootId = dyn(pageId || 'page', 'help')

  if (!help) return null

  const frameworks = [
    { key: 'selenium', label: 'Selenium', code: help.selenium },
    { key: 'playwright', label: 'Playwright', code: help.playwright },
    { key: 'cypress', label: 'Cypress', code: help.cypress },
  ]

  const active = frameworks[tab]

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      {...aid(rootId)}
      sx={{
        mb: compact ? 0 : 2.5,
        border: 'none',
        borderRadius: '16px !important',
        bgcolor: 'background.default',
        boxShadow: (t) => t.customShadows?.neuRaisedSm || t.shadows[1],
        '&:before': { display: 'none' },
        overflow: 'hidden',
        '&.Mui-expanded': {
          boxShadow: (t) => t.customShadows?.neuRaised || t.shadows[3],
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        {...btn(dyn(rootId, 'toggle'), 'Toggle automation help')}
        sx={{
          px: compact ? 1.25 : 2,
          minHeight: compact ? 44 : 52,
          '& .MuiAccordionSummary-content': { my: 0.75, alignItems: 'center', gap: 1 },
        }}
      >
        <InfoOutlinedIcon color="primary" fontSize="small" />
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} fontSize={compact ? 12.5 : undefined} {...aid(dyn(rootId, 'title'))}>
            {compact ? 'Menu Automation Help' : `Automation Help — ${help.title}`}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', whiteSpace: compact ? 'normal' : 'nowrap' }}
            {...aid(dyn(rootId, 'summary'))}
          >
            {help.summary}
          </Typography>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ px: compact ? 1.25 : 2, pb: 2, pt: 0 }} {...aid(dyn(rootId, 'content'))}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: compact ? 12.5 : undefined }} {...aid(dyn(rootId, 'description'))}>
          {help.description}
        </Typography>

        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 0.8 }}>
          Key concepts
        </Typography>
        <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mb: 2 }} {...aid(dyn(rootId, 'concepts'))}>
          {help.concepts.map((c) => (
            <Chip
              key={c}
              label={c}
              size="small"
              variant="outlined"
              color="primary"
              {...aid(dyn(rootId, 'concept', c))}
            />
          ))}
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: compact ? '1fr' : { xs: '1fr', md: '1fr 1fr' },
            gap: compact ? 1.5 : 2,
            mb: 2,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: compact ? 1.25 : 1.5,
              border: 'none',
              bgcolor: 'background.default',
              boxShadow: (t) => t.customShadows?.neuInsetSm || 'none',
            }}
            {...aid(dyn(rootId, 'techniques'))}
          >
            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
              Techniques to practice
            </Typography>
            <List dense disablePadding>
              {help.techniques.map((t, i) => (
                <ListItem key={t} disableGutters sx={{ py: 0.25 }} {...aid(dyn(rootId, 'technique', i + 1))}>
                  <ListItemText
                    primary={t}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontSize: compact ? 12.5 : undefined }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: compact ? 1.25 : 1.5,
              border: 'none',
              bgcolor: 'background.default',
              boxShadow: (t) => t.customShadows?.neuInsetSm || 'none',
            }}
            {...aid(dyn(rootId, 'practices'))}
          >
            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
              Best practices
            </Typography>
            <List dense disablePadding>
              {help.bestPractices.map((t, i) => (
                <ListItem key={t} disableGutters sx={{ py: 0.25 }} {...aid(dyn(rootId, 'practice', i + 1))}>
                  <ListItemText
                    primary={t}
                    primaryTypographyProps={{ variant: 'body2', color: 'text.secondary', fontSize: compact ? 12.5 : undefined }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        <Divider sx={{ mb: 1.5 }} />

        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          Framework examples
        </Typography>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant={compact ? 'fullWidth' : 'standard'}
          {...aid(dyn(rootId, 'framework-tabs'))}
          sx={{
            minHeight: 36,
            mb: 1.5,
            '& .MuiTab-root': {
              minHeight: 36,
              minWidth: 0,
              px: compact ? 0.5 : 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: compact ? 12 : undefined,
            },
          }}
        >
          {frameworks.map((f, i) => (
            <Tab
              key={f.key}
              label={compact ? f.label.slice(0, 3) : f.label}
              {...btn(dyn(rootId, 'tab', f.key), `${f.label} examples`)}
              id={`${rootId}-tab-${i}`}
            />
          ))}
        </Tabs>

        <CodeBlock
          code={active.code}
          testId={dyn(rootId, 'code', active.key)}
          copyId={dyn(rootId, 'btn-copy', active.key)}
          maxHeight={compact ? 220 : 320}
          compact={compact}
        />

        {help.suitableFor && (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }} {...aid(dyn(rootId, 'suitable'))}>
            Most suitable for this page: {help.suitableFor}
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
