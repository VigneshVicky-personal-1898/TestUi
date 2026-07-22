// AI-ASSISTED: Cursor
// PROMPT: Migrate OrdersPage interactive elements to automation helpers
// ACCEPTED-BY: vignesh
import { useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Collapse, Typography, Select, MenuItem, FormControl,
  Stepper, Step, StepLabel, StepContent, TextField, TablePagination,
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { PageHeader } from '../../components/common/PageHeader'
import { updateOrderStatus } from '../../store'
import { aid, field, select, option, iconBtn, optId } from '../../utils/automation'

const STATUS_COLORS = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'error',
  refunded: 'default',
}

function OrderRow({ order }) {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const statusSelectId = `order-status-${order.id}`

  return (
    <Fragment>
      <TableRow hover {...aid(`order-row-${order.id}`)}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
            {...iconBtn(`order-expand-${order.id}`, open ? `Collapse order ${order.id}` : `Expand order ${order.id}`)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell {...aid(`order-id-${order.id}`)}>{order.id}</TableCell>
        <TableCell>{order.customer}</TableCell>
        <TableCell>{order.email}</TableCell>
        <TableCell>${order.total}</TableCell>
        <TableCell>{order.createdAt}</TableCell>
        <TableCell>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select
              value={order.status}
              onChange={(e) => dispatch(updateOrderStatus({ id: order.id, status: e.target.value }))}
              {...select(statusSelectId, statusSelectId, `Update status for ${order.id}`)}
            >
              {Object.keys(STATUS_COLORS).map((s) => (
                <MenuItem key={s} value={s} {...option(optId(statusSelectId, s), s)}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          <Chip label={order.status} size="small" color={STATUS_COLORS[order.status] || 'default'} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} sx={{ py: 0, borderBottom: open ? undefined : 'none' }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, px: 2 }} {...aid(`order-detail-${order.id}`)}>
              <Typography variant="subtitle2" gutterBottom>Order Items</Typography>
              <Table size="small" {...aid(`order-items-${order.id}`)}>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.qty}</TableCell>
                      <TableCell>${item.price}</TableCell>
                      <TableCell>${(item.qty * item.price).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>Timeline</Typography>
              <Box {...aid(`order-timeline-${order.id}`)} sx={{ maxWidth: 480 }}>
                <Stepper orientation="vertical" activeStep={order.timeline.length}>
                  {order.timeline.map((t, i) => (
                    <Step key={i} completed>
                      <StepLabel optional={<Typography variant="caption">{t.date}</Typography>}>
                        {t.status}
                      </StepLabel>
                      <StepContent>
                        <Typography variant="body2">{t.note}</Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Ship to: {order.shippingAddress}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
}

export default function OrdersPage() {
  const orders = useSelector((s) => s.data.orders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase()
    const match = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
    const statusOk = statusFilter === 'all' || o.status === statusFilter
    return match && statusOk
  })

  const rows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const filterSelectId = 'orders-filter-status'

  return (
    <Box {...aid('orders-page')}>
      <PageHeader pageId="orders" title="Order Management" subtitle="Expandable rows, nested tables, status updates & timelines" breadcrumbs={['Orders']} />

      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search orders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          {...field('orders-search')}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            displayEmpty
            {...select(filterSelectId, filterSelectId, 'Filter by status')}
          >
            <MenuItem value="all" {...option(optId(filterSelectId, 'all'), 'All Statuses')}>All Statuses</MenuItem>
            {Object.keys(STATUS_COLORS).map((s) => (
              <MenuItem key={s} value={s} {...option(optId(filterSelectId, s), s)}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper>
        <TableContainer {...aid('orders-table')}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={50} />
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Update Status</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((order) => <OrderRow key={order.id} order={order} />)}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(+e.target.value); setPage(0) }}
          {...aid('orders-pagination')}
        />
      </Paper>
    </Box>
  )
}
