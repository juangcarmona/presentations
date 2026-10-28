import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import Experience from './Experience'
import { talks } from './talks'
import type { Talk } from './talk-model'

type Theme = 'dark' | 'light' | 'system'

function SiteHeader({ theme, onThemeChange }: { theme: Theme; onThemeChange: () => void }) {
  return (
    <header className="topbar">
      <a className="wordmark" href="/" aria-label="Juan G. Carmona, home">
        <span className="wordmark-mark">JG</span>
        <span>talks</span>
      </a>
      <nav aria-label="Main navigation">
        <a href="/#catalog">Catalog</a>
        <a href="/#method">Method</a>
        <a href="https://github.com/juangcarmona/presentations">GitHub</a>
      </nav>
      <button
        className="theme-toggle"
        type="button"
        aria-label={`Appearance: ${theme}. Change appearance`}
        onClick={onThemeChange}
      >
        <span aria-hidden="true">{theme === 'dark' ? '☼' : '◐'}</span>
        {theme}
      </button>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="footer">
      <span>© 2026 Juan G. Carmona</span>
      <span className="footer-code">built from source / talks.jgcarmona.com</span>
    </footer>
  )
}

function Layout({ children, theme, onThemeChange }: { children: React.ReactNode; theme: Theme; onThemeChange: () => void }) {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido">Skip to content</a>
      <SiteHeader theme={theme} onThemeChange={onThemeChange} />
      <main id="contenido" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </div>
  )
}

function CatalogPage() {
  return (
    <>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker"><span>01</span> / living catalog</p>
          <h1 id="hero-title">Ideas that deserve a stage.</h1>
          <p className="hero-lede">
            Talks about software, product and artificial intelligence. Each one starts with research, becomes a narrative and ends as an experience you can walk through.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#catalog">Explore talks <span aria-hidden="true">↓</span></a>
            <a className="text-link" href="https://github.com/juangcarmona/presentations">View the repository <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        <div className="hero-signal" aria-label="Catalog status">
          <div className="signal-grid" aria-hidden="true" />
          <div className="signal-content">
            <span className="signal-dot" />
            <span>catalog / online</span>
            <strong>{String(talks.length).padStart(2, '0')}</strong>
            <small>talks in the archive</small>
          </div>
          <span className="signal-code">jgcarmona.com/talks</span>
        </div>
      </section>

      <section className="catalog-section" id="catalog" aria-labelledby="catalog-title">
        <div className="section-heading">
          <div>
            <p className="kicker"><span>02</span> / catalog</p>
            <h2 id="catalog-title">The talks</h2>
          </div>
          <p>Editable source, research and a distinct direction for every idea.</p>
        </div>
        <div className="talk-list">
          {talks.map((talk) => <TalkCard key={talk.slug} talk={talk} />)}
        </div>
      </section>

      <section className="method-section" id="method" aria-labelledby="method-title">
        <div>
          <p className="kicker"><span>03</span> / how they are made</p>
          <h2 id="method-title">A talk is a product too.</h2>
        </div>
        <div className="method-flow" aria-label="Talk creation flow">
          <div><span>01</span><strong>Research</strong><small>sources and questions</small></div>
          <div><span>02</span><strong>Narrative</strong><small>thesis and movement</small></div>
          <div><span>03</span><strong>Experience</strong><small>deck and scene</small></div>
        </div>
      </section>
    </>
  )
}

function TalkCard({ talk }: { talk: Talk }) {
  return (
    <article className={`talk-card${talk.featured ? ' talk-card-featured' : ''}`}>
      <div className="talk-card-index" aria-hidden="true">{talk.number}</div>
      <div className="talk-card-body">
        <div className="talk-card-topline">
          <span>{talk.eyebrow}</span>
          <span className="status"><i aria-hidden="true" />{talk.status}</span>
        </div>
        <h3>{talk.title}</h3>
        <p>{talk.description}</p>
        <ul className="meta-list" aria-label={`Details for ${talk.title}`}>
          {talk.meta.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="card-actions">
          <a className="button button-secondary" href={`/${talk.slug}/`}>Enter talk <span aria-hidden="true">↗</span></a>
          <a className="text-link" href={talk.sourceUrl}>Source <span aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className="talk-card-mark" aria-hidden="true">{talk.featured ? '◒' : '◌'}</div>
    </article>
  )
}

function TalkPage({ talk }: { talk: Talk }) {
  const Content = useMemo(() => lazy(async () => {
    const { default: experience } = await talk.load()
    return { default: () => <Experience talk={talk} experience={experience} /> }
  }), [talk])
  return <Suspense fallback={<p role="status">Loading talk…</p>}><Content /></Suspense>
}

function NotFoundPage() {
  return (
    <section className="empty-state" aria-labelledby="not-found-title">
      <p className="kicker"><span>404</span> / not found</p>
      <h1 id="not-found-title">This talk has not entered the archive yet.</h1>
      <a className="button button-primary" href="/">Back to catalog <span aria-hidden="true">↗</span></a>
    </section>
  )
}

export function App() {
  const [theme, setTheme] = useState<Theme>('system')
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '')
  const talk = talks.find((candidate) => candidate.slug === path.replace(/^decks\//, ''))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <Layout theme={theme} onThemeChange={() => setTheme(theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system')}>
      {path === '' ? <CatalogPage /> : talk ? <TalkPage talk={talk} /> : <NotFoundPage />}
    </Layout>
  )
}
