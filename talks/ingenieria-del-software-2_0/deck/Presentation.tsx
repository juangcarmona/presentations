import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { handlesShortcut, interactiveSelector, nextIndex, sceneIndex } from '../../../src/scene-navigation'
import experience from './experience'
import cover from './public/bg-cover-1.jpg'
import './keynote.css'

export default function Presentation() {
  const { scenes } = experience
  const [index, setIndex] = useState(() => sceneIndex(scenes, location.hash))
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [message, setMessage] = useState('')
  const stage = useRef<HTMLDivElement>(null)
  const article = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const previous = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)
  const recoverFocus = useRef(false)
  const recoverControl = useRef<HTMLButtonElement | null>(null)
  const scene = scenes[index]

  useEffect(() => {
    document.documentElement.lang = 'es'
    const update = () => {
      recoverFocus.current = Boolean(article.current?.contains(document.activeElement))
      recoverControl.current = [previous.current, next.current].find(control => control === document.activeElement) ?? null
      setIndex(sceneIndex(scenes, location.hash))
    }
    const syncFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    addEventListener('hashchange', update)
    document.addEventListener('fullscreenchange', syncFullscreen)
    return () => {
      removeEventListener('hashchange', update)
      document.removeEventListener('fullscreenchange', syncFullscreen)
    }
  }, [scenes])

  useLayoutEffect(() => {
    document.title = `${scene.title} · Ingeniería del Software 2.0`
    article.current?.scrollTo({ top: 0, behavior: 'instant' })
    stage.current?.scrollTo({ top: 0, behavior: 'instant' })
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (recoverFocus.current) heading.current?.focus({ preventScroll: true })
    if (recoverControl.current) {
      const control = recoverControl.current
      const target = control.disabled ? (control === next.current ? previous.current : next.current) : control
      target?.focus({ preventScroll: true })
    }
    recoverFocus.current = false
    recoverControl.current = null
  }, [scene])

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

  async function toggleFullscreen() {
    setMessage('')
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (stage.current?.requestFullscreen) await stage.current.requestFullscreen()
      else setMessage('Pantalla completa no disponible en este navegador. Puedes seguir presentando aquí.')
    } catch {
      setMessage('No se pudo cambiar a pantalla completa. Puedes seguir presentando aquí.')
    }
  }

  return <div className="keynote" ref={stage} lang="es" style={{ '--cover-image': `url("${cover}")` } as React.CSSProperties}>
    <main className="keynote-main">
      <article className={`scene keynote-scene${index === 0 ? ' keynote-cover' : ''}`} key={scene.id} ref={article} aria-labelledby="scene-title" data-scene={scene.id}>
        <div className="stage-orbit" aria-hidden="true" />
        <div className="scene-inner">
          <p className="scene-kicker"><span>{String(index + 1).padStart(2, '0')}</span> / INGENIERÍA CON INTENCIÓN</p>
          <h1 id="scene-title" ref={heading} tabIndex={-1}>{scene.title}</h1>
          <div className="scene-content">{scene.content}</div>
        </div>
      </article>
    </main>
    <div className="presentation-dock">
      <div className="experience-meta"><a href="/#catalog">← Catálogo</a><span>JUAN G. CARMONA / 2026</span>
        <button type="button" onClick={toggleFullscreen} aria-pressed={fullscreen}>{fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</button>
      </div>
      <nav className="scene-controls" aria-label="Navegación de escenas">
        <button type="button" ref={previous} onClick={() => move(-1)} disabled={index === 0}>Anterior</button>
        <span role="status" aria-live="polite" aria-atomic="true">{index + 1} / {scenes.length} · {scene.title}</span>
        <button type="button" ref={next} onClick={() => move(1)} disabled={index === scenes.length - 1}>Siguiente</button>
      </nav>
      {message && <p role="alert">{message}</p>}
      <details className="experience-overview"><summary>Mapa y navegación</summary>
        <p>Avanzar: ArrowRight / PageDown. Retroceder: ArrowLeft / PageUp. Esc sale de pantalla completa. Los controles interactivos conservan sus teclas. Desplázate para leer escenas largas.</p>
        <ol>{scenes.map(item => <li key={item.id}><a href={`#scene=${item.id}`}>{item.title}</a></li>)}</ol>
        <a href="https://github.com/juangcarmona/presentations/tree/main/talks/ingenieria-del-software-2_0">Fuentes y guía de la charla</a>
      </details>
    </div>
    <div className="stage-progress" aria-hidden="true" style={{ width: `${(index + 1) / scenes.length * 100}%` }} />
  </div>
}
