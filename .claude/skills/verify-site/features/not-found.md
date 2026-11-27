# Not found

Any unknown URL shows a custom `Not found` page with a `Return to home` button.

## Sub-features

- `404-page` returns HTTP 404 with the `Not found` h1 and explanatory text.
- `404-home` takes the visitor back to `/` from the `Return to home` button.

## How to get to it (user POV)

- Type or follow a URL that does not exist, such as `/this-page-does-not-exist`.

## Driving it with verify.mjs

Preconditions:

- Doctor is healthy.

- **Unknown route.** Run `verify.mjs drive not-found`. It opens `/this-page-does-not-exist`, notes `status: 404`, waits for the `Not found` h1, and saves `404.png`.
- **Return home.** It clicks `Return to home` and waits for `/` and the `Takuya Matsuyama` h2.

## Gotchas

- `next dev` compiles the 404 page on its first hit, so the first request can take several seconds.
