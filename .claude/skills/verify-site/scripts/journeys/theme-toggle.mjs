// Theme toggle flips colour mode and the choice survives a reload.
// Home/posts use Chakra's cookie storage (SSR), so the choice lives in the `chakra-ui-color-mode` cookie.
export default async function ({ page, base, step, shot, assert, note }) {
  const mode = () => page.evaluate(() => document.documentElement.dataset.theme)
  const cookie = async () =>
    (await page.context().cookies()).find(
      c => c.name === 'chakra-ui-color-mode'
    )?.value
  let before
  await step('open home (system scheme = dark)', async () => {
    await page.goto(base + '/')
    await page
      .getByRole('heading', { level: 2, name: 'Takuya Matsuyama' })
      .waitFor()
    before = await mode()
    note('mode', before)
    await shot('before')
  })
  await step('click Toggle theme', async () => {
    await page.getByRole('button', { name: 'Toggle theme' }).click()
    await page.waitForFunction(
      b => document.documentElement.dataset.theme !== b,
      before
    )
    const after = await mode()
    await page.waitForTimeout(400)
    const stored = await cookie()
    note('mode', after)
    note('cookie', stored)
    assert(after !== before, 'mode flipped')
    assert(
      stored === after,
      'choice persisted to the chakra-ui-color-mode cookie'
    )
    await shot('after')
  })
  await step('reload keeps the choice', async () => {
    await page.reload()
    await page
      .getByRole('heading', { level: 2, name: 'Takuya Matsuyama' })
      .waitFor()
    await page.waitForTimeout(400)
    const m = await mode()
    note('mode', m)
    assert(m !== before, 'mode survives reload')
    await shot('after-reload')
  })
}
