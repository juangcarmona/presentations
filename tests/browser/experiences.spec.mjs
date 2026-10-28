import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync, mkdirSync } from 'node:fs'

const baseline = JSON.parse(readFileSync('tests/fixtures/migration.json', 'utf8'))
const talks = [
  { slug: 'software-engineering-2_0', directory: 'ingenieria-del-software-2_0', language: 'es', count: 24 },
  { slug: 'soft-and-hard-guardrails', directory: 'soft-and-hard-guardrails', language: 'en', count: 15 },
]
const forward = page => page.keyboard.press('ArrowRight')
mkdirSync('test-results/captures', { recursive: true })

test('all five directory-index entries, fragments, reloads, history and assets', async ({ page, request }) => {
  const manifest = await (await request.get('/site-manifest.json')).json()
  for (const path of manifest.entries) {
    expect((await request.get(path)).status()).toBe(200)
    await page.goto(path)
    await expect(page.locator('h1')).toBeVisible()
    await page.reload()
    await expect(page.locator('h1')).toBeVisible()
    if (path !== '/') {
      await page.goto(`${path}#scene=unknown`)
      await expect(page.locator('[data-scene="cover"]')).toBeVisible()
      await forward(page)
      await expect(page.locator('[data-scene]')).not.toHaveAttribute('data-scene', 'cover')
      await page.reload()
      await expect(page.locator('[data-scene]')).not.toHaveAttribute('data-scene', 'cover')
      await forward(page)
      await page.goBack()
      await expect(page.locator('[role="status"]')).toContainText('2 /')
      await page.goForward()
      await expect(page.locator('[role="status"]')).toContainText('3 /')
    }
  }
  for (const asset of manifest.assets) expect((await request.get(asset)).status(), asset).toBe(200)
  expect((await request.get('/not-a-real-route/')).status()).toBe(404)
  await page.goto('/')
  await page.screenshot({ path: 'test-results/captures/catalog-desktop.png', fullPage: true })
})

for (const talk of talks) for (const theme of ['dark', 'light', 'system']) {
  test(`${talk.slug}: every scene, exact code, accessibility and ${theme} appearance`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.goto(`/${talk.slug}/`)
    await expect(page.locator('[data-scene="cover"]')).toBeVisible()
    await page.evaluate(theme => { document.documentElement.dataset.lhTheme = theme }, theme)
    await expect(page.locator('html')).toHaveAttribute('lang', talk.language)
    const scenes = baseline.scenes.filter(scene => scene.directory === talk.directory)
    expect(scenes.length).toBe(talk.count)
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i]
      await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scene.id)
      await expect(page.locator('#scene-title')).toHaveText(scene.title)
      await expect(page.locator('article')).toHaveCount(1)
      const code = await page.locator('pre code').allTextContents()
      for (const block of scene.code) expect(code).toContain(block)
      const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      expect(result.violations, `${scene.id}: ${JSON.stringify(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))}`).toEqual([])
      if (theme === 'dark') await page.screenshot({ path: `test-results/captures/${talk.slug}-${scene.id}.png`, fullPage: true })
      await page.locator('body').click({ position: { x: 2, y: 2 } })
      await forward(page)
    }
    await expect(page.locator('.scene-controls button').last()).toBeDisabled()
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scenes.at(-1).id)
    expect(errors).toEqual([])
  })
}

