// AI-ASSISTED: Cursor
// PROMPT: Browser storage practice: localStorage, sessionStorage, cookies, IndexedDB
// ACCEPTED-BY: vignesh

import { useState } from 'react'
import { Box, Paper, Tabs, Tab, TextField, Button, Stack, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import { PageHeader, PageContainer } from '../../components/common/PageHeader'
import { storageApi } from '../../utils/storageApi'
import { aid, btn, field } from '../../utils/automation'

export default function StoragePage() {
  const [tab, setTab] = useState(0)
  const kinds = ['local', 'session', 'cookie']
  const kind = kinds[tab] || 'local'
  const [key, setKey] = useState('demoKey')
  const [value, setValue] = useState('demoValue')
  const [idbVal, setIdbVal] = useState('')
  const [entries, setEntries] = useState([])

  const refresh = () => {
    if (tab === 3) return
    setEntries(storageApi[kind].entries())
  }

  const save = () => {
    if (tab === 3) {
      storageApi.idb.set(key, value).then(() => setIdbVal('saved'))
      return
    }
    storageApi[kind].set(key, value)
    refresh()
  }

  const remove = () => {
    if (tab === 3) { storageApi.idb.remove(key); setIdbVal('removed'); return }
    storageApi[kind].remove(key); refresh()
  }

  const clearAll = () => {
    if (tab === 3) { storageApi.idb.clear(); setIdbVal('cleared'); return }
    storageApi[kind].clear(); refresh()
  }

  const loadIdb = async () => {
    const v = await storageApi.idb.get(key)
    setIdbVal(v == null ? '(empty)' : String(v))
  }

  return (
    <PageContainer pageId="storage-page">
      <PageHeader pageId="storage" title="Browser Storage" subtitle="Local Storage, Session Storage, Cookies, IndexedDB" breadcrumbs={['Storage']} />
      <Paper sx={{ p: 2 }} {...aid('storage-panel')}>
        <Tabs value={tab} onChange={(_, v) => { setTab(v); setTimeout(refresh, 0) }} {...aid('storage-tabs')}>
          <Tab label="Local Storage" {...aid('storage-tab-local')} />
          <Tab label="Session Storage" {...aid('storage-tab-session')} />
          <Tab label="Cookies" {...aid('storage-tab-cookie')} />
          <Tab label="IndexedDB" {...aid('storage-tab-idb')} />
        </Tabs>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
          <TextField size="small" label="Key" value={key} onChange={(e) => setKey(e.target.value)} {...field('storage-input-key', 'storageKey')} />
          <TextField size="small" label="Value" value={value} onChange={(e) => setValue(e.target.value)} {...field('storage-input-value', 'storageValue')} />
          <Button variant="contained" {...btn('storage-btn-set')} onClick={save}>Set</Button>
          <Button {...btn('storage-btn-get')} onClick={tab === 3 ? loadIdb : refresh}>Get/Refresh</Button>
          <Button color="warning" {...btn('storage-btn-remove')} onClick={remove}>Remove</Button>
          <Button color="error" {...btn('storage-btn-clear')} onClick={clearAll}>Clear</Button>
        </Stack>
        {tab === 3 ? (
          <Typography sx={{ mt: 2 }} {...aid('storage-idb-result')}>IndexedDB value: {idbVal || '—'}</Typography>
        ) : (
          <Table size="small" sx={{ mt: 2 }} {...aid('storage-table')}>
            <TableHead><TableRow><TableCell>Key</TableCell><TableCell>Value</TableCell></TableRow></TableHead>
            <TableBody>
              {entries.map(([k, v]) => (
                <TableRow key={k} {...aid(`storage-row-${k}`)}><TableCell>{k}</TableCell><TableCell>{String(v)}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </PageContainer>
  )
}
