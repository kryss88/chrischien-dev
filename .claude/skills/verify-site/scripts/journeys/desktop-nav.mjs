// Desktop navbar shows exactly Works, Posts and Source, and Posts is reachable.
export default async function ({ page, base, step, shot, aria, assert, note }) {
  const nav = () => page.getByRole('navigation')

  await step('open home', async () => {
    await page.goto(base + '/')
    await page
      .getByRole('heading', { level: 2, name: 'Takuya Matsuyama' })
      .waitFor()
  })
  await step('navbar links', async () => {
    const names = (await nav().getByRole('link').allInnerTexts())
      .map(s => s.trim())
      .filter(Boolean)
    note('links', names)
    assert(
      JSON.stringify(names.slice(1)) ===
        JSON.stringify(['Works', 'Posts', 'Source']),
      `navbar links after logo are Works, Posts, Source (got ${names})`
    )
    for (const gone of ['Wallpapers', 'Uses']) {
      assert(
        (await page.getByRole('link', { name: gone }).count()) === 0,
        `no ${gone} link`
      )
    }
    const source = nav().getByRole('link', { name: 'Source' })
    const href = await source.getAttribute('href')
    note('sourceHref', href)
    assert(
      href === 'https://github.com/kryss88/chrischien-dev',
      'Source points at kryss88/chrischien-dev'
    )
    assert(
      (await source.getAttribute('target')) === '_blank',
      'Source opens in a new tab'
    )
    await aria('navbar', nav())
    await shot('navbar')
  })
  await step('click Posts in navbar', async () => {
    await nav().getByRole('link', { name: 'Posts', exact: true }).click()
    await page.waitForURL(base + '/posts')
    await page.waitForFunction(
      () => document.title === 'Posts - Takuya Matsuyama'
    )
    await shot('posts')
  })
}
