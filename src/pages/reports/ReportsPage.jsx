// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh

import { useRef } from 'react'
import {
  Box, Paper, Button, Stack, Typography, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import TableViewIcon from '@mui/icons-material/TableView'
import PrintIcon from '@mui/icons-material/Print'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'
import { PageHeader } from '../../components/common/PageHeader'
import { CHART_SALES } from '../../data/mockData'
import { useSelector } from 'react-redux'
import { aid, btn } from '../../utils/automation'

export default function ReportsPage() {
  const printRef = useRef()
  const orders = useSelector((s) => s.data.orders).slice(0, 10)

  const downloadCsv = () => {
    const csv = ['month,sales,orders,users', ...CHART_SALES.map((r) => `${r.month},${r.sales},${r.orders},${r.users}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'sales-report.xlsx.csv'
    a.click()
  }

  const downloadPdf = () => {
    // Dummy PDF-like text file for download automation practice
    const content = '%PDF-1.4\n1 0 obj<<>>endobj\nTestUi Sales Report\n' + CHART_SALES.map((r) => `${r.month}: $${r.sales}`).join('\n')
    const blob = new Blob([content], { type: 'application/pdf' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'sales-report.pdf'
    a.click()
  }

  const handlePrint = () => {
    const w = window.open('', '_blank', 'width=800,height=600')
    w.document.write(`<html><head><title>Print Report</title></head><body>${printRef.current.innerHTML}</body></html>`)
    w.document.close()
    w.focus()
    w.print()
  }

  return (
    <Box {...aid('reports-page')}>
      <PageHeader
        pageId="reports"
        title="Reports"
        subtitle="Download PDF, Excel/CSV, print, and graphs"
        breadcrumbs={['Reports']}
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<PictureAsPdfIcon />} onClick={downloadPdf} {...btn('report-download-pdf')}>PDF</Button>
            <Button variant="outlined" startIcon={<TableViewIcon />} onClick={downloadCsv} {...btn('report-download-excel')}>Excel</Button>
            <Button variant="contained" startIcon={<PrintIcon />} onClick={handlePrint} {...btn('report-print')}>Print</Button>
          </Stack>
        }
      />

      <Box ref={printRef}>
        <Paper sx={{ p: 2, mb: 2 }} {...aid('report-graphs')}>
          <Typography variant="h6" gutterBottom>Sales vs Orders</Typography>
          <Box sx={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_SALES}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#0d47a1" />
                <Bar dataKey="orders" fill="#00838f" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Box sx={{ height: 220, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_SALES}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#ed6c02" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        <Paper sx={{ p: 2 }} {...aid('report-table')}>
          <Typography variant="h6" gutterBottom>Recent Orders Snapshot</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>{o.id}</TableCell>
                  <TableCell>{o.customer}</TableCell>
                  <TableCell>${o.total}</TableCell>
                  <TableCell>{o.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  )
}
