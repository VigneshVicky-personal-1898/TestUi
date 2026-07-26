
//  Folder-based suite/Java discovery with correct relative paths

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'


const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(__dirname, '../..')
export const AUTOMATION_ROOT = path.join(ROOT, 'automation')


const FRAMEWORKS = {
 selenium: {
   id: 'selenium',
   label: 'Selenium + TestNG',
   packageRoot: 'com.testui.selenium',
   dir: path.join(AUTOMATION_ROOT, 'selenium-java'),
   mainSrc: path.join(AUTOMATION_ROOT, 'selenium-java', 'src/main/java/com/testui/selenium'),
   testSrc: path.join(AUTOMATION_ROOT, 'selenium-java', 'src/test/java/com/testui/selenium'),
   suitesRoot: path.join(AUTOMATION_ROOT, 'selenium-java', 'src/test/resources/suites'),
   reportsDir: path.join(AUTOMATION_ROOT, 'selenium-java', 'reports'),
   screenshotsDir: path.join(AUTOMATION_ROOT, 'selenium-java', 'src/test/resources/screenshots'),
   surefireDir: path.join(AUTOMATION_ROOT, 'selenium-java', 'target/surefire-reports'),
   layers: [
     { id: 'suites', label: 'TestNG Suites', path: 'src/test/resources/suites' },
     { id: 'tests', label: 'Test Classes', path: 'src/test/java/.../tests' },
     { id: 'listeners', label: 'Listeners / DataProviders', path: 'src/test/java/.../listeners' },
     { id: 'pages', label: 'Page Objects (POM)', path: 'src/main/java/.../pages' },
     { id: 'core', label: 'BasePage / Core', path: 'src/main/java/.../core' },
     { id: 'driver', label: 'Driver Factory', path: 'src/main/java/.../driver' },
     { id: 'utils', label: 'Utils (Extent, Logs, Screenshots)', path: 'src/main/java/.../utils' },
     { id: 'config', label: 'Config / Constants', path: 'src/main/java/.../config' },
   ],
 },
 playwright: {
   id: 'playwright',
   label: 'Playwright + TestNG',
   packageRoot: 'com.testui.playwright',
   dir: path.join(AUTOMATION_ROOT, 'playwright-java'),
   mainSrc: path.join(AUTOMATION_ROOT, 'playwright-java', 'src/main/java/com/testui/playwright'),
   testSrc: path.join(AUTOMATION_ROOT, 'playwright-java', 'src/test/java/com/testui/playwright'),
   suitesRoot: path.join(AUTOMATION_ROOT, 'playwright-java', 'src/test/resources/suites'),
   reportsDir: path.join(AUTOMATION_ROOT, 'playwright-java', 'reports'),
   screenshotsDir: path.join(AUTOMATION_ROOT, 'playwright-java', 'src/test/resources/screenshots'),
   surefireDir: path.join(AUTOMATION_ROOT, 'playwright-java', 'target/surefire-reports'),
   layers: [
     { id: 'suites', label: 'TestNG Suites', path: 'src/test/resources/suites' },
     { id: 'tests', label: 'Test Classes', path: 'src/test/java/.../tests' },
     { id: 'listeners', label: 'Listeners / DataProviders', path: 'src/test/java/.../listeners' },
     { id: 'pages', label: 'Page Objects (POM)', path: 'src/main/java/.../pages' },
     { id: 'core', label: 'BasePage / Core', path: 'src/main/java/.../core' },
     { id: 'driver', label: 'Playwright Manager', path: 'src/main/java/... (browser)' },
     { id: 'utils', label: 'Utils (Extent, Logs, Screenshots)', path: 'src/main/java/.../utils' },
     { id: 'config', label: 'Config / Constants', path: 'src/main/java/.../config' },
   ],
 },
}


function listJavaFiles(dir) {
 if (!fs.existsSync(dir)) return []
 const out = []
 const walk = (current) => {
   for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
     const full = path.join(current, entry.name)
     if (entry.isDirectory()) walk(full)
     else if (entry.name.endsWith('.java')) out.push(full)
   }
 }
 walk(dir)
 return out.sort()
}


