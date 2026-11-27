# chrischien.dev

Personal portfolio for chrischien.dev, forked from craftzdog/craftzdog-homepage. Keep its visual identity: layout, animations, light/dark themes. Target sections: **Home, Works, Posts** only (Uses and Wallpapers are being removed).

## Requirements

- Node 24 (`.nvmrc`, `engines` in `package.json`).
- Yarn v1 with `yarn.lock`. Never run `npm install` in the repo root; it creates a second lockfile. Commands use `npx yarn@1.22.22` so no global Yarn install is needed.

## Commands

```bash
npx --yes yarn@1.22.22 install --frozen-lockfile   # install
npx yarn@1.22.22 dev     # dev server, http://localhost:3000
npx yarn@1.22.22 lint    # ESLint (next lint)
npx yarn@1.22.22 build   # production build
npx prettier --check .   # formatting
```

## Architecture

- Next.js 13 Pages Router, plain JavaScript (no TypeScript). Each file in `pages/` is a route. Content is written directly in the page files; there is no CMS.
- `pages/_app.js` wraps every page in Chakra (`components/chakra.js`), the site frame (`components/layouts/main.js`: navbar, 3D scene, footer, `<head>` tags) and framer-motion page transitions.
- Each page wraps its content in `components/layouts/article.js` (tab title and enter animation). Use `components/section.js` for staggered fade-in blocks.
- Theme lives in `lib/theme.js`. Colour mode is stored in a cookie, which is why pages export `getServerSideProps` from `components/chakra.js`. Keep that export on new pages.
- 3D scene: `components/voxel-dog.js` + `lib/model.js` (Three.js, loaded client-side only).

## Conventions

- Style with Chakra props and theme tokens, not CSS files. Every colour must work in both modes: use `useColorModeValue(light, dark)` or `mode()` in the theme.
- Prettier style (`prettier.config.js`): no semicolons, single quotes, 2 spaces, no trailing commas, LF line endings.
- Images go in `public/images/`. Use `next/image` for grid thumbnails, as the existing cards do.
- Keep changes small and scoped to one task. Don't upgrade dependencies or change the design unless the task asks.

## Licence rules

- Keep `LICENSE` (MIT, Takuya Matsuyama) and a visible credit link to https://www.craftz.dog/ on the site.
- The voxel dog model (`public/dog.glb`, CC BY-NC-ND) must not ship on chrischien.dev. It must also not load from craftzdog's CDN. Replace it before going public.
- Photos, screenshots, posts and text from the original site are not covered by MIT. Replace them.

## Verification

- After any change to `pages/`, `components/` or `lib/`, run lint, build, and the `verify-site` skill journeys (`.claude/skills/verify-site/SKILL.md`).
- When content changes, update the matching journey and feature file in the same change. Never weaken a check just to make it pass.

## Git

- Work on a branch per task and commit only when asked.
- Never push to GitHub or deploy without explicit approval.