for (const talk of talks) {
  test(`${talk.slug}: narrow layout, zoom-equivalent and motion-off`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 })
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' })
    const scenes = baseline.scenes.filter(scene => scene.directory === talk.directory)
    for (const scene of scenes) {
      await page.goto(`/${talk.slug}/#scene=${scene.id}`)
      await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scene.id)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      expect(await page.locator('.scene').evaluate(element => getComputedStyle(element).animationDuration)).toBe('0s')
      if (scene.id === 'cover' || scene.id.includes('console') || ['11-modelo', '24-fin', '14-takeaway'].includes(scene.id)) await page.screenshot({ path: `test-results/captures/${talk.slug}-${scene.id}-320px-motion-off.png`, fullPage: true })
    }
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto(`/${talk.slug}/`)
    await page.locator('body').evaluate(element => { element.style.zoom = '4' })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test('keyboard journey, native controls, focus recovery and protected interactive descendants', async ({ page }) => {
  await page.goto('/')
  const enter = page.getByRole('link', { name: 'Enter talk' }).first()
  await enter.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('[data-scene="cover"]')).toBeVisible()
  const previous = page.locator('.scene-controls button').first()
  const next = page.locator('.scene-controls button').last()
  await expect(previous).toBeDisabled()
  await next.focus()
  await page.screenshot({ path: 'test-results/captures/navigation-before-focus.png', fullPage: true })
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('[data-scene="cover"]')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('[data-scene="02-recorrido"]')).toBeVisible()
  await expect(next).toBeFocused()
  await page.screenshot({ path: 'test-results/captures/navigation-after-focus.png', fullPage: true })
  await page.locator('body').click({ position: { x: 2, y: 2 } })
  await page.keyboard.press('PageDown')
  await expect(page.locator('[data-scene="03-repo"]')).toBeVisible()
  await page.keyboard.press('PageUp')
  await expect(page.locator('[data-scene="02-recorrido"]')).toBeVisible()
  await page.evaluate(() => {
    const article = document.querySelector('article')
    article.insertAdjacentHTML('beforeend', '<div id="interactive-fixture"><a href="#"><span>nested link</span></a><button><span>nested button</span></button><input aria-label="Typing" /><div contenteditable="true">editable</div><div role="slider" tabindex="0"><span>slider</span></div><video controls></video><audio controls></audio><iframe title="fixture frame" src="about:blank"></iframe></div>')
  })
  for (const selector of ['a span', 'button span', 'input', '[contenteditable]', '[role="slider"] span', 'video', 'audio', 'iframe']) {
    const handled = await page.locator(`#interactive-fixture ${selector}`).evaluate(element => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true })
      element.dispatchEvent(event)
      return event.defaultPrevented
    })
    expect(handled, selector).toBe(false)
  }
  for (const flag of ['repeat', 'isComposing', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey']) {
    expect(await page.locator('article').evaluate((element, flag) => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true, [flag]: true })
      element.dispatchEvent(event); return event.defaultPrevented
    }, flag)).toBe(false)
  }
  await page.locator('#interactive-fixture input').focus()
  await page.evaluate(() => { location.hash = 'scene=03-repo' })
  await expect(page.locator('#scene-title')).toBeFocused()
  await expect(page.locator('#interactive-fixture')).toHaveCount(0)
  await page.getByRole('link', { name: '← Catálogo' }).focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/#catalog$/)
})

test('external media failure leaves context, source and onward navigation', async ({ page }) => {
  await page.route('https://www.youtube-nocookie.com/**', route => route.abort())
  await page.goto('/software-engineering-2_0/#scene=23-videos')
  await expect(page.getByRole('link', { name: /Ver «Planos/ })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=vsERtDqflfI')
  await expect(page.getByText(/Si no se reproduce/)).toBeVisible()
  await page.getByText('Cargar reproductor externo de YouTube').click()
  await expect(page.locator('iframe')).toHaveAttribute('title', /Planos/)
  await page.locator('.scene-controls button').last().click()
  await expect(page.locator('[data-scene="24-fin"]')).toBeVisible()
  await expect(page.getByRole('img', { name: 'Juan G. Carmona, ponente' })).toBeVisible()
  await expect(page.locator('.portrait-fallback')).toHaveCount(0)
})

for (const talk of talks) {
  test(`${talk.slug}: focus stays on enabled navigation at both boundaries`, async ({ page }) => {
    const scenes = baseline.scenes.filter(scene => scene.directory === talk.directory)
    await page.goto(`/${talk.slug}/#scene=${scenes.at(-2).id}`)
    const previous = page.locator('.scene-controls button').first()
    const next = page.locator('.scene-controls button').last()
    await next.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', scenes.at(-1).id)
    await expect(next).toBeDisabled()
    await expect(previous).toBeFocused()
    await page.screenshot({ path: `test-results/captures/${talk.slug}-final-boundary-focus.png`, fullPage: true })
    await page.goto(`/${talk.slug}/#scene=${scenes[1].id}`)
    await previous.focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-scene="cover"]')).toBeVisible()
    await expect(previous).toBeDisabled()
    await expect(next).toBeFocused()
  })

  test(`${talk.slug}: real tab journey and system appearance follows the OS`, async ({ page }) => {
    await page.goto('/')
    const enter = page.locator(`a[href="/${talk.slug}/"]`).first()
    for (let step = 0; step < 30 && !await enter.evaluate(element => element === document.activeElement); step++) {
      await page.keyboard.press('Tab')
    }
    await expect(enter).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-scene="cover"]')).toBeVisible()
    await page.keyboard.press('ArrowLeft')
    await expect(page.locator('[data-scene="cover"]')).toBeVisible()

    await page.evaluate(() => { document.documentElement.dataset.lhTheme = 'system' })
    await page.emulateMedia({ colorScheme: 'light' })
    const light = await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor)
    await page.emulateMedia({ colorScheme: 'dark' })
    const dark = await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor)
    if (talk.language === 'es') expect(dark).toBe(light) // This keynote deliberately owns a dark identity.
    else expect(dark).not.toBe(light)
    const next = page.locator('.scene-controls button').last()
    for (let step = 0; step < 30 && !await next.evaluate(element => element === document.activeElement); step++) {
      await page.keyboard.press('Tab')
    }
    await expect(next).toBeFocused()
    expect(await next.evaluate(element => getComputedStyle(element).outlineStyle)).not.toBe('none')
    await page.keyboard.press('Enter')
    await expect(page.locator('[role="status"]')).toContainText('2 /')
    await expect(next).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('.scene-controls button').first()).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-scene="cover"]')).toBeVisible()
    const catalog = page.locator('.experience-meta a').first()
    for (let step = 0; step < 30 && !await catalog.evaluate(element => element === document.activeElement); step++) {
      await page.keyboard.press('Tab')
    }
    await expect(catalog).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/#catalog$/)
  })
}

