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
    'BR-REFUND-001: one accepted rule.',
    'Each delivery spec cites it.',
    'If it changes, CI flags stale citations.',
  ] : [
    'BR-REFUND-001: una regla aceptada.',
    'Cada spec de entrega la cita.',
    'Si cambia, CI señala las citas obsoletas.',
  ]
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => { if (preference.matches) setPlaying(false) }
    preference.addEventListener('change', stop)
    return () => preference.removeEventListener('change', stop)
  }, [])
  return <div className="demo-stage"><div className="demo-narrative"><p>{en ? 'The accepted product definition is the source of truth. Specs are delivery snapshots.' : 'La definición aceptada del producto es la fuente de verdad. Las specs son fotos de la entrega.'}</p><ol className="demo-steps" aria-label={en ? 'Citation demonstration' : 'Demostración de citas'}>{steps.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, '0')}</span><p>{step}</p></li>)}</ol></div><div className="demo-visual" onClick={event => event.stopPropagation()}>{playing ? <img className="demo-animation" src={demo} alt={en ? 'Animated demonstration of the refund rule and stale citations' : 'Demostración animada de la regla de devolución y citas obsoletas'} /> : <button className="demo-poster" type="button" onClick={() => setPlaying(true)}><strong>BR-REFUND-001</strong><small>{en ? 'Play demo' : 'Reproducir demo'} ▶</small></button>}</div></div>
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

export function WhatStory({ language }: { language: 'es' | 'en' }) {
  const en = language === 'en'
  return <div className="what-story">
    <p className="what-abandoned">{en ? '…then abandoned it.' : '…y lo abandonábamos.'}</p>
    <h2>{en ? 'Now it can be our source of truth.' : 'Ahora puede ser nuestra fuente de verdad.'}</h2>
    <a className="what-pdac" href="https://pdac.dev/"><img src={logo} alt="" /><span>Product Definition as Code <small>(PDaC) ↗</small></span></a>
    <p className="what-rule">{en ? 'We maintain it with AI, under rules that do not depend on AI.' : 'La mantenemos con ayuda de la IA, pero con reglas que no dependen de ella.'}</p>
  </div>
}

export function ProductCycle({ language }: { language: 'es' | 'en' }) {
  const en = language === 'en'
  return <div className="product-cycle" aria-label={en ? 'Product definition and delivery cycle' : 'Ciclo de definición y entrega del producto'}>
    <div className="product-cycle-stages">
      <div className="product-cycle-card"><span className="product-cycle-icon" aria-hidden="true">✦</span><div><strong>Product thinking</strong><small>{en ? 'Research · signals · product judgement' : 'Investigación · señales · criterio de producto'}</small></div></div>
      <div className="product-cycle-connector"><span>{en ? 'Human acceptance' : 'Aceptación humana'}</span></div>
      <div className="product-cycle-card product-cycle-definition"><span className="product-cycle-icon" aria-hidden="true">▤</span><div><strong>{en ? 'Accepted product definition' : 'Definición de producto aceptada'}</strong><small>{en ? 'Readable · versioned · connected' : 'Legible · versionada · conectada'}</small></div></div>
      <div className="product-cycle-connector"><span>{en ? 'Citations' : 'Citas'}</span></div>
      <div className="product-cycle-card"><span className="product-cycle-icon" aria-hidden="true">◇</span><div><strong>{en ? 'Delivery' : 'Entrega'}</strong><small>{en ? 'Specs · architecture · backlog · agents' : 'Specs · arquitectura · backlog · agentes'}</small></div></div>
    </div>
    <div className="product-cycle-return"><span className="product-cycle-return-head">{en ? 'A person decides' : 'Decide una persona'}</span><span className="product-cycle-return-line" aria-hidden="true" /><span className="product-cycle-return-detail">{en ? 'Results + proposed Product Changes' : 'Resultados + Product Changes propuestos'}</span></div>
  </div>
}

