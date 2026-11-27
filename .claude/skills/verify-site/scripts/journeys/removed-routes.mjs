// Removed Wallpaper routes return 404, and no page loads Payhip.
const ROUTES = [
  '/wallpapers',
  '/wallpapers/machiya',
  '/wallpapers/cherry-blossoms'
]
const PAGES = ['/', '/works', '/works/inkdrop', '/posts']

export default async function ({ page, base, step, shot, assert, note }) {
  const payhipRequests = []
  page.on('request', req => {
    if (/payhip/i.test(req.url())) payhipRequests.push(req.url())
  })

  for (const route of ROUTES) {
    await step(`open ${route}`, async () => {
      const res = await page.goto(base + route)
      note('status', res.status())
      assert(res.status() === 404, `${route} returns 404`)
      await page.getByRole('heading', { level: 1, name: 'Not found' }).waitFor()
    })
  }
  await shot('wallpapers-404')

  for (const path of PAGES) {
    await step(`no Payhip on ${path}`, async () => {
      await page.goto(base + path)
      await page.waitForLoadState('networkidle')
      const html = await page.content()
      note('payhipInDom', /payhip/i.test(html))
      assert(!/payhip/i.test(html), `${path} DOM has no Payhip reference`)
      assert(
        (await page.evaluate(() => typeof window.Payhip)) === 'undefined',
        `${path} has no window.Payhip`
      )
    })
  }
  note('payhipRequests', payhipRequests)
  assert(payhipRequests.length === 0, 'no request to payhip')
}
