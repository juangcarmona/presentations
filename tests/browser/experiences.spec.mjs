import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'node:fs'

const baseline = JSON.parse(readFileSync('tests/fixtures/migration.json', 'utf8'))
const spanish = baseline.scenes.filter(scene => scene.directory === 'ingenieria-del-software-2_0')
const guardrails = baseline.scenes.filter(scene => scene.directory === 'soft-and-hard-guardrails')

test('every static entry and asset is directly served', async ({ page, request }) => {
  const manifest = await (await request.get('/site-manifest.json')).json()
  expect(manifest.entries).toHaveLength(5)
  for (const path of manifest.entries) {
    expect((await request.get(path)).status(), path).toBe(200)
    await page.goto(path)
    await expect(page.locator('h1')).toBeVisible()
  }
  for (const asset of manifest.assets) expect((await request.get(asset)).status(), asset).toBe(200)
  expect((await request.get('/not-a-real-route/')).status()).toBe(404)
  expect((await request.get('/en/software-engineering-2_0/')).status()).toBe(404)
})

for (const [path, scenes, language] of [
  ['/software-engineering-2_0/', spanish, 'es'],
  ['/software-engineering-2_0/?lang=en', spanish, 'en'],
  ['/soft-and-hard-guardrails/', guardrails, 'en'],
]) test(`${path}: complete scene journey`, async ({ page }) => {
  test.setTimeout(90_000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(path)
  await expect(page.locator('html')).toHaveAttribute('lang', language)
  for (const scene of scenes) {
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scene.id)
    await expect(page.locator('#scene-title')).toBeVisible()
    if (path.includes('software-engineering')) expect(await page.locator('.scene a[href^="http"]').evaluateAll(links => links.every(link => link.target === '_blank' && link.rel.includes('noopener'))), scene.id).toBe(true)
    await page.keyboard.press('ArrowRight')
    if (path.includes('software-engineering') && ['04-guardarrailes', '20-piramide'].includes(scene.id)) await page.keyboard.press('ArrowRight')
    if (path.includes('software-engineering') && scene.id === '04-guardarrailes') await page.keyboard.press('ArrowRight')
  }
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scenes.at(-1).id)
  await page.reload()
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scenes.at(-1).id)
  expect(errors).toEqual([])
})

test('standalone talk has no persistent controls, supports keys and protects focused content', async ({ page }) => {
  await page.goto('/software-engineering-2_0/')
  await expect(page.locator('.presentation-dock, .scene-controls, .topbar, .footer, iframe')).toHaveCount(0)
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'cover')
  await page.keyboard.press('PageDown')
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', '02-recorrido')
  await page.keyboard.press('PageUp')
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'cover')
  await page.evaluate(() => { location.hash = 'scene=07-gaps' })
  await expect(page.locator('.terminal')).toContainText('refund')
  await page.locator('.terminal').focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', '07-gaps')
  await page.locator('#scene-title').focus()
  await page.evaluate(() => { location.hash = 'scene=08-dimensiones' })
  await expect(page.locator('#scene-title')).toBeFocused()
})

test('English shares the standalone page and retains links to original media', async ({ page, request }) => {
  await page.goto('/software-engineering-2_0/?lang=en#scene=11-modelo')
  await expect(page.locator('#scene-title')).toContainText('product')
  await expect(page.locator('.diagram-node')).toHaveCount(10)
  const original = await page.getByRole('link', { name: 'Original diagram' }).getAttribute('href')
  expect((await request.get(original)).status()).toBe(200)
  await page.getByRole('button', { name: /Use cases/ }).hover()
  await expect(page.locator('.node-popover')).toContainText('links rules, domain and requirements')
  const scripts = await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => node.src))
  expect(scripts.every(src => src.includes('/software-engineering-2_0/assets/'))).toBe(true)
  await page.goto('/software-engineering-2_0/?lang=en#scene=24-fin')
  await expect(page.getByRole('img', { name: 'Juan G. Carmona' })).toBeVisible()
  await expect(page.getByText('Questions?')).toBeVisible()
})

test('keynote respects reduced motion and has no WCAG A/AA violations on representative scenes', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const scene of ['cover', '03-repo', '11-modelo', '24-fin']) {
    await page.goto(`/software-engineering-2_0/#scene=${scene}`)
    await expect(page.locator('.scene')).toHaveCSS('animation-duration', '0s')
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
    expect(result.violations, scene).toEqual([])
  }
})
