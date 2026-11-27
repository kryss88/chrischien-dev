// Home page: identity, sections, voxel dog canvas.
export default async function ({ page, base, step, shot, aria, assert, note }) {
  await step('open home', async () => {
    await page.goto(base + '/')
    await page
      .getByRole('heading', { level: 2, name: 'Takuya Matsuyama' })
      .waitFor()
  })
  await step('sections render', async () => {
    for (const name of ['Work', 'Bio', 'I ♥']) {
      await page.getByRole('heading', { level: 3, name }).first().waitFor()
    }
    await aria('home')
  })
  await step('voxel dog canvas mounts', async () => {
    const canvas = page.locator('.voxel-dog canvas')
    await canvas.waitFor({ timeout: 30000 })
    const box = await canvas.boundingBox()
    note('canvasBox', box)
    assert(
      box && box.width > 100 && box.height > 100,
      'voxel dog canvas has a real size'
    )
    await page.waitForTimeout(1500) // let the dog finish its intro rotation
    await shot('home')
  })
}
