import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

export const entries = [
  { slug: 'software-engineering-2_0', directory: 'ingenieria-del-software-2_0', title: 'Ingeniería del Software 2.0', language: 'es' },
  { slug: 'soft-and-hard-guardrails', directory: 'soft-and-hard-guardrails', title: 'Soft & Hard Guardrails', language: 'en' },
]
export function validateRegistry(root = '.') {
  const registry = readFileSync(resolve(root, 'src/talks.ts'), 'utf8')
  if ((registry.match(/import \{ talk as /g) || []).length !== entries.length) throw Error('Unknown talk registry mapping')
  for (const entry of entries) {
    const web = readFileSync(resolve(root, `talks/${entry.directory}/web.ts`), 'utf8')
    if (!registry.includes(`../talks/${entry.directory}/web`) || !web.includes(`slug: '${entry.slug}'`)) throw Error(`Invalid talk mapping: ${entry.directory}`)
  }
}
export function escapeHTML(text) { return text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]) }
export function buildStatic(root = '.') {
  validateRegistry(root)
  const shell = readFileSync(resolve(root, 'dist/index.html'), 'utf8')
  for (const entry of entries) for (const prefix of ['', 'decks/']) {
    const directory = resolve(root, `dist/${prefix}${entry.slug}`)
    mkdirSync(directory, { recursive: true })
    const source = entry.language === 'es' ? readFileSync(resolve(root, `dist/${entry.slug}/index.html`), 'utf8') : shell
    writeFileSync(`${directory}/index.html`, source.replace(/<html[^>]*>/, `<html lang="${entry.language}">`).replace(/<title>.*?<\/title>/s, `<title>${escapeHTML(entry.title)}</title>`))
  }
}
if (import.meta.url === pathToFileURL(resolve(process.argv[1])).href) buildStatic()
