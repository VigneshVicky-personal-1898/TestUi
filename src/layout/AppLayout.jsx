// AI-ASSISTED: Cursor
// PROMPT: Clean Soft UI AppLayout — flatter shell, subtle shadows
// ACCEPTED-BY: vignesh
import { useEffect, useMemo, useState } from 'react'
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Badge, Avatar, Menu, MenuItem, Divider, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, useMediaQuery,
  useTheme, Collapse,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import WifiOffIcon from '@mui/icons-material/WifiOff'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { MODULE_ITEMS, ADVANCED_MODULE_ITEMS, I18N } from '../utils/navConfig'
import {
  toggleSidebar, setSidebarOpen, setThemeMode, setSessionWarning,
  logout, extendSession, markAsRead, hasPermission,
} from '../store'
import { aid, btn, iconBtn, option, dyn } from '../utils/automation'
import AutomationHelpPanel from '../components/common/AutomationHelpPanel'

const DRAWER_WIDTH = 268
const HEADER_HEIGHT = 60
const OFFLINE_HEIGHT = 36

function NavSection({ title, open, onToggle, items, location, isMobile, dispatch, toggleId }) {
  return (
    <Box sx={{ mb: 0.75 }}>
      <ListItemButton
        onClick={onToggle}
        {...btn(toggleId, `Toggle ${title}`)}
        sx={{
          mx: 1,
          borderRadius: 1.5,
          py: 0.75,
          minHeight: 36,
          boxShadow: 'none',
          '&:hover': { bgcolor: 'action.hover', boxShadow: 'none' },
        }}
      >
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            variant: 'overline',
            sx: {
              color: 'text.secondary',
              letterSpacing: 1,
              fontWeight: 700,
              lineHeight: 1,
              fontSize: 11,
            },
          }}
        />
        {open ? <ExpandLess fontSize="small" color="action" /> : <ExpandMore fontSize="small" color="action" />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List dense disablePadding sx={{ px: 1, pb: 0.5 }} {...aid(`${toggleId}-list`)}>
          {items.map((item) => {
            const Icon = item.icon
            const active = item.path === '/dashboard'
              ? location.pathname === '/dashboard'
              : location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)

            return (
              <ListItemButton
                key={item.path}
                component={RouterLink}
                to={item.path}
                selected={active}
                {...btn(item.navId, item.label)}
                onClick={() => isMobile && dispatch(setSidebarOpen(false))}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.25,
                  minHeight: 40,
                  px: 1.25,
                  '&.Mui-selected': {
                    bgcolor: 'action.selected',
                    color: 'primary.main',
                    '& .MuiListItemIcon-root': { color: 'primary.main' },
                    '&:hover': { bgcolor: 'action.selected' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 34, color: active ? 'primary.main' : 'text.secondary' }}>
                  <Icon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 13.25,
                    fontWeight: active ? 700 : 500,
                    noWrap: true,
                  }}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Collapse>
    </Box>
  )
}

