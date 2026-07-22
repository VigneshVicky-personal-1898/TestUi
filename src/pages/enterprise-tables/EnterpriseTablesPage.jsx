// AI-ASSISTED: Cursor
// PROMPT: Add option() automation attrs to enterprise table MenuItems
// ACCEPTED-BY: vignesh

import { useEffect, useMemo, useState, useCallback } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  Box, Paper, Table, TableHead, TableBody, TableRow, TableCell, TablePagination, TextField,
  Button, Stack, IconButton, Collapse, Typography, Checkbox, MenuItem, Select, FormControl, InputLabel,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { mockServerTable } from '../../utils/mockApi'
import { generateProducts } from '../../data/mockData'
import { aid, btn, field, option, optId } from '../../utils/automation'

const ALL = generateProducts(120)

function DraggableRow({ row, index, moveRow, children }) {
  const ref = useCallback(() => {}, [])
  const [, drop] = useDrop({ accept: 'ROW', hover(item) { if (item.index !== index) { moveRow(item.index, index); item.index = index } } })
  const [{ isDragging }, drag] = useDrag({ type: 'ROW', item: { id: row.id, index }, collect: (m) => ({ isDragging: m.isDragging() }) })
  return (
    <TableRow ref={(n) => drag(drop(n))} hover sx={{ opacity: isDragging ? 0.4 : 1 }} {...aid(`ent-table-row-${row.id}`)}>
      {children}
    </TableRow>
  )
}

