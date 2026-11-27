# Homepage verification map

This directory is the maintained source for verifying the visitor-facing behavior of the homepage. Read this index before driving the site, then use the matching feature file as the recipe.

## Baseline preconditions

- The site is launched by `node .claude/skills/verify-site/scripts/verify.mjs launch` at `http://127.0.0.1:3123`.
- `verify.mjs doctor` reports `healthy: true`.
- The browser context is fresh for each journey: no cookies, no localStorage, `prefers-color-scheme: dark`.
- Never drive an instance that this harness did not start.

## Driving conventions

- Run each recipe with `verify.mjs drive <journey>`. Each feature names its journey.
- Prefer ARIA roles and accessible names over CSS selectors or DOM position.
- After client-side navigation, wait for `document.title` to read `<Page> - Takuya Matsuyama` before asserting.
- Assert the `href` of external links. Do not follow them.

## Proof and skip reporting

- Capture the visitor action and the resulting state, not only the final screen.
- Proof is the evidence folder printed by `drive`: screenshots, ARIA snapshots, and `summary.json`.
- Report an unreachable path with the attempted journey and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the visitor-visible behavior, then exactly four H2 sections in this order: `Sub-features`, `How to get to it (user POV)`, `Driving it with verify.mjs`, `Gotchas`.

## Features

- [Home page](./home.md): identity, sections, voxel dog.
- [Navigation and works](./navigation.md): desktop navbar, works grid, work detail, breadcrumb, mobile menu, removed Wallpaper routes and Payhip.
- [Theme toggle](./theme-toggle.md): dark/light switch and persistence.
- [Posts](./posts.md): post grid with external links.
- [Not found](./not-found.md): 404 page and return home.
