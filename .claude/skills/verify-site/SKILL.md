---
name: verify-site
description: Launch and drive this Next.js personal homepage (pages /, /works, /works/*, /posts, /wallpapers, 404) in real system Chrome to prove a UI change works, the way a visitor would. Use after any change to pages/, components/ or lib/, or when asked to verify, screenshot or check the site.
---

# Verify the homepage

The app is a Next.js 13 (pages router) site with Chakra UI, framer-motion and a Three.js voxel-dog canvas. The only user surface is the web UI. All harness commands go through one script, run from the repo root:

```
node .claude/skills/verify-site/scripts/verify.mjs <launch|doctor|list|drive <journey>|cleanup> [--headed]
```

Everything the harness creates lives in `.verify/` (gitignored): `.verify/run/` for the live instance, `.verify/evidence/` for proof.

## Setup (once per checkout)

- Site deps: `npx --yes yarn@1.22.22 install --frozen-lockfile` from the repo root. The repo uses yarn v1 (`yarn.lock`); do not run `npm install` there, it writes a `package-lock.json`.
- Harness deps: `cd .claude/skills/verify-site/scripts && npm install`. That installs only `playwright-core`; it drives the system Chrome (falls back to Edge), so no browser download is needed.

## Launch

`node .claude/skills/verify-site/scripts/verify.mjs launch`

- Starts `next dev -H 127.0.0.1 -p 3123` (override with `VERIFY_PORT=<port>` on every command), detached, logging to `.verify/run/next.log`, and records its PID in `.verify/run/state.json`.
- Ready when it prints `READY http://127.0.0.1:3123`. That means `/` was compiled and its HTML contains `Takuya Matsuyama`, not just that the port answers. The first compile takes 10-60 s.
- It refuses to start if this harness already has a live instance, or if the port is serving something else. Do not reuse a dev server the user started (`yarn dev` on :3000); it is not ours.
- One instance per checkout: two `next dev` processes share the `.next/` folder and corrupt each other. Run parallel verifications in separate worktrees with distinct `VERIFY_PORT`s.
- No database, env vars, auth or seed data are needed.

## Doctor

`node .claude/skills/verify-site/scripts/verify.mjs doctor`

Read-only. Prints JSON and exits 0 only when `healthy: true`: the recorded PID is alive, the port matches, and `/` returns 200 with the identity string. Run it first whenever anything looks off. If unhealthy, read `.verify/run/next.log` (compile errors appear there and in the page as the Next error overlay).

## Drive

`node .claude/skills/verify-site/scripts/verify.mjs drive <journey>` runs `scripts/journeys/<journey>.mjs` in a fresh headless Chrome context (1280x900, `prefers-color-scheme: dark`; `--headed` to watch). `list` prints the journeys.

Seeded journeys (one per feature file in [features/](features/README.md)):

| Journey            | Proves                                                          |
| ------------------ | --------------------------------------------------------------- |
| `home`             | Home renders identity, sections, and the voxel-dog WebGL canvas |
| `works-navigation` | Navbar → Works → Inkdrop detail → breadcrumb back               |
| `theme-toggle`     | Toggle flips colour mode, writes the cookie, survives reload    |
| `mobile-menu`      | Hamburger menu (390x844) navigates to Works and Posts           |
| `not-found`        | Unknown route returns 404 page and "Return to home" works       |

To prove a new change, write a journey next to the others. A journey is `export default async function ({ page, base, step, shot, aria, assert, note })`, plus optional `export const options = { viewport, isMobile, colorScheme }`:

- `step(label, fn)` wraps one user action and records URL and title after it.
- `shot(label)` saves a screenshot; `aria(label, locator?)` saves an ARIA snapshot (YAML).
- `note(key, value)` attaches an observed value to the current step; `assert(cond, msg)` fails the journey.
- `page` is a Playwright page. Use stable handles: `getByRole('heading', { level: 2, name: 'Takuya Matsuyama' })`, `getByRole('button', { name: 'Toggle theme' })`, `getByRole('button', { name: 'Options' })` (mobile menu), `getByRole('navigation').getByRole('link', { name: 'Works', exact: true })`, `.voxel-dog canvas`. Wait on `document.title` (`<Title> - Takuya Matsuyama`) after client navigation; it updates after the URL does.

## Evidence

Each drive writes `.verify/evidence/<timestamp>-<journey>/`: numbered screenshots and ARIA snapshots, a `failure.png` on failure, and `summary.json` (pass/fail, error, each step with URL, title and noted values, and the browser console). The command prints `PASS|FAIL <journey> -> <dir>` and exits non-zero on failure.

Proof standards:

- Drive the real visitor path: click the navbar, menu and buttons; don't `goto` the destination you're trying to prove is reachable.
- Capture the action and the resulting state: a screenshot before and after, plus the observed value (URL, title, `data-theme`, cookie) in `summary.json`.
- Check side effects, not just pixels: the theme choice is the `chakra-ui-color-mode` cookie, then a reload.
- Read the `console` array. Baseline noise you can ignore: React DevTools info, `[HMR] connected`, the `fetchPriority` prop warning from `next/image`, and `THREE.WebGLRenderer ... outputEncoding` warnings. Anything else new is a finding.
- External links (Wallpapers, Uses, Source, posts, social) leave the site. Assert their `href`; don't follow them.

## Cleanup

`node .claude/skills/verify-site/scripts/verify.mjs cleanup`

Kills only the PID tree recorded in `state.json` (`taskkill /T /F` on Windows, process group elsewhere), then deletes `.verify/run/`. It never kills by process name, and it never touches `.verify/evidence/`. Run it after every session, including failed ones. Delete old evidence by hand when you no longer need it.

## Gotchas

- `vercel.json` redirects (`/wallpapers/machiya`, `/wallpapers/cherry-blossoms` → store.craftz.dog) apply only on Vercel. Locally those routes render the page. Don't treat either behaviour as a bug in local verification.
- Colour mode follows the system scheme first (`useSystemColorMode: true`). The harness pins `prefers-color-scheme: dark`; set `options.colorScheme` to test light.
- `/`, `/posts` and `/wallpapers/cherry-blossoms` store the colour mode in a cookie (SSR). Other pages use `localStorage`. Check the store that matches the page.
- The project runs on Node 24 (`.nvmrc`, `engines` in `package.json`). Yarn v1 refuses to install on other major versions.
