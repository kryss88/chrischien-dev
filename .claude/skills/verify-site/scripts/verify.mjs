#!/usr/bin/env node
// Verification harness for the homepage (Next.js dev server + system Chrome via playwright-core).
// Usage: node .claude/skills/verify-site/scripts/verify.mjs <launch|doctor|drive|cleanup|list> [journey] [--headed]
import { spawn, execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../../../..')
const runDir = path.join(repo, '.verify', 'run')
const evidenceRoot = path.join(repo, '.verify', 'evidence')
const statePath = path.join(runDir, 'state.json')
const port = Number(process.env.VERIFY_PORT || 3123)
const base = `http://127.0.0.1:${port}`
const IDENTITY = 'Takuya Matsuyama' // h2 on the home page; proves we hit this app

const [cmd, ...rest] = process.argv.slice(2)
const flags = new Set(rest.filter(a => a.startsWith('--')))
const args = rest.filter(a => !a.startsWith('--'))

const readState = () =>
  fs.existsSync(statePath)
    ? JSON.parse(fs.readFileSync(statePath, 'utf8'))
    : null

const alive = pid => {
  try {
    process.kill(pid, 0)
    return true
  } catch {
    return false
  }
}

async function fetchHome(timeoutMs = 60000) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), timeoutMs)
  try {
    const res = await fetch(base + '/', { signal: ctl.signal })
    const html = await res.text()
    return { status: res.status, hasIdentity: html.includes(IDENTITY) }
  } catch (e) {
    return { status: 0, error: e.cause?.code || e.name }
  } finally {
    clearTimeout(t)
  }
}

async function launch() {
  const st = readState()
  if (st && alive(st.pid)) {
    console.error(
      `Refusing: an instance started by this harness is running (pid ${st.pid}, ${st.base}). Run cleanup first.`
    )
    process.exit(1)
  }
  const probe = await fetchHome(2000)
  if (probe.status !== 0) {
    console.error(
      `Refusing: port ${port} is already serving (status ${probe.status}) and not ours. Set VERIFY_PORT to a free port.`
    )
    process.exit(1)
  }
  if (!fs.existsSync(path.join(repo, 'node_modules', 'next'))) {
    console.error(
      'node_modules missing. Run: npx --yes yarn@1.22.22 install --frozen-lockfile'
    )
    process.exit(1)
  }
  fs.mkdirSync(runDir, { recursive: true })
  const logPath = path.join(runDir, 'next.log')
  const log = fs.openSync(logPath, 'w')
  const child = spawn(
    process.execPath,
    [
      path.join(repo, 'node_modules', 'next', 'dist', 'bin', 'next'),
      'dev',
      '-H',
      '127.0.0.1',
      '-p',
      String(port)
    ],
    {
      cwd: repo,
      detached: true,
      stdio: ['ignore', log, log],
      windowsHide: true,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' }
    }
  )
  child.unref()
  const state = {
    pid: child.pid,
    port,
    base,
    repo,
    startedAt: new Date().toISOString(),
    log: logPath
  }
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2))
  console.log(
    `Started next dev pid ${child.pid} on ${base}; waiting for first compile of / ...`
  )
  const deadline = Date.now() + 180000
  while (Date.now() < deadline) {
    if (!alive(child.pid)) {
      console.error(`next dev exited early. Log: ${logPath}`)
      process.exit(1)
    }
    const r = await fetchHome(60000)
    if (r.status === 200 && r.hasIdentity) {
      console.log(`READY ${base} (home page rendered with "${IDENTITY}")`)
      return
    }
    await new Promise(r => setTimeout(r, 1000))
  }
  console.error(`Timed out waiting for ${base}. Log: ${logPath}`)
  process.exit(1)
}

async function doctor() {
  const st = readState()
  const report = {
    base,
    statePath,
    state: st,
    pidAlive: st ? alive(st.pid) : false
  }
  const r = await fetchHome(60000)
  report.home = r
  report.ownedByUs = Boolean(st && report.pidAlive && st.port === port)
  report.healthy = report.ownedByUs && r.status === 200 && r.hasIdentity
  console.log(JSON.stringify(report, null, 2))
  process.exit(report.healthy ? 0 : 1)
}

