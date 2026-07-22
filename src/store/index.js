// AI-ASSISTED: Cursor
// PROMPT: Redux Toolkit store with auth, ui, data, cart, and notifications slices
// ACCEPTED-BY: vignesh
import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  DEMO_USERS,
  generateUsers,
  generateProducts,
  generateOrders,
  generateNotifications,
  ROLE_PERMISSIONS,
} from '../data/mockData'

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// --- Auth ---
const savedAuth = (() => {
  try {
    return JSON.parse(localStorage.getItem('testui_auth') || 'null')
  } catch {
    return null
  }
})()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedAuth?.user || null,
    token: savedAuth?.token || null,
    rememberMe: savedAuth?.rememberMe || false,
    otpPending: false,
    mfaPending: false,
    pendingEmail: null,
    sessionExpiry: savedAuth?.sessionExpiry || null,
    loginError: null,
  },
  reducers: {
    loginSuccess(state, action) {
      const { user, token, rememberMe, sessionExpiry } = action.payload
      state.user = user
      state.token = token
      state.rememberMe = rememberMe
      state.sessionExpiry = sessionExpiry
      state.otpPending = false
      state.mfaPending = false
      state.pendingEmail = null
      state.loginError = null
      localStorage.setItem('testui_auth', JSON.stringify({ user, token, rememberMe, sessionExpiry }))
    },
    setOtpPending(state, action) {
      state.otpPending = true
      state.pendingEmail = action.payload
    },
    setMfaPending(state, action) {
      state.mfaPending = true
      state.pendingEmail = action.payload
    },
    setLoginError(state, action) {
      state.loginError = action.payload
    },
    clearLoginError(state) {
      state.loginError = null
    },
    logout(state) {
      state.user = null
      state.token = null
      state.otpPending = false
      state.mfaPending = false
      state.pendingEmail = null
      state.sessionExpiry = null
      localStorage.removeItem('testui_auth')
    },
    extendSession(state) {
      state.sessionExpiry = Date.now() + (state.rememberMe ? 7 * 24 * 3600000 : 30 * 60000)
      const saved = JSON.parse(localStorage.getItem('testui_auth') || '{}')
      saved.sessionExpiry = state.sessionExpiry
      localStorage.setItem('testui_auth', JSON.stringify(saved))
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload }
      const saved = JSON.parse(localStorage.getItem('testui_auth') || '{}')
      saved.user = state.user
      localStorage.setItem('testui_auth', JSON.stringify(saved))
    },
  },
})

export const loginThunk = createAsyncThunk('auth/login', async ({ email, password, rememberMe, captcha }, { dispatch, rejectWithValue }) => {
  await delay(800)
  if (captcha && captcha.toUpperCase() !== 'TEST') {
    dispatch(authSlice.actions.setLoginError('Invalid captcha. Enter TEST'))
    return rejectWithValue('captcha')
  }
  const demo = DEMO_USERS.find((u) => u.email === email && u.password === password)
  if (!demo) {
    dispatch(authSlice.actions.setLoginError('Invalid email or password'))
    return rejectWithValue('credentials')
  }
  if (email === 'employee@testui.com') {
    dispatch(authSlice.actions.setOtpPending(email))
    return { step: 'otp' }
  }
  if (email === 'manager@testui.com') {
    dispatch(authSlice.actions.setMfaPending(email))
    return { step: 'mfa' }
  }
  const { password: _, ...user } = demo
  const sessionExpiry = Date.now() + (rememberMe ? 7 * 24 * 3600000 : 30 * 60000)
  dispatch(authSlice.actions.loginSuccess({ user, token: `tok_${user.id}_${Date.now()}`, rememberMe, sessionExpiry }))
  return { step: 'done', user }
})

export const verifyOtpThunk = createAsyncThunk('auth/otp', async ({ otp }, { dispatch, getState, rejectWithValue }) => {
  await delay(500)
  if (otp !== '123456') {
    return rejectWithValue('Invalid OTP. Use 123456')
  }
  const email = getState().auth.pendingEmail
  const demo = DEMO_USERS.find((u) => u.email === email)
  const { password: _, ...user } = demo
  dispatch(authSlice.actions.loginSuccess({
    user,
    token: `tok_${user.id}_${Date.now()}`,
    rememberMe: false,
    sessionExpiry: Date.now() + 30 * 60000,
  }))
  return user
})

export const verifyMfaThunk = createAsyncThunk('auth/mfa', async ({ code }, { dispatch, getState, rejectWithValue }) => {
  await delay(500)
  if (code !== '654321') {
    return rejectWithValue('Invalid MFA code. Use 654321')
  }
  const email = getState().auth.pendingEmail
  const demo = DEMO_USERS.find((u) => u.email === email)
  const { password: _, ...user } = demo
  dispatch(authSlice.actions.loginSuccess({
    user,
    token: `tok_${user.id}_${Date.now()}`,
    rememberMe: false,
    sessionExpiry: Date.now() + 30 * 60000,
  }))
  return user
})

