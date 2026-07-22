// AI-ASSISTED: Cursor
// PROMPT: Soft UI Users page inherits neumorphic theme surfaces
// ACCEPTED-BY: vignesh
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, IconButton, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, TablePagination,
  Toolbar, Typography, Stack, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { useForm } from 'react-hook-form'
import { PageHeader } from '../../components/common/PageHeader'
import { EmptyState } from '../../components/common/PageHeader'
import { addUser, updateUser, deleteUser, bulkDeleteUsers, setUsers } from '../../store'
import { ROLES } from '../../data/mockData'
import { aid, btn, iconBtn, field, control, select, option, input, dyn, optId } from '../../utils/automation'

export default function UsersPage() {
  const dispatch = useDispatch()
  const users = useSelector((s) => s.data.users)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [importMsg, setImportMsg] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase()
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q)
      const matchRole = roleFilter === 'all' || u.role === roleFilter
      const matchStatus = statusFilter === 'all' || u.status === statusFilter
      return matchSearch && matchRole && matchStatus
    })
  }, [users, search, roleFilter, statusFilter])

  const pageRows = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  const allSelected = pageRows.length > 0 && pageRows.every((u) => selected.includes(u.id))

  const openCreate = () => {
    setEditing(null)
    reset({ name: '', email: '', role: 'employee', department: '', status: 'active', phone: '' })
    setDialogOpen(true)
  }

  const openEdit = (user) => {
    setEditing(user)
    reset(user)
    setDialogOpen(true)
  }

  const onSave = (data) => {
    if (editing) {
      dispatch(updateUser({ ...editing, ...data }))
    } else {
      dispatch(addUser({ ...data, id: String(Date.now()), createdAt: new Date().toISOString().slice(0, 10) }))
    }
    setDialogOpen(false)
  }

  const handleExport = () => {
    const csv = ['name,email,role,department,status,phone', ...filtered.map((u) =>
      `${u.name},${u.email},${u.role},${u.department},${u.status},${u.phone}`
    )].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users-export.csv'
    a.setAttribute('data-testid', 'users-download-link')
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const lines = String(ev.target.result).trim().split('\n').slice(1)
      const imported = lines.map((line, i) => {
        const [name, email, role, department, status, phone] = line.split(',')
        return {
          id: `imp-${Date.now()}-${i}`,
          name: name?.trim() || `Imported ${i}`,
          email: email?.trim() || `import${i}@testui.com`,
          role: role?.trim() || 'employee',
          department: department?.trim() || 'General',
          status: status?.trim() || 'active',
          phone: phone?.trim() || '',
          createdAt: new Date().toISOString().slice(0, 10),
        }
      })
      dispatch(setUsers([...imported, ...users]))
      setImportMsg(`Imported ${imported.length} users`)
      setTimeout(() => setImportMsg(''), 3000)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <Box {...aid('users-page')}>
      <PageHeader
        pageId="users"
        title="User Management"
        subtitle="Add, edit, delete, search, filter, and bulk manage users"
        breadcrumbs={['Users']}
        actions={
          <>
            <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={handleExport} {...btn('users-btn-export', 'Export')}>
              Export
            </Button>
            <Button variant="outlined" component="label" startIcon={<FileUploadIcon />} {...btn('users-btn-import', 'Import')}>
              Import
              <input type="file" accept=".csv" hidden onChange={handleImport} {...input('users-input-import')} />
            </Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate} {...btn('users-btn-add', 'Add User')}>
              Add User
            </Button>
          </>
        }
      />

      {importMsg && <Alert severity="success" sx={{ mb: 2 }} {...aid('import-success')}>{importMsg}</Alert>}

      <Paper sx={{ mb: 2.5, p: 0.5, bgcolor: 'background.default', borderRadius: 3 }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', py: 1.5 }}>
          <TextField
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            {...field('users-search')}
            sx={{ minWidth: 220 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(0) }}
              {...select('users-filter-role', 'role', 'Filter by role')}
            >
              <MenuItem value="all" {...option(optId('users-filter-role', 'all'), 'All Roles')}>All Roles</MenuItem>
              {ROLES.map((r) => (
                <MenuItem key={r} value={r} {...option(optId('users-filter-role', r), r)}>{r}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
              {...select('users-filter-status', 'status', 'Filter by status')}
            >
              <MenuItem value="all" {...option(optId('users-filter-status', 'all'), 'All')}>All</MenuItem>
              <MenuItem value="active" {...option(optId('users-filter-status', 'active'), 'Active')}>Active</MenuItem>
              <MenuItem value="inactive" {...option(optId('users-filter-status', 'inactive'), 'Inactive')}>Inactive</MenuItem>
              <MenuItem value="pending" {...option(optId('users-filter-status', 'pending'), 'Pending')}>Pending</MenuItem>
              <MenuItem value="suspended" {...option(optId('users-filter-status', 'suspended'), 'Suspended')}>Suspended</MenuItem>
            </Select>
          </FormControl>
          {selected.length > 0 && (
            <Button
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => { dispatch(bulkDeleteUsers(selected)); setSelected([]) }}
              {...btn('users-bulk-delete', `Delete ${selected.length} users`)}
            >
              Delete ({selected.length})
            </Button>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {filtered.length} users
          </Typography>
        </Toolbar>

        <TableContainer {...aid('users-table')}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={selected.length > 0 && !allSelected}
                    onChange={(e) => {
                      if (e.target.checked) setSelected([...new Set([...selected, ...pageRows.map((u) => u.id)])])
                      else setSelected(selected.filter((id) => !pageRows.find((u) => u.id === id)))
                    }}
                    {...control('users-select-all', 'users-select-all', 'Select all')}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <EmptyState title="No users found" description="Try a different search or filter." />
                  </TableCell>
                </TableRow>
              ) : pageRows.map((user) => (
                <TableRow key={user.id} hover selected={selected.includes(user.id)} {...aid(dyn('user-row', user.id))}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(user.id)}
                      onChange={() => setSelected((prev) =>
                        prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id]
                      )}
                      {...control(dyn('user-checkbox', user.id), dyn('user-checkbox', user.id), `Select ${user.name}`)}
                    />
                  </TableCell>
                  <TableCell {...aid(dyn('user-name', user.id))}>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small" color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={user.status === 'active' ? 'success' : user.status === 'suspended' ? 'error' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(user)} {...iconBtn(dyn('user-edit', user.id), 'Edit user')}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setDeleteTarget(user)} {...iconBtn(dyn('user-delete', user.id), 'Delete user')}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          rowsPerPageOptions={[5, 10, 25, 50]}
          {...aid('users-pagination')}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth {...aid('user-dialog')}>
        <DialogTitle>{editing ? 'Edit User' : 'Add User'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSave)}>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Name"
                fullWidth
                {...field('user-form-name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />
              <TextField
                label="Email"
                fullWidth
                {...field('user-form-email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' } })}
              />
              <TextField select label="Role" fullWidth defaultValue="employee" {...field('user-form-role')} {...register('role')}>
                {ROLES.map((r) => (
                  <MenuItem key={r} value={r} {...option(optId('user-form-role', r), r)}>{r}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="Department"
                fullWidth
                {...field('user-form-department')}
                {...register('department', { required: 'Required' })}
              />
              <TextField select label="Status" fullWidth defaultValue="active" {...field('user-form-status')} {...register('status')}>
                <MenuItem value="active" {...option(optId('user-form-status', 'active'), 'Active')}>Active</MenuItem>
                <MenuItem value="inactive" {...option(optId('user-form-status', 'inactive'), 'Inactive')}>Inactive</MenuItem>
                <MenuItem value="pending" {...option(optId('user-form-status', 'pending'), 'Pending')}>Pending</MenuItem>
                <MenuItem value="suspended" {...option(optId('user-form-status', 'suspended'), 'Suspended')}>Suspended</MenuItem>
              </TextField>
              <TextField label="Phone" fullWidth {...field('user-form-phone')} {...register('phone')} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} {...btn('user-form-cancel', 'Cancel')}>Cancel</Button>
            <Button type="submit" variant="contained" {...btn('user-form-save', 'Save')}>Save</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} {...aid('user-delete-dialog')}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteTarget(null)} {...btn('user-delete-cancel', 'Cancel')}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => { dispatch(deleteUser(deleteTarget.id)); setDeleteTarget(null) }}
            {...btn('user-delete-confirm', 'Confirm delete')}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
