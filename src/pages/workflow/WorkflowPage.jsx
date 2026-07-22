// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh
import { useState, useCallback, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {
  Box, Paper, Typography, Button, Chip, Stack, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, Card, CardContent, IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { PageHeader } from '../../components/common/PageHeader'
import { WORKFLOWS } from '../../data/mockData'
import { aid, btn, field, iconBtn, dyn } from '../../utils/automation'

const NODE_TYPES = [
  { type: 'start', label: 'Start', color: '#2e7d32' },
  { type: 'task', label: 'Task', color: '#0d47a1' },
  { type: 'decision', label: 'Decision', color: '#ed6c02' },
  { type: 'condition', label: 'Condition', color: '#9c27b0' },
  { type: 'approval', label: 'Approval', color: '#00838f' },
  { type: 'end', label: 'End', color: '#d32f2f' },
]

function PaletteItem({ nodeType }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'WF_NODE',
    item: { nodeType },
    collect: (m) => ({ isDragging: m.isDragging() }),
  })
  return (
    <Chip
      ref={drag}
      label={nodeType.label}
      sx={{ bgcolor: nodeType.color, color: '#fff', opacity: isDragging ? 0.5 : 1, cursor: 'grab', m: 0.5 }}
      {...aid(dyn('workflow-palette', nodeType.type))}
    />
  )
}

function CanvasNode({ node, onDelete, index, moveNode }) {
  const ref = useRef(null)
  const [, drop] = useDrop({
    accept: 'CANVAS_NODE',
    hover(item) {
      if (item.index === index) return
      moveNode(item.index, index)
      item.index = index
    },
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'CANVAS_NODE',
    item: { id: node.id, index },
    collect: (m) => ({ isDragging: m.isDragging() }),
  })
  drag(drop(ref))
  const meta = NODE_TYPES.find((n) => n.type === node.type) || NODE_TYPES[1]
  return (
    <Paper
      ref={ref}
      sx={{ p: 1.5, mb: 1, opacity: isDragging ? 0.4 : 1, borderLeft: 4, borderColor: meta.color, display: 'flex', alignItems: 'center' }}
      {...aid(dyn('wf-node', node.id))}
    >
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2">{node.label}</Typography>
        <Typography variant="caption" color="text.secondary">
          {node.type}{node.condition ? ` · ${node.condition}` : ''}
        </Typography>
      </Box>
      <IconButton
        size="small"
        onClick={() => onDelete(node.id)}
        {...iconBtn(dyn('wf-node-delete', node.id), `Delete ${node.label}`)}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Paper>
  )
}

function WorkflowCanvas({ nodes, setNodes, condition }) {
  const moveNode = useCallback((from, to) => {
    setNodes((prev) => {
      const next = [...prev]
      const [r] = next.splice(from, 1)
      next.splice(to, 0, r)
      return next
    })
  }, [setNodes])

  const [, drop] = useDrop({
    accept: 'WF_NODE',
    drop: (item) => {
      const meta = item.nodeType
      setNodes((prev) => [
        ...prev.slice(0, -1),
        {
          id: `n${Date.now()}`,
          type: meta.type,
          label: meta.label,
          condition: meta.type === 'condition' || meta.type === 'decision' ? condition : undefined,
        },
        prev[prev.length - 1],
      ])
    },
  })

  return (
    <Paper
      ref={drop}
      sx={{ p: 2, minHeight: 280, bgcolor: 'action.hover', border: '2px dashed', borderColor: 'divider' }}
      {...aid('workflow-canvas')}
    >
      <Typography variant="caption" color="text.secondary">Drop nodes here · Reorder by dragging</Typography>
      {nodes.map((node, index) => (
        <CanvasNode
          key={node.id}
          node={node}
          index={index}
          moveNode={moveNode}
          onDelete={(id) => setNodes(nodes.filter((n) => n.id !== id))}
        />
      ))}
    </Paper>
  )
}

export default function WorkflowPage() {
  const [workflows, setWorkflows] = useState(WORKFLOWS)
  const [builderOpen, setBuilderOpen] = useState(false)
  const [name, setName] = useState('New Workflow')
  const [nodes, setNodes] = useState([
    { id: 'n1', type: 'start', label: 'Start' },
    { id: 'n2', type: 'end', label: 'End' },
  ])
  const [condition, setCondition] = useState('amount > 1000')

  const saveWorkflow = () => {
    setWorkflows((prev) => [
      { id: `wf-${Date.now()}`, name, status: 'draft', nodes: nodes.length, updatedAt: new Date().toISOString().slice(0, 10) },
      ...prev,
    ])
    setBuilderOpen(false)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Box {...aid('workflow-page')}>
        <PageHeader
          pageId="workflow"
          title="Workflow Module"
          subtitle="Workflow list, create, nodes, decision, conditions, approval, drag-and-drop builder"
          breadcrumbs={['Workflow']}
          actions={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setBuilderOpen(true)} {...btn('workflow-create')}>
              Create Workflow
            </Button>
          }
        />

        <Grid container spacing={2} {...aid('workflow-list')}>
          {workflows.map((wf) => (
            <Grid key={wf.id} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card {...aid(dyn('workflow-card', wf.id))}>
                <CardContent>
                  <Typography variant="h6">{wf.name}</Typography>
                  <Chip label={wf.status} size="small" color={wf.status === 'active' ? 'success' : 'default'} sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">{wf.nodes} nodes · Updated {wf.updatedAt}</Typography>
                  <Button size="small" sx={{ mt: 1 }} onClick={() => setBuilderOpen(true)} {...btn(dyn('workflow-open', wf.id))}>
                    Open Builder
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={builderOpen} onClose={() => setBuilderOpen(false)} maxWidth="md" fullWidth {...aid('workflow-builder')}>
          <DialogTitle>Workflow Builder</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Workflow Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} {...field('workflow-name')} />
            <TextField fullWidth size="small" label="Default Condition Expression" value={condition} onChange={(e) => setCondition(e.target.value)} sx={{ mb: 2 }} {...field('workflow-condition')} />
            <Typography variant="subtitle2" gutterBottom>Node Palette (drag to canvas)</Typography>
            <Stack direction="row" flexWrap="wrap" sx={{ mb: 2 }} {...aid('workflow-palette')}>
              {NODE_TYPES.map((n) => <PaletteItem key={n.type} nodeType={n} />)}
            </Stack>
            <WorkflowCanvas nodes={nodes} setNodes={setNodes} condition={condition} />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setBuilderOpen(false)} {...btn('workflow-cancel')}>Cancel</Button>
            <Button variant="contained" onClick={saveWorkflow} {...btn('workflow-save')}>Save Workflow</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DndProvider>
  )
}