// --- UI ---
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    themeMode: localStorage.getItem('testui_theme') || 'light',
    language: localStorage.getItem('testui_lang') || 'en',
    networkDelay: 0,
    offline: false,
    loading: false,
    sessionWarning: false,
  },
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload
    },
    setThemeMode(state, action) {
      state.themeMode = action.payload
      localStorage.setItem('testui_theme', action.payload)
    },
    setLanguage(state, action) {
      state.language = action.payload
      localStorage.setItem('testui_lang', action.payload)
    },
    setNetworkDelay(state, action) {
      state.networkDelay = action.payload
    },
    setOffline(state, action) {
      state.offline = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setSessionWarning(state, action) {
      state.sessionWarning = action.payload
    },
  },
})

// --- Data entities ---
const dataSlice = createSlice({
  name: 'data',
  initialState: {
    users: generateUsers(57),
    products: generateProducts(48),
    orders: generateOrders(42),
  },
  reducers: {
    addUser(state, action) {
      state.users.unshift(action.payload)
    },
    updateUser(state, action) {
      const idx = state.users.findIndex((u) => u.id === action.payload.id)
      if (idx >= 0) state.users[idx] = action.payload
    },
    deleteUser(state, action) {
      state.users = state.users.filter((u) => u.id !== action.payload)
    },
    bulkDeleteUsers(state, action) {
      const ids = new Set(action.payload)
      state.users = state.users.filter((u) => !ids.has(u.id))
    },
    setUsers(state, action) {
      state.users = action.payload
    },
    addProduct(state, action) {
      state.products.unshift(action.payload)
    },
    updateProduct(state, action) {
      const idx = state.products.findIndex((p) => p.id === action.payload.id)
      if (idx >= 0) state.products[idx] = action.payload
    },
    deleteProduct(state, action) {
      state.products = state.products.filter((p) => p.id !== action.payload)
    },
    updateOrderStatus(state, action) {
      const order = state.orders.find((o) => o.id === action.payload.id)
      if (order) {
        order.status = action.payload.status
        order.timeline.push({
          status: action.payload.status,
          date: new Date().toISOString().slice(0, 16).replace('T', ' '),
          note: `Status updated to ${action.payload.status}`,
        })
      }
    },
  },
})

// --- Notifications ---
const notifSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: generateNotifications(30),
  },
  reducers: {
    markAsRead(state, action) {
      const n = state.items.find((i) => i.id === action.payload)
      if (n) n.read = true
    },
    markAllRead(state) {
      state.items.forEach((i) => { i.read = true })
    },
    addNotification(state, action) {
      state.items.unshift(action.payload)
    },
    // AI-ASSISTED: Cursor
    // PROMPT: Add clear-all and delete-single notification actions
    // ACCEPTED-BY: vignesh
    deleteNotification(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    clearAllNotifications(state) {
      state.items = []
    },
  },
})

// --- Cart ---
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    wishlist: [],
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find((i) => i.id === action.payload.id)
      if (existing) existing.qty += 1
      else state.items.push({ ...action.payload, qty: 1 })
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload)
    },
    updateQty(state, action) {
      const item = state.items.find((i) => i.id === action.payload.id)
      if (item) item.qty = action.payload.qty
    },
    clearCart(state) {
      state.items = []
    },
    toggleWishlist(state, action) {
      const idx = state.wishlist.findIndex((i) => i.id === action.payload.id)
      if (idx >= 0) state.wishlist.splice(idx, 1)
      else state.wishlist.push(action.payload)
    },
  },
})

export const { logout, extendSession, updateProfile, clearLoginError } = authSlice.actions
export const {
  toggleSidebar, setSidebarOpen, setThemeMode, setLanguage,
  setNetworkDelay, setOffline, setLoading, setSessionWarning,
} = uiSlice.actions
export const {
  addUser, updateUser, deleteUser, bulkDeleteUsers, setUsers,
  addProduct, updateProduct, deleteProduct, updateOrderStatus,
} = dataSlice.actions
export const { markAsRead, markAllRead, addNotification, deleteNotification, clearAllNotifications } = notifSlice.actions
export const { addToCart, removeFromCart, updateQty, clearCart, toggleWishlist } = cartSlice.actions

export function hasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role] || []
  if (perms.includes('*')) return true
  if (perms.includes(permission)) return true
  const base = permission.split(':')[0]
  return perms.includes(base)
}

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    data: dataSlice.reducer,
    notifications: notifSlice.reducer,
    cart: cartSlice.reducer,
  },
})
