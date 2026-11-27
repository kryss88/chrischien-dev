# Theme toggle

The sun/moon button in the navbar switches the site between dark and light mode, and the choice persists across reloads.

## Sub-features

- `theme-initial` follows the system colour scheme on first visit.
- `theme-flip` switches `<html data-theme>` between `dark` and `light` when clicked.
- `theme-persist` stores the choice and restores it after a reload.

## How to get to it (user POV)

- Click the `Toggle theme` button at the top right of any page (desktop and mobile).

## Driving it with verify.mjs

Preconditions:

- Doctor is healthy. The context is fresh, with `prefers-color-scheme: dark`.

- **Initial.** Run `verify.mjs drive theme-toggle`. It opens `/`, notes `mode: dark`, and saves `before.png`.
- **Flip.** It clicks `Toggle theme` and waits for `data-theme` to change. It notes `mode: light` and `cookie: light` (the `chakra-ui-color-mode` cookie) and saves `after.png`.
- **Persist.** It reloads, asserts the mode is still `light`, and saves `after-reload.png`.

## Gotchas

- `/` and `/posts` persist the mode in the `chakra-ui-color-mode` cookie. Other pages use `localStorage` under the same key. Checking the wrong store reports a false failure.
- The class on `<html>` is not a reliable signal. Read `document.documentElement.dataset.theme`.