export default function EnterpriseTablesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState({ data: [], total: 0 })
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [expanded, setExpanded] = useState({})
  const [cols, setCols] = useState(['drag', 'name', 'sku', 'category', 'price', 'stock', 'status', 'actions'])
  const [groupBy, setGroupBy] = useState('none')
  const [localRows, setLocalRows] = useState(ALL)

  const fetchPage = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 400))
    const res = mockServerTable({
      rows: localRows, page, pageSize, sortBy, sortDir,
      filters: { status }, search,
    })
    setResult(res)
    setLoading(false)
  }

  useEffect(() => { fetchPage() }, [page, pageSize, sortBy, sortDir, status, search, localRows])

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir((d) => d === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const saveInline = (id) => {
    setLocalRows((rows) => rows.map((r) => r.id === id ? { ...r, name: editName } : r))
    setEditId(null)
  }

  const copyRow = (row) => navigator.clipboard.writeText(JSON.stringify(row))
  const duplicateRow = (row) => setLocalRows((rows) => [{ ...row, id: String(Date.now()), name: row.name + ' (copy)', sku: row.sku + '-C' }, ...rows])

  const moveRow = (from, to) => {
    setResult((prev) => {
      const data = [...prev.data]
      const [r] = data.splice(from, 1)
      data.splice(to, 0, r)
      return { ...prev, data }
    })
  }

  const moveCol = (from, to) => {
    setCols((prev) => { const n = [...prev]; const [c] = n.splice(from, 1); n.splice(to, 0, c); return n })
  }

  const aggregates = useMemo(() => {
    const prices = result.data.map((r) => r.price)
    return {
      count: result.data.length,
      sum: prices.reduce((a, b) => a + b, 0).toFixed(2),
      avg: prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2) : 0,
    }
  }, [result.data])

  const grouped = useMemo(() => {
    if (groupBy === 'none') return null
    const map = {}
    result.data.forEach((r) => {
      const k = r[groupBy]
      if (!map[k]) map[k] = []
      map[k].push(r)
    })
    return map
  }, [result.data, groupBy])

  return (
    <DndProvider backend={HTML5Backend}>
      <PageContainer pageId="enterprise-tables-page">
        <PageHeader pageId="enterprise-tables" title="Enterprise Tables" subtitle="Server pagination/filter, inline edit, master-detail, group, aggregate, column reorder, row DnD" breadcrumbs={['Enterprise Tables']} />
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 2 }} useFlexGap flexWrap="wrap">
          <TextField size="small" placeholder="Server search…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} {...field('ent-table-search', 'search')} />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(0) }} {...aid('ent-table-filter-status')}>
              <MenuItem value="all" {...option(optId('ent-table-filter-status', 'all'))}>All</MenuItem>
              <MenuItem value="active" {...option(optId('ent-table-filter-status', 'active'))}>Active</MenuItem>
              <MenuItem value="draft" {...option(optId('ent-table-filter-status', 'draft'))}>Draft</MenuItem>
              <MenuItem value="out_of_stock" {...option(optId('ent-table-filter-status', 'out_of_stock'))}>Out of stock</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Group By</InputLabel>
            <Select label="Group By" value={groupBy} onChange={(e) => setGroupBy(e.target.value)} {...aid('ent-table-groupby')}>
              <MenuItem value="none" {...option(optId('ent-table-groupby', 'none'))}>None</MenuItem>
              <MenuItem value="category" {...option(optId('ent-table-groupby', 'category'))}>Category</MenuItem>
              <MenuItem value="status" {...option(optId('ent-table-groupby', 'status'))}>Status</MenuItem>
            </Select>
          </FormControl>
          <Button {...btn('ent-table-btn-col-left')} onClick={() => moveCol(1, 0)}>Reorder Col ←</Button>
          {loading && <Typography variant="caption" {...aid('ent-table-loading')}>Loading…</Typography>}
        </Stack>

        <Paper {...aid('ent-table-paper')}>
          <Box sx={{ overflow: 'auto' }}>
            <Table stickyHeader size="small" {...aid('ent-table')}>
              <TableHead>
                <TableRow>
                  {cols.map((c) => (
                    <TableCell key={c} sx={{ position: c === 'name' || c === 'sku' ? 'sticky' : 'static', left: c === 'name' ? 0 : c === 'sku' ? 140 : undefined, bgcolor: 'background.paper', zIndex: c === 'name' || c === 'sku' ? 2 : 1, minWidth: c === 'name' ? 140 : 90 }}
                      onClick={() => ['name','sku','price','stock'].includes(c) && toggleSort(c)}
                      {...aid(`ent-table-th-${c}`)}
                    >
                      {c}{sortBy === c ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(grouped ? Object.entries(grouped).flatMap(([g, rows]) => [
                  <TableRow key={'g-'+g} {...aid(`ent-table-group-${g}`)}><TableCell colSpan={cols.length}><strong>Group: {g} ({rows.length})</strong></TableCell></TableRow>,
                  ...rows.map((row, index) => renderRow(row, index)),
                ]) : result.data.map((row, index) => renderRow(row, index)))}
                <TableRow {...aid('ent-table-footer')}>
                  <TableCell colSpan={cols.length}>Aggregate — count: {aggregates.count} · sum: ${aggregates.sum} · avg: ${aggregates.avg}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <TablePagination component="div" count={result.total} page={page} onPageChange={(_, p) => setPage(p)}
            rowsPerPage={pageSize} onRowsPerPageChange={(e) => { setPageSize(+e.target.value); setPage(0) }}
            {...aid('ent-table-pagination')} />
        </Paper>
      </PageContainer>
    </DndProvider>
  )

  function renderRow(row, index) {
    const open = !!expanded[row.id]
    return (
      <>
        <DraggableRow key={row.id} row={row} index={index} moveRow={moveRow}>
          {cols.map((c) => {
            if (c === 'drag') return <TableCell key={c}><DragIndicatorIcon fontSize="small" color="action" /></TableCell>
            if (c === 'actions') return (
              <TableCell key={c}>
                <IconButton size="small" {...btn(`ent-table-btn-expand-${row.id}`)} onClick={() => setExpanded((e) => ({ ...e, [row.id]: !e[row.id] }))}>{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>
                <IconButton size="small" {...btn(`ent-table-btn-edit-${row.id}`)} onClick={() => { setEditId(row.id); setEditName(row.name) }}><EditIcon fontSize="small" /></IconButton>
                <IconButton size="small" {...btn(`ent-table-btn-copy-${row.id}`)} onClick={() => copyRow(row)}><ContentCopyIcon fontSize="small" /></IconButton>
                <IconButton size="small" {...btn(`ent-table-btn-dup-${row.id}`)} onClick={() => duplicateRow(row)}><ControlPointDuplicateIcon fontSize="small" /></IconButton>
              </TableCell>
            )
            if (c === 'name' && editId === row.id) return (
              <TableCell key={c}>
                <TextField size="small" value={editName} onChange={(e) => setEditName(e.target.value)} {...field(`ent-table-inline-${row.id}`, 'inlineName')} />
                <Button size="small" {...btn(`ent-table-btn-save-${row.id}`)} onClick={() => saveInline(row.id)}>Save</Button>
              </TableCell>
            )
            return <TableCell key={c} sx={{ position: c === 'name' || c === 'sku' ? 'sticky' : 'static', left: c === 'name' ? 0 : c === 'sku' ? 140 : undefined, bgcolor: 'background.paper' }}>{String(row[c] ?? '')}</TableCell>
          })}
        </DraggableRow>
        <TableRow key={row.id + '-detail'}>
          <TableCell colSpan={cols.length} sx={{ py: 0, border: 0 }}>
            <Collapse in={open}>
              <Box sx={{ p: 2 }} {...aid(`ent-table-detail-${row.id}`)}>
                <Typography variant="subtitle2">Master-Detail / Child Grid</Typography>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Field</TableCell><TableCell>Value</TableCell></TableRow></TableHead>
                  <TableBody>
                    <TableRow><TableCell>Description</TableCell><TableCell>{row.description}</TableCell></TableRow>
                    <TableRow><TableCell>Tags</TableCell><TableCell>{(row.tags || []).join(', ')}</TableCell></TableRow>
                    <TableRow><TableCell>Created</TableCell><TableCell>{row.createdAt}</TableCell></TableRow>
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    )
  }
}
