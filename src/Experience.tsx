import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Experience as ExperienceData } from './experience-model'
import type { Talk } from './talk-model'
import { handlesShortcut, interactiveSelector, nextIndex, sceneIndex } from './scene-navigation'

export default function Experience({ talk, experience }: { talk: Talk; experience: ExperienceData }) {
  const { scenes, language } = experience
  const [index, setIndex] = useState(() => sceneIndex(scenes, location.hash))
  const article = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const previous = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)
  const recoverFocus = useRef(false)
  const recoverControl = useRef<HTMLButtonElement | null>(null)
  const scene = scenes[index]
  const es = language === 'es'

  useEffect(() => {
    document.documentElement.lang = language
    const update = () => {
      recoverFocus.current = Boolean(article.current?.contains(document.activeElement))
      recoverControl.current = [previous.current, next.current].find(control => control === document.activeElement) ?? null
      setIndex(sceneIndex(scenes, location.hash))
    }
    addEventListener('hashchange', update)
    return () => removeEventListener('hashchange', update)
  }, [language, scenes])

  useLayoutEffect(() => {
    document.title = `${scene.title} · ${talk.title}`
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (recoverFocus.current) heading.current?.focus({ preventScroll: true })
    if (recoverControl.current) {
      const control = recoverControl.current
      const target = control.disabled ? (control === next.current ? previous.current : next.current) : control
      target?.focus({ preventScroll: true })
    }
    recoverFocus.current = false
    recoverControl.current = null
  }, [scene, talk.title])

  function move(direction: number) {
    const target = nextIndex(index, direction, scenes.length)
    if (target !== index) location.hash = `scene=${scenes[target].id}`
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

  return <div className="experience" lang={language}>
    <div className="experience-meta">
      <a href="/#catalog">← {es ? 'Catálogo' : 'Catalog'}</a>
      <span>{talk.title}</span>
      <a href={talk.sourceUrl}>{es ? 'Fuentes' : 'Source'}</a>
    </div>
    <nav className="scene-controls" aria-label={es ? 'Navegación de escenas' : 'Scene navigation'}>
      <button type="button" ref={previous} onClick={() => move(-1)} disabled={index === 0}>{es ? 'Anterior' : 'Previous'}</button>
      <span role="status" aria-live="polite" aria-atomic="true">{index + 1} / {scenes.length} · {scene.title}</span>
      <button type="button" ref={next} onClick={() => move(1)} disabled={index === scenes.length - 1}>{es ? 'Siguiente' : 'Next'}</button>
    </nav>
    <article className="scene" key={scene.id} ref={article} aria-labelledby="scene-title" data-scene={scene.id}>
      <p className="kicker"><span>{String(index + 1).padStart(2, '0')}</span> / {es ? 'Ingeniería con intención' : 'Guidance → enforcement'}</p>
      <h1 id="scene-title" ref={heading} tabIndex={-1}>{scene.title}</h1>
      <div className="scene-content">{scene.content}</div>
    </article>
    <details className="experience-overview"><summary>{es ? 'Mapa y navegación' : 'Overview & navigation'}</summary>
      <p>{talk.description}</p><blockquote>{talk.thesis}</blockquote>
      <p>{es ? 'Avanzar: ArrowRight / PageDown. Retroceder: ArrowLeft / PageUp. Los controles interactivos conservan sus teclas. Desplázate para leer escenas largas.' : 'Next: ArrowRight / PageDown. Previous: ArrowLeft / PageUp. Interactive controls keep their own keys. Scroll to read long scenes.'}</p>
      <ol>{scenes.map(item => <li key={item.id}><a href={`#scene=${item.id}`}>{item.title}</a></li>)}</ol>
      <a href={talk.readmeUrl}>{es ? 'Guía de la charla' : 'Talk guide'}</a>
    </details>
  </div>
}
