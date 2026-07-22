// AI-ASSISTED: Cursor
// PROMPT: Advanced search: suggestions, highlight, saved and recent searches
// ACCEPTED-BY: vignesh

import { useMemo, useState } from 'react'
import { Box, Paper, TextField, List, ListItem, ListItemText, Chip, Stack, Typography, Button } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { generateUsers } from '../../data/mockData'
import { aid, btn, field } from '../../utils/automation'

const DATA = generateUsers(80)

function highlight(text, q) {
  if (!q) return text
  const i = text.toLowerCase().indexOf(q.toLowerCase())
  if (i < 0) return text
  return <>{text.slice(0,i)}<mark data-testid="search-highlight">{text.slice(i,i+q.length)}</mark>{text.slice(i+q.length)}</>
}

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('testui_recent_search')||'[]'))
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('testui_saved_search')||'[]'))
  const results = useMemo(() => {
    if (!q.trim()) return []
    return DATA.filter(u => (u.name+u.email+u.department).toLowerCase().includes(q.toLowerCase())).slice(0, 20)
  }, [q])
  const suggestions = useMemo(() => {
    if (!q) return []
    return [...new Set(DATA.map(u=>u.department).filter(d => d.toLowerCase().includes(q.toLowerCase())))].slice(0,6)
  }, [q])

  const commit = () => {
    if (!q.trim()) return
    const next = [q, ...recent.filter(x=>x!==q)].slice(0,8)
    setRecent(next); localStorage.setItem('testui_recent_search', JSON.stringify(next))
  }
  const save = () => {
    if (!q.trim()) return
    const next = [q, ...saved.filter(x=>x!==q)].slice(0,8)
    setSaved(next); localStorage.setItem('testui_saved_search', JSON.stringify(next))
  }

  return (
    <PageContainer pageId="search-page">
      <PageHeader pageId="search" title="Search Engine" subtitle="Advanced search, suggestions, highlight, saved & recent" breadcrumbs={['Search']} />
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField fullWidth size="small" placeholder="Search users…" value={q} onChange={(e)=>setQ(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&commit()} {...field('search-input', 'q')} />
        <Button variant="contained" {...btn('search-btn-go')} onClick={commit}>Search</Button>
        <Button {...btn('search-btn-save')} onClick={save}>Save</Button>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }} {...aid('search-suggestions')}>
        {suggestions.map(s => <Chip key={s} label={s} clickable onClick={()=>setQ(s)} {...aid(`search-suggest-${s.toLowerCase()}`)} />)}
      </Stack>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Box {...aid('search-recent')}><Typography variant="caption">Recent</Typography><Stack direction="row" gap={0.5} flexWrap="wrap">{recent.map(r=><Chip key={r} size="small" label={r} onClick={()=>setQ(r)} {...aid(`search-recent-${r}`)} />)}</Stack></Box>
        <Box {...aid('search-saved')}><Typography variant="caption">Saved</Typography><Stack direction="row" gap={0.5} flexWrap="wrap">{saved.map(r=><Chip key={r} size="small" color="primary" label={r} onClick={()=>setQ(r)} {...aid(`search-saved-${r}`)} />)}</Stack></Box>
      </Stack>
      <Paper {...aid('search-results')}>
        <List>{results.map(u=>(
          <ListItem key={u.id} {...aid(`search-result-${u.id}`)}>
            <ListItemText primary={<>{highlight(u.name,q)} — {highlight(u.email,q)}</>} secondary={u.department} />
          </ListItem>
        ))}</List>
      </Paper>
    </PageContainer>
  )
}
