import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const entries = [
  { slug: 'software-engineering-2_0', title: 'Ingeniería del Software 2.0', language: 'es', redirectTo: 'https://se2.jgcarmona.com/' },
  { slug: 'soft-and-hard-guardrails', directory: 'soft-and-hard-guardrails', title: 'Soft & Hard Guardrails', language: 'en' },
]
export function validateRegistry(root = '.') {
  const registry = readFileSync(resolve(root, 'src/talks.ts'), 'utf8')
  if ((registry.match(/import \{ talk as /g) || []).length !== entries.length) throw Error('Unknown talk registry mapping')
  for (const entry of entries) {
    if (entry.redirectTo) {
      const metadata = readFileSync(resolve(root, 'src/talk-se2.ts'), 'utf8')
      if (!registry.includes("'./talk-se2'") || !metadata.includes(`deckUrl: '${entry.redirectTo}'`)) throw Error('Invalid external talk mapping')
      continue
    }
    const web = readFileSync(resolve(root, `talks/${entry.directory}/web.ts`), 'utf8')
    if (!registry.includes(`../talks/${entry.directory}/web`) || !web.includes(`slug: '${entry.slug}'`) || !web.includes("import('./deck/experience')")) throw Error(`Invalid talk mapping: ${entry.directory}`)
  }
}
export function escapeHTML(text) { return text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]) }
export function buildStatic(root = '.') {
  validateRegistry(root)
  const shell = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
  for (const entry of entries) for (const prefix of ['', 'decks/']) {
    const directory = resolve(root, `dist/${prefix}${entry.slug}`)
    mkdirSync(directory, { recursive: true })
    if (entry.redirectTo) {
      writeFileSync(`${directory}/index.html`, `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="robots" content="noindex"><title>${escapeHTML(entry.title)} · moved</title><script>location.replace(${JSON.stringify(entry.redirectTo)}+location.search+location.hash)</script><p>This talk moved to <a href="${escapeHTML(entry.redirectTo)}">${escapeHTML(entry.redirectTo)}</a>.</p></html>`)
      continue
    }
    writeFileSync(`${directory}/index.html`, shell.replace(/<html[^>]*>/, `<html lang="${entry.language}">`).replace(/<title>.*?<\/title>/s, `<title>${escapeHTML(entry.title)}</title>`))
  }
}
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) buildStatic()
