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
import { Arc42Overview, RepoStructure, SddOverview, TerminalCase } from './SceneExtras'

function Demo({ language }: { language: string }) {
  const [playing, setPlaying] = useState(() => !matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => { if (preference.matches) setPlaying(false) }
    preference.addEventListener('change', stop)
    return () => preference.removeEventListener('change', stop)
  }, [])
  return <div className="demo-stage"><img className="product-brand" src={branding} alt="ProductShape, Product Definition as Code" /><div className="demo-count" aria-hidden="true">03 <span>→</span> 01<small>{language === 'en' ? 'conflicting specs → accepted rule' : 'specs divergentes → regla aceptada'}</small></div><button type="button" aria-pressed={playing} onClick={() => setPlaying(!playing)}>{playing ? (language === 'en' ? 'Stop animated demo' : 'Detener demo animada') : (language === 'en' ? 'Play animated demo' : 'Reproducir demo animada')}</button>{playing && <img className="demo-animation" src={demo} alt={language === 'en' ? 'Demo: three conflicting refund specs, one accepted BR-REFUND-001 rule and stale citation detection' : 'Demo: tres specs divergentes sobre devoluciones, BR-REFUND-001 definida una vez y verificación de citas obsoletas'} />}</div>
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
  { id: '02-recorrido', title: 'El recorrido', content: <Flow label="Recorrido" items={['Código', 'Tendencias', 'Documentación', 'Desarrollo', 'Validación', 'Vista global']} /> },
  { id: '03-repo', title: 'Prepara el repo para la IA', content: <Diagram id="03-repo" language="es" /> },
  { id: '04-guardarrailes', title: 'Dos tipos de guardarraíles', content: <div className="scene-grid"><section><h2>Blandos · Guían</h2><p>La regla existe, pero nada impide ignorarla.</p><ul><li>AGENTS.md / CLAUDE.md</li><li>Skills</li><li>ADRs y docs</li><li>Reglas en warning</li><li>Checklists</li></ul></section><section><h2>Duros · Bloquean</h2><p>La herramienta se niega a continuar si se rompe la regla.</p><ul><li>Analizadores</li><li>Tests de arquitectura</li><li>Hooks de commit</li><li>CI obligatoria</li><li>Hooks del harness</li><li>Citas de producto en CI</li></ul></section></div> },
  { id: '05-estructura', title: 'Estructura ideal', content: <><Code label="Árbol del repositorio">{'├── AGENTS.md          # mapa de contexto\n├── CLAUDE.md          # @AGENTS.md\n├── .agents/skills/    # capacidades\n├── src/               # todo el código\n├── tests/             # unit · e2e\n└── docs/              # todo el conocimiento\n    ├── product/       # el QUÉ · PDaC\n    ├── architecture/  # el CÓMO · arc42\n    └── design/        # UX y UI'}</Code><p><strong>src/</strong> para el código. <strong>docs/</strong> para el conocimiento.</p><p>Cada decisión, en un solo sitio.</p></> },
  { id: '06-sdd', title: 'Spec-Driven Development', content: <><Flow label="De intención a implementación" items={['Especificar', 'Planificar', 'Tareas', 'Implementar']} /><div className="scene-grid"><section><h2>OpenSpec</h2><p>Specs vivas y cambios propuestos como carpetas</p></section><section><h2>GitHub Spec Kit</h2><p>Constitución, spec, plan y tareas</p></section><section><h2>Kiro</h2><p>Requisitos, diseño y tareas en el IDE</p></section></div><p>La intención se escribe <strong>antes</strong> de generar código.</p></> },
  { id: '07-gaps', title: 'Cada spec describe un cambio, no el producto', content: <><Code label="Tres definiciones divergentes">{'$ grep -rn -i "refund" openspec/specs\nbilling:   Refunds are issued for purchases made in the last 30 days.\ncheckout:  Customers can request a refund within 30 days of delivery.\nsupport:   If the order is less than a month old, offer a refund.'}</Code><h2>Caso real · 160 specs con OpenSpec</h2><blockquote>«Forbidden and mandatory, same file, same day, both marked MUST.»</blockquote><p>Dos modelos del mismo IVA, el esquema equivocado en runtime y un agujero de seguridad · <a href="https://jgcarmona.com/en/i-tried-to-prove-pdac-wrong/">I Tried to Prove PDaC Wrong</a></p></> },
  { id: '08-dimensiones', title: 'Dos fuentes de verdad', content: <div className="scene-grid"><section><h2>Producto · El QUÉ</h2><p><code>docs/product/</code></p><ul><li>Reglas de negocio</li><li>Journeys y casos de uso</li><li>Comportamiento estructurado</li><li>PDaC · ProductShape</li></ul></section><section><h2>Arquitectura · El CÓMO</h2><p><code>docs/architecture/</code></p><ul><li>Contexto y bloques</li><li>Conceptos transversales</li><li>Decisiones (ADRs)</li><li>Requisitos de calidad</li><li>arc42</li></ul></section></div> },
  { id: '09-intencion', title: 'Escribíamos el qué… y lo abandonábamos', content: <><p className="scene-lede">Ahora puede ser nuestra fuente de verdad. La mantenemos con ayuda de la IA, pero con reglas que no dependen de ella.</p><Citation href="https://pdac.dev/">Product Definition as Code</Citation></> },
  { id: '10-autoridad', title: 'Producto decide. La entrega aprende y propone.', content: <><Flow label="Autoridad hacia abajo" items={['Product thinking: research · evidence · product judgment', 'Human acceptance → Accepted product definition: readable files · stable IDs · typed relationships', 'Citations → Delivery: specifications · architecture · backlogs · agents']} /><aside className="feedback-path"><strong>↑ Evidence + proposed Product Changes</strong><p>La entrega devuelve evidencia y propuestas. Una persona decide; la definición aceptada conserva la autoridad.</p></aside><p>One-way authority · two-way learning</p><Citation /></> },
  { id: '11-modelo', title: 'Qué escribimos del producto, y cómo se conecta', content: <><h2>PDaC-2 · Product Definition Model</h2><Flow label="Definición canónica" items={['Actors: ACT-CUSTOMER · ACT-PAYMENT-SERVICE participan en journeys', 'Journeys: JRN-CHECKOUT · JRN-REFUND se realizan en Use Cases: UC-CHECKOUT · UC-REFUND', 'Use Cases: gobernados por Business Rules BR-REFUND-001 · BR-AUTH-001; usan Domain: Terms TERM-* · Bounded Contexts BC-*', 'Los casos de uso generan obligaciones: Functional FR-* · Quality QR-* · Constraints CON-*', 'Requirements → scenario-ref → Structured Behaviour: SB-* · SB-CHECKOUT-001 · Given / When / Then']} /><div className="scene-grid"><section><h3>Product Changes</h3><p>CHG-REFUND-002 · semantic proposed delta · afecta a la definición</p></section><section><h3>Derived views</h3><p>snapshot · impact · reference validation · graph diff · navigation · citation status</p></section><section><h3>Delivery consumers</h3><p>SDD specifications · AI agents · human teams · backlog / code citan la definición</p></section></div><Citation /></> },
  { id: '12-origen', title: 'Nada de esto es nuevo', content: <><ul className="principles"><li>Ficheros versionados y legibles</li><li>Metadatos y validación</li><li>IDs estables y enlaces tipados</li><li>Vocabulario de producto</li><li>Baselines y Product Changes</li><li>Citas y detección de obsoletos</li><li>Grafos e informes de impacto</li><li>Contexto acotado para agentes</li></ul><Citation href="https://pdac.dev/articles/what-product-definition-as-code-puts-together/">Where Product Definition as Code comes from</Citation></> },
  { id: '13-productshape', title: 'Definida una vez, citada por todos', content: <><h2>ProductShape · Product Definition as Code</h2><Flow label="Demostración de citas" items={['Tres specs divergentes: compra, entrega y «menos de un mes»', 'BR-REFUND-001: una regla definida una vez, con ID estable', 'Cada spec cita la regla. Cambia la regla → las citas quedan stale', 'prodshape citations verify detecta las citas que necesitan revisión']} /><p className="demo-callout">Demo en vivo · Snapshot de DomusMind</p><p>Markdown es la fuente de verdad; el grafo se deriva. En CI, un guardarraíl duro sobre el conocimiento de producto.</p><Citation href="https://pdac.dev/">PDaC · ejemplo de devoluciones</Citation></> },
  { id: '14-citas', title: 'Citas y deriva', content: <Diagram id="14-citas" language="es" /> },
  { id: '15-workflow', title: 'La IA propone, el código valida, una persona acepta', content: <><h2>PDaC · Flujo de referencia</h2><Flow label="Configuración y aceptación" items={['Accepted baseline · accepted product definition', 'Product Change · semantic change record', 'Overlay validation · proposed state', 'Human approval', 'Apply · materialises', 'Working branch · candidate state', 'Pull request · Git review', 'Human acceptance · merge', 'New accepted baseline · accepted product definition']} /><p className="scene-lede">Apply materialises · merge accepts</p><Citation /></> },
  { id: '16-arc42', title: 'Documentar arquitectura con arc42', content: <><ol className="architecture-blocks"><li>Introducción y objetivos</li><li>Restricciones</li><li><strong>Contexto y alcance</strong></li><li><strong>Estrategia de solución</strong></li><li><strong>Bloques de construcción</strong></li><li>Vista de ejecución</li><li>Vista de despliegue</li><li><strong>Conceptos transversales</strong></li><li><strong>Decisiones (ADRs)</strong></li><li><em>Requisitos de calidad</em></li><li>Riesgos y deuda técnica</li><li><em>Glosario</em></li></ol><p><strong>Negrita:</strong> lo que el agente consulta en cada cambio. <em>Cursiva:</em> el puente con la definición de producto.</p><Citation href="https://arc42.org/">arc42 · doce bloques</Citation></> },
  { id: '17-flujo-agentico', title: 'Un flujo agéntico de principio a fin', content: <><Flow label="Ciclo de vida de agentic-sdlc" items={['Backlog', 'Refine → Ready · verifica un agente', 'Propose → Planned · verifica una persona', 'Implement → Done · verifican CI y una persona', 'Integrate', 'Review → vuelve al backlog']} /><p>agentic-sdlc · <a href="https://github.com/juangcarmona/agent-toolkit">github.com/juangcarmona/agent-toolkit</a></p><p>adopt descubre las herramientas del proyecto. done-gate-auditor revisa el diff fuera del contexto de quien lo escribió.</p></> },
  { id: '19-validacion', title: 'Del comportamiento estructurado al test', content: <><Code label="Escenarios de la ventana de devolución">{'@BR-REFUND-001\nFeature: Ventana de devolución\n\n  Scenario: Dentro de plazo\n    Given un pedido entregado hace 29 días\n    When el cliente pide la devolución\n    Then se acepta\n\n  Scenario: Fuera de plazo\n    Given un pedido entregado hace 31 días\n    Then se rechaza'}</Code><Flow label="Trazabilidad de la validación" items={['Structured behaviour (PDaC)', 'Criterios Given / When / Then en el backlog', 'Gherkin etiquetado con la regla', 'Tests e2e ejecutables', 'Evidencia']} /></> },
  { id: '20-piramide', title: 'La pirámide cambia de forma', content: <><div className="scene-grid"><section><h2>Antes</h2><div className="test-shape before"><p>E2E</p><p>Integración</p><p>Unitarios</p></div><p>Pocos e2e: caros de crear y de mantener</p></section><section><h2>Ahora</h2><div className="test-shape after"><p>E2E desde la intención</p><p>Integración</p><p>Unitarios</p></div><p>Producto y arquitectura como fuente de verdad</p></section></div><p>Los unitarios siguen siendo la base. Reparar la ejecución de un test nunca debe debilitar el escenario.</p></> },
  { id: '20b-power-bi-fabric', title: 'Una métrica. Tres respuestas.', content: <><Code label="Tres definiciones de ventas netas">{'$ rg "ventas_netas" .\nfinanzas:  bruto - devoluciones - descuentos\ncomercial: bruto - descuentos\ncierre:    sum(facturado)  # sin abonos'}</Code><div className="scene-grid"><section><h2>El problema</h2><p>Tres consumidores calculan la misma métrica de tres formas.</p></section><section><h2>La decisión</h2><p>Definir el KPI una vez, con ID estable; el código y los informes citan esa definición.</p></section></div></> },
  { id: '21-vista-global', title: 'El sistema, de un vistazo', content: <Diagram id="21-vista-global" language="es" /> },
  { id: '22-nosotros', title: 'Lo que sigue dependiendo de nosotros', content: <dl className="scene-list"><dt>Producto</dt><dd>Decidir qué producto queremos</dd><dt>Definición</dt><dd>Aceptar o rechazar cada cambio de definición</dd><dt>Guardarraíles</dt><dd>Elegir qué reglas merecen ser duras</dd><dt>Evidencia</dt><dd>Juzgar la evidencia, no solo mirarla</dd><dt>Responsabilidad</dt><dd>Responder de lo que se entrega</dd></dl> },
  { id: '23-videos', title: 'Sin planos, no hay plan', content: <><p>Planos de la Estrella de la Muerte: la documentación técnica permite entender un sistema y encontrar su punto débil sin haberlo construido.</p><p>El vídeo externo necesita conexión. Si no se reproduce, este contexto y el enlace siguen disponibles.</p><a href="https://www.youtube.com/watch?v=vsERtDqflfI">Ver «Planos de la Estrella de la Muerte» en YouTube</a><details className="video-panel"><summary>Cargar reproductor externo de YouTube</summary><iframe title="Planos de la Estrella de la Muerte — vídeo de cierre" src="https://www.youtube-nocookie.com/embed/vsERtDqflfI" loading="lazy" allowFullScreen /></details></> },
  { id: '24-fin', title: 'Juan G. Carmona', content: <><p className="scene-lede">¿Preguntas?</p><p>Software Architect · AI Strategist · Plain Concepts</p><div className="portrait-fallback" aria-label="Juan G. Carmona, retrato no disponible"><span aria-hidden="true">JG</span><p>Juan G. Carmona · ponente</p></div><ul><li><a href="https://jgcarmona.com/">jgcarmona.com</a></li><li><a href="https://linkedin.com/in/juangcarmona">linkedin.com/in/juangcarmona</a></li><li><a href="https://pdac.dev/">pdac.dev</a></li></ul></> },
] }
const figures: Record<string, string> = {
  '10-autoridad': authority,
  '11-modelo': model,
  '14-citas': citations,
  '15-workflow': workflow,
  '17-flujo-agentico': lifecycle,
}

