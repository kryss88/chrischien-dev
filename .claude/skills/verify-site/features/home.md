# Home page

The home page introduces Takuya Matsuyama with a 3D voxel-dog scene, a greeting, a name heading with avatar, and sections for Work, Bio, I ♥, On the web, and Newsletter.

## Sub-features

- `home-identity` shows the `Takuya Matsuyama` h2 and the `Digital Craftsman` tagline.
- `home-sections` renders the Work, Bio, I ♥, On the web and Newsletter h3 headings.
- `home-dog` mounts a WebGL canvas inside `.voxel-dog` that renders the dog at a desk.
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
- **Voxel dog.** The journey waits for `.voxel-dog canvas`, asserts it is larger than 100x100 (noted as `canvasBox`), and saves `home.png` after the intro rotation.

## Gotchas

- The canvas mounts before the model loads, so the spinner shows for a moment. Judge the screenshot, not just the element.
- `My portfolio`, the logo and the `About` entry are not driven yet. Add them to the journey before claiming them.
