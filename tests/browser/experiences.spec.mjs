import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'

const baseline = JSON.parse(readFileSync('tests/fixtures/migration.json', 'utf8'))
const guardrails = baseline.scenes.filter(scene => scene.directory === 'soft-and-hard-guardrails')

test('catalogue, local talk, redirects and assets are directly served', async ({ page, request }) => {
  const manifest = await (await request.get('/site-manifest.json')).json()
  expect(manifest.entries).toHaveLength(5)
  for (const path of manifest.entries) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    if (path.includes('software-engineering-2_0')) {
      expect(await response.text()).toContain('https://se2.jgcarmona.com/')
    } else {
      await page.goto(path)
      await expect(page.locator('h1')).toBeVisible()
    }
  }
  for (const asset of manifest.assets) expect((await request.get(asset)).status(), asset).toBe(200)
  expect((await request.get('/not-a-real-route/')).status()).toBe(404)
  expect((await request.get('/en/software-engineering-2_0/')).status()).toBe(404)
})

test('old talk URLs preserve language and scene on the new domain', async ({ page }) => {
  await page.route('https://se2.jgcarmona.com/**', route => route.fulfill({ status: 200, contentType: 'text/html', body: '<h1>Moved talk</h1>' }))
  for (const path of ['/software-engineering-2_0/', '/decks/software-engineering-2_0/']) {
    await page.goto(`${path}?lang=en#scene=product-definition-model`)
    await expect(page).toHaveURL('https://se2.jgcarmona.com/?lang=en#scene=product-definition-model')
  }
})

test('guardrails: complete scene journey', async ({ page }) => {
  test.setTimeout(90_000)
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/soft-and-hard-guardrails/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  for (const scene of guardrails) {
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scene.id)
    await expect(page.locator('#scene-title')).toBeVisible()
    await page.keyboard.press('ArrowRight')
  }
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', guardrails.at(-1).id)
  await page.reload()
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', guardrails.at(-1).id)
  expect(errors).toEqual([])
})
