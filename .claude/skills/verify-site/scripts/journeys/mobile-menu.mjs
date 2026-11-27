// Mobile hamburger menu navigates to Works and Posts.
export const options = { viewport: { width: 390, height: 844 }, isMobile: true }
export default async function ({ page, base, step, shot, aria }) {
  await step('open home on phone viewport', async () => {
    await page.goto(base + '/')
    await page
      .getByRole('heading', { level: 2, name: 'Takuya Matsuyama' })
      .waitFor()
  })
  await step('open hamburger menu', async () => {
    await page.getByRole('button', { name: 'Options' }).click()
    await page.getByRole('menu').waitFor()
    await aria('menu', page.getByRole('menu'))
    await shot('menu-open')
  })
  await step('choose Works', async () => {
    await page.getByRole('menuitem', { name: 'Works' }).click()
    await page.waitForURL(base + '/works')
    await page.waitForFunction(
      () => document.title === 'Works - Takuya Matsuyama'
    )
  })
  await step('menu -> Posts', async () => {
    await page.getByRole('button', { name: 'Options' }).click()
    await page.getByRole('menuitem', { name: 'Posts' }).click()
    await page.waitForURL(base + '/posts')
    await page.waitForFunction(
      () => document.title === 'Posts - Takuya Matsuyama'
    )
    await shot('posts')
  })
}