export function decorateExperience(source: Experience) {
for (const scene of source.scenes) {
  const figure = figures[scene.id]
  if (figure) scene.content = <Diagram id={scene.id} language={source.language} original={figure} />
  if (['08-dimensiones', '22-nosotros'].includes(scene.id)) scene.content = <Diagram id={scene.id} language={source.language} />
  if (scene.id === '05-estructura') scene.content = <RepoStructure language={source.language} />
  if (scene.id === '06-sdd') scene.content = <SddOverview language={source.language} />
  if (scene.id === '07-gaps') scene.content = <TerminalCase language={source.language} variant="specs" />
  if (scene.id === '16-arc42') scene.content = <Arc42Overview language={source.language} />
  if (scene.id === '20b-power-bi-fabric') scene.content = <TerminalCase language={source.language} variant="metric" />
  if (scene.id === 'cover') scene.content = <><img className="cover-art" src={cover} alt="" />{scene.content}</>
  if (scene.id === '09-intencion') scene.content = <><img className="pdac-mark" src={logo} alt="PDaC" />{scene.content}</>
  if (scene.id === '13-productshape') scene.content = <><Demo language={source.language} /><details className="supporting-text"><summary>{source.language === 'en' ? 'Demo steps and references' : 'Pasos de la demo y referencias'}</summary>{scene.content}</details></>
  if (scene.id === '24-fin') scene.content = <div className="closing-layout"><img className="speaker-portrait" src={portrait} alt="Juan G. Carmona" /><div><p className="scene-lede">{source.language === 'en' ? 'Questions?' : '¿Preguntas?'}</p><p>Software Architect · AI Strategist · Plain Concepts</p><ul><li><a href="https://jgcarmona.com/">jgcarmona.com</a></li><li><a href="https://linkedin.com/in/juangcarmona">linkedin.com/in/juangcarmona</a></li><li><a href="https://pdac.dev/">pdac.dev</a></li></ul></div></div>
}
return source
}
decorateExperience(experience)
export default experience
