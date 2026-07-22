// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh

import { useMemo, useState, useRef } from 'react'
import {
  useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel,
  getPaginationRowModel, flexRender,
} from '@tanstack/react-table'
import { AgGridReact } from 'ag-grid-react'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import {
  Box, Paper, TextField, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TableSortLabel, TablePagination, Checkbox, FormControlLabel,
  FormGroup, Typography, Tabs, Tab, Slider,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { PageHeader } from '../../components/common/PageHeader'
import { aid, btn, field, control, dyn } from '../../utils/automation'

ModuleRegistry.registerModules([AllCommunityModule])

export default function TablesPage() {
  const products = useSelector((s) => s.data.products)
  const [tab, setTab] = useState(0)
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})
  const [colWidths, setColWidths] = useState({ name: 180, sku: 100, category: 120, price: 80, stock: 80 })
  const gridRef = useRef()

  const columns = useMemo(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={table.getIsSomePageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          {...control('table-select-all', 'table-select-all', 'Select all rows')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          {...control(dyn('table-select', row.original.id), dyn('table-select', row.original.id), `Select row ${row.original.id}`)}
        />
      ),
      size: 50,
    },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'sku', header: 'SKU' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'price', header: 'Price', cell: (info) => `$${info.getValue()}` },
    { accessorKey: 'stock', header: 'Stock' },
    { accessorKey: 'status', header: 'Status' },
  ], [])

  const table = useReactTable({
    data: products,
    columns,
    state: { sorting, globalFilter, rowSelection, columnVisibility },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    initialState: { pagination: { pageSize: 10 } },
  })

  const agCols = useMemo(() => [
    { field: 'name', filter: true, sortable: true, resizable: true, checkboxSelection: true, headerCheckboxSelection: true },
    { field: 'sku', filter: true, sortable: true },
    { field: 'category', filter: true, sortable: true },
    { field: 'price', filter: 'agNumberColumnFilter', sortable: true },
    { field: 'stock', filter: 'agNumberColumnFilter', sortable: true },
    { field: 'status', filter: true, sortable: true },
  ], [])

  const onResize = (key, value) => setColWidths((prev) => ({ ...prev, [key]: value }))

  return (
    <Box {...aid('tables-page')}>
      <PageHeader pageId="tables" title="Table Features" subtitle="Sorting, filtering, search, pagination, sticky header, column hide/show, resize, row selection, virtual/AG Grid" breadcrumbs={['Tables']} />

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }} {...aid('tables-tabs')}>
        <Tab label="TanStack Table" {...btn('tab-tanstack')} />
        <Tab label="AG Grid (Virtual)" {...btn('tab-aggrid')} />
      </Tabs>

      {tab === 0 && (
        <Paper {...aid('tanstack-table-section')}>
          <Box sx={{ p: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField size="small" placeholder="Search..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} {...field('table-search')} />
            <FormGroup row {...aid('column-visibility')}>
              {table.getAllLeafColumns().filter((c) => c.id !== 'select').map((col) => (
                <FormControlLabel
                  key={col.id}
                  control={
                    <Checkbox
                      checked={col.getIsVisible()}
                      onChange={col.getToggleVisibilityHandler()}
                      {...control(dyn('col-toggle', col.id), dyn('col-toggle', col.id), `Toggle column ${col.id}`)}
                    />
                  }
                  label={col.id}
                />
              ))}
            </FormGroup>
            <Typography variant="caption">{Object.keys(rowSelection).length} selected</Typography>
          </Box>

          <Box sx={{ px: 2, mb: 1 }} {...aid('column-resize-controls')}>
            <Typography variant="caption">Resize columns:</Typography>
            {['name', 'sku', 'category', 'price', 'stock'].map((k) => (
              <Box key={k} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mr: 2 }}>
                <Typography variant="caption">{k}</Typography>
                <Slider value={colWidths[k]} min={60} max={300} onChange={(_, v) => onResize(k, v)} sx={{ width: 80 }} size="small" {...aid(dyn('resize', k))} />
              </Box>
            ))}
          </Box>

          <TableContainer sx={{ maxHeight: 440 }} {...aid('tanstack-table')}>
            <Table stickyHeader size="small">
              <TableHead>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        sortDirection={header.column.getIsSorted() || false}
                        sx={{ width: colWidths[header.column.id] || header.getSize(), position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}
                        {...aid(dyn('th', header.column.id))}
                      >
                        {header.isPlaceholder ? null : (
                          <TableSortLabel
                            active={!!header.column.getIsSorted()}
                            direction={header.column.getIsSorted() || 'asc'}
                            onClick={header.column.getToggleSortingHandler()}
                            hideSortIcon={!header.column.getCanSort()}
                            {...btn(dyn('sort', header.column.id), `Sort by ${header.column.id}`)}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableSortLabel>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} selected={row.getIsSelected()} hover {...aid(dyn('tr', row.original.id))}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} sx={{ width: colWidths[cell.column.id] }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={table.getFilteredRowModel().rows.length}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, p) => table.setPageIndex(p)}
            rowsPerPage={table.getState().pagination.pageSize}
            onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
            {...aid('tanstack-pagination')}
          />
        </Paper>
      )}

      {tab === 1 && (
        <Box className="ag-theme-alpine" sx={{ height: 500, width: '100%' }} {...aid('ag-grid-section')}>
          <AgGridReact
            ref={gridRef}
            rowData={products}
            columnDefs={agCols}
            rowSelection="multiple"
            pagination
            paginationPageSize={15}
            animateRows
            {...aid('ag-grid')}
          />
        </Box>
      )}
    </Box>
  )
}
