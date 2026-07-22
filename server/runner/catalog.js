// AI-ASSISTED: Cursor
// PROMPT: Scan Selenium/Playwright projects for suites classes structure
// ACCEPTED-BY: vignesh
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


function listXmlSuites(dir, baseLabel = '') {
 if (!fs.existsSync(dir)) return []
 const suites = []
 const walk = (current, relParts = []) => {
   for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
     const full = path.join(current, entry.name)
     if (entry.isDirectory()) {
       walk(full, [...relParts, entry.name])
     } else if (entry.name.endsWith('.xml')) {
       const rel = path.relative(dir, full).split(path.sep).join('/')
       const suiteRel = path.join('src/test/resources/suites', rel).split(path.sep).join('/')
       const parts = rel.replace(/\.xml$/, '').split('/')
       suites.push({
         id: `${baseLabel}${rel}`.replace(/[/.]/g, '-'),
         name: parts[parts.length - 1],
         category: parts.length > 1 ? parts.slice(0, -1).join('/') : 'root',
         relativePath: suiteRel,
         label: parts.join(' / '),
       })
     }
   }
 }
 walk(dir)
 return suites.sort((a, b) => a.label.localeCompare(b.label))
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


 const applicationSuites = fw.id === 'selenium'
   ? listXmlSuites(path.join(fw.suitesRoot, 'application'), 'app-')
   : listXmlSuites(fw.suitesRoot, 'root-')


 const moduleSuites = fw.id === 'selenium'
   ? listXmlSuites(path.join(fw.suitesRoot, 'modules'), 'mod-')
   : []


 const modules = fw.id === 'selenium' && fs.existsSync(path.join(fw.suitesRoot, 'modules'))
   ? fs.readdirSync(path.join(fw.suitesRoot, 'modules'), { withFileTypes: true })
     .filter((d) => d.isDirectory())
     .map((d) => d.name)
     .sort()
   : []


 const pageDir = path.join(fw.mainSrc, 'pages')
 const testDir = path.join(fw.testSrc, 'tests')
 const pages = listJavaFiles(pageDir).map((f) => parseJavaMeta(f, `${fw.packageRoot}.pages`))
 const tests = listJavaFiles(testDir).map((f) => parseJavaMeta(f, `${fw.packageRoot}.tests`))


 const packages = {}
 for (const section of [
   { key: 'pages', dir: path.join(fw.mainSrc, 'pages'), pkg: `${fw.packageRoot}.pages` },
   { key: 'core', dir: path.join(fw.mainSrc, 'core'), pkg: `${fw.packageRoot}.core` },
   { key: 'driver', dir: path.join(fw.mainSrc, 'driver'), pkg: `${fw.packageRoot}.driver` },
   { key: 'config', dir: path.join(fw.mainSrc, 'config'), pkg: `${fw.packageRoot}.config` },
   { key: 'constants', dir: path.join(fw.mainSrc, 'constants'), pkg: `${fw.packageRoot}.constants` },
   { key: 'utils', dir: path.join(fw.mainSrc, 'utils'), pkg: `${fw.packageRoot}.utils` },
   { key: 'tests', dir: path.join(fw.testSrc, 'tests'), pkg: `${fw.packageRoot}.tests` },
   { key: 'basetest', dir: path.join(fw.testSrc, 'basetest'), pkg: `${fw.packageRoot}.basetest` },
   { key: 'listeners', dir: path.join(fw.testSrc, 'listeners'), pkg: `${fw.packageRoot}.listeners` },
   { key: 'dataproviders', dir: path.join(fw.testSrc, 'dataproviders'), pkg: `${fw.packageRoot}.dataproviders` },
 ]) {
   packages[section.key] = listJavaFiles(section.dir).map((f) => parseJavaMeta(f, section.pkg))
 }


 // Playwright may keep browser manager under a different folder name
 if (packages.driver.length === 0) {
   const alt = listJavaFiles(fw.mainSrc).filter((f) => /Manager|Factory|Driver|Browser/i.test(path.basename(f)))
   packages.driver = alt.map((f) => parseJavaMeta(f, fw.packageRoot))
 }


 return {
   framework: {
     id: fw.id,
     label: fw.label,
     packageRoot: fw.packageRoot,
     projectDir: path.relative(ROOT, fw.dir),
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
