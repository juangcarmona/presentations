import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { handlesShortcut, interactiveSelector, nextIndex, sceneIndex } from '../../../src/scene-navigation'
import spanish, { chapterForScene, legacySceneIds, presentationImages } from './experience'
import english from './experience-en'

function indexFromHash(scenes: { id: string }[], hash: string) {
  const oldId = new URLSearchParams(hash.replace(/^#/, '')).get('scene')
  return sceneIndex(scenes, oldId && legacySceneIds[oldId] ? `#scene=${legacySceneIds[oldId]}` : hash)
}

export default function Presentation() {
  const [language, setLanguage] = useState<'es' | 'en'>(() => new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'es')
  const experience = language === 'en' ? english : spanish
  const { scenes } = experience
  const [index, setIndex] = useState(() => indexFromHash(scenes, location.hash))
  const [elapsed, setElapsed] = useState(0)
  const [comparisonStage, setComparisonStage] = useState(0)
  const started = useRef(performance.now())
  const heading = useRef<HTMLHeadingElement>(null)
  const focusScene = useRef(false)
  const preloadedImages = useRef<HTMLImageElement[]>([])
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const scene = scenes[index]
  const elapsedMinutes = Math.floor(elapsed / 60)

  useEffect(() => {
    preloadedImages.current = presentationImages.map(src => {
      const image = new Image()
      image.src = src
      return image
    })
  }, [])

  useEffect(() => {
    const tick = () => setElapsed(Math.floor((performance.now() - started.current) / 1000))
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.lang = experience.language
    const update = () => {
      focusScene.current = Boolean(document.activeElement?.closest('.scene'))
      setComparisonStage(0)
      setIndex(indexFromHash(scenes, location.hash))
    }
    addEventListener('hashchange', update)
    return () => removeEventListener('hashchange', update)
  }, [scenes])

  useLayoutEffect(() => {
    document.title = `${scene.title} · Software Engineering 2.0`
    document.querySelectorAll<HTMLAnchorElement>('.scene a[href^="http"]').forEach(link => {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
    })
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (focusScene.current) heading.current?.focus({ preventScroll: true })
    focusScene.current = false
  }, [scene])

  function move(direction: number) {
    const lastStage = scene.id === 'guardrails' ? 2 : scene.id === 'from-pyramid-to-hourglass' ? 1 : 0
    if (lastStage) {
      if (direction > 0 && comparisonStage < lastStage) { setComparisonStage(comparisonStage + 1); return }
      if (direction < 0 && comparisonStage > 0) { setComparisonStage(comparisonStage - 1); return }
    }
    const target = nextIndex(index, direction, scenes.length)
    if (target !== index) location.hash = `scene=${scenes[target].id}`
  }

  function chooseLanguage(value: 'es' | 'en') {
    const url = new URL(location.href)
    if (value === 'en') url.searchParams.set('lang', 'en')
    else url.searchParams.delete('lang')
    history.replaceState(null, '', url)
    setLanguage(value)
  }

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const interactive = event.composedPath().some(target => target instanceof Element && target.matches(interactiveSelector))
      if (!handlesShortcut(event, interactive)) return
      event.preventDefault()
      move(['ArrowRight', 'PageDown'].includes(event.key) ? 1 : -1)
    }
    addEventListener('keydown', keydown)
    return () => removeEventListener('keydown', keydown)
  })

  return <main className="keynote" lang={experience.language} onClick={event => {
    if (!(event.target instanceof Element) || event.target.closest('a, button, input, textarea, select, details, pre, code, .terminal, [role="button"], [contenteditable="true"]') || window.getSelection()?.toString()) return
    move(event.clientX < window.innerWidth / 2 ? -1 : 1)
  }} onTouchStart={event => {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }} onTouchEnd={event => {
    if (!touchStart.current || event.changedTouches.length === 0) return
    const dx = event.changedTouches[0].clientX - touchStart.current.x
    const dy = event.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
  }}>
    <a className="skip-link" href="#scene-title">{language === 'en' ? 'Skip to slide' : 'Ir a la diapositiva'}</a>
    <article className="scene" key={scene.id} aria-labelledby="scene-title" data-scene={scene.id} data-stage={comparisonStage}>
      <h1 id="scene-title" className={scene.id === 'engineering-journey' ? 'visually-hidden' : undefined} ref={heading} tabIndex={-1}>{scene.title}</h1>
      <div className="scene-content">{scene.content}</div>
      {scene.id === 'from-pyramid-to-hourglass' && <button className="comparison-next" type="button" onClick={() => setComparisonStage(comparisonStage === 0 ? 1 : 0)}>{comparisonStage === 0 ? (language === 'en' ? 'Show now →' : 'Mostrar ahora →') : (language === 'en' ? '← Show before' : '← Mostrar antes')}</button>}
    </article>
    <div className="presentation-hud" role="group" aria-label={language === 'en' ? `Slide ${index + 1} of ${scenes.length}` : `Diapositiva ${index + 1} de ${scenes.length}`}>
      {chapterForScene(scene.id, language) && <span className="slide-number" aria-hidden="true">{chapterForScene(scene.id, language)}</span>}
      {elapsedMinutes > 0 && <time className="elapsed-clock" dateTime={`PT${elapsedMinutes}M`} aria-label={language === 'en' ? `${elapsedMinutes} minutes elapsed` : `${elapsedMinutes} minutos transcurridos`}>{String(Math.floor(elapsedMinutes / 60)).padStart(2, '0')}:{String(elapsedMinutes % 60).padStart(2, '0')}</time>}
    </div>
    {index === 0 && <nav className="language-picker" aria-label={language === 'en' ? 'Presentation language' : 'Idioma de la presentación'}>
      <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => chooseLanguage('en')}>EN</button>
      <button type="button" lang="es" aria-pressed={language === 'es'} onClick={() => chooseLanguage('es')}>ES</button>
    </nav>}
    <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{index + 1} / {scenes.length} · {scene.title}</span>
  </main>
}
