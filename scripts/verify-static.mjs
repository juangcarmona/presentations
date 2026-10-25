import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { entries, validateRegistry } from './build-static.mjs'

export function files(directory) {
  return readdirSync(directory).flatMap(name => { const path = resolve(directory, name); return statSync(path).isDirectory() ? files(path) : [path] })
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
    if (path.endsWith('.map') || !/\.(html|css|js)$/.test(path)) throw Error(`Unexpected distributed file: ${path}`)
    const text = readFileSync(path, 'utf8')
    // Vite's emitted chunks use relative imports; validate every bundled asset edge.
    for (const match of text.matchAll(/(?:["'`(])((?:\/?assets\/|\.\/)[^"'`()\s]+\.(?:js|css|svg|png|jpg|gif|woff2?))(?:["'`)])/g)) {
      const asset = match[1].startsWith('./') ? resolve(path, '..', match[1]) : resolve(dist, match[1].replace(/^\//, ''))
      if (!statSync(asset, { throwIfNoEntry: false })?.isFile()) throw Error(`Missing required asset ${match[1]} in ${relative(dist, path)}`)
    }
  }
  // Author notes are inspected only by build verification, never by runtime imports.
  for (const entry of entries) {
    const notes = readFileSync(resolve(root, `talks/${entry.directory}/content/speaker-notes.md`), 'utf8')
    for (const block of notes.split(/^## /m).slice(1)) {
      const note = block.split('\n').slice(2).join('\n').trim()
      if (note.length > 80 && outputFiles.some(path => readFileSync(path, 'utf8').includes(note.slice(0, 100)))) throw Error(`Author notes leaked: ${entry.directory}`)
    }
  }
  const manifest = { schemaVersion: 1, entries: paths, talks: entries, assets: outputFiles.filter(path => !path.endsWith('.html')).map(path => `/${relative(dist, path)}`).sort() }
  if (write) writeFileSync(`${dist}/site-manifest.json`, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`Verified ${paths.length} static entries and ${manifest.assets.length} assets; no source maps or author notes.`)
  return manifest
}
if (process.argv[1]?.endsWith('/verify-static.mjs') || process.argv[1] === 'scripts/verify-static.mjs') verifyStatic()
