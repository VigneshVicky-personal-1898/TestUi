// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh

import { useState } from 'react'
import {
  Box, Paper, Typography, Collapse, List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, CircularProgress,
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { PageHeader } from '../../components/common/PageHeader'
import { FILE_TREE } from '../../data/mockData'
import { aid, btn, iconBtn, dyn } from '../../utils/automation'

function TreeNode({ node, depth = 0, onSelect, selectedId }) {
  const [open, setOpen] = useState(depth < 1)
  const [lazyChildren, setLazyChildren] = useState(node.children)
  const [loading, setLoading] = useState(false)
  const isFolder = node.type === 'folder'

  const toggle = () => {
    if (!isFolder) { onSelect(node); return }
    if (!open && node.lazy && !lazyChildren) {
      setLoading(true)
      setTimeout(() => {
        setLazyChildren([
          { id: `${node.id}-lazy-1`, name: 'Lazy File 1.txt', type: 'file', size: '12 KB', modified: '2024-06-01' },
          { id: `${node.id}-lazy-2`, name: 'Lazy Folder', type: 'folder', lazy: true, children: null },
        ])
        setLoading(false)
        setOpen(true)
      }, 900)
      return
    }
    setOpen(!open)
    onSelect(node)
  }

  return (
    <Box>
      <ListItemButton
        sx={{ pl: 1 + depth * 2 }}
        selected={selectedId === node.id}
        onClick={toggle}
        {...btn(dyn('tree-node', node.id), node.name)}
      >
        {isFolder && (
          <IconButton
            size="small"
            sx={{ mr: 0.5 }}
            {...iconBtn(dyn('tree-toggle', node.id), open ? `Collapse ${node.name}` : `Expand ${node.name}`)}
          >
            {open ? <ExpandMoreIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
          </IconButton>
        )}
        <ListItemIcon sx={{ minWidth: 32 }}>
          {loading ? <CircularProgress size={18} /> : isFolder ? (open ? <FolderOpenIcon color="primary" /> : <FolderIcon color="primary" />) : <InsertDriveFileIcon color="action" />}
        </ListItemIcon>
        <ListItemText
          primary={node.name}
          secondary={!isFolder ? `${node.size} · ${node.modified}` : undefined}
          primaryTypographyProps={{ variant: 'body2' }}
        />
      </ListItemButton>
      {isFolder && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List disablePadding dense {...aid(dyn('tree-children', node.id))}>
            {(lazyChildren || []).map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} onSelect={onSelect} selectedId={selectedId} />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  )
}

export default function TreePage() {
  const [selected, setSelected] = useState(null)
  const tree = [
    ...FILE_TREE,
    { id: 'lazy-root', name: 'Lazy Loaded Branch', type: 'folder', lazy: true, children: null },
  ]

  return (
    <Box {...aid('tree-page')}>
      <PageHeader pageId="tree" title="Tree & Hierarchy" subtitle="Folder structure, expand/collapse, lazy loading" breadcrumbs={['Tree View']} />
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
        <Paper sx={{ flex: 1, p: 1, minHeight: 400 }} {...aid('tree-view')}>
          <List dense>
            {tree.map((n) => (
              <TreeNode key={n.id} node={n} onSelect={setSelected} selectedId={selected?.id} />
            ))}
          </List>
        </Paper>
        <Paper sx={{ width: { md: 280 }, p: 2 }} {...aid('tree-selection')}>
          <Typography variant="h6" gutterBottom>Selection</Typography>
          {selected ? (
            <>
              <Typography variant="body2"><strong>Name:</strong> {selected.name}</Typography>
              <Typography variant="body2"><strong>Type:</strong> {selected.type}</Typography>
              <Typography variant="body2"><strong>ID:</strong> {selected.id}</Typography>
            </>
          ) : (
            <Typography color="text.secondary">Select a node</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  )
}
