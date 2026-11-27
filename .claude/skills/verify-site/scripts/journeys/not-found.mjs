// Unknown route shows the custom 404 and "Return to home" works.
export default async function ({ page, base, step, shot, assert, note }) {
  await step('open unknown route', async () => {
    const res = await page.goto(base + '/this-page-does-not-exist')
    note('status', res.status())
    assert(res.status() === 404, 'HTTP 404')
    await page.getByRole('heading', { level: 1, name: 'Not found' }).waitFor()
    await shot('404')
  })
  await step('Return to home', async () => {
    await page.getByRole('link', { name: 'Return to home' }).click()
    await page.waitForURL(base + '/')
    await page
      .getByRole('heading', { level: 2, name: 'Takuya Matsuyama' })
      .waitFor()
  })
}