export default function AppLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, sessionExpiry } = useSelector((s) => s.auth)
  const { sidebarOpen, themeMode, language, offline } = useSelector((s) => s.ui)
  const notifications = useSelector((s) => s.notifications.items)
  const cartCount = useSelector((s) => s.cart.items.reduce((a, i) => a + i.qty, 0))
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifAnchor, setNotifAnchor] = useState(null)
  const [sessionOpen, setSessionOpen] = useState(false)
  const [modulesOpen, setModulesOpen] = useState(true)
  const [advancedOpen, setAdvancedOpen] = useState(true)
  const t = I18N[language] || I18N.en
  const unread = notifications.filter((n) => !n.read).length
  const offlineOffset = offline ? OFFLINE_HEIGHT : 0
  const raisedSm = theme.customShadows?.neuRaisedSm
  const insetSm = theme.customShadows?.neuInsetSm

  const modules = useMemo(
    () => MODULE_ITEMS.filter((item) => hasPermission(user?.role, item.permission)),
    [user?.role],
  )
  const advanced = useMemo(
    () => ADVANCED_MODULE_ITEMS.filter((item) => hasPermission(user?.role, item.permission)),
    [user?.role],
  )

  useEffect(() => {
    if (isMobile) dispatch(setSidebarOpen(false))
  }, [isMobile, dispatch])

  useEffect(() => {
    if (!sessionExpiry) return undefined
    const check = () => {
      const remaining = sessionExpiry - Date.now()
      if (remaining <= 0) {
        dispatch(logout())
        navigate('/login', { state: { reason: 'session_expired' } })
      } else if (remaining <= 60000) {
        setSessionOpen(true)
        dispatch(setSessionWarning(true))
      }
    }
    const id = setInterval(check, 5000)
    return () => clearInterval(id)
  }, [sessionExpiry, dispatch, navigate])

  useEffect(() => {
    const inModules = modules.some((i) => location.pathname.startsWith(i.path))
    const inAdvanced = advanced.some((i) => location.pathname.startsWith(i.path))
    if (inAdvanced && !inModules) setAdvancedOpen(true)
    if (inModules) setModulesOpen(true)
  }, [location.pathname, modules, advanced])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const drawer = (
    <Box
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}
      {...aid('app-sidebar')}
    >
      <Toolbar
        sx={{
          gap: 1.5,
          minHeight: `${HEADER_HEIGHT}px !important`,
          px: 2.25,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 13,
            flexShrink: 0,
            boxShadow: raisedSm,
          }}
          {...aid('app-logo')}
        >
          TU
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2} noWrap {...aid('app-brand-name')}>
            TestUi
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap {...aid('app-brand-tagline')}>
            Automation Lab
          </Typography>
        </Box>
      </Toolbar>

      <Box sx={{ px: 2.25, pb: 1 }}>
        <Divider />
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', py: 0.5 }} {...aid('nav-scroll-area')}>
        <NavSection
          title="Modules"
          open={modulesOpen}
          onToggle={() => setModulesOpen((v) => !v)}
          items={modules}
          location={location}
          isMobile={isMobile}
          dispatch={dispatch}
          toggleId="nav-modules-toggle"
        />

        <Box sx={{ px: 2.25, py: 0.75 }}>
          <Divider />
        </Box>

        <NavSection
          title="Advanced Modules"
          open={advancedOpen}
          onToggle={() => setAdvancedOpen((v) => !v)}
          items={advanced}
          location={location}
          isMobile={isMobile}
          dispatch={dispatch}
          toggleId="nav-advanced-toggle"
        />

        <Box sx={{ px: 1.25, pt: 1, pb: 0.5 }} {...aid('nav-menu-help-wrap')}>
          <AutomationHelpPanel pageId="nav" compact />
        </Box>
      </Box>

      <Box
        sx={{
          mx: 1.25,
          mb: 1.25,
          mt: 0.5,
          p: 1.25,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          flexShrink: 0,
          borderRadius: 2,
          boxShadow: insetSm,
          bgcolor: 'background.default',
        }}
        {...aid('sidebar-user-footer')}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'primary.main',
            fontSize: 13,
            fontWeight: 700,
          }}
          {...aid('sidebar-user-avatar')}
        >
          {user?.name?.[0]}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body2" fontWeight={700} noWrap {...aid('sidebar-user-name')}>
            {user?.name?.split(' ')[0]}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ textTransform: 'capitalize' }}>
            {user?.role}
          </Typography>
        </Box>
        <Chip
          label={user?.role}
          size="small"
          {...aid('header-user-role')}
          sx={{
            textTransform: 'capitalize',
            fontWeight: 650,
            display: { xs: 'none', lg: 'flex' },
            maxWidth: 72,
          }}
        />
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }} {...aid('app-layout')}>
      {offline && (
        <Box
          {...aid('offline-banner')}
          role="alert"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2000,
            height: OFFLINE_HEIGHT,
            bgcolor: 'warning.main',
            color: 'warning.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            px: 2,
          }}
        >
          <WifiOffIcon fontSize="small" />
          <Typography variant="body2">You are offline. Some features may be unavailable.</Typography>
        </Box>
      )}

      <AppBar
        position="fixed"
        elevation={0}
        {...aid('app-header')}
        sx={{
          height: HEADER_HEIGHT,
          bgcolor: 'background.default',
          boxShadow: 'none',
          borderBottom: 'none',
          width: { md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          ml: { md: sidebarOpen ? `${DRAWER_WIDTH}px` : 0 },
          top: offlineOffset,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar
          sx={{
            minHeight: `${HEADER_HEIGHT}px !important`,
            gap: 0.5,
            px: { xs: 1.5, md: 2.5 },
            minWidth: 0,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <IconButton
            edge="start"
            onClick={() => dispatch(toggleSidebar())}
            {...iconBtn('header-btn-sidebar-toggle', 'Toggle sidebar')}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontSize: 15, fontWeight: 650, minWidth: 0 }}
            noWrap
            {...aid('header-welcome-text')}
          >
            {t.welcome}, {user?.name?.split(' ')[0]}
          </Typography>

          <Tooltip title="Toggle theme">
            <IconButton
              onClick={() => dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'))}
              {...iconBtn('header-btn-theme', 'Toggle theme')}
            >
              {themeMode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>

          <IconButton component={RouterLink} to="/ecommerce/cart" {...iconBtn('header-btn-cart', 'Open cart')}>
            <Badge badgeContent={cartCount} color="error" {...aid('header-badge-cart')}>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <IconButton
            onClick={(e) => setNotifAnchor(e.currentTarget)}
            {...iconBtn('header-btn-notifications', 'Open notifications')}
          >
            <Badge badgeContent={unread} color="error" {...aid('header-badge-notifications')}>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notifAnchor}
            open={Boolean(notifAnchor)}
            onClose={() => setNotifAnchor(null)}
            {...aid('header-menu-notifications')}
            slotProps={{ paper: { sx: { width: 340, maxHeight: 400 } } }}
          >
            <MenuItem disabled {...option('header-menu-notifications-title', 'Notifications')}>
              <Typography fontWeight={700}>Notifications ({unread} unread)</Typography>
            </MenuItem>
            <Divider />
            {notifications.slice(0, 6).map((n) => (
              <MenuItem
                key={n.id}
                onClick={() => {
                  dispatch(markAsRead(n.id))
                  setNotifAnchor(null)
                  navigate('/notifications')
                }}
                {...option(dyn('header-notif-item', n.id), n.title)}
                sx={{ opacity: n.read ? 0.65 : 1, whiteSpace: 'normal', alignItems: 'flex-start' }}
              >
                <Box>
                  <Typography variant="body2" fontWeight={n.read ? 500 : 700}>{n.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{n.message}</Typography>
                </Box>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem
              onClick={() => { setNotifAnchor(null); navigate('/notifications') }}
              {...option('header-menu-notifications-view-all', 'View all notifications')}
            >
              View all
            </MenuItem>
          </Menu>

          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            {...iconBtn('header-btn-user-menu', 'Open user menu')}
            sx={{ ml: 0.25, p: 0.5 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700 }} {...aid('header-avatar')}>
              {user?.name?.[0]}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            {...aid('header-menu-user')}
          >
            <MenuItem disabled {...option('header-menu-user-info', 'User info')}>
              <Box>
                <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
                <Typography variant="caption">{user?.email}</Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => { setAnchorEl(null); navigate('/settings') }}
              {...option('header-menu-settings', 'Settings')}
            >
              <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout} {...option('header-menu-logout', t.logout)}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              {t.logout}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
        {...aid('app-drawer')}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            top: offlineOffset,
            height: `calc(100% - ${offlineOffset}px)`,
            borderRight: 'none',
            bgcolor: 'background.default',
            boxShadow: raisedSm,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        {...aid('main-content')}
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          mt: `${HEADER_HEIGHT + offlineOffset}px`,
          width: { md: sidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%' },
          minHeight: `calc(100vh - ${HEADER_HEIGHT + offlineOffset}px)`,
          maxWidth: '100%',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Box
          sx={{ width: '100%', maxWidth: 1558, mx: 'auto' }}
          {...aid('main-content-surface')}
        >
          <Outlet />
        </Box>
      </Box>

      <Dialog open={sessionOpen} {...aid('session-timeout-dialog')}>
        <DialogTitle {...aid('session-timeout-title')}>Session Expiring</DialogTitle>
        <DialogContent>
          <Typography {...aid('session-timeout-message')}>
            Your session will expire soon due to inactivity. Stay logged in?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              dispatch(logout())
              navigate('/login', { state: { reason: 'session_expired' } })
            }}
            {...btn('session-btn-logout', 'Logout now')}
          >
            Logout
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(extendSession())
              setSessionOpen(false)
              dispatch(setSessionWarning(false))
            }}
            {...btn('session-btn-extend', 'Stay logged in')}
          >
            Stay Logged In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
