import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { handlesShortcut, interactiveSelector, nextIndex, sceneIndex } from '../../../src/scene-navigation'
import spanish from './experience'
import english from './experience-en'

export default function Presentation() {
  const [language, setLanguage] = useState<'es' | 'en'>(() => new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'es')
  const experience = language === 'en' ? english : spanish
  const { scenes } = experience
  const [index, setIndex] = useState(() => sceneIndex(scenes, location.hash))
  const [elapsed, setElapsed] = useState(0)
  const started = useRef(performance.now())
  const heading = useRef<HTMLHeadingElement>(null)
  const focusScene = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const scene = scenes[index]

  useEffect(() => {
    const tick = () => setElapsed(Math.floor((performance.now() - started.current) / 1000))
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    document.documentElement.lang = experience.language
    const update = () => { focusScene.current = Boolean(document.activeElement?.closest('.scene')); setIndex(sceneIndex(scenes, location.hash)) }
    addEventListener('hashchange', update)
    return () => removeEventListener('hashchange', update)
  }, [scenes])

  useLayoutEffect(() => {
    document.title = `${scene.title} · Software Engineering 2.0`
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (focusScene.current) heading.current?.focus({ preventScroll: true })
    focusScene.current = false
  }, [scene])

  function move(direction: number) {
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

  return <main className="keynote" lang={experience.language} onTouchStart={event => {
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }} onTouchEnd={event => {
    if (!touchStart.current || event.changedTouches.length === 0) return
    const dx = event.changedTouches[0].clientX - touchStart.current.x
    const dy = event.changedTouches[0].clientY - touchStart.current.y
    touchStart.current = null
    if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
  }}>
    <a className="skip-link" href="#scene-title">{language === 'en' ? 'Skip to slide' : 'Ir a la diapositiva'}</a>
    <article className="scene" key={scene.id} aria-labelledby="scene-title" data-scene={scene.id}>
      <h1 id="scene-title" ref={heading} tabIndex={-1}>{scene.title}</h1>
      <div className="scene-content">{scene.content}</div>
    </article>
    <div className="presentation-hud" role="group" aria-label={language === 'en' ? `Elapsed ${Math.floor(elapsed / 60)} minutes ${elapsed % 60} seconds. Slide ${index + 1} of ${scenes.length}` : `Transcurridos ${Math.floor(elapsed / 60)} minutos y ${elapsed % 60} segundos. Diapositiva ${index + 1} de ${scenes.length}`}>
      <span aria-hidden="true">{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</span>
      <span aria-hidden="true">{index + 1}</span>
      <span className="hud-track" aria-hidden="true"><span style={{ width: `${(index + 1) / scenes.length * 100}%` }} /></span>
    </div>
    {index === 0 && <nav className="language-picker" aria-label={language === 'en' ? 'Presentation language' : 'Idioma de la presentación'}>
      <button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => chooseLanguage('en')}>EN</button>
      <button type="button" lang="es" aria-pressed={language === 'es'} onClick={() => chooseLanguage('es')}>ES</button>
    </nav>}
    <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{index + 1} / {scenes.length} · {scene.title}</span>
  </main>
}
