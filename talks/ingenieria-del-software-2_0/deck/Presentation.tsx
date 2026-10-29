import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { handlesShortcut, interactiveSelector, nextIndex, sceneIndex } from '../../../src/scene-navigation'
import spanish from './experience'
import english from './experience-en'

const isEnglish = location.pathname.startsWith('/en/')
const experience = isEnglish ? english : spanish
const chapters = isEnglish
  ? ['OPENING', 'CODE', 'INTENT', 'DELIVERY', 'EVIDENCE', 'US']
  : ['APERTURA', 'CÓDIGO', 'INTENCIÓN', 'DESARROLLO', 'EVIDENCIA', 'NOSOTROS']
function chapter(index: number) { return index < 2 ? 0 : index < 5 ? 1 : index < 16 ? 2 : index < 17 ? 3 : index < 21 ? 4 : 5 }

export default function Presentation() {
  const { scenes } = experience
  const [index, setIndex] = useState(() => sceneIndex(scenes, location.hash))
  const heading = useRef<HTMLHeadingElement>(null)
  const focusScene = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const scene = scenes[index]

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
    <a className="skip-link" href="#scene-title">{isEnglish ? 'Skip to slide' : 'Ir a la diapositiva'}</a>
    <div className="keynote-topline" aria-hidden="true"><span>JGC / SOFTWARE ENGINEERING <b>2.0</b></span><span>{chapters[chapter(index)]} — {String(index + 1).padStart(2, '0')}</span></div>
    <article className="scene" key={scene.id} aria-labelledby="scene-title" data-scene={scene.id} data-chapter={chapter(index)}>
      <div className="scene-orbit" aria-hidden="true" />
      <p className="kicker">{String(index + 1).padStart(2, '0')} <span>/ {chapters[chapter(index)]}</span></p>
      <h1 id="scene-title" ref={heading} tabIndex={-1}>{scene.title}</h1>
      <div className="scene-content">{scene.content}</div>
    </article>
    <span className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">{index + 1} / {scenes.length} · {scene.title}</span>
  </main>
}