function parseJavaMeta(filePath, packageRoot) {
 const rel = filePath.split(`${path.sep}java${path.sep}`)[1] || filePath
 const className = path.basename(filePath, '.java')
 const pkg = rel.replace(/\.java$/, '').replaceAll(path.sep, '.')
 const underTest = filePath.includes(`${path.sep}src${path.sep}test${path.sep}java${path.sep}`)
 const sourcePath = path
   .join(underTest ? 'src/test/java' : 'src/main/java', rel)
   .split(path.sep)
   .join('/')
 let methods = []
 try {
   const src = fs.readFileSync(filePath, 'utf8')
   const methodRe = /(?:public|protected)\s+(?:void|[\w.<>,\s\[\]]+)\s+(\w+)\s*\(/g
   let m
   while ((m = methodRe.exec(src))) {
     const name = m[1]
     if (!['if', 'for', 'while', 'switch', 'catch', 'return', className].includes(name)) {
       methods.push(name)
     }
   }
   methods = [...new Set(methods)].slice(0, 40)
 } catch {
   methods = []
 }
 return {
   className,
   packageName: pkg.includes('.') ? pkg.slice(0, pkg.lastIndexOf('.')) : packageRoot,
   fqcn: pkg,
   file: rel,
   sourcePath,
   methods,
 }
}


/**
* Recursively list TestNG suite XMLs under `dir`.
* `relativePath` is always relative to the project `suitesRoot` so it matches
* real disk paths (e.g. suites/application/smoke.xml, suites/modules/login/smoke.xml).
* `category` / `label` stay relative to the scanned folder for UI grouping.
*/
function listXmlSuites(dir, suitesRoot, baseLabel = '') {
 if (!fs.existsSync(dir) || !fs.existsSync(suitesRoot)) return []
 const suites = []
 const walk = (current) => {
   for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
     const full = path.join(current, entry.name)
     if (entry.isDirectory()) {
       walk(full)
     } else if (entry.name.endsWith('.xml')) {
       const relFromRoot = path.relative(suitesRoot, full).split(path.sep).join('/')
       const relFromScan = path.relative(dir, full).split(path.sep).join('/')
       if (relFromRoot.startsWith('..')) continue
       const suiteRel = path.join('src/test/resources/suites', relFromRoot).split(path.sep).join('/')
       const parts = relFromScan.replace(/\.xml$/, '').split('/').filter(Boolean)
       suites.push({
         id: `${baseLabel}${relFromRoot}`.replace(/[/.]/g, '-'),
         name: parts[parts.length - 1] || path.basename(entry.name, '.xml'),
         category: parts.length > 1 ? parts.slice(0, -1).join('/') : 'root',
         relativePath: suiteRel,
         folderPath: relFromRoot.includes('/')
           ? relFromRoot.slice(0, relFromRoot.lastIndexOf('/'))
           : '',
         label: parts.join(' / '),
       })
     }
   }
 }
 walk(dir)
 return suites.sort((a, b) => a.relativePath.localeCompare(b.relativePath))
}


/** Dynamically discover first-level package folders under main/test src. */
function discoverPackages(fw) {
 const packages = {}
 const addSection = (key, dir, pkg) => {
   if (!fs.existsSync(dir)) {
     packages[key] = packages[key] || []
     return
   }
   packages[key] = listJavaFiles(dir).map((f) => parseJavaMeta(f, pkg))
 }


 if (fs.existsSync(fw.mainSrc)) {
   for (const entry of fs.readdirSync(fw.mainSrc, { withFileTypes: true })) {
     if (!entry.isDirectory()) continue
     addSection(entry.name, path.join(fw.mainSrc, entry.name), `${fw.packageRoot}.${entry.name}`)
   }
 }
 if (fs.existsSync(fw.testSrc)) {
   for (const entry of fs.readdirSync(fw.testSrc, { withFileTypes: true })) {
     if (!entry.isDirectory()) continue
     addSection(entry.name, path.join(fw.testSrc, entry.name), `${fw.packageRoot}.${entry.name}`)
   }
 }


 // Playwright may keep browser manager under a different folder name
 if (!packages.driver?.length) {
   const alt = listJavaFiles(fw.mainSrc).filter((f) => /Manager|Factory|Driver|Browser/i.test(path.basename(f)))
   if (alt.length) {
     packages.driver = alt.map((f) => parseJavaMeta(f, fw.packageRoot))
   }
 }


 return packages
}


function listArtifacts(dir, kind) {
 if (!fs.existsSync(dir)) return []
 return fs
   .readdirSync(dir)
   .filter((f) => {
     if (kind === 'report') return f.endsWith('.html')
     if (kind === 'screenshot') return /\.(png|jpg|jpeg|webp)$/i.test(f)
     return false
   })
   .map((f) => {
     const full = path.join(dir, f)
     const stat = fs.statSync(full)
     return {
       name: f,
       kind,
       size: stat.size,
       modified: stat.mtimeMs,
     }
   })
   .sort((a, b) => b.modified - a.modified)
}


export function getFramework(id) {
 return FRAMEWORKS[id] || null
}


export function listFrameworks() {
 return Object.values(FRAMEWORKS).map((fw) => ({
   id: fw.id,
   label: fw.label,
   packageRoot: fw.packageRoot,
   exists: fs.existsSync(fw.dir),
 }))
}