const experience: Experience = { language: 'es', scenes: [
  { id: 'cover', title: 'Ingeniería del Software 2.0', content: <><p className="scene-lede">Diseñar, construir y validar productos con IA</p><p>Juan G. Carmona</p><div className="intent-motif" aria-hidden="true">intención → sistema → evidencia</div></> },
  { id: 'engineering-journey', title: 'Una nueva manera de hacer software', content: <Flow label="Recorrido" items={['Código', 'Tendencias', 'Documentación', 'Desarrollo', 'Validación', 'Vista global']} /> },
  { id: 'prepare-repo-for-ai', title: 'Prepara el repo para la IA', content: <Diagram id="prepare-repo-for-ai" language="es" /> },
  { id: 'guardrails', title: 'Guardarraíles', content: <><p className="guardrail-definition">Mecanismos que guían el trabajo y ayudan a conseguir procesos repetibles.</p><div className="scene-grid"><section><span className="guardrail-kind">Indeterministas</span><h2>Blandos</h2><p className="guardrail-action">Guían</p><p>La regla existe, pero nada impide ignorarla.</p><ul><li>AGENTS.md / CLAUDE.md</li><li>Skills</li><li>ADRs y docs</li><li>Reglas en warning</li><li>Checklists</li></ul></section><section><span className="guardrail-kind">Deterministas</span><h2>Duros</h2><p className="guardrail-action">Bloquean</p><p>La herramienta se niega a continuar si se rompe la regla.</p><ul><li>Analizadores</li><li>Tests de arquitectura</li><li>Hooks de commit</li><li>CI obligatoria</li><li>Hooks del harness</li><li>Citas de producto en CI</li></ul></section></div></> },
  { id: 'repository-structure', title: 'Estructura ideal', content: <><Code label="Árbol del repositorio">{'├── AGENTS.md          # mapa de contexto\n├── CLAUDE.md          # @AGENTS.md\n├── .agents/skills/    # capacidades\n├── src/               # todo el código\n├── tests/             # unit · e2e\n└── docs/              # todo el conocimiento\n    ├── product/       # el QUÉ · PDaC\n    ├── architecture/  # el CÓMO · arc42\n    └── design/        # UX y UI'}</Code><p><strong>src/</strong> para el código. <strong>docs/</strong> para el conocimiento.</p><p>Cada decisión, en un solo sitio.</p></> },
  { id: 'spec-driven-development', title: 'Spec-Driven Development', content: <><Flow label="De intención a implementación" items={['Especificar', 'Planificar', 'Tareas', 'Implementar']} /><div className="scene-grid"><section><h2>OpenSpec</h2><p>Specs vivas y cambios propuestos como carpetas</p></section><section><h2>GitHub Spec Kit</h2><p>Constitución, spec, plan y tareas</p></section><section><h2>Kiro</h2><p>Requisitos, diseño y tareas en el IDE</p></section></div><p>La intención se escribe <strong>antes</strong> de generar código.</p></> },
  { id: 'openspec', title: 'OpenSpec', content: <></> },
  { id: 'github-spec-kit', title: 'GitHub Spec Kit', content: <></> },
  { id: 'kiro', title: 'Kiro', content: <></> },
  { id: 'specs-are-not-source-of-truth', title: 'Las specs no son la fuente de verdad', content: <><Code label="Tres definiciones divergentes">{'$ grep -rn -i "refund" openspec/specs\nbilling:   Refunds are issued for purchases made in the last 30 days.\ncheckout:  Customers can request a refund within 30 days of delivery.\nsupport:   If the order is less than a month old, offer a refund.'}</Code><h2>Caso real · 160 specs con OpenSpec</h2><blockquote>«Forbidden and mandatory, same file, same day, both marked MUST.»</blockquote><p>Dos modelos del mismo IVA, el esquema equivocado en runtime y un agujero de seguridad · <a href="https://jgcarmona.com/en/i-tried-to-prove-pdac-wrong/">I Tried to Prove PDaC Wrong</a></p></> },
  { id: 'two-sources-of-truth', title: 'Dos fuentes de verdad', content: <div className="scene-grid"><section><h2>Producto · El QUÉ</h2><p><code>docs/product/</code></p><ul><li>Reglas de negocio</li><li>Journeys y casos de uso</li><li>Comportamiento estructurado</li><li>PDaC · ProductShape</li></ul></section><section><h2>Arquitectura · El CÓMO</h2><p><code>docs/architecture/</code></p><ul><li>Contexto y bloques</li><li>Conceptos transversales</li><li>Decisiones (ADRs)</li><li>Requisitos de calidad</li><li>arc42</li></ul></section></div> },
  { id: 'we-abandoned-the-what', title: 'Antes escribíamos el qué', content: <WhatStory language="es" /> },
  { id: 'product-decides', title: 'El ciclo del producto', content: <ProductCycle language="es" /> },
  { id: 'product-definition-model', title: 'Qué escribimos del producto, y cómo se conecta', content: <><h2>PDaC-2 · Product Definition Model</h2><Flow label="Definición canónica" items={['Actors: ACT-CUSTOMER · ACT-PAYMENT-SERVICE participan en journeys', 'Journeys: JRN-CHECKOUT · JRN-REFUND se realizan en Use Cases: UC-CHECKOUT · UC-REFUND', 'Use Cases: gobernados por Business Rules BR-REFUND-001 · BR-AUTH-001; usan Domain: Terms TERM-* · Bounded Contexts BC-*', 'Los casos de uso generan obligaciones: Functional FR-* · Quality QR-* · Constraints CON-*', 'Requirements → scenario-ref → Structured Behaviour: SB-* · SB-CHECKOUT-001 · Given / When / Then']} /><div className="scene-grid"><section><h3>Product Changes</h3><p>CHG-REFUND-002 · semantic proposed delta · afecta a la definición</p></section><section><h3>Derived views</h3><p>snapshot · impact · reference validation · graph diff · navigation · citation status</p></section><section><h3>Delivery consumers</h3><p>SDD specifications · AI agents · human teams · backlog / code citan la definición</p></section></div><Citation /></> },
  { id: 'none-of-this-is-new', title: 'Nada de esto es nuevo', content: <><ul className="principles"><li>Ficheros versionados y legibles</li><li>Metadatos y validación</li><li>IDs estables y enlaces tipados</li><li>Vocabulario de producto</li><li>Baselines y Product Changes</li><li>Citas y detección de obsoletos</li><li>Grafos e informes de impacto</li><li>Contexto acotado para agentes</li></ul><Citation href="https://pdac.dev/articles/what-product-definition-as-code-puts-together/">Where Product Definition as Code comes from</Citation></> },
  { id: 'define-once-cite-everywhere', title: 'Definida una vez, citada por todos', content: <><h2>ProductShape · Product Definition as Code</h2><Flow label="Demostración de citas" items={['Tres specs divergentes: compra, entrega y «menos de un mes»', 'BR-REFUND-001: una regla definida una vez, con ID estable', 'Cada spec cita la regla. Cambia la regla → las citas quedan stale', 'prodshape citations verify detecta las citas que necesitan revisión']} /><p className="demo-callout">Demo en vivo · Snapshot de DomusMind</p><p>Markdown es la fuente de verdad; el grafo se deriva. En CI, un guardarraíl duro sobre el conocimiento de producto.</p><Citation href="https://pdac.dev/">PDaC · ejemplo de devoluciones</Citation></> },
  { id: 'from-proposal-to-accepted-product', title: 'De propuesta a producto aceptado', content: <Diagram id="from-proposal-to-accepted-product" language="es" /> },
  { id: 'document-architecture-with-arc42', title: 'Documentar arquitectura con arc42', content: <><ol className="architecture-blocks"><li>Introducción y objetivos</li><li>Restricciones</li><li><strong>Contexto y alcance</strong></li><li><strong>Estrategia de solución</strong></li><li><strong>Bloques de construcción</strong></li><li>Vista de ejecución</li><li>Vista de despliegue</li><li><strong>Conceptos transversales</strong></li><li><strong>Decisiones (ADRs)</strong></li><li><em>Requisitos de calidad</em></li><li>Riesgos y deuda técnica</li><li><em>Glosario</em></li></ol><p><strong>Negrita:</strong> lo que el agente consulta en cada cambio. <em>Cursiva:</em> el puente con la definición de producto.</p><Citation href="https://arc42.org/">arc42 · doce bloques</Citation></> },
  { id: 'agentic-flow-end-to-end', title: 'Un flujo agéntico de principio a fin', content: <><Flow label="Ciclo de vida de agentic-sdlc" items={['Backlog', 'Refine → Ready · verifica un agente', 'Propose → Planned · verifica una persona', 'Implement → Done · verifican CI y una persona', 'Integrate', 'Review → vuelve al backlog']} /><p>agentic-sdlc · <a href="https://github.com/juangcarmona/agent-toolkit">github.com/juangcarmona/agent-toolkit</a></p><p>adopt descubre las herramientas del proyecto. done-gate-auditor revisa el diff fuera del contexto de quien lo escribió.</p></> },
  { id: 'from-structured-behaviour-to-tests', title: 'Del comportamiento estructurado al test', content: <><Code label="Escenarios de la ventana de devolución">{'@BR-REFUND-001\nFeature: Ventana de devolución\n\n  Scenario: Dentro de plazo\n    Given un pedido entregado hace 29 días\n    When el cliente pide la devolución\n    Then se acepta\n\n  Scenario: Fuera de plazo\n    Given un pedido entregado hace 31 días\n    Then se rechaza'}</Code><Flow label="Trazabilidad de la validación" items={['Structured behaviour (PDaC)', 'Criterios Given / When / Then en el backlog', 'Gherkin etiquetado con la regla', 'Tests e2e ejecutables', 'Evidencia']} /></> },
  { id: 'from-pyramid-to-hourglass', title: 'De pirámide a reloj de arena', content: <><div className="scene-grid"><section><h2>Antes · pirámide</h2><div className="test-shape before"><p>E2E</p><p>Integración</p><p>Unitarios</p></div><p>Pocos e2e: caros de crear y mantener.</p></section><section><h2>Ahora · reloj de arena</h2><div className="test-shape after"><p>E2E desde la intención</p><p>Integración</p><p>Unitarios</p></div><p>Una definición de producto viva permite generar y mantener los e2e con ayuda de la IA.</p></section></div><p>Los unitarios siguen siendo la base. Los e2e comprueban el comportamiento aceptado.</p></> },
  { id: 'controlled-deployment', title: 'Entregar es desplegar con control', content: <></> },
  { id: 'operate-learn-decide-again', title: 'Operar, aprender, volver a decidir', content: <></> },
  { id: 'what-still-depends-on-us', title: 'Lo que sigue dependiendo de nosotros', content: <dl className="scene-list"><dt>Producto</dt><dd>Decidir qué producto queremos</dd><dt>Definición</dt><dd>Aceptar o rechazar cada cambio de definición</dd><dt>Guardarraíles</dt><dd>Elegir qué reglas merecen ser duras</dd><dt>Evidencia</dt><dd>Juzgar la evidencia, no solo mirarla</dd><dt>Responsabilidad</dt><dd>Responder de lo que se entrega</dd></dl> },
  { id: 'juan-g-carmona', title: 'Juan G. Carmona', content: <><p className="scene-lede">¿Preguntas?</p><p>Software Architect · AI Strategist · Plain Concepts</p><div className="portrait-fallback" aria-label="Juan G. Carmona, retrato no disponible"><span aria-hidden="true">JG</span><p>Juan G. Carmona · ponente</p></div><ul><li><a href="https://jgcarmona.com/">jgcarmona.com</a></li><li><a href="https://linkedin.com/in/juangcarmona">linkedin.com/in/juangcarmona</a></li><li><a href="https://pdac.dev/">pdac.dev</a></li></ul></> },
] }
const figures: Record<string, string> = {
  'product-decides': authority,
  'product-definition-model': model,
  // Keep the retired source illustration in the public deck assets.
  '14-citas': citations,
  'from-proposal-to-accepted-product': workflow,
  'agentic-flow-end-to-end': lifecycle,
}

