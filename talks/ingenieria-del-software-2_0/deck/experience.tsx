import type { Experience } from '../../../src/experience-model'
import { useEffect, useState } from 'react'
import cover from './public/bg-cover-1.jpg'
import portrait from './public/juan.jpg'
import lifecycle from './public/lifecycle-overview.svg'
import model from './public/pdac-2-product-definition-model.png'
import citations from './public/pdac-5-citation-and-drift.png'
import authority from './public/pdac-authority-and-learning.png'
import demo from './public/pdac-demo.gif'
import logo from './public/pdac-logo.png'
import workflow from './public/pdac-reference-workflow.png'
import branding from './public/product_shape_branding.png'
import Diagram from './Diagrams'
import { Arc42Overview, JourneyMap, OriginsMap, RepoStructure, SddOverview, TerminalCase, sddImages } from './SceneExtras'

export const presentationImages = [portrait, logo, branding, ...sddImages]

function Demo({ language }: { language: string }) {
  const [playing, setPlaying] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const en = language === 'en'
  const steps = en ? [
    'Three specs disagree: purchase, delivery, “less than a month”.',
    'BR-REFUND-001 defines the accepted rule once.',
    'Each spec cites that rule; a change makes the citations stale.',
    'prodshape citations verify flags what needs review.',
  ] : [
    'Tres specs discrepan: compra, entrega, «menos de un mes».',
    'BR-REFUND-001 define la regla aceptada una sola vez.',
    'Cada spec cita esa regla; al cambiar, las citas quedan obsoletas.',
    'prodshape citations verify señala lo que hay que revisar.',
  ]
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => { if (preference.matches) setPlaying(false) }
    preference.addEventListener('change', stop)
    return () => preference.removeEventListener('change', stop)
  }, [])
  return <div className="demo-stage"><ol className="demo-steps" aria-label={en ? 'Citation demonstration' : 'Demostración de citas'}>{steps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol><div className="demo-visual" onClick={event => event.stopPropagation()}>{playing ? <img className="demo-animation" src={demo} alt={en ? 'Animated demonstration of the refund rule and stale citations' : 'Demostración animada de la regla de devolución y citas obsoletas'} /> : <button className="demo-poster" type="button" onClick={() => setPlaying(true)}><strong>BR-REFUND-001</strong><small>{en ? 'Play demo' : 'Reproducir demo'} ▶</small></button>}</div></div>
}

export function Flow({ items, label }: { items: string[]; label: string }) {
  return <ol className="product-flow" aria-label={label}>{items.map((text, i) => <li key={text}><span className="flow-index" aria-hidden="true">{String(i + 1).padStart(2, '0')} →</span>{text}</li>)}</ol>
}
export function Code({ children, label }: { children: string; label: string }) {
  return <pre role="region" aria-label={label} tabIndex={0}><code>{children}</code></pre>
}
export function Citation({ href = 'https://pdac.dev/diagrams/', children, language = 'es' }: { href?: string; children?: React.ReactNode; language?: string }) {
  return <p className="citation">{language === 'en' ? 'Source' : 'Referencia'}: <a href={href}>{children ?? (language === 'en' ? 'PDaC · original diagrams' : 'PDaC · diagramas originales')}</a>.</p>
}