export function buildCatalog(frameworkId) {
 const fw = getFramework(frameworkId)
 if (!fw || !fs.existsSync(fw.dir)) {
   return { error: `Framework not found: ${frameworkId}` }
 }


 // Folder-based discovery only — whatever exists under suites/ is what the UI shows.
 const applicationDir = path.join(fw.suitesRoot, 'application')
 const modulesDir = path.join(fw.suitesRoot, 'modules')
 const hasApplicationFolder = fs.existsSync(applicationDir)
 const hasModulesFolder = fw.id === 'selenium' && fs.existsSync(modulesDir)


 let applicationSuites
 if (fw.id === 'selenium' && hasApplicationFolder) {
   applicationSuites = listXmlSuites(applicationDir, fw.suitesRoot, 'app-')
   // Root-level suite XMLs that sit beside application/ and modules/ (not nested folders)
   const rootLevel = []
   for (const entry of fs.readdirSync(fw.suitesRoot, { withFileTypes: true })) {
     if (!entry.isFile() || !entry.name.endsWith('.xml')) continue
     const relFromRoot = entry.name
     const name = path.basename(entry.name, '.xml')
     rootLevel.push({
       id: `root-${relFromRoot}`.replace(/[/.]/g, '-'),
       name,
       category: 'root',
       relativePath: path.join('src/test/resources/suites', relFromRoot).split(path.sep).join('/'),
       folderPath: '',
       label: name,
     })
   }
   const seen = new Set(applicationSuites.map((s) => s.relativePath))
   for (const s of rootLevel) {
     if (!seen.has(s.relativePath)) applicationSuites.push(s)
   }
   applicationSuites.sort((a, b) => a.relativePath.localeCompare(b.relativePath))
 } else {
   applicationSuites = listXmlSuites(fw.suitesRoot, fw.suitesRoot, 'root-')
 }


 const moduleSuites = hasModulesFolder
   ? listXmlSuites(modulesDir, fw.suitesRoot, 'mod-')
   : []


 const modules = hasModulesFolder
   ? fs.readdirSync(modulesDir, { withFileTypes: true })
     .filter((d) => d.isDirectory())
     .map((d) => d.name)
     .sort()
   : []


 const packages = discoverPackages(fw)
 const pages = packages.pages || []
 const tests = packages.tests || []


 return {
   framework: {
     id: fw.id,
     label: fw.label,
     packageRoot: fw.packageRoot,
     projectDir: path.relative(ROOT, fw.dir),
     suitesRoot: path.relative(ROOT, fw.suitesRoot),
   },
   applicationSuites,
   moduleSuites,
   modules,
   pages,
   tests,
   packages,
   layers: fw.layers,
   suiteTypes: [...new Set([
     ...applicationSuites.map((s) => s.name),
     ...moduleSuites.map((s) => s.name),
   ])].sort(),
   source: 'filesystem',
 }
}


export function buildStructureDiagram(frameworkId) {
 const catalog = buildCatalog(frameworkId)
 if (catalog.error) return catalog
 const fw = getFramework(frameworkId)


 const nodes = [
   { id: 'app', label: 'TestUi App\n(localhost:5173)', group: 'target' },
   { id: 'suites', label: `TestNG Suites\n(${catalog.applicationSuites.length + catalog.moduleSuites.length})`, group: 'suite' },
   { id: 'tests', label: `Test Classes\n(${catalog.tests.length})`, group: 'test' },
   { id: 'listeners', label: 'TestListener\nDataProviders', group: 'support' },
   { id: 'pages', label: `Page Objects\n(${catalog.pages.length})`, group: 'pom' },
   { id: 'core', label: 'BasePage', group: 'core' },
   { id: 'driver', label: fw.id === 'selenium' ? 'DriverFactory\nDriverManager' : 'PlaywrightManager', group: 'driver' },
   { id: 'utils', label: 'Extent / Logs\nScreenshots', group: 'utils' },
   { id: 'browser', label: 'Browser\nChrome/Firefox/Edge', group: 'browser' },
 ]


 const edges = [
   { from: 'suites', to: 'tests', label: 'includes' },
   { from: 'tests', to: 'listeners', label: 'hooks' },
   { from: 'tests', to: 'pages', label: 'uses POM' },
   { from: 'pages', to: 'core', label: 'extends' },
   { from: 'core', to: 'driver', label: 'gets driver' },
   { from: 'driver', to: 'browser', label: 'launches' },
   { from: 'browser', to: 'app', label: 'automates' },
   { from: 'listeners', to: 'utils', label: 'reports' },
   { from: 'tests', to: 'utils', label: 'asserts / log' },
 ]


 const mermaid = [
   'flowchart LR',
   '  suites["TestNG Suites"] --> tests["Test Classes"]',
   '  tests --> pages["Page Objects"]',
   '  tests --> listeners["Listeners"]',
   '  pages --> core["BasePage"]',
   `  core --> driver["${fw.id === 'selenium' ? 'DriverFactory' : 'PlaywrightManager'}"]`,
   '  driver --> browser["Browser"]',
   '  browser --> app["TestUi App"]',
   '  listeners --> utils["Extent + Screenshots"]',
   '  tests --> utils',
 ].join('\n')


 return {
   framework: catalog.framework,
   layers: fw.layers,
   nodes,
   edges,
   mermaid,
   packages: catalog.packages,
   modules: catalog.modules,
   applicationSuites: catalog.applicationSuites,
   moduleSuites: catalog.moduleSuites,
   counts: {
     pages: catalog.pages.length,
     tests: catalog.tests.length,
     applicationSuites: catalog.applicationSuites.length,
     moduleSuites: catalog.moduleSuites.length,
     modules: catalog.modules.length,
   },
 }
}


