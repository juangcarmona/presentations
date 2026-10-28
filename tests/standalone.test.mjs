import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { createHash } from 'node:crypto'

const deck = 'talks/ingenieria-del-software-2_0/deck'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')

test('every approved original asset is published byte-for-byte in talk-owned output', () => {
  const originals = readdirSync(`${deck}/public`)
  assert.equal(originals.length, 10)
  const built = readdirSync(`${deck}/dist/assets`).map(name => hash(readFileSync(`${deck}/dist/assets/${name}`)))
  for (const name of originals) assert.ok(built.includes(hash(readFileSync(`${deck}/public/${name}`))), name)
  for (const prefix of ['', 'decks/']) {
    const files = readdirSync(`dist/${prefix}software-engineering-2_0/assets`).map(name => hash(readFileSync(`dist/${prefix}software-engineering-2_0/assets/${name}`)))
    for (const original of built) assert.ok(files.includes(original))
  }
})

test('catalogue metadata and bundles do not own the Spanish renderer or narrative', () => {
  const metadata = readFileSync('talks/ingenieria-del-software-2_0/web.ts', 'utf8')
  assert.doesNotMatch(metadata, /import\(|deck\/experience/)
  for (const name of readdirSync('dist/assets').filter(name => name.endsWith('.js'))) {
    assert.doesNotMatch(readFileSync(`dist/assets/${name}`, 'utf8'), /BR-REFUND-001|pdac-authority-and-learning|keynote-enter/)
  }
})
