// AI-ASSISTED: Cursor
// PROMPT: Migrate Files page controls to automation helpers
// ACCEPTED-BY: vignesh
import { useState } from 'react'
import {
  Box, Paper, Button, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Typography, Stack, Breadcrumbs, Link,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import DeleteIcon from '@mui/icons-material/Delete'
import FolderIcon from '@mui/icons-material/Folder'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import { PageHeader } from '../../components/common/PageHeader'
import { aid, btn, iconBtn, field, input, link, dyn } from '../../utils/automation'

const INITIAL = [
  { id: '1', name: 'Q1 Report.pdf', type: 'file', size: '2.4 MB', modified: '2024-06-01', content: 'Q1 financial report content...' },
  { id: '2', name: 'Budget.xlsx', type: 'file', size: '1.1 MB', modified: '2024-06-05', content: 'Budget spreadsheet data...' },
  { id: '3', name: 'logo.png', type: 'file', size: '45 KB', modified: '2024-04-10', preview: 'https://picsum.photos/seed/logo/400/300' },
  { id: '4', name: 'Contracts', type: 'folder', size: '-', modified: '2024-05-20' },
  { id: '5', name: 'Design Spec.docx', type: 'file', size: '340 KB', modified: '2024-06-12', content: 'Design specification document...' },
]

export default function FilesPage() {
  const [files, setFiles] = useState(INITIAL)
  const [preview, setPreview] = useState(null)
  const [renameTarget, setRenameTarget] = useState(null)
  const [newName, setNewName] = useState('')
  const [path] = useState(['Root'])

  const handleUpload = (e) => {
    const list = Array.from(e.target.files || [])
    const uploaded = list.map((f, i) => ({
      id: `u-${Date.now()}-${i}`,
      name: f.name,
      type: 'file',
      size: `${(f.size / 1024).toFixed(1)} KB`,
      modified: new Date().toISOString().slice(0, 10),
      content: `Uploaded file: ${f.name}`,
      preview: f.type.startsWith('image/') ? URL.createObjectURL(f) : undefined,
    }))
    setFiles((prev) => [...uploaded, ...prev])
    e.target.value = ''
  }

  const handleDownload = (file) => {
    const blob = new Blob([file.content || file.name], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = file.name
    a.click()
  }

  const confirmRename = () => {
    if (!newName.trim()) return
    setFiles((prev) => prev.map((f) => (f.id === renameTarget.id ? { ...f, name: newName.trim() } : f)))
    setRenameTarget(null)
  }

  return (
    <Box {...aid('files-page')}>
      <PageHeader
        pageId="files"
        title="File Manager"
        subtitle="Upload, download, preview, rename, delete"
        breadcrumbs={['File Manager']}
        actions={
          <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} {...btn('file-upload-btn', 'Upload')}>
            Upload
            <input type="file" hidden multiple onChange={handleUpload} {...input('file-upload-input')} />
          </Button>
        }
      />

      <Breadcrumbs sx={{ mb: 2 }} {...aid('file-breadcrumbs')}>
        {path.map((p) => (
          <Link key={p} underline="hover" color="inherit" {...link(dyn('file-breadcrumb', p), p)}>{p}</Link>
        ))}
      </Breadcrumbs>

      <Paper>
        <Table {...aid('files-table')}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Modified</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id} hover {...aid(dyn('file-row', file.id))}>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {file.type === 'folder' ? <FolderIcon color="primary" /> : <InsertDriveFileIcon color="action" />}
                    <Typography variant="body2">{file.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{file.size}</TableCell>
                <TableCell>{file.modified}</TableCell>
                <TableCell align="right">
                  {file.type === 'file' && (
                    <>
                      <IconButton size="small" onClick={() => setPreview(file)} {...iconBtn(dyn('file-preview', file.id), `Preview ${file.name}`)}><VisibilityIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDownload(file)} {...iconBtn(dyn('file-download', file.id), `Download ${file.name}`)}><DownloadIcon fontSize="small" /></IconButton>
                    </>
                  )}
                  <IconButton size="small" onClick={() => { setRenameTarget(file); setNewName(file.name) }} {...iconBtn(dyn('file-rename', file.id), `Rename ${file.name}`)}>
                    <DriveFileRenameOutlineIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => setFiles(files.filter((f) => f.id !== file.id))} {...iconBtn(dyn('file-delete', file.id), `Delete ${file.name}`)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={Boolean(preview)} onClose={() => setPreview(null)} maxWidth="sm" fullWidth {...aid('file-preview-dialog')}>
        <DialogTitle>Preview: {preview?.name}</DialogTitle>
        <DialogContent>
          {preview?.preview ? (
            <Box component="img" src={preview.preview} alt={preview.name} sx={{ maxWidth: '100%' }} {...aid('file-preview-image')} />
          ) : (
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }} {...aid('file-preview-text')}>
              {preview?.content || 'No preview available'}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)} {...btn('preview-close', 'Close preview')}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(renameTarget)} onClose={() => setRenameTarget(null)} {...aid('file-rename-dialog')}>
        <DialogTitle>Rename</DialogTitle>
        <DialogContent>
          <TextField fullWidth value={newName} onChange={(e) => setNewName(e.target.value)} sx={{ mt: 1 }} {...field('file-rename-input', 'newName')} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameTarget(null)} {...btn('file-rename-cancel', 'Cancel rename')}>Cancel</Button>
          <Button variant="contained" onClick={confirmRename} {...btn('file-rename-confirm', 'Confirm rename')}>Rename</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