test('standalone keynote: isolated entry, complete media, fullscreen and desktop preview', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  await page.locator('a[href="/software-engineering-2_0/"]').first().click()
  await expect(page.locator('.keynote')).toBeVisible()
  await expect(page.locator('.site-shell, .topbar, .footer, iframe')).toHaveCount(0)
  const styles = await page.locator('link[rel="stylesheet"]').evaluateAll(nodes => nodes.map(node => node.href))
  expect(styles.every(href => href.includes('/software-engineering-2_0/assets/'))).toBe(true)
  await page.screenshot({ path: 'test-results/captures/issue-53-desktop-cover.png', fullPage: true, animations: 'disabled' })
  const fullscreen = page.getByRole('button', { name: 'Pantalla completa', exact: true })
  await fullscreen.click()
  await expect(page.getByRole('button', { name: 'Salir de pantalla completa' })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: 'Salir de pantalla completa' }).click()
  await expect(fullscreen).toHaveAttribute('aria-pressed', 'false')
  await page.evaluate(() => { document.querySelector('.keynote').requestFullscreen = () => Promise.reject(new Error('Denied for test')) })
  await fullscreen.click()
  await expect(page.getByRole('alert')).toContainText('Puedes seguir presentando aquí')
  await page.locator('body').click({ position: { x: 2, y: 2 } })
  await page.keyboard.press('ArrowRight')
  await expect(page.locator('[data-scene="02-recorrido"]')).toBeVisible()
  await page.reload() // Do not carry the simulated fullscreen failure into owner preview captures.
  for (const id of ['04-guardarrailes', '10-autoridad', '11-modelo', '13-productshape', '14-citas', '15-workflow', '17-flujo-agentico', '19-validacion', '21-vista-global', '24-fin']) {
    await page.goto(`/software-engineering-2_0/#scene=${id}`)
    for (const img of await page.locator('img').all()) await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true)
    await page.screenshot({ path: `test-results/captures/issue-53-desktop-${id}.png`, fullPage: true, animations: 'disabled' })
  }
  const manifest = await (await request.get('/site-manifest.json')).json()
  expect(manifest.assets.filter(path => /\.(png|jpg|gif|svg)$/.test(path))).toHaveLength(10)
  await page.goto('/decks/software-engineering-2_0/#scene=11-modelo')
  await expect(page.getByRole('img', { name: /PDaC-2:/ })).toBeVisible()
  await expect(page.locator('.topbar, .footer')).toHaveCount(0)
})

test('reduced-motion demo is opt-in and can be stopped', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const gifs = []
  page.on('request', request => { if (request.url().endsWith('.gif')) gifs.push(request.url()) })
  await page.goto('/software-engineering-2_0/#scene=13-productshape')
  await expect(page.locator('.demo-animation')).toHaveCount(0)
  expect(gifs).toEqual([])
  await expect(page.getByText('BR-REFUND-001: una regla definida una vez, con ID estable')).toBeVisible()
  await page.getByRole('button', { name: 'Reproducir demo animada' }).click()
  await expect(page.locator('.demo-animation')).toBeVisible()
  await page.getByRole('button', { name: 'Detener demo animada' }).click()
  await expect(page.locator('.demo-animation')).toHaveCount(0)
})

for (const theme of ['dark', 'light']) {
  test(`scene entrance preserves text contrast in ${theme} appearance`, async ({ page }) => {
    await page.goto('/software-engineering-2_0/')
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', 'cover')
    await page.evaluate(theme => { document.documentElement.dataset.lhTheme = theme }, theme)
    await page.addStyleTag({ content: '.scene { animation-duration: 10s; }' })
    await page.locator('.scene-controls button').last().click()
    await expect(page.locator('[data-scene]')).toHaveAttribute('data-scene', '02-recorrido')
    // Hold the transition midway so fast and slow runners inspect the same state.
    await page.locator('.scene').evaluate(element => {
      const animation = element.getAnimations()[0]
      if (!animation) throw new Error('Expected the normal-motion scene entrance')
      animation.pause()
      animation.currentTime = Number(animation.effect.getTiming().duration) / 2
    })
    const result = await new AxeBuilder({ page }).include('.scene').withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(result.violations).toEqual([])
    await page.screenshot({ path: `test-results/captures/scene-entrance-${theme}.png`, fullPage: true })
  })
}
