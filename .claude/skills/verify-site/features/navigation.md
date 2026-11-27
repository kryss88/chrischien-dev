# Navigation and works

Visitors move between pages with the desktop navbar or the mobile hamburger menu, browse the works grid, open a work detail page, and return through its breadcrumb.

## Sub-features

- `nav-desktop` shows Works, Wallpapers, Posts, Uses and Source links at 1280 px wide.
- `nav-works-grid` lists works (Inkdrop, walknote, The four painters, Menkiki, and more) on `/works`.
- `nav-work-detail` opens `/works/<id>` with the title `<Work> - Takuya Matsuyama`.
- `nav-breadcrumb` returns from a work detail page to `/works` through the `Works` link.
- `nav-mobile` opens the `Options` menu below the md breakpoint with About, Works, Wallpapers, Posts, Uses and View Source.

## How to get to it (user POV)

- Click `Works` or `Posts` in the desktop navbar.
- Click a work card on `/works`.
- Click `Works` in the breadcrumb on a work page.
- On a phone, tap the hamburger (`Options`) and choose an entry.

## Driving it with verify.mjs

Preconditions:

- Doctor is healthy.

- **Desktop path.** Run `verify.mjs drive works-navigation`. It clicks the navbar `Works` link and waits for the title `Works - Takuya Matsuyama`. It clicks the `Inkdrop` card and waits for `/works/inkdrop` and the title `Inkdrop - Takuya Matsuyama`. Then it clicks the breadcrumb back to `/works`. It saves `works.png`, `inkdrop.png` and `inkdrop.aria.yml`.
- **Mobile path.** Run `verify.mjs drive mobile-menu`. At 390x844 it opens `Options` and saves `menu.aria.yml` and `menu-open.png`. It chooses `Works` and lands on `/works`, then reopens the menu, chooses `Posts`, and lands on `/posts`.

## Gotchas

- Wallpapers, Uses and Source link to external sites (`store.craftz.dog`, `uses.craftz.dog`, GitHub). Assert their `href`. Do not follow them.
- The URL changes before the page transition finishes and the title updates. Wait for the title.
- At a 1280 px viewport the hamburger is hidden. At 390 px the desktop links are hidden. Pick the viewport for the path you claim.