const experience: Experience = { language: 'es', scenes: [
  { id: 'cover', title: 'Ingeniería del Software 2.0', content: <><p className="scene-lede">Diseñar, construir y validar productos con IA</p><p>Juan G. Carmona</p><div className="intent-motif" aria-hidden="true">intención → sistema → evidencia</div></> },
  { id: '02-recorrido', title: 'Una nueva manera de hacer software', content: <Flow label="Recorrido" items={['Código', 'Tendencias', 'Documentación', 'Desarrollo', 'Validación', 'Vista global']} /> },
  { id: '03-repo', title: 'Prepara el repo para la IA', content: <Diagram id="03-repo" language="es" /> },
  { id: '04-guardarrailes', title: 'Guardarraíles', content: <><p className="guardrail-definition">Mecanismos que guían el trabajo y ayudan a conseguir procesos repetibles.</p><div className="scene-grid"><section><span className="guardrail-kind">Indeterministas</span><h2>Blandos</h2><p className="guardrail-action">Guían</p><p>La regla existe, pero nada impide ignorarla.</p><ul><li>AGENTS.md / CLAUDE.md</li><li>Skills</li><li>ADRs y docs</li><li>Reglas en warning</li><li>Checklists</li></ul></section><section><span className="guardrail-kind">Deterministas</span><h2>Duros</h2><p className="guardrail-action">Bloquean</p><p>La herramienta se niega a continuar si se rompe la regla.</p><ul><li>Analizadores</li><li>Tests de arquitectura</li><li>Hooks de commit</li><li>CI obligatoria</li><li>Hooks del harness</li><li>Citas de producto en CI</li></ul></section></div></> },
  { id: '05-estructura', title: 'Estructura ideal', content: <><Code label="Árbol del repositorio">{'├── AGENTS.md          # mapa de contexto\n├── CLAUDE.md          # @AGENTS.md\n├── .agents/skills/    # capacidades\n├── src/               # todo el código\n├── tests/             # unit · e2e\n└── docs/              # todo el conocimiento\n    ├── product/       # el QUÉ · PDaC\n    ├── architecture/  # el CÓMO · arc42\n    └── design/        # UX y UI'}</Code><p><strong>src/</strong> para el código. <strong>docs/</strong> para el conocimiento.</p><p>Cada decisión, en un solo sitio.</p></> },
  { id: '06-sdd', title: 'Spec-Driven Development', content: <><Flow label="De intención a implementación" items={['Especificar', 'Planificar', 'Tareas', 'Implementar']} /><div className="scene-grid"><section><h2>OpenSpec</h2><p>Specs vivas y cambios propuestos como carpetas</p></section><section><h2>GitHub Spec Kit</h2><p>Constitución, spec, plan y tareas</p></section><section><h2>Kiro</h2><p>Requisitos, diseño y tareas en el IDE</p></section></div><p>La intención se escribe <strong>antes</strong> de generar código.</p></> },
  { id: '06a-openspec', title: 'OpenSpec', content: <></> },
  { id: '06b-spec-kit', title: 'GitHub Spec Kit', content: <></> },
  { id: '06c-kiro', title: 'Kiro', content: <></> },
  { id: '06d-codigo', title: 'Del criterio al código', content: <div className="code-bridge"><Code label="Ejemplo ilustrativo de implementación">{'// BR-REFUND-001 · regla aceptada\nexport function canRefund(\n  daysSinceDelivery: number,\n  windowDays: number\n) {\n  return daysSinceDelivery <= windowDays\n}'}</Code><div className="code-bridge-notes"><p><strong>Intención</strong> · la regla define el comportamiento y sus límites.</p><p><strong>Arquitectura</strong> · decide dónde vive esta decisión.</p><p><strong>Evidencia</strong> · tests de borde: día 29, día 30 y día 31.</p></div></div> },
  { id: '07-gaps', title: 'Las specs no son la fuente de verdad', content: <><Code label="Tres definiciones divergentes">{'$ grep -rn -i "refund" openspec/specs\nbilling:   Refunds are issued for purchases made in the last 30 days.\ncheckout:  Customers can request a refund within 30 days of delivery.\nsupport:   If the order is less than a month old, offer a refund.'}</Code><h2>Caso real · 160 specs con OpenSpec</h2><blockquote>«Forbidden and mandatory, same file, same day, both marked MUST.»</blockquote><p>Dos modelos del mismo IVA, el esquema equivocado en runtime y un agujero de seguridad · <a href="https://jgcarmona.com/en/i-tried-to-prove-pdac-wrong/">I Tried to Prove PDaC Wrong</a></p></> },
  { id: '08-dimensiones', title: 'Dos fuentes de verdad', content: <div className="scene-grid"><section><h2>Producto · El QUÉ</h2><p><code>docs/product/</code></p><ul><li>Reglas de negocio</li><li>Journeys y casos de uso</li><li>Comportamiento estructurado</li><li>PDaC · ProductShape</li></ul></section><section><h2>Arquitectura · El CÓMO</h2><p><code>docs/architecture/</code></p><ul><li>Contexto y bloques</li><li>Conceptos transversales</li><li>Decisiones (ADRs)</li><li>Requisitos de calidad</li><li>arc42</li></ul></section></div> },
  { id: '09-intencion', title: 'Escribíamos el qué… y lo abandonábamos', content: <><p className="scene-lede">Ahora puede ser nuestra fuente de verdad. La mantenemos con ayuda de la IA, pero con reglas que no dependen de ella.</p><Citation href="https://pdac.dev/">Product Definition as Code</Citation></> },
  { id: '10-autoridad', title: 'Producto decide. La entrega aprende y propone.', content: <><Flow label="Autoridad hacia abajo" items={['Product thinking: research · evidence · product judgment', 'Human acceptance → Accepted product definition: readable files · stable IDs · typed relationships', 'Citations → Delivery: specifications · architecture · backlogs · agents']} /><aside className="feedback-path"><strong>↑ Evidence + proposed Product Changes</strong><p>La entrega devuelve evidencia y propuestas. Una persona decide; la definición aceptada conserva la autoridad.</p></aside><p>One-way authority · two-way learning</p><Citation /></> },
  { id: '11-modelo', title: 'Qué escribimos del producto, y cómo se conecta', content: <><h2>PDaC-2 · Product Definition Model</h2><Flow label="Definición canónica" items={['Actors: ACT-CUSTOMER · ACT-PAYMENT-SERVICE participan en journeys', 'Journeys: JRN-CHECKOUT · JRN-REFUND se realizan en Use Cases: UC-CHECKOUT · UC-REFUND', 'Use Cases: gobernados por Business Rules BR-REFUND-001 · BR-AUTH-001; usan Domain: Terms TERM-* · Bounded Contexts BC-*', 'Los casos de uso generan obligaciones: Functional FR-* · Quality QR-* · Constraints CON-*', 'Requirements → scenario-ref → Structured Behaviour: SB-* · SB-CHECKOUT-001 · Given / When / Then']} /><div className="scene-grid"><section><h3>Product Changes</h3><p>CHG-REFUND-002 · semantic proposed delta · afecta a la definición</p></section><section><h3>Derived views</h3><p>snapshot · impact · reference validation · graph diff · navigation · citation status</p></section><section><h3>Delivery consumers</h3><p>SDD specifications · AI agents · human teams · backlog / code citan la definición</p></section></div><Citation /></> },
  { id: '12-origen', title: 'Nada de esto es nuevo', content: <><ul className="principles"><li>Ficheros versionados y legibles</li><li>Metadatos y validación</li><li>IDs estables y enlaces tipados</li><li>Vocabulario de producto</li><li>Baselines y Product Changes</li><li>Citas y detección de obsoletos</li><li>Grafos e informes de impacto</li><li>Contexto acotado para agentes</li></ul><Citation href="https://pdac.dev/articles/what-product-definition-as-code-puts-together/">Where Product Definition as Code comes from</Citation></> },
  { id: '13-productshape', title: 'Definida una vez, citada por todos', content: <><h2>ProductShape · Product Definition as Code</h2><Flow label="Demostración de citas" items={['Tres specs divergentes: compra, entrega y «menos de un mes»', 'BR-REFUND-001: una regla definida una vez, con ID estable', 'Cada spec cita la regla. Cambia la regla → las citas quedan stale', 'prodshape citations verify detecta las citas que necesitan revisión']} /><p className="demo-callout">Demo en vivo · Snapshot de DomusMind</p><p>Markdown es la fuente de verdad; el grafo se deriva. En CI, un guardarraíl duro sobre el conocimiento de producto.</p><Citation href="https://pdac.dev/">PDaC · ejemplo de devoluciones</Citation></> },
  { id: '15-workflow', title: 'De propuesta a producto aceptado', content: <Diagram id="15-workflow" language="es" /> },
  { id: '16-arc42', title: 'Documentar arquitectura con arc42', content: <><ol className="architecture-blocks"><li>Introducción y objetivos</li><li>Restricciones</li><li><strong>Contexto y alcance</strong></li><li><strong>Estrategia de solución</strong></li><li><strong>Bloques de construcción</strong></li><li>Vista de ejecución</li><li>Vista de despliegue</li><li><strong>Conceptos transversales</strong></li><li><strong>Decisiones (ADRs)</strong></li><li><em>Requisitos de calidad</em></li><li>Riesgos y deuda técnica</li><li><em>Glosario</em></li></ol><p><strong>Negrita:</strong> lo que el agente consulta en cada cambio. <em>Cursiva:</em> el puente con la definición de producto.</p><Citation href="https://arc42.org/">arc42 · doce bloques</Citation></> },
  { id: '17-flujo-agentico', title: 'Un flujo agéntico de principio a fin', content: <><Flow label="Ciclo de vida de agentic-sdlc" items={['Backlog', 'Refine → Ready · verifica un agente', 'Propose → Planned · verifica una persona', 'Implement → Done · verifican CI y una persona', 'Integrate', 'Review → vuelve al backlog']} /><p>agentic-sdlc · <a href="https://github.com/juangcarmona/agent-toolkit">github.com/juangcarmona/agent-toolkit</a></p><p>adopt descubre las herramientas del proyecto. done-gate-auditor revisa el diff fuera del contexto de quien lo escribió.</p></> },
  { id: '19-validacion', title: 'Del comportamiento estructurado al test', content: <><Code label="Escenarios de la ventana de devolución">{'@BR-REFUND-001\nFeature: Ventana de devolución\n\n  Scenario: Dentro de plazo\n    Given un pedido entregado hace 29 días\n    When el cliente pide la devolución\n    Then se acepta\n\n  Scenario: Fuera de plazo\n    Given un pedido entregado hace 31 días\n    Then se rechaza'}</Code><Flow label="Trazabilidad de la validación" items={['Structured behaviour (PDaC)', 'Criterios Given / When / Then en el backlog', 'Gherkin etiquetado con la regla', 'Tests e2e ejecutables', 'Evidencia']} /></> },
  { id: '20-piramide', title: 'La pirámide cambia de forma', content: <><div className="scene-grid"><section><h2>Antes</h2><div className="test-shape before"><p>E2E</p><p>Integración</p><p>Unitarios</p></div><p>Pocos e2e: caros de crear y de mantener</p></section><section><h2>Ahora</h2><div className="test-shape after"><p>E2E desde la intención</p><p>Integración</p><p>Unitarios</p></div><p>Producto y arquitectura como fuente de verdad</p></section></div><p>Los unitarios siguen siendo la base. Reparar la ejecución de un test nunca debe debilitar el escenario.</p></> },
  { id: '20a-evidencia', title: 'Un cambio no termina al compilar', content: <></> },
  { id: '18-entrega', title: 'Entregar es desplegar con control', content: <></> },
  { id: '18b-mantenimiento', title: 'Operar, aprender, volver a decidir', content: <></> },
  { id: '20b-power-bi-fabric', title: 'Una métrica. Tres respuestas.', content: <><Code label="Tres definiciones de ventas netas">{'$ rg "ventas_netas" .\nfinanzas:  bruto - devoluciones - descuentos\ncomercial: bruto - descuentos\ncierre:    sum(facturado)  # sin abonos'}</Code><div className="scene-grid"><section><h2>El problema</h2><p>Tres consumidores calculan la misma métrica de tres formas.</p></section><section><h2>La decisión</h2><p>Definir el KPI una vez, con ID estable; el código y los informes citan esa definición.</p></section></div></> },
  { id: '21-vista-global', title: 'El sistema, de un vistazo', content: <Diagram id="21-vista-global" language="es" /> },
  { id: '22-nosotros', title: 'Lo que sigue dependiendo de nosotros', content: <dl className="scene-list"><dt>Producto</dt><dd>Decidir qué producto queremos</dd><dt>Definición</dt><dd>Aceptar o rechazar cada cambio de definición</dd><dt>Guardarraíles</dt><dd>Elegir qué reglas merecen ser duras</dd><dt>Evidencia</dt><dd>Juzgar la evidencia, no solo mirarla</dd><dt>Responsabilidad</dt><dd>Responder de lo que se entrega</dd></dl> },
  { id: '23-videos', title: 'Sin planos, no hay plan', content: <><p>Planos de la Estrella de la Muerte: la documentación técnica permite entender un sistema y encontrar su punto débil sin haberlo construido.</p><p>El vídeo externo necesita conexión. Si no se reproduce, este contexto y el enlace siguen disponibles.</p><a href="https://www.youtube.com/watch?v=vsERtDqflfI">Ver «Planos de la Estrella de la Muerte» en YouTube</a><details className="video-panel"><summary>Cargar reproductor externo de YouTube</summary><iframe title="Planos de la Estrella de la Muerte — vídeo de cierre" src="https://www.youtube-nocookie.com/embed/vsERtDqflfI" loading="lazy" allowFullScreen /></details></> },
  { id: '24-fin', title: 'Juan G. Carmona', content: <><p className="scene-lede">¿Preguntas?</p><p>Software Architect · AI Strategist · Plain Concepts</p><div className="portrait-fallback" aria-label="Juan G. Carmona, retrato no disponible"><span aria-hidden="true">JG</span><p>Juan G. Carmona · ponente</p></div><ul><li><a href="https://jgcarmona.com/">jgcarmona.com</a></li><li><a href="https://linkedin.com/in/juangcarmona">linkedin.com/in/juangcarmona</a></li><li><a href="https://pdac.dev/">pdac.dev</a></li></ul></> },
] }
const figures: Record<string, string> = {
  '10-autoridad': authority,
  '11-modelo': model,
  // Keep the retired source illustration in the public deck assets.
  '14-citas': citations,
  '15-workflow': workflow,
  '17-flujo-agentico': lifecycle,
}

