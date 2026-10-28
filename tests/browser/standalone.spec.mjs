import { test, expect } from '@playwright/test'

test('catalogue opens an independent keynote with no shared shell or iframe', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Enter talk' }).first().click()
  await expect(page).toHaveURL(/\/software-engineering-2_0\/$/)
  await expect(page.locator('.keynote')).toBeVisible()
  await expect(page.locator('.topbar, .footer, .site-shell, iframe')).toHaveCount(0)
  await expect(page.locator('.scene')).toHaveCSS('min-height', `${await page.evaluate(() => innerHeight)}px`)
  const scripts = await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => node.src))
  expect(scripts.every(src => src.includes('/software-engineering-2_0/assets/'))).toBe(true)
})

test('fullscreen enters, leaves, follows browser state and survives permission rejection', async ({ page }) => {
  await page.goto('/software-engineering-2_0/')
  await page.getByRole('button', { name: 'Pantalla completa', exact: true }).click()
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(true)
  await page.getByRole('button', { name: 'Salir de pantalla completa' }).click()
  await expect.poll(() => page.evaluate(() => Boolean(document.fullscreenElement))).toBe(false)
  await page.getByRole('button', { name: 'Pantalla completa', exact: true }).click()
  // Chromium headless does not dispatch the native Escape fullscreen action;
  // exercise the same fullscreenchange event through the browser exit API.
  await page.evaluate(() => document.exitFullscreen())
  await expect(page.getByRole('button', { name: 'Pantalla completa', exact: true })).toBeVisible()
  await page.evaluate(() => { document.documentElement.requestFullscreen = () => Promise.reject(new Error('Denied')) })
  await page.getByRole('button', { name: 'Pantalla completa', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('Puedes seguir presentando')
  await page.locator('body').click({ position: { x: 2, y: 2 } })
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', '02-recorrido')
})

test('original media, controllable GIF and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/software-engineering-2_0/#scene=13-productshape')
  await expect(page.locator('.demo-animation')).toHaveCount(0)
  await expect(page.getByRole('img', { name: 'ProductShape, Product Definition as Code', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Reproducir demo animada' }).click()
  await expect(page.locator('.demo-animation')).toBeVisible()
  await page.getByRole('button', { name: 'Detener demo animada' }).click()
  await expect(page.locator('.demo-animation')).toHaveCount(0)
  await expect(page.locator('.scene')).toHaveCSS('animation-duration', '0s')
  await page.goto('/decks/software-engineering-2_0/#scene=11-modelo')
  await expect(page.locator('.original-figure img')).toBeVisible()
  expect(await page.locator('.original-figure img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
  await page.reload()
  await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', '11-modelo')
})
