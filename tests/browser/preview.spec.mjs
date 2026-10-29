import { test, expect } from '@playwright/test'
import { readFileSync, mkdirSync } from 'node:fs'

const scenes = JSON.parse(readFileSync('tests/fixtures/migration.json', 'utf8')).scenes.filter(scene => scene.directory === 'ingenieria-del-software-2_0' && scene.id !== '14-citas').flatMap(scene => scene.id === '06-sdd' ? [scene, ...['06a-openspec', '06b-spec-kit', '06c-kiro'].map(id => ({ id }))] : [scene])
test.use({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' })

test('owner preview: all published scenes at presentation size and narrow viewport', async ({ page }) => {
  test.setTimeout(90_000)
  mkdirSync('test-results/desktop-preview', { recursive: true })
  for (const scene of scenes) {
    await page.goto(`/software-engineering-2_0/#scene=${scene.id}`)
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scene.id)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), scene.id).toBe(true)
    if (scene.id.startsWith('06') || scene.id === '15-workflow') expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), scene.id).toBe(true)
    await page.screenshot({ path: `test-results/desktop-preview/${scene.id}.png`, fullPage: true })
  }
  await page.setViewportSize({ width: 320, height: 720 })
  for (const id of ['cover', '03-repo', '04-guardarrailes', '05-estructura', '06-sdd', '07-gaps', '08-dimensiones', '11-modelo', '12-origen', '16-arc42', '20-piramide', '20b-power-bi-fabric', '24-fin']) {
    await page.goto(`/software-engineering-2_0/?lang=en#scene=${id}`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id).toBe(true)
  }
})
