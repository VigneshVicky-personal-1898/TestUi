// AI-ASSISTED: Cursor
// PROMPT: Browser storage helpers for local/session/cookie/IndexedDB practice
// ACCEPTED-BY: vignesh

const DB_NAME = 'testui_idb'
const STORE = 'kv'

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export const storageApi = {
  local: {
    get: (k) => localStorage.getItem(k),
    set: (k, v) => localStorage.setItem(k, v),
    remove: (k) => localStorage.removeItem(k),
    clear: () => localStorage.clear(),
    entries: () => Object.entries(localStorage),
  },
  session: {
    get: (k) => sessionStorage.getItem(k),
    set: (k, v) => sessionStorage.setItem(k, v),
    remove: (k) => sessionStorage.removeItem(k),
    clear: () => sessionStorage.clear(),
    entries: () => Object.entries(sessionStorage),
  },
  cookie: {
    get: (name) => {
      const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
      return m ? decodeURIComponent(m[1]) : null
    },
    set: (name, value, days = 7) => {
      const expires = new Date(Date.now() + days * 864e5).toUTCString()
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
    },
    remove: (name) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    },
    entries: () => document.cookie.split(';').map((c) => c.trim()).filter(Boolean).map((c) => {
      const i = c.indexOf('=')
      return [c.slice(0, i), decodeURIComponent(c.slice(i + 1))]
    }),
  },
  idb: {
    async get(key) {
      const db = await openDb()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readonly')
        const req = tx.objectStore(STORE).get(key)
        req.onsuccess = () => resolve(req.result ?? null)
        req.onerror = () => reject(req.error)
      })
    },
    async set(key, value) {
      const db = await openDb()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite')
        tx.objectStore(STORE).put(value, key)
        tx.oncomplete = () => resolve(true)
        tx.onerror = () => reject(tx.error)
      })
    },
    async remove(key) {
      const db = await openDb()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite')
        tx.objectStore(STORE).delete(key)
        tx.oncomplete = () => resolve(true)
        tx.onerror = () => reject(tx.error)
      })
    },
    async clear() {
      const db = await openDb()
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, 'readwrite')
        tx.objectStore(STORE).clear()
        tx.oncomplete = () => resolve(true)
        tx.onerror = () => reject(tx.error)
      })
    },
  },
}
