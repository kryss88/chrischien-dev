# Home page

The home page introduces Takuya Matsuyama with a temporary construction mascot image, a greeting, a name heading with avatar, and sections for Work, Bio, I ♥, On the web, and Newsletter.

## Sub-features

- `home-identity` shows the `Takuya Matsuyama` h2 and the `Digital Craftsman` tagline.
- `home-sections` renders the Work, Bio, I ♥, On the web and Newsletter h3 headings.
- `home-hero` shows `public/images/construction-hero.png` in `.mascot-hero` above the greeting, with alt text `Construction builder mascot holding a laptop`. It is 256x320 at md and up, 224x280 at sm, and 176x220 below sm, which keeps the image's 1122:1402 ratio. It looks the same in light and dark mode. No 3D canvas mounts, and nothing requests `dog.glb` or the craftzdog CDN.
- `home-portfolio` has a `My portfolio` button that goes to `/works`.

## How to get to it (user POV)

- Open `/`.
- Click the `Takuya Matsuyama` logo in the navbar from any page.
- Choose `About` in the mobile menu.

## Driving it with verify.mjs

Preconditions:

- Doctor is healthy.

- **Open home.** Run `verify.mjs drive home`. The `Takuya Matsuyama` h2 appears.
- **Sections.** The same journey waits for the Work, Bio and I ♥ h3 headings and saves `home.aria.yml`.
- **Hero.** It finds the hero by its alt text and waits for it to load. At 1280, 600 and 390 px wide it asserts the expected width and the 1122:1402 ratio, noting `hero` and `greetingTop`. It asserts no `canvas` exists. It saves `hero-desktop-dark.png`, then toggles the theme and saves `hero-desktop-light.png`, then `hero-tablet.png` and `hero-phone.png`.
- **No dog model.** It records every request and asserts none goes to `dog.glb`, `fastly` or `craftzdog`.

## Gotchas

- The hero lives in `components/layouts/main.js`, so it shows above every page, not only Home.
- `components/mascot-scene.js` is the 3D scene kept for a future mascot. It is not mounted, so no journey checks it.
- `My portfolio`, the logo and the `About` entry are not driven yet. Add them to the journey before claiming them.
