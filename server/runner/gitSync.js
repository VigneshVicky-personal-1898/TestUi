// AI-ASSISTED: Cursor
// PROMPT: Optional git commit/push of automation run artifacts to repo
// ACCEPTED-BY: vignesh
import { spawn } from 'node:child_process'
import path from 'node:path'
import { ROOT } from './catalog.js'

function envFlag(name, fallback = false) {
  const v = process.env[name]
  if (v == null || v === '') return fallback
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase())
}

export function getGitSyncConfig() {
  return {
    enabled: envFlag('RUNNER_GIT_SYNC', false),
    push: envFlag('RUNNER_GIT_PUSH', true),
    remote: process.env.RUNNER_GIT_REMOTE || 'origin',
    branch: process.env.RUNNER_GIT_BRANCH || '',
    repoUrl: process.env.RUNNER_GIT_REPO_URL || '',
    userName: process.env.RUNNER_GIT_USER_NAME || 'TestUi Runner',
    userEmail: process.env.RUNNER_GIT_USER_EMAIL || 'testui-runner@local',
    // Relative paths under TestUi that will be committed
    paths: ['automation/runs'],
  }
}

function runGit(args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn('git', args, {
      cwd: opts.cwd || ROOT,
      env: process.env,
      shell: false,
    })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (b) => { stdout += b.toString() })
    child.stderr.on('data', (b) => { stderr += b.toString() })
    child.on('error', (err) => {
      resolve({ ok: false, code: 1, stdout, stderr: err.message })
    })
    child.on('close', (code) => {
      resolve({ ok: code === 0, code, stdout: stdout.trim(), stderr: stderr.trim() })
    })
  })
}

/**
 * Stage automation/runs, commit, and optionally push to the configured remote.
 * Designed for deployed TestUi hosts that have a writable git checkout.
 */
export async function syncRunToGit(runSummary, onLog = () => {}, options = {}) {
  const cfg = getGitSyncConfig()
  const enabled = typeof options.enabled === 'boolean' ? options.enabled : cfg.enabled
  if (!enabled) {
    return { ok: true, skipped: true, reason: 'Git sync disabled for this run' }
  }

  const repoRoot = path.resolve(ROOT, '..') // QE_Engine root (parent of TestUi)
  // Prefer monorepo root if it looks like a git repo; else TestUi itself
  let cwd = ROOT
  const rootGit = await runGit(['rev-parse', '--show-toplevel'], { cwd: ROOT })
  if (rootGit.ok) {
    cwd = rootGit.stdout
  } else {
    const parentGit = await runGit(['rev-parse', '--show-toplevel'], { cwd: repoRoot })
    if (parentGit.ok) cwd = parentGit.stdout
  }

  onLog(`[git] Repository: ${cwd}`)

  await runGit(['config', 'user.name', cfg.userName], { cwd })
  await runGit(['config', 'user.email', cfg.userEmail], { cwd })

  // Paths relative to git root
  const relFromGit = path.relative(cwd, path.join(ROOT, 'automation', 'runs'))
  const addPaths = [relFromGit || 'TestUi/automation/runs']

  for (const p of addPaths) {
    onLog(`[git] git add ${p}`)
    const add = await runGit(['add', '-A', '--', p], { cwd })
    if (!add.ok) {
      onLog(`[git] add failed: ${add.stderr || add.stdout}`)
      return { ok: false, error: add.stderr || add.stdout, cwd }
    }
  }

  const status = await runGit(['status', '--porcelain', '--', ...addPaths], { cwd })
  if (!status.stdout) {
    onLog('[git] Nothing new to commit')
    return { ok: true, skipped: true, reason: 'clean', cwd }
  }

  const msg = `testui-runner: ${runSummary.framework} ${runSummary.status} (${runSummary.id})`
  onLog(`[git] commit: ${msg}`)
  const commit = await runGit(['commit', '-m', msg], { cwd })
  if (!commit.ok) {
    onLog(`[git] commit failed: ${commit.stderr || commit.stdout}`)
    return { ok: false, error: commit.stderr || commit.stdout, cwd }
  }

  let pushResult = null
  if (cfg.push) {
    const branchRes = cfg.branch
      ? { ok: true, stdout: cfg.branch }
      : await runGit(['rev-parse', '--abbrev-ref', 'HEAD'], { cwd })
    const branch = (branchRes.stdout || 'HEAD').trim()
    onLog(`[git] push ${cfg.remote} ${branch}`)
    pushResult = await runGit(['push', cfg.remote, branch], { cwd })
    if (!pushResult.ok) {
      onLog(`[git] push failed: ${pushResult.stderr || pushResult.stdout}`)
      return {
        ok: false,
        committed: true,
        pushed: false,
        error: pushResult.stderr || pushResult.stdout,
        cwd,
        branch,
        remote: cfg.remote,
      }
    }
    onLog('[git] push succeeded')
    return {
      ok: true,
      committed: true,
      pushed: true,
      cwd,
      branch,
      remote: cfg.remote,
      message: msg,
    }
  }

  return {
    ok: true,
    committed: true,
    pushed: false,
    cwd,
    message: msg,
  }
}