export const chapters = [
  { label: ['Intención', 'Intent'], ids: ['two-sources-of-truth', 'we-abandoned-the-what', 'product-decides', 'product-definition-model', 'none-of-this-is-new'] },
  { label: ['Arquitectura', 'Architecture'], ids: ['document-architecture-with-arc42'] },
  { label: ['Guardarraíles', 'Guardrails'], ids: ['guardrails'] },
  { label: ['Código', 'Code'], ids: ['prepare-repo-for-ai', 'repository-structure', 'spec-driven-development', 'openspec', 'github-spec-kit', 'kiro'] },
  { label: ['Evidencia', 'Evidence'], ids: ['from-pyramid-to-hourglass', 'from-structured-behaviour-to-tests'] },
  { label: ['Entrega', 'Delivery'], ids: ['specs-are-not-source-of-truth', 'define-once-cite-everywhere', 'agentic-flow-end-to-end', 'controlled-deployment'] },
  { label: ['Mantenimiento', 'Maintenance'], ids: ['operate-learn-decide-again', 'from-proposal-to-accepted-product'] },
] as const

// Old shared links remain readable after the presentation was reorganised.
export const legacySceneIds: Record<string, string> = {
  '02-recorrido': 'engineering-journey',
  '03-repo': 'prepare-repo-for-ai',
  '04-guardarrailes': 'guardrails',
  '05-estructura': 'repository-structure',
  '06-sdd': 'spec-driven-development',
  '06a-openspec': 'openspec',
  '06b-spec-kit': 'github-spec-kit',
  '06c-kiro': 'kiro',
  '06d-codigo': 'from-structured-behaviour-to-tests',
  '07-gaps': 'specs-are-not-source-of-truth',
  '08-dimensiones': 'two-sources-of-truth',
  '09-intencion': 'we-abandoned-the-what',
  '10-autoridad': 'product-decides',
  '11-modelo': 'product-definition-model',
  '12-origen': 'none-of-this-is-new',
  '13-productshape': 'define-once-cite-everywhere',
  '14-citas': 'define-once-cite-everywhere',
  '15-workflow': 'from-proposal-to-accepted-product',
  '16-arc42': 'document-architecture-with-arc42',
  '17-flujo-agentico': 'agentic-flow-end-to-end',
  '18-entrega': 'controlled-deployment',
  '18b-mantenimiento': 'operate-learn-decide-again',
  '19-validacion': 'from-structured-behaviour-to-tests',
  '20-piramide': 'from-pyramid-to-hourglass',
  '20a-evidencia': 'agentic-flow-end-to-end',
  '20b-power-bi-fabric': 'specs-are-not-source-of-truth',
  '21-vista-global': 'what-still-depends-on-us',
  '22-nosotros': 'what-still-depends-on-us',
  '23-videos': 'juan-g-carmona',
  '24-fin': 'juan-g-carmona',
}

