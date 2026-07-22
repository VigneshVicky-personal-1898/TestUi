// AI-ASSISTED: Cursor
// PROMPT: Persist runs and git-sync artifacts after Maven execution
// ACCEPTED-BY: vignesh
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { getFramework, listFrameworkArtifacts, ROOT } from './catalog.js'
import { persistRun, loadStoredRun, listStoredRuns } from './artifactStore.js'
import { syncRunToGit, getGitSyncConfig } from './gitSync.js'

const MAX_LOG_LINES = 4000
const runs = new Map()

function now() {
  return Date.now()
}

function pushLog(run, line, stream = 'stdout') {
  const entry = { t: now(), stream, line: String(line).replace(/\r/g, '') }
  run.logs.push(entry)
  if (run.logs.length > MAX_LOG_LINES) {
    run.logs.splice(0, run.logs.length - MAX_LOG_LINES)
  }
  for (const client of run.subscribers) {
    try {
      client.write(`data: ${JSON.stringify({ type: 'log', ...entry })}\n\n`)
    } catch {
      // ignore broken SSE clients
    }
  }
}

function broadcast(run, payload) {
  for (const client of run.subscribers) {
    try {
      client.write(`data: ${JSON.stringify(payload)}\n\n`)
    } catch {
      // ignore
    }
  }
}

function summarizeRun(run) {
  return {
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
    logCount: run.logs.length,
    storage: run.storage || null,
    git: run.git || null,
  }
}

async function finalizeRun(run) {
  try {
    const stored = persistRun(run)
    run.storage = {
      path: stored.relativePath,
      dir: stored.dir,
    }
    run.artifacts = {
      ...stored.artifacts.live,
      storedReports: stored.artifacts.reports,
      storedScreenshots: stored.artifacts.screenshots,
      storedSurefire: stored.artifacts.surefire,
    }
    pushLog(run, `[runner] Artifacts saved to ${stored.relativePath}`, 'system')

    const wantGit = run.settings?.gitSync
    const envEnabled = getGitSyncConfig().enabled
    const enabled = typeof wantGit === 'boolean' ? wantGit : envEnabled

    if (enabled) {
      pushLog(run, '[git] Syncing run artifacts to git repository…', 'system')
      const git = await syncRunToGit(
        summarizeRun(run),
        (line) => pushLog(run, line, 'system'),
        { enabled: true },
      )
      run.git = git
      persistRun(run)
      if (git.ok) {
        pushLog(run, `[git] Sync complete${git.pushed ? ' (pushed)' : git.committed ? ' (committed locally)' : ''}`, 'system')
      } else {
        pushLog(run, `[git] Sync error: ${git.error || 'unknown'}`, 'system')
      }
    } else {
      pushLog(run, '[git] Git sync off for this run — artifacts kept under automation/runs/', 'system')
    }
  } catch (err) {
    pushLog(run, `[runner] Failed to persist artifacts: ${err.message}`, 'system')
  }
}

export function listRuns() {
  const memory = [...runs.values()].map(summarizeRun)
  const stored = listStoredRuns().filter((s) => !memory.some((m) => m.id === s.id))
  return [...memory, ...stored].sort((a, b) => (b.startedAt || 0) - (a.startedAt || 0))
}

export function getRun(id) {
  return runs.get(id) || null
}

export function getRunPublic(id) {
  const run = getRun(id)
  if (run) {
    return {
      ...summarizeRun(run),
      logs: run.logs,
      artifacts: run.artifacts,
    }
  }
  const stored = loadStoredRun(id)
  if (!stored) return null
  return stored
}

export function stopRun(id) {
  const run = getRun(id)
  if (!run || run.status !== 'running' || !run.child) {
    return { ok: false, error: 'No running process for this id' }
  }
  try {
    run.child.kill('SIGTERM')
    setTimeout(() => {
      if (run.status === 'running' && run.child) {
        try { run.child.kill('SIGKILL') } catch { /* ignore */ }
      }
    }, 4000)
    pushLog(run, '[runner] Stop requested by user', 'system')
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message }
  }
}

/**
 * Start a Maven TestNG suite for selenium or playwright.
 */
