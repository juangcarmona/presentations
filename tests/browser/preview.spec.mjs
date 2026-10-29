import { test, expect } from '@playwright/test'
import { readFileSync, mkdirSync } from 'node:fs'

const scenes = JSON.parse(readFileSync('tests/fixtures/migration.json', 'utf8')).scenes.filter(scene => scene.directory === 'ingenieria-del-software-2_0')
test.use({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' })

test('owner preview: all 24 scenes at presentation size and narrow viewport', async ({ page }) => {
  test.setTimeout(90_000)
  mkdirSync('test-results/desktop-preview', { recursive: true })
  for (const scene of scenes) {
    await page.goto(`/software-engineering-2_0/#scene=${scene.id}`)
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scene.id)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), scene.id).toBe(true)
    await page.screenshot({ path: `test-results/desktop-preview/${scene.id}.png`, fullPage: true })
  }
  await page.setViewportSize({ width: 320, height: 720 })
  for (const id of ['cover', '03-repo', '11-modelo', '24-fin']) {
    await page.goto(`/software-engineering-2_0/?lang=en#scene=${id}`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id).toBe(true)
  }
})
