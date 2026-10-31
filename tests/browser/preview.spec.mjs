import { test, expect } from '@playwright/test'
import { readFileSync, mkdirSync } from 'node:fs'

const scenes = JSON.parse(readFileSync('tests/fixtures/active-scenes.json', 'utf8')).map(id => ({ id }))
test.use({ viewport: { width: 1280, height: 720 }, reducedMotion: 'reduce' })

test('owner preview: all published scenes at presentation size and narrow viewport', async ({ page }) => {
  test.setTimeout(90_000)
  mkdirSync('test-results/desktop-preview', { recursive: true })
  for (const scene of scenes) {
    await page.goto(`/software-engineering-2_0/#scene=${scene.id}`)
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scene.id)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), scene.id).toBe(true)
    if (['spec-driven-development', 'openspec', 'github-spec-kit', 'kiro', 'can-we-trust-the-result', 'what-still-depends-on-us', 'from-proposal-to-accepted-product'].includes(scene.id)) expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), scene.id).toBe(true)
    await page.screenshot({ path: `test-results/desktop-preview/${scene.id}.png`, fullPage: true })
    if (scene.id === 'from-pyramid-to-hourglass') {
      await page.keyboard.press('ArrowRight')
      expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), 'testing-now').toBe(true)
      await page.screenshot({ path: 'test-results/desktop-preview/from-pyramid-to-hourglass-now.png', fullPage: true })
    }
  }
  await page.setViewportSize({ width: 320, height: 720 })
  for (const id of ['cover', 'engineering-journey', 'prepare-repo-for-ai', 'guardrails', 'repository-structure', 'spec-driven-development', 'specs-are-not-source-of-truth', 'two-sources-of-truth', 'product-definition-model', 'none-of-this-is-new', 'document-architecture-with-arc42', 'can-we-trust-the-result', 'from-pyramid-to-hourglass', 'from-structured-behaviour-to-tests', 'agentic-flow-end-to-end', 'controlled-deployment', 'operate-learn-decide-again', 'what-still-depends-on-us', 'juan-g-carmona']) {
    await page.goto(`/software-engineering-2_0/?lang=en#scene=${id}`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), id).toBe(true)
  }
})