export function startRun(options = {}) {
  const {
    framework = 'selenium',
    suiteXmlFile,
    profile,
    browser = 'chrome',
    headless = true,
    baseUrl = 'http://localhost:5173',
    gitSync,
  } = options

  const fw = getFramework(framework)
  if (!fw || !fs.existsSync(fw.dir)) {
    return { ok: false, error: `Framework project missing: ${framework}` }
  }

  const active = [...runs.values()].find((r) => r.status === 'running')
  if (active) {
    return { ok: false, error: `Another run is already in progress (${active.id}). Stop it first.` }
  }

  if (!suiteXmlFile && !profile) {
    return { ok: false, error: 'Provide suiteXmlFile or profile' }
  }

  if (suiteXmlFile) {
    const absSuite = path.resolve(fw.dir, suiteXmlFile)
    if (!absSuite.startsWith(fw.dir) || !fs.existsSync(absSuite)) {
      return { ok: false, error: `Suite XML not found: ${suiteXmlFile}` }
    }
  }

  const args = ['test', '-B']
  if (profile) args.push(`-P${profile}`)
  if (suiteXmlFile) args.push(`-DsuiteXmlFile=${suiteXmlFile}`)
  args.push(`-Dbrowser=${browser}`)
  args.push(`-Dheadless=${headless ? 'true' : 'false'}`)
  args.push(`-DbaseUrl=${baseUrl}`)

  const id = randomUUID().slice(0, 8)
  const run = {
    id,
    framework,
    status: 'running',
    command: `mvn ${args.join(' ')}`,
    suiteXmlFile: suiteXmlFile || null,
    profile: profile || null,
    settings: {
      browser,
      headless: Boolean(headless),
      baseUrl,
      gitSync: typeof gitSync === 'boolean' ? gitSync : getGitSyncConfig().enabled,
    },    startedAt: now(),
    finishedAt: null,
    exitCode: null,
    error: null,
    logs: [],
    artifacts: { reports: [], screenshots: [], surefire: [] },
    storage: null,
    git: null,
    subscribers: new Set(),
    child: null,
  }
  runs.set(id, run)

  pushLog(run, `[runner] Working directory: ${path.relative(ROOT, fw.dir)}`, 'system')
  pushLog(run, `[runner] Mode: ${headless ? 'headless' : 'visible'} · browser=${browser} · baseUrl=${baseUrl}`, 'system')
  pushLog(run, `[runner] ${run.command}`, 'system')
  pushLog(run, `[runner] Results will be stored under automation/runs/${id}`, 'system')

  const child = spawn('mvn', args, {
    cwd: fw.dir,
    env: {
      ...process.env,
      MAVEN_OPTS: process.env.MAVEN_OPTS || '-Xmx1024m',
    },
    shell: false,
  })
  run.child = child

  child.stdout.on('data', (buf) => {
    String(buf).split('\n').forEach((line) => {
      if (line.length) pushLog(run, line, 'stdout')
    })
  })
  child.stderr.on('data', (buf) => {
    String(buf).split('\n').forEach((line) => {
      if (line.length) pushLog(run, line, 'stderr')
    })
  })

  child.on('error', async (err) => {
    run.status = 'failed'
    run.error = err.message
    run.finishedAt = now()
    pushLog(run, `[runner] Failed to start Maven: ${err.message}`, 'system')
    await finalizeRun(run)
    broadcast(run, { type: 'status', run: summarizeRun(run) })
    broadcast(run, { type: 'done', run: getRunPublic(id) })
  })

  child.on('close', async (code) => {
    run.exitCode = code
    run.finishedAt = now()
    run.status = code === 0 ? 'passed' : 'failed'
    run.child = null
    try {
      run.artifacts = listFrameworkArtifacts(framework)
    } catch {
      run.artifacts = { reports: [], screenshots: [], surefire: [] }
    }
    pushLog(run, `[runner] Process exited with code ${code}`, 'system')
    await finalizeRun(run)
    broadcast(run, { type: 'status', run: summarizeRun(run) })
    broadcast(run, { type: 'done', run: getRunPublic(id) })
  })

  return { ok: true, run: summarizeRun(run) }
}

export function subscribe(runId, res) {
  const run = getRun(runId)
  if (run) {
    run.subscribers.add(res)
    res.on('close', () => run.subscribers.delete(res))
    for (const entry of run.logs.slice(-500)) {
      res.write(`data: ${JSON.stringify({ type: 'log', ...entry })}\n\n`)
    }
    res.write(`data: ${JSON.stringify({ type: 'status', run: summarizeRun(run) })}\n\n`)
    return true
  }

  // Replay stored run logs once for historical viewing
  const stored = loadStoredRun(runId)
  if (!stored) return false
  for (const entry of (stored.logs || []).slice(-500)) {
    res.write(`data: ${JSON.stringify({ type: 'log', ...entry })}\n\n`)
  }
  res.write(`data: ${JSON.stringify({ type: 'status', run: stored })}\n\n`)
  res.write(`data: ${JSON.stringify({ type: 'done', run: stored })}\n\n`)
  res.end()
  return true
}

export function getRunnerConfig() {
  const git = getGitSyncConfig()
  return {
    service: 'testui-automation-runner',
    runsRoot: 'automation/runs',
    gitSync: {
      enabled: git.enabled,
      push: git.push,
      remote: git.remote,
      branch: git.branch || '(current)',
      repoUrl: git.repoUrl || null,
      paths: git.paths,
    },
    note: 'Deploy with Node + Maven so /api/runner can execute suites against this host. Enable RUNNER_GIT_SYNC to commit/push automation/runs to git.',
  }
}
