import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { handlesShortcut, interactiveSelector, nextIndex, sceneIndex } from '../../../src/scene-navigation'
import experience from './experience'

const chapters = ['APERTURA', 'CÓDIGO', 'INTENCIÓN', 'DESARROLLO', 'EVIDENCIA', 'NOSOTROS']
function chapter(index: number) { return index < 2 ? 0 : index < 5 ? 1 : index < 16 ? 2 : index < 17 ? 3 : index < 21 ? 4 : 5 }

export default function Presentation() {
  const { scenes } = experience
  const [index, setIndex] = useState(() => sceneIndex(scenes, location.hash))
  const [fullscreen, setFullscreen] = useState(Boolean(document.fullscreenElement))
  const [notice, setNotice] = useState('')
  const [mapOpen, setMapOpen] = useState(false)
  const article = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const previous = useRef<HTMLButtonElement>(null)
  const next = useRef<HTMLButtonElement>(null)
  const recoverFocus = useRef(false)
  const recoverControl = useRef<HTMLButtonElement | null>(null)
  const scene = scenes[index]

  useEffect(() => {
    const update = () => {
      recoverFocus.current = Boolean(article.current?.contains(document.activeElement))
      recoverControl.current = [previous.current, next.current].find(control => control === document.activeElement) ?? null
      setIndex(sceneIndex(scenes, location.hash))
      setMapOpen(false)
    }
    const updateFullscreen = () => setFullscreen(Boolean(document.fullscreenElement))
    addEventListener('hashchange', update)
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => {
      removeEventListener('hashchange', update)
      document.removeEventListener('fullscreenchange', updateFullscreen)
    }
  }, [scenes])

  useLayoutEffect(() => {
    document.title = `${scene.title} · Ingeniería del Software 2.0`
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
      if (mapOpen || !handlesShortcut(event, interactive)) return
      event.preventDefault()
      move(['ArrowRight', 'PageDown'].includes(event.key) ? 1 : -1)
    }
    addEventListener('keydown', keydown)
    return () => removeEventListener('keydown', keydown)
  })

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen()
      else throw new Error('Fullscreen unavailable')
      setNotice('')
    } catch {
      setNotice('El navegador no permite pantalla completa. Puedes seguir presentando en esta ventana.')
    }
  }

  return <main className="keynote" lang="es">
    <a className="skip-link" href="#scene-title">Ir a la diapositiva</a>
    <div className="keynote-topline" aria-hidden="true"><span>INGENIERÍA DEL SOFTWARE <b>2.0</b></span><span>{chapters[chapter(index)]} / {String(chapter(index) + 1).padStart(2, '0')}</span></div>
    <article className="scene" key={scene.id} ref={article} aria-labelledby="scene-title" data-scene={scene.id}>
      <div className="scene-orbit" aria-hidden="true" />
      <p className="kicker">{String(index + 1).padStart(2, '0')} <span>/ {chapters[chapter(index)]}</span></p>
      <h1 id="scene-title" ref={heading} tabIndex={-1}>{scene.title}</h1>
      <div className="scene-content">{scene.content}</div>
    </article>
    <div className="presentation-dock">
      <div className="dock-tools experience-meta">
        <a href="/#catalog" aria-label="← Catálogo">← Catálogo</a>
        <button type="button" aria-expanded={mapOpen} aria-controls="scene-map" onClick={() => setMapOpen(!mapOpen)}>Mapa</button>
        <button type="button" onClick={toggleFullscreen}>{fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}</button>
      </div>
      <nav className="scene-controls" aria-label="Navegación de escenas">
        <button type="button" ref={previous} onClick={() => move(-1)} disabled={index === 0}>Anterior</button>
        <span role="status" aria-live="polite" aria-atomic="true">{index + 1} / {scenes.length}<span className="visually-hidden"> · {scene.title}</span></span>
        <button type="button" ref={next} onClick={() => move(1)} disabled={index === scenes.length - 1}>Siguiente</button>
      </nav>
      <div className="progress-track" aria-hidden="true"><div style={{ width: `${(index + 1) / scenes.length * 100}%` }} /></div>
    </div>
    {notice && <p className="fullscreen-notice" role="alert">{notice}</p>}
    <aside id="scene-map" className="scene-map" hidden={!mapOpen} aria-label="Mapa de la presentación">
      <h2>El recorrido</h2>
      <p>Avanzar: → / PageDown. Retroceder: ← / PageUp. Esc sale de pantalla completa. Las escenas largas permiten desplazamiento.</p>
      <ol>{scenes.map(item => <li key={item.id}><a href={`#scene=${item.id}`} aria-current={item.id === scene.id ? 'step' : undefined} onClick={() => { setMapOpen(false); heading.current?.focus() }}>{item.title}</a></li>)}</ol>
      <a href="https://github.com/juangcarmona/presentations/tree/main/talks/ingenieria-del-software-2_0">Fuentes y notas del ponente</a>
    </aside>
  </main>
}
