// Home page: identity, sections, and the mascot hero image at each size and theme.
const RATIO = 1122 / 1402 // construction-hero.png natural width / height

async function checkHero({ page, assert, note }, expectedWidth) {
  const img = page.getByRole('img', {
    name: 'Construction builder mascot holding a laptop'
  })
  await img.waitFor()
  await page.waitForFunction(
    () => document.querySelector('.mascot-hero img')?.complete
  )
  const info = await img.evaluate(el => {
    const r = el.getBoundingClientRect()
    return {
      width: r.width,
      height: r.height,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      src: el.currentSrc
    }
  })
  note('hero', info)
  assert(info.naturalWidth > 0, 'hero image loaded')
  assert(
    Math.abs(info.width - expectedWidth) <= 1,
    `hero is ${expectedWidth}px wide (got ${info.width})`
  )
  assert(
    Math.abs(info.width / info.height - RATIO) < 0.01,
    `hero keeps the 1122:1402 ratio (got ${info.width}x${info.height})`
  )
  const greeting = await page
    .getByText("Hello, I'm an indie app developer based in Japan!")
    .boundingBox()
  note('greetingTop', greeting && greeting.y)
}

export default async function (ctx) {
  const { page, base, step, shot, aria, assert, note } = ctx
  const requests = []
  page.on('request', req => requests.push(req.url()))

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
  await step('hero image, desktop, dark', async () => {
    await checkHero(ctx, 256)
    assert((await page.locator('canvas').count()) === 0, 'no 3D canvas')
    await shot('hero-desktop-dark')
  })
  await step('hero image, desktop, light', async () => {
    await page.getByRole('button', { name: 'Toggle theme' }).click()
    await page.waitForFunction(
      () => document.documentElement.dataset.theme === 'light'
    )
    await page.waitForTimeout(400) // colour transition
    await checkHero(ctx, 256)
    await shot('hero-desktop-light')
  })
  for (const [label, width, expected] of [
    ['tablet', 600, 224],
    ['phone', 390, 176]
  ]) {
    await step(`hero image, ${label}`, async () => {
      await page.setViewportSize({ width, height: 844 })
      await checkHero(ctx, expected)
      await shot(`hero-${label}`)
    })
  }
  await step('no voxel dog model requested', async () => {
    const bad = requests.filter(u => /dog\.glb|fastly|craftzdog/i.test(u))
    note('modelRequests', bad)
    assert(bad.length === 0, 'no request for dog.glb or the craftzdog CDN')
  })
}
