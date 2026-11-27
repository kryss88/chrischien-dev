# Navigation and works

Visitors move between pages with the desktop navbar or the mobile hamburger menu, browse the works grid, open a work detail page, and return through its breadcrumb.

## Sub-features

- `nav-desktop` shows exactly Works, Posts and Source links after the logo at 1280 px wide. Source points at `https://github.com/kryss88/chrischien-dev` and opens in a new tab.
- `nav-works-grid` lists works (Inkdrop, walknote, The four painters, Menkiki, and more) on `/works`.
- `nav-work-detail` opens `/works/<id>` with the title `<Work> - Takuya Matsuyama`.
- `nav-breadcrumb` returns from a work detail page to `/works` through the `Works` link.
- `nav-mobile` opens the `Options` menu below the md breakpoint with exactly About, Works, Posts and View Source.
- `nav-removed` has no Wallpapers or Uses entry. `/wallpapers`, `/wallpapers/machiya` and `/wallpapers/cherry-blossoms` return 404, and no page loads Payhip.

## How to get to it (user POV)

- Click `Works` or `Posts` in the desktop navbar.
- Click a work card on `/works`.
- Click `Works` in the breadcrumb on a work page.
- On a phone, tap the hamburger (`Options`) and choose an entry.

## Driving it with verify.mjs

Preconditions:

- Doctor is healthy.

- **Desktop navbar.** Run `verify.mjs drive desktop-nav`. It reads the navbar links and asserts they are Works, Posts, Source with no Wallpapers or Uses. It asserts the Source `href` and `target`, saves `navbar.aria.yml` and `navbar.png`, then clicks `Posts` and waits for the title `Posts - Takuya Matsuyama`.
- **Desktop path.** Run `verify.mjs drive works-navigation`. It clicks the navbar `Works` link and waits for the title `Works - Takuya Matsuyama`. It clicks the `Inkdrop` card and waits for `/works/inkdrop` and the title `Inkdrop - Takuya Matsuyama`. Then it clicks the breadcrumb back to `/works`. It saves `works.png`, `inkdrop.png` and `inkdrop.aria.yml`.
- **Mobile path.** Run `verify.mjs drive mobile-menu`. At 390x844 it opens `Options`, asserts the items are About, Works, Posts, View Source and the View Source `href`, and saves `menu.aria.yml` and `menu-open.png`. It chooses `Works` and lands on `/works`, then reopens the menu, chooses `Posts`, and lands on `/posts`.
- **Removed features.** Run `verify.mjs drive removed-routes`. It opens each former Wallpaper route and asserts HTTP 404 with the `Not found` h1. It then loads `/`, `/works`, `/works/inkdrop` and `/posts` and asserts no Payhip reference in the DOM, no `window.Payhip`, and no network request to Payhip.

## Gotchas

- Source links to GitHub. Assert its `href`. Do not follow it.
- The URL changes before the page transition finishes and the title updates. Wait for the title.
- At a 1280 px viewport the hamburger is hidden. At 390 px the desktop links are hidden. Pick the viewport for the path you claim.
