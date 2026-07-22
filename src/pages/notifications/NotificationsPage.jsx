// AI-ASSISTED: Cursor
// PROMPT: Migrate interactive controls to automation helpers (id/name/data-testid/aria-label)
// ACCEPTED-BY: vignesh
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Paper, List, ListItem, ListItemText, ListItemAvatar, Avatar,
  Typography, Button, Chip, Stack, CircularProgress, IconButton,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import CircleIcon from '@mui/icons-material/Circle'
import { PageHeader } from '../../components/common/PageHeader'
import DeleteIcon from '@mui/icons-material/Delete'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep'
import { markAsRead, markAllRead, deleteNotification, clearAllNotifications, addNotification } from '../../store'
import { subscribeMockWs } from '../../utils/mockWs'
import { aid, btn, iconBtn, dyn } from '../../utils/automation'

const TYPE_COLOR = { info: 'info', success: 'success', warning: 'warning', error: 'error' }

export default function NotificationsPage() {
  const dispatch = useDispatch()
  const all = useSelector((s) => s.notifications.items)
  const [visible, setVisible] = useState(10)
  const [loading, setLoading] = useState(false)
  const sentinel = useRef(null)
  const items = all.slice(0, visible)

  useEffect(() => {
    const el = sentinel.current
    if (!el) return undefined
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visible < all.length && !loading) {
        setLoading(true)
        setTimeout(() => {
          setVisible((v) => Math.min(v + 8, all.length))
          setLoading(false)
        }, 600)
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [visible, all.length, loading])

  useEffect(() => subscribeMockWs((msg) => {
    if (msg.type === 'notification') {
      dispatch(addNotification({
        id: msg.notification.id,
        title: msg.notification.title,
        message: msg.notification.message,
        type: msg.notification.type,
        read: false,
        createdAt: msg.ts,
      }))
    }
  }), [dispatch])

  return (
    <Box {...aid('notifications-page')}>
      <PageHeader
        pageId="notifications"
        title="Notifications"
        subtitle="Realtime push, badge, mark read, clear all, delete single, infinite scroll"
        breadcrumbs={['Notifications']}
        actions={
          <>
            <Button startIcon={<DoneAllIcon />} onClick={() => dispatch(markAllRead())} {...btn('notifications-btn-mark-all')}>
              Mark all as read
            </Button>
            <Button color="error" startIcon={<DeleteSweepIcon />} onClick={() => dispatch(clearAllNotifications())} {...btn('notifications-btn-clear-all')}>
              Clear All
            </Button>
          </>
        }
      />

      <Paper {...aid('notification-panel')}>
        <List>
          {items.map((n) => (
            <ListItem
              key={n.id}
              {...aid(dyn('notification', n.id))}
              secondaryAction={(
                <Stack direction="row" spacing={0.5}>
                  {!n.read && (
                    <IconButton
                      edge="end"
                      onClick={() => dispatch(markAsRead(n.id))}
                      {...iconBtn(dyn('notifications-btn-mark-read', n.id), `Mark ${n.id} read`)}
                    >
                      <CircleIcon color="primary" sx={{ fontSize: 12 }} />
                    </IconButton>
                  )}
                  <IconButton
                    edge="end"
                    onClick={() => dispatch(deleteNotification(n.id))}
                    {...iconBtn(dyn('notifications-btn-delete', n.id), `Delete ${n.id}`)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              )}
              sx={{ bgcolor: n.read ? 'transparent' : 'action.hover' }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: `${TYPE_COLOR[n.type] || 'primary'}.main` }}>
                  <NotificationsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight={n.read ? 400 : 700}>{n.title}</Typography>
                    <Chip label={n.type} size="small" color={TYPE_COLOR[n.type]} />
                    {!n.read && <Chip label="Unread" size="small" variant="outlined" {...aid(dyn('unread-badge', n.id))} />}
                  </Stack>
                }
                secondary={`${n.message} · ${new Date(n.createdAt).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
        <Box ref={sentinel} sx={{ py: 2, textAlign: 'center' }} {...aid('notif-scroll-sentinel')}>
          {loading && <CircularProgress size={24} />}
          {visible >= all.length && (
            <Typography variant="caption" color="text.secondary">All notifications loaded</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
