import { test, expect } from '@playwright/test'

test('catalogue opens independent Spanish and English keynotes', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Enter talk' }).first().click()
  await expect(page).toHaveURL(/\/software-engineering-2_0\/$/)
  await expect(page.locator('.keynote')).toBeVisible()
  await expect(page.locator('.topbar, .footer, .site-shell, iframe')).toHaveCount(0)
  await page.goto('/')
  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/software-engineering-2_0\/$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('original GIF is opt-in and can be stopped', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/software-engineering-2_0/#scene=13-productshape')
  await expect(page.locator('.demo-animation')).toHaveCount(0)
  await page.getByRole('button', { name: 'Reproducir demo animada' }).click()
  await expect(page.locator('.demo-animation')).toBeVisible()
  await page.getByRole('button', { name: 'Detener demo animada' }).click()
  await expect(page.locator('.demo-animation')).toHaveCount(0)
})