export function listFrameworkArtifacts(frameworkId) {
 const fw = getFramework(frameworkId)
 if (!fw) return { error: 'Unknown framework' }
 const reports = listArtifacts(fw.reportsDir, 'report').map((a) => ({
   ...a,
   url: `/api/runner/artifact?framework=${frameworkId}&kind=report&file=${encodeURIComponent(a.name)}`,
 }))
 const screenshots = listArtifacts(fw.screenshotsDir, 'screenshot').map((a) => ({
   ...a,
   url: `/api/runner/artifact?framework=${frameworkId}&kind=screenshot&file=${encodeURIComponent(a.name)}`,
 }))
 let surefire = []
 if (fs.existsSync(fw.surefireDir)) {
   surefire = fs
     .readdirSync(fw.surefireDir)
     .filter((f) => f.endsWith('.html') || f.endsWith('.xml'))
     .map((f) => ({
       name: f,
       kind: 'surefire',
       url: `/api/runner/artifact?framework=${frameworkId}&kind=surefire&file=${encodeURIComponent(f)}`,
       modified: fs.statSync(path.join(fw.surefireDir, f)).mtimeMs,
     }))
     .sort((a, b) => b.modified - a.modified)
 }
 return { reports, screenshots, surefire }
}


export function resolveArtifactPath(frameworkId, kind, file) {
 const fw = getFramework(frameworkId)
 if (!fw) return null
 const safe = path.basename(file)
 let base
 if (kind === 'report') base = fw.reportsDir
 else if (kind === 'screenshot') base = fw.screenshotsDir
 else if (kind === 'surefire') base = fw.surefireDir
 else return null
 const full = path.join(base, safe)
 if (!full.startsWith(base) || !fs.existsSync(full)) return null
 return full
}


/**
* Read suite XML or Java source from the framework project (path-traversal safe).
* @param {'suite'|'java'} type
* @param {string} relativePath e.g. src/test/resources/suites/modules/login/smoke.xml
*   or src/test/java/com/testui/selenium/tests/LoginTest.java
*/
export function readProjectSource(frameworkId, type, relativePath) {
 const fw = getFramework(frameworkId)
 if (!fw || !relativePath) return { error: 'Missing framework or path' }


 const normalized = String(relativePath).replace(/\\/g, '/').replace(/^\/+/, '')
 if (normalized.includes('..')) return { error: 'Invalid path' }


 let allowedPrefix
 if (type === 'suite') {
   if (!normalized.startsWith('src/test/resources/suites/') || !normalized.endsWith('.xml')) {
     return { error: 'Suite path must be under src/test/resources/suites/*.xml' }
   }
   allowedPrefix = path.join(fw.dir, 'src/test/resources/suites')
 } else if (type === 'java') {
   const okMain = normalized.startsWith('src/main/java/') && normalized.endsWith('.java')
   const okTest = normalized.startsWith('src/test/java/') && normalized.endsWith('.java')
   if (!okMain && !okTest) {
     return { error: 'Java path must be under src/main/java or src/test/java' }
   }
   allowedPrefix = path.join(fw.dir, normalized.startsWith('src/main/') ? 'src/main/java' : 'src/test/java')
 } else {
   return { error: 'type must be suite or java' }
 }


 const full = path.resolve(fw.dir, normalized)
 if (!full.startsWith(fw.dir) || !full.startsWith(path.resolve(allowedPrefix)) || !fs.existsSync(full)) {
   return { error: `File not found: ${normalized}` }
 }


 const content = fs.readFileSync(full, 'utf8')
 const language = type === 'suite' ? 'xml' : 'java'
 return {
   framework: frameworkId,
   type,
   path: normalized,
   language,
   size: content.length,
   content,
 }
}