export const chapters = [
  { label: ['Intención', 'Intent'], ids: ['08-dimensiones', '07-gaps', '09-intencion', '10-autoridad', '11-modelo', '12-origen', '13-productshape'] },
  { label: ['Arquitectura', 'Architecture'], ids: ['16-arc42'] },
  { label: ['Guardarraíles', 'Guardrails'], ids: ['04-guardarrailes'] },
  { label: ['Código', 'Code'], ids: ['03-repo', '05-estructura', '06-sdd', '06a-openspec', '06b-spec-kit', '06c-kiro', '06d-codigo'] },
  { label: ['Evidencia', 'Evidence'], ids: ['19-validacion', '20-piramide', '20a-evidencia'] },
  { label: ['Entrega', 'Delivery'], ids: ['17-flujo-agentico', '18-entrega'] },
  { label: ['Mantenimiento', 'Maintenance'], ids: ['18b-mantenimiento', '15-workflow'] },
] as const

export function chapterForScene(id: string, language: 'es' | 'en') {
  const chapter = chapters.find(section => (section.ids as readonly string[]).includes(id))
  return chapter?.label[language === 'en' ? 1 : 0] ?? (['02-recorrido', '21-vista-global', '22-nosotros'].includes(id) ? (language === 'en' ? '7 STAGES' : '7 ETAPAS') : null)
}

