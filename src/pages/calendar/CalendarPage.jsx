// AI-ASSISTED: Cursor
// PROMPT: Migrate Calendar page to automation helpers with option MenuItems
// ACCEPTED-BY: vignesh
import { useState, useRef } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import {
  Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Button, FormControlLabel, Checkbox, MenuItem, Stack,
} from '@mui/material'
import { PageHeader } from '../../components/common/PageHeader'
import { CALENDAR_EVENTS } from '../../data/mockData'
import { aid, btn, field, control, option, optId } from '../../utils/automation'

export default function CalendarPage() {
  const calendarRef = useRef(null)
  const [events, setEvents] = useState(CALENDAR_EVENTS)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', start: '', end: '', recurring: false, freq: 'weekly' })

  const handleDateSelect = (selectInfo) => {
    setForm({
      title: '',
      start: selectInfo.startStr.slice(0, 16),
      end: (selectInfo.endStr || selectInfo.startStr).slice(0, 16),
      recurring: false,
      freq: 'weekly',
    })
    setOpen(true)
  }

  const handleEventDrop = (info) => {
    setEvents((prev) => prev.map((e) =>
      e.id === info.event.id
        ? { ...e, start: info.event.start.toISOString(), end: info.event.end?.toISOString() || info.event.start.toISOString() }
        : e
    ))
  }

  const saveEvent = () => {
    if (!form.title.trim()) return
    const base = {
      id: String(Date.now()),
      title: form.recurring ? `${form.title} (recurring)` : form.title,
      start: form.start,
      end: form.end || form.start,
      color: form.recurring ? '#9c27b0' : '#1976d2',
    }
    const next = [base]
    if (form.recurring) {
      for (let i = 1; i <= 3; i += 1) {
        const start = new Date(form.start)
        const end = new Date(form.end || form.start)
        const days = form.freq === 'weekly' ? 7 * i : 1 * i
        start.setDate(start.getDate() + days)
        end.setDate(end.getDate() + days)
        next.push({
          ...base,
          id: `${base.id}-r${i}`,
          start: start.toISOString(),
          end: end.toISOString(),
        })
      }
    }
    setEvents((prev) => [...prev, ...next])
    setOpen(false)
  }

  return (
    <Box {...aid('calendar-page')}>
      <PageHeader
        pageId="calendar"
        title="Calendar"
        subtitle="Event creation, drag events, recurring events"
        breadcrumbs={['Calendar']}
      />
      <Paper sx={{ p: 2 }} {...aid('calendar-widget')}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
          }}
          editable
          selectable
          selectMirror
          dayMaxEvents
          events={events}
          select={handleDateSelect}
          eventDrop={handleEventDrop}
          eventResize={handleEventDrop}
          height={650}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} {...aid('event-dialog')}>
        <DialogTitle>Create Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 320 }}>
            <TextField label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} {...field('event-title', 'title')} />
            <TextField label="Start" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} {...field('event-start', 'start')} />
            <TextField label="End" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} {...field('event-end', 'end')} />
            <FormControlLabel
              control={<Checkbox checked={form.recurring} onChange={(e) => setForm({ ...form, recurring: e.target.checked })} {...control('event-recurring', 'recurring')} />}
              label="Recurring Event"
            />
            {form.recurring && (
              <TextField select label="Frequency" value={form.freq} onChange={(e) => setForm({ ...form, freq: e.target.value })} {...field('event-freq', 'freq')}>
                <MenuItem value="daily" {...option(optId('event-freq', 'daily'))}>Daily</MenuItem>
                <MenuItem value="weekly" {...option(optId('event-freq', 'weekly'))}>Weekly</MenuItem>
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} {...btn('event-cancel', 'Cancel')}>Cancel</Button>
          <Button variant="contained" onClick={saveEvent} {...btn('event-save', 'Create event')}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}