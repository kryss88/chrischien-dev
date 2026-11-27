# Posts

The Posts page lists videos and articles as thumbnail cards. Each card links out to YouTube or the Inkdrop blog in a new tab.

## Sub-features

- `posts-grid` shows the `Popular Posts` heading and cards such as `How to build a portfolio website`.
- `posts-external` opens each card's link in a new tab (`target="_blank"`) to youtube.com or blog.inkdrop.app.

## How to get to it (user POV)

- Click `Posts` in the desktop navbar.
- Choose `Posts` in the mobile menu.

## Driving it with verify.mjs

Preconditions:

- Doctor is healthy.

- **Reach it.** `verify.mjs drive desktop-nav` reaches `/posts` through the desktop navbar and `verify.mjs drive mobile-menu` through the mobile menu. Both save `posts.png`.
- **Cards.** Not scripted yet. To prove it, write `journeys/posts.mjs`. It should click the navbar `Posts` link. Then it should assert that `getByRole('link', { name: 'How to build a portfolio website' })` has `href` `https://www.youtube.com/watch?v=bSMZgXzC9AA` and `target` `_blank`.

## Gotchas

- Every card leaves the site. Never click through in a journey. Assert `href` and `target` instead.
