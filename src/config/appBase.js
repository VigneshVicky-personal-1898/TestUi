// AI-ASSISTED: Cursor
// PROMPT: Shared base-path helpers for local and GitHub Pages
// ACCEPTED-BY: vignesh


/**
* Vite injects {@code import.meta.env.BASE_URL} from {@code vite.config.js} {@code base}.
* Local: `/` → router basename unused / empty
* GitHub Pages: `/TestUi/` → router basename `/TestUi`
*/
export function getViteBaseUrl() {
 return import.meta.env.BASE_URL || '/'
}


/** React Router basename without trailing slash (undefined when app is at domain root). */
export function getRouterBasename() {
 const base = getViteBaseUrl()
 if (!base || base === '/') {
   return undefined
 }
 return base.replace(/\/$/, '')
}


/** Prefix a root-absolute app path with the deploy base (for rare non-router links). */
export function withBasePath(path = '/') {
 const base = getViteBaseUrl()
 const normalized = path.startsWith('/') ? path : `/${path}`
 if (!base || base === '/') {
   return normalized
 }
 const prefix = base.replace(/\/$/, '')
 return `${prefix}${normalized}`
}