export function decorateExperience(source: Experience) {
for (const scene of source.scenes) {
  const figure = figures[scene.id]
  if (figure) scene.content = <Diagram id={scene.id} language={source.language} original={figure} />
  if (['08-dimensiones', '22-nosotros'].includes(scene.id)) scene.content = <Diagram id={scene.id} language={source.language} />
  if (scene.id === '02-recorrido') scene.content = <JourneyMap language={source.language} />
  if (scene.id === '05-estructura') scene.content = <RepoStructure language={source.language} />
  if (['06-sdd', '06a-openspec', '06b-spec-kit', '06c-kiro'].includes(scene.id)) scene.content = <SddOverview language={source.language} view={scene.id === '06-sdd' ? 'general' : scene.id === '06a-openspec' ? 'openspec' : scene.id === '06b-spec-kit' ? 'spec-kit' : 'kiro'} />
  if (['20a-evidencia', '18-entrega', '18b-mantenimiento'].includes(scene.id)) scene.content = <Diagram id={scene.id} language={source.language} />
  if (scene.id === '07-gaps') scene.content = <TerminalCase language={source.language} variant="specs" />
  if (scene.id === '12-origen') scene.content = <OriginsMap language={source.language} />
  if (scene.id === '16-arc42') scene.content = <Arc42Overview language={source.language} />
  if (scene.id === '20b-power-bi-fabric') scene.content = <TerminalCase language={source.language} variant="metric" />
  if (scene.id === 'cover') scene.content = <><img className="cover-art" src={cover} alt="" />{scene.content}</>
  if (scene.id === '09-intencion') scene.content = <><img className="pdac-mark" src={logo} alt="PDaC" />{scene.content}</>
  if (scene.id === '13-productshape') scene.content = <Demo language={source.language} />
  if (scene.id === '24-fin') scene.content = <div className="closing-layout"><img className="speaker-portrait" src={portrait} alt="Juan G. Carmona" /><div><p className="scene-lede">{source.language === 'en' ? 'Questions?' : '¿Preguntas?'}</p><p>Software Architect · AI Strategist · Plain Concepts</p><ul><li><a href="https://jgcarmona.com/">jgcarmona.com</a></li><li><a href="https://linkedin.com/in/juangcarmona">linkedin.com/in/juangcarmona</a></li><li><a href="https://pdac.dev/">pdac.dev</a></li></ul></div></div>
}
const order = ['cover', '02-recorrido', ...chapters.flatMap(chapter => chapter.ids), '21-vista-global', '22-nosotros', '24-fin']
const byId = new Map(source.scenes.map(scene => [scene.id, scene]))
source.scenes = order.map(id => {
  const scene = byId.get(id)
  if (!scene) throw new Error(`Missing keynote scene: ${id}`)
  return scene
})
return source
}
decorateExperience(experience)
export default experience