export function chapterForScene(id: string, language: 'es' | 'en') {
  const chapter = chapters.find(section => (section.ids as readonly string[]).includes(id))
  return chapter?.label[language === 'en' ? 1 : 0] ?? (['engineering-journey', 'what-still-depends-on-us'].includes(id) ? (language === 'en' ? '7 STAGES' : '7 ETAPAS') : null)
}

export function decorateExperience(source: Experience) {
for (const scene of source.scenes) {
  const figure = figures[scene.id]
  if (figure && scene.id !== 'product-decides') scene.content = <Diagram id={scene.id} language={source.language} original={figure} />
  if (['two-sources-of-truth', 'what-still-depends-on-us'].includes(scene.id)) scene.content = <Diagram id={scene.id} language={source.language} />
  if (scene.id === 'engineering-journey') scene.content = <JourneyMap language={source.language} />
  if (scene.id === 'repository-structure') scene.content = <RepoStructure language={source.language} />
  if (['spec-driven-development', 'openspec', 'github-spec-kit', 'kiro'].includes(scene.id)) scene.content = <SddOverview language={source.language} view={scene.id === 'spec-driven-development' ? 'general' : scene.id === 'openspec' ? 'openspec' : scene.id === 'github-spec-kit' ? 'spec-kit' : 'kiro'} />
  if (['controlled-deployment', 'operate-learn-decide-again'].includes(scene.id)) scene.content = <Diagram id={scene.id} language={source.language} />
  if (scene.id === 'specs-are-not-source-of-truth') scene.content = <TerminalCase language={source.language} />
  if (scene.id === 'none-of-this-is-new') scene.content = <OriginsMap language={source.language} />
  if (scene.id === 'document-architecture-with-arc42') scene.content = <Arc42Overview language={source.language} />
  if (scene.id === 'cover') scene.content = <><img className="cover-art" src={cover} alt="" />{scene.content}</>
  if (scene.id === 'define-once-cite-everywhere') scene.content = <Demo language={source.language} />
  if (scene.id === 'juan-g-carmona') scene.content = <div className="closing-layout"><img className="speaker-portrait" src={portrait} alt="Juan G. Carmona" /><div><p className="scene-lede">{source.language === 'en' ? 'Questions?' : '¿Preguntas?'}</p><p>Software Architect · AI Strategist · Plain Concepts</p><ul><li><a href="https://jgcarmona.com/">jgcarmona.com</a></li><li><a href="https://linkedin.com/in/juangcarmona">linkedin.com/in/juangcarmona</a></li><li><a href="https://pdac.dev/">pdac.dev</a></li></ul></div></div>
}
const order = ['cover', 'engineering-journey', ...chapters.flatMap(chapter => chapter.ids), 'what-still-depends-on-us', 'juan-g-carmona']
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
