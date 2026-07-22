// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh

import { useState } from 'react'
import { Box, Paper, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Chip, Typography } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { aid, btn, dyn } from '../../utils/automation'

const AUDIT = Array.from({ length: 20 }, (_, i) => ({ id: i+1, user: ['admin','manager','employee'][i%3], action: ['LOGIN','UPDATE','DELETE','EXPORT'][i%4], target: 'resource-'+(i+1), ts: new Date(Date.now()-i*3600000).toISOString() }))
const LOGINS = Array.from({ length: 12 }, (_, i) => ({ id: i+1, user: 'user'+(i%4), ip: '10.0.0.'+(i+10), status: i%5===0?'failed':'success', ts: new Date(Date.now()-i*7200000).toISOString() }))
const ROLES = ['admin','manager','employee','viewer']
const PERMS = ['dashboard','users','products','orders','reports','workflow','settings']
const MATRIX = { admin: PERMS, manager: ['dashboard','users','products','orders','reports','workflow'], employee: ['dashboard','products','orders'], viewer: ['dashboard','products','orders'] }

export default function AdminPage() {
  const [tab, setTab] = useState(0)
  return (
    <PageContainer pageId="admin-page">
      <PageHeader pageId="admin" title="Admin Module" subtitle="Audit logs, activity, login history, role & permission matrix, sessions" breadcrumbs={['Admin']} />
      <Tabs value={tab} onChange={(_,v)=>setTab(v)} {...aid('admin-tabs')}>
        <Tab label="Audit Logs" {...btn('admin-tab-audit')} />
        <Tab label="Login History" {...btn('admin-tab-logins')} />
        <Tab label="Permission Matrix" {...btn('admin-tab-matrix')} />
        <Tab label="Sessions" {...btn('admin-tab-sessions')} />
      </Tabs>
      {tab===0 && (
        <Paper sx={{ mt: 2 }} {...aid('admin-audit-table')}>
          <Table size="small"><TableHead><TableRow><TableCell>ID</TableCell><TableCell>User</TableCell><TableCell>Action</TableCell><TableCell>Target</TableCell><TableCell>Time</TableCell></TableRow></TableHead>
          <TableBody>{AUDIT.map(a=>(
            <TableRow key={a.id} {...aid(dyn('admin-audit-row', a.id))}><TableCell>{a.id}</TableCell><TableCell>{a.user}</TableCell><TableCell>{a.action}</TableCell><TableCell>{a.target}</TableCell><TableCell>{a.ts}</TableCell></TableRow>
          ))}</TableBody></Table>
        </Paper>
      )}
      {tab===1 && (
        <Paper sx={{ mt: 2 }} {...aid('admin-login-table')}>
          <Table size="small"><TableHead><TableRow><TableCell>User</TableCell><TableCell>IP</TableCell><TableCell>Status</TableCell><TableCell>Time</TableCell></TableRow></TableHead>
          <TableBody>{LOGINS.map(l=>(
            <TableRow key={l.id} {...aid(dyn('admin-login-row', l.id))}><TableCell>{l.user}</TableCell><TableCell>{l.ip}</TableCell><TableCell><Chip size="small" color={l.status==='success'?'success':'error'} label={l.status} /></TableCell><TableCell>{l.ts}</TableCell></TableRow>
          ))}</TableBody></Table>
        </Paper>
      )}
      {tab===2 && (
        <Paper sx={{ mt: 2, p: 2, overflow: 'auto' }} {...aid('admin-matrix')}>
          <Table size="small"><TableHead><TableRow><TableCell>Role</TableCell>{PERMS.map(p=><TableCell key={p}>{p}</TableCell>)}</TableRow></TableHead>
          <TableBody>{ROLES.map(r=>(
            <TableRow key={r} {...aid(dyn('admin-matrix-row', r))}><TableCell>{r}</TableCell>{PERMS.map(p=><TableCell key={p}>{MATRIX[r].includes(p)?'✅':'—'}</TableCell>)}</TableRow>
          ))}</TableBody></Table>
        </Paper>
      )}
      {tab===3 && (
        <Paper sx={{ mt: 2, p: 2 }} {...aid('admin-sessions')}>
          <Typography>Active sessions simulation</Typography>
          {['Chrome/Linux','Safari/iOS','Edge/Windows'].map((d,i)=>(
            <Chip key={d} sx={{ m: 0.5 }} label={d} {...aid(dyn('admin-session', i))} />
          ))}
        </Paper>
      )}
    </PageContainer>
  )
}
