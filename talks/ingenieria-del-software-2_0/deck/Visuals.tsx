import { useEffect, useState } from 'react'
import authority from './public/pdac-authority-and-learning.png'
import model from './public/pdac-2-product-definition-model.png'
import citations from './public/pdac-5-citation-and-drift.png'
import workflow from './public/pdac-reference-workflow.png'
import lifecycle from './public/lifecycle-overview.svg'
import logo from './public/pdac-logo.png'
import branding from './public/product_shape_branding.png'
import demo from './public/pdac-demo.gif'
import portrait from './public/juan.jpg'

const diagrams = {
  '10-autoridad': [authority, 'Product thinking, accepted product definition y delivery: autoridad hacia abajo, evidencia y Product Changes propuestos hacia arriba'],
  '11-modelo': [model, 'PDaC-2: actores, journeys, casos de uso, reglas de negocio, dominio, requisitos y comportamiento estructurado'],
  '14-citas': [citations, 'PDaC-5: estados de cita current, stale, unresolved y tampered, y escenario de deriva controlado por personas'],
  '15-workflow': [workflow, 'Flujo de referencia de PDaC: baseline aceptada, Product Change, validación, aprobación humana, aplicar, rama, pull request, aceptación humana y nueva baseline'],
  '17-flujo-agentico': [lifecycle, 'Ciclo de vida de agentic-sdlc'],
} as const

export function Diagram({ id }: { id: keyof typeof diagrams }) {
  const [src, alt] = diagrams[id]
  return <figure className="original-visual"><a href={src} target="_blank" rel="noreferrer" aria-label={`Ampliar: ${alt}`}><img src={src} alt={alt} /></a><figcaption>Visual original · abre la imagen para ampliarla</figcaption></figure>
}

export function ProductLogo() { return <img className="product-logo" src={logo} alt="PDaC" /> }
export function Portrait() { return <img className="speaker-portrait" src={portrait} alt="Juan G. Carmona, ponente" /> }

export function ProductDemo() {
  // No GIF element is mounted until a user explicitly starts it, including under reduced motion.
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => { if (media.matches) setPlaying(false) }
    media.addEventListener('change', stop)
    return () => media.removeEventListener('change', stop)
  }, [])
  return <div className="product-demo">
    <img className="product-branding" src={branding} alt="ProductShape, Product Definition as Code" />
    <button type="button" onClick={() => setPlaying(!playing)} aria-pressed={playing}>{playing ? 'Detener demo animada' : 'Reproducir demo animada'}</button>
    {playing && <img className="demo-animation" src={demo} alt="Demo: tres specs divergentes sobre devoluciones, la regla BR-REFUND-001 definida una vez y la verificación de citas que marca las obsoletas" />}
  </div>
}
