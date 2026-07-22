// AI-ASSISTED: Cursor
// PROMPT: Persist runner logs reports screenshots under automation/runs
// ACCEPTED-BY: vignesh
import fs from 'node:fs'
import path from 'node:path'
import { AUTOMATION_ROOT, getFramework, listFrameworkArtifacts, ROOT } from './catalog.js'

export const RUNS_ROOT = path.join(AUTOMATION_ROOT, 'runs')
const MANIFEST = path.join(RUNS_ROOT, 'index.json')

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function copyFileSafe(src, dest) {
  try {
    ensureDir(path.dirname(dest))
    fs.copyFileSync(src, dest)
    return true
  } catch {
    return false
  }
}

function copyNewest(srcDir, destDir, filterFn, limit = 20) {
  if (!fs.existsSync(srcDir)) return []
  ensureDir(destDir)
  const copied = []
  const files = fs
    .readdirSync(srcDir)
    .filter(filterFn)
    .map((name) => ({ name, full: path.join(srcDir, name), mtime: fs.statSync(path.join(srcDir, name)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, limit)

  for (const f of files) {
    if (copyFileSafe(f.full, path.join(destDir, f.name))) {
      copied.push(f.name)
    }
  }
  return copied
}

export function runDir(runId) {
  return path.join(RUNS_ROOT, runId)
}

export function readManifest() {
  try {
    if (!fs.existsSync(MANIFEST)) return []
    return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
  } catch {
    return []
  }
}

function writeManifest(entries) {
  ensureDir(RUNS_ROOT)
  const trimmed = entries.slice(0, 100)
  fs.writeFileSync(MANIFEST, JSON.stringify(trimmed, null, 2))
}

export function upsertManifest(entry) {
  const list = readManifest().filter((e) => e.id !== entry.id)
  list.unshift(entry)
  writeManifest(list)
  return list
}

/**
 * Persist a finished (or in-progress snapshot) run to automation/runs/{id}.
 * Copies latest Extent reports, screenshots, and surefire HTML into the run folder.
 */
export function persistRun(run) {
  const dir = runDir(run.id)
  ensureDir(dir)
  ensureDir(path.join(dir, 'reports'))
  ensureDir(path.join(dir, 'screenshots'))
  ensureDir(path.join(dir, 'surefire'))

  const fw = getFramework(run.framework)
  const summary = {
    id: run.id,
    framework: run.framework,
    status: run.status,
    command: run.command,
    suiteXmlFile: run.suiteXmlFile,
    profile: run.profile,
    settings: run.settings,
    startedAt: run.startedAt,
    finishedAt: run.finishedAt,
    exitCode: run.exitCode,
    error: run.error,
    logCount: run.logs?.length || 0,
    storedAt: Date.now(),
    repoRelativePath: path.relative(ROOT, dir),
    git: run.git || null,
  }

  fs.writeFileSync(path.join(dir, 'summary.json'), JSON.stringify(summary, null, 2))
  fs.writeFileSync(
    path.join(dir, 'logs.json'),
    JSON.stringify(run.logs || [], null, 2),
  )
  fs.writeFileSync(
    path.join(dir, 'logs.txt'),
    (run.logs || []).map((l) => `[${new Date(l.t).toISOString()}] [${l.stream}] ${l.line}`).join('\n'),
  )

  let copied = { reports: [], screenshots: [], surefire: [] }
  if (fw) {
    copied.reports = copyNewest(fw.reportsDir, path.join(dir, 'reports'), (f) => f.endsWith('.html'), 10)
    copied.screenshots = copyNewest(
      fw.screenshotsDir,
      path.join(dir, 'screenshots'),
      (f) => /\.(png|jpg|jpeg|webp)$/i.test(f),
      30,
    )
    copied.surefire = copyNewest(
      fw.surefireDir,
      path.join(dir, 'surefire'),
      (f) => f.endsWith('.html') || f === 'testng-results.xml' || f === 'emailable-report.html',
      15,
    )
  }

  // Also keep a pointer to live framework artifacts for the UI
  let liveArtifacts = { reports: [], screenshots: [], surefire: [] }
  try {
    liveArtifacts = listFrameworkArtifacts(run.framework)
  } catch {
    // ignore
  }

  const storedArtifacts = {
    reports: copied.reports.map((name) => ({
      name,
      kind: 'stored-report',
      url: `/api/runner/stored-artifact?runId=${encodeURIComponent(run.id)}&kind=reports&file=${encodeURIComponent(name)}`,
    })),
    screenshots: copied.screenshots.map((name) => ({
      name,
      kind: 'stored-screenshot',
      url: `/api/runner/stored-artifact?runId=${encodeURIComponent(run.id)}&kind=screenshots&file=${encodeURIComponent(name)}`,
    })),
    surefire: copied.surefire.map((name) => ({
      name,
      kind: 'stored-surefire',
      url: `/api/runner/stored-artifact?runId=${encodeURIComponent(run.id)}&kind=surefire&file=${encodeURIComponent(name)}`,
    })),
    live: liveArtifacts,
  }

  fs.writeFileSync(path.join(dir, 'artifacts.json'), JSON.stringify(storedArtifacts, null, 2))

  upsertManifest({
    id: summary.id,
    framework: summary.framework,
    status: summary.status,
    startedAt: summary.startedAt,
    finishedAt: summary.finishedAt,
    suiteXmlFile: summary.suiteXmlFile,
    path: summary.repoRelativePath,
    settings: summary.settings,
  })

  return {
    dir,
    relativePath: summary.repoRelativePath,
    summary,
    artifacts: storedArtifacts,
  }
}

export function loadStoredRun(runId) {
  const dir = runDir(runId)
  const summaryPath = path.join(dir, 'summary.json')
  if (!fs.existsSync(summaryPath)) return null
  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'))
  let logs = []
  let artifacts = { reports: [], screenshots: [], surefire: [] }
  try {
    logs = JSON.parse(fs.readFileSync(path.join(dir, 'logs.json'), 'utf8'))
  } catch {
    logs = []
  }
  try {
    artifacts = JSON.parse(fs.readFileSync(path.join(dir, 'artifacts.json'), 'utf8'))
  } catch {
    // ignore
  }
  return { ...summary, logs, artifacts, stored: true }
}

export function listStoredRuns() {
  return readManifest()
}

export function resolveStoredArtifact(runId, kind, file) {
  const safeId = path.basename(runId)
  const safeKind = path.basename(kind)
  const safeFile = path.basename(file)
  if (!['reports', 'screenshots', 'surefire'].includes(safeKind)) return null
  const full = path.join(runDir(safeId), safeKind, safeFile)
  if (!full.startsWith(runDir(safeId)) || !fs.existsSync(full)) return null
  return full
}
