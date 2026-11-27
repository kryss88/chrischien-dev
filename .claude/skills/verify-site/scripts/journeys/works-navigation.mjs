// Desktop nav: Home -> Works -> Inkdrop detail, then back via breadcrumb.
export default async function ({ page, base, step, shot, aria, assert }) {
  await step('open home', async () => {
    await page.goto(base + '/')
    await page
      .getByRole('heading', { level: 2, name: 'Takuya Matsuyama' })
      .waitFor()
  })
  await step('click Works in navbar', async () => {
    await page
      .getByRole('navigation')
      .getByRole('link', { name: 'Works', exact: true })
      .click()
    await page.waitForURL(base + '/works')
    await page.waitForFunction(
      () => document.title === 'Works - Takuya Matsuyama'
    )
    await page.getByText('Inkdrop', { exact: true }).waitFor()
    await shot('works')
  })
  await step('open Inkdrop work', async () => {
    await page
      .getByRole('link', { name: /Inkdrop/ })
      .first()
      .click()
    await page.waitForURL(base + '/works/inkdrop')
    await page.waitForFunction(
      () => document.title === 'Inkdrop - Takuya Matsuyama'
    )
    await aria('inkdrop', page.locator('main, body').first())
    await shot('inkdrop')
  })
  await step('breadcrumb back to Works', async () => {
    await page.getByRole('link', { name: 'Works', exact: true }).last().click()
    await page.waitForURL(base + '/works')
    await page.waitForFunction(
      () => document.title === 'Works - Takuya Matsuyama'
    )
  })
}
