import { test, expect } from '@playwright/test'
import { readFileSync, mkdirSync } from 'node:fs'

const scenes = JSON.parse(readFileSync('tests/fixtures/migration.json', 'utf8')).scenes.filter(scene => scene.directory === 'ingenieria-del-software-2_0')
test.use({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })

test('owner desktop preview: all 24 scenes and diagram fit', async ({ page }) => {
  mkdirSync('test-results/desktop-preview', { recursive: true })
  for (const scene of scenes) {
    await page.goto(`/software-engineering-2_0/#scene=${scene.id}`)
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scene.id)
    await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const figure = page.locator('.original-figure')
    if (await figure.count()) {
      const image = await figure.boundingBox()
      const dock = await page.locator('.presentation-dock').boundingBox()
      expect(image.y + image.height, scene.id).toBeLessThan(dock.y)
    }
    await page.screenshot({ path: `test-results/desktop-preview/${scene.id}.png`, fullPage: true })
  }
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/software-engineering-2_0/#scene=11-modelo')
  await page.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())))
  const image = await page.locator('.original-figure').boundingBox()
  const dock = await page.locator('.presentation-dock').boundingBox()
  expect(image.y + image.height).toBeLessThan(dock.y)
  await page.screenshot({ path: 'test-results/desktop-preview/model-1280x720.png', fullPage: true })
})
