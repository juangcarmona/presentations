import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { entries, validateRegistry } from './build-static.mjs'

export function files(directory) {
  return readdirSync(directory).flatMap(name => { const path = resolve(directory, name); return statSync(path).isDirectory() ? files(path) : [path] })
}

function normalizeText(text) {
  return text
    .replace(/\\u([\da-f]{4})|\\x([\da-f]{2})|\\([nrt\\"'])/gi, (_, unicode, hex, escaped) => {
      if (unicode || hex) return String.fromCharCode(parseInt(unicode || hex, 16))
      return ({ n: '\n', r: '\r', t: '\t' })[escaped] ?? escaped
    })
    .replace(/&(amp|lt|gt|quot|apos|#39);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" })[entity])
    .replace(/\s+/g, ' ').trim()
}

export function assertNoAuthorNotes(notes, outputs, directory) {
  const normalizedOutputs = outputs.map(normalizeText)
  for (const block of notes.split(/^## /m).slice(1)) {
    const [id, ...lines] = block.split('\n')
    const note = lines.join('\n').trim()
    if (!note || note === '_No speaker note in original._') continue
    for (const paragraph of note.split(/\n\s*\n/)) {
      const fingerprint = normalizeText(paragraph).slice(0, 100)
      if (fingerprint && normalizedOutputs.some(text => text.includes(fingerprint))) {
        throw Error(`Author notes leaked: ${directory} / ${id}`)
      }
    }
  }
}

export function verifyStatic(root = '.', write = true) {
  validateRegistry(root)
  const dist = resolve(root, 'dist')
  const paths = ['/', ...entries.flatMap(({ slug }) => [`/${slug}/`, `/decks/${slug}/`])]
  for (const path of paths) {
    const html = readFileSync(`${dist}${path}index.html`, 'utf8')
    if (!html.includes('id="root"') || !html.includes('/assets/')) throw Error(`Invalid static entry: ${path}`)
  }
  const outputFiles = files(dist).filter(path => !path.endsWith('/site-manifest.json'))
  for (const path of outputFiles) {
    if (path.endsWith('.map') || !/\.(html|css|js|svg|png|jpg|gif)$/.test(path)) throw Error(`Unexpected distributed file: ${path}`)
    if (!/\.(html|css|js)$/.test(path)) continue
    const text = readFileSync(path, 'utf8')
    // Vite's emitted chunks use relative imports; validate every bundled asset edge.
    for (const match of text.matchAll(/(?:["'`(])((?:\/(?:software-engineering-2_0\/)?assets\/|assets\/|\.\/)[^"'`()\s]+\.(?:js|css|svg|png|jpg|gif|woff2?))(?:["'`)])/g)) {
      const asset = match[1].startsWith('./') ? resolve(path, '..', match[1]) : resolve(dist, match[1].replace(/^\//, ''))
      if (!statSync(asset, { throwIfNoEntry: false })?.isFile()) throw Error(`Missing required asset ${match[1]} in ${relative(dist, path)}`)
    }
  }
  // Author notes are inspected only by build verification, never by runtime imports.
  const outputText = outputFiles.filter(path => /\.(html|css|js)$/.test(path)).map(path => readFileSync(path, 'utf8'))
  for (const entry of entries) {
    const notes = readFileSync(resolve(root, `talks/${entry.directory}/content/speaker-notes.md`), 'utf8')
    assertNoAuthorNotes(notes, outputText, entry.directory)
  }
  const manifest = { schemaVersion: 1, entries: paths, talks: entries, assets: outputFiles.filter(path => !path.endsWith('.html')).map(path => `/${relative(dist, path)}`).sort() }
  if (write) writeFileSync(`${dist}/site-manifest.json`, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`Verified ${paths.length} static entries and ${manifest.assets.length} assets; no source maps or author notes.`)
  return manifest
}
if (process.argv[1]?.endsWith('/verify-static.mjs') || process.argv[1] === 'scripts/verify-static.mjs') verifyStatic()
