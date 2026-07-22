// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh

import { useState } from 'react'
import { Box, Paper, Button, TextField, Typography, Switch, FormControlLabel, Slider, Stack } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn, field, control } from '../../utils/automation'

export default function A11yPage() {
  const [highContrast, setHighContrast] = useState(false)
  const [fontScale, setFontScale] = useState(100)
  return (
    <PageContainer pageId="a11y-page">
      <PageHeader pageId="a11y" title="Accessibility Lab" subtitle="ARIA labels, keyboard-only, focus, contrast, alt text, font size" breadcrumbs={['Accessibility']} />
      <Paper sx={{ p: 3, ...(highContrast ? { bgcolor: '#000', color: '#fff', '& .MuiInputBase-root': { color: '#fff' } } : {}) }} {...aid('a11y-panel')}>
        <FormControlLabel
          control={
            <Switch
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
              {...control('a11y-switch-contrast', 'a11y-switch-contrast', 'High contrast')}
            />
          }
          label="High Contrast"
        />
        <Typography gutterBottom>Font size: {fontScale}%</Typography>
        <Slider min={80} max={160} value={fontScale} onChange={(_, v) => setFontScale(v)} {...aid('a11y-font-slider')} />
        <Box sx={{ fontSize: `${fontScale}%`, mt: 2 }}>
          <Button {...btn('a11y-btn-primary', 'Primary accessible action')}>Accessible Button</Button>
          <TextField
            sx={{ ml: 2, mt: { xs: 2, sm: 0 } }}
            label="Required field"
            required
            helperText={<span id="a11y-help">Screen reader description</span>}
            {...field('a11y-input-required', 'requiredField')}
            slotProps={{
              htmlInput: {
                id: 'a11y-input-required',
                name: 'requiredField',
                'data-testid': 'a11y-input-required',
                'aria-required': true,
                'aria-describedby': 'a11y-help',
              },
            }}
          />
          <Box sx={{ mt: 2 }}>
            <img src="https://picsum.photos/seed/a11y/200/100" alt="Sample product banner for accessibility alt-text practice" {...aid('a11y-img')} />
          </Box>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.querySelector('button')?.click() }}>
            <Button {...btn('a11y-btn-tab-1')}>Tab 1</Button>
            <Button {...btn('a11y-btn-tab-2')}>Tab 2</Button>
            <Button {...btn('a11y-btn-tab-3')}>Tab 3</Button>
          </Stack>
          <Typography variant="body2" sx={{ mt: 2 }}>Use keyboard only: Tab / Shift+Tab / Enter / Space</Typography>
        </Box>
      </Paper>
    </PageContainer>
  )
}