function cleanup() {
  const st = readState()
  if (st && alive(st.pid)) {
    if (process.platform === 'win32') {
      try {
        execFileSync('taskkill', ['/PID', String(st.pid), '/T', '/F'], {
          stdio: 'inherit'
        })
      } catch {}
    } else {
      try {
        process.kill(-st.pid, 'SIGTERM')
      } catch {}
    }
    console.log(`Stopped pid ${st.pid}`)
  } else {
    console.log('No running instance recorded by this harness.')
  }
  fs.rmSync(runDir, { recursive: true, force: true })
  console.log(`Removed ${runDir}. Evidence kept in ${evidenceRoot}`)
}

function listJourneys() {
  for (const f of fs.readdirSync(path.join(here, 'journeys')))
    if (f.endsWith('.mjs')) console.log(f.replace(/\.mjs$/, ''))
}

async function drive(name) {
  if (!name) {
    console.error('Usage: verify.mjs drive <journey>. Journeys:')
    listJourneys()
    process.exit(2)
  }
  const st = readState()
  if (!st || !alive(st.pid) || st.port !== port) {
    console.error(
      'Refusing: no instance started by this harness on this port. Run launch first.'
    )
    process.exit(1)
  }
  const journeyFile = path.join(here, 'journeys', `${name}.mjs`)
  const { default: journey, options = {} } = await import(
    pathToFileURL(journeyFile)
  )
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const outDir = path.join(evidenceRoot, `${stamp}-${name}`)
  fs.mkdirSync(outDir, { recursive: true })

  const { chromium } = await import('playwright-core')
  let browser
  for (const channel of ['chrome', 'msedge']) {
    try {
      browser = await chromium.launch({
        channel,
        headless: !flags.has('--headed')
      })
      break
    } catch {}
  }
  if (!browser) throw new Error('Could not launch system Chrome or Edge')
  const context = await browser.newContext({
    viewport: options.viewport || { width: 1280, height: 900 },
    colorScheme: options.colorScheme || 'dark',
    isMobile: Boolean(options.isMobile),
    hasTouch: Boolean(options.isMobile)
  })
  const page = await context.newPage()
  const consoleLines = []
  page.on('console', m =>
    consoleLines.push(`[${m.type()}] ${m.text().split('\n')[0]}`)
  )
  page.on('pageerror', e => consoleLines.push(`[pageerror] ${e.message}`))

  const steps = []
  let n = 0
  const tag = s => `${String(++n).padStart(2, '0')}-${s}`
  const h = {
    page,
    base,
    async step(label, fn) {
      const entry = { step: label, url: null, ok: false }
      steps.push(entry)
      try {
        await fn()
        entry.ok = true
      } finally {
        entry.url = page.url()
        entry.title = await page.title().catch(() => null)
      }
    },
    async shot(label) {
      const f = path.join(outDir, `${tag(label)}.png`)
      await page.screenshot({ path: f, fullPage: false })
      return f
    },
    async aria(label, locator = page.locator('body')) {
      const f = path.join(outDir, `${tag(label)}.aria.yml`)
      fs.writeFileSync(f, await locator.ariaSnapshot())
      return f
    },
    note(key, value) {
      steps[steps.length - 1][key] = value
    },
    assert(cond, msg) {
      if (!cond) throw new Error(`Assertion failed: ${msg}`)
    }
  }

  let failure = null
  try {
    await journey(h)
  } catch (e) {
    failure = e
    await h.shot('failure').catch(() => {})
  }
  await browser.close()
  const summary = {
    journey: name,
    base,
    passed: !failure,
    error: failure ? String(failure.stack || failure) : null,
    steps,
    console: consoleLines
  }
  fs.writeFileSync(
    path.join(outDir, 'summary.json'),
    JSON.stringify(summary, null, 2)
  )
  console.log(`${failure ? 'FAIL' : 'PASS'} ${name} -> ${outDir}`)
  if (failure) {
    console.error(failure.message)
    process.exit(1)
  }
}

const commands = {
  launch,
  doctor,
  cleanup,
  list: listJourneys,
  drive: () => drive(args[0])
}
if (!commands[cmd]) {
  console.error(
    'Usage: verify.mjs <launch|doctor|drive <journey>|cleanup|list> [--headed]'
  )
  process.exit(2)
}
await commands[cmd]()
