// AI-ASSISTED: Cursor
// PROMPT: Download module: PDF Excel CSV ZIP Image with verify metadata
// ACCEPTED-BY: vignesh

import { useState } from 'react'
import { Box, Paper, Button, Stack, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn } from '../../utils/automation'

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.id = 'downloads-anchor'; a.setAttribute('data-testid', 'downloads-anchor')
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
  return { filename, size: blob.size, type, ts: new Date().toISOString() }
}

export default function DownloadsPage() {
  const [history, setHistory] = useState([])
  const push = (meta) => setHistory((h) => [meta, ...h])

  const items = [
    { id: 'pdf', label: 'PDF', fn: () => push(downloadBlob('%PDF-1.4\nTestUi Report', 'testui-report.pdf', 'application/pdf')) },
    { id: 'excel', label: 'Excel/CSV', fn: () => push(downloadBlob('a,b\n1,2\n', 'testui-export.xlsx.csv', 'text/csv')) },
    { id: 'csv', label: 'CSV', fn: () => push(downloadBlob('id,name\n1,Ada\n', 'testui-data.csv', 'text/csv')) },
    { id: 'zip', label: 'ZIP', fn: () => push(downloadBlob('PK\x03\x04 mock-zip', 'testui-bundle.zip', 'application/zip')) },
    { id: 'image', label: 'Image', fn: () => {
      const canvas = document.createElement('canvas'); canvas.width = 120; canvas.height = 80
      const ctx = canvas.getContext('2d'); ctx.fillStyle = '#0d47a1'; ctx.fillRect(0,0,120,80); ctx.fillStyle = '#fff'; ctx.fillText('TestUi', 40, 45)
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'testui-image.png'; a.click(); URL.revokeObjectURL(url)
        push({ filename: 'testui-image.png', size: blob.size, type: 'image/png', ts: new Date().toISOString() })
      })
    }},
  ]

  return (
    <PageContainer pageId="downloads-page">
      <PageHeader pageId="downloads" title="Downloads" subtitle="PDF, Excel, CSV, ZIP, Image — verify name/size/type" breadcrumbs={['Downloads']} />
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }} {...aid('downloads-actions')}>
        {items.map((i) => <Button key={i.id} variant="contained" {...btn(`downloads-btn-${i.id}`)} onClick={i.fn}>{i.label}</Button>)}
      </Stack>
      <Paper {...aid('downloads-history')}>
        <Table size="small">
          <TableHead><TableRow><TableCell>Filename</TableCell><TableCell>Size</TableCell><TableCell>Type</TableCell><TableCell>Time</TableCell></TableRow></TableHead>
          <TableBody>
            {history.map((h, idx) => (
              <TableRow key={idx} {...aid(`downloads-row-${idx}`)}>
                <TableCell {...aid(`downloads-name-${idx}`)}>{h.filename}</TableCell>
                <TableCell {...aid(`downloads-size-${idx}`)}>{h.size}</TableCell>
                <TableCell>{h.type}</TableCell>
                <TableCell>{h.ts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </PageContainer>
  )
}
