import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { entries, escapeHTML, validateRegistry } from '../scripts/build-static.mjs'
import { verifyStatic, assertNoAuthorNotes } from '../scripts/verify-static.mjs'

test('registry and five physical entries have complete assets', () => {
  validateRegistry()
  const manifest = verifyStatic('.', false)
  assert.equal(manifest.entries.length, 5)
  assert.equal(manifest.talks.length, 2)
  assert.ok(manifest.assets.some(name => name.includes('experience')))
  assert.ok(manifest.assets.some(name => name.startsWith('/software-engineering-2_0/assets/') && name.endsWith('.js')))
  assert.equal(manifest.assets.filter(name => /\.(png|jpg|gif|svg)$/.test(name)).length, 10)
  assert.equal(escapeHTML('<"a&b\'>'), '&lt;&quot;a&amp;b&#39;&gt;')
})

test('one public locked dependency graph, without presentation frameworks or local resolutions', () => {
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'))
  for (const [path, dependency] of Object.entries(lock.packages)) {
    assert.doesNotMatch(path, /slidev|reveal\.js|impress\.js/)
    if (dependency.resolved) assert.ok(dependency.resolved.startsWith('https://registry.npmjs.org/'), `${path} must resolve publicly`)
  }
  for (const entry of entries) for (const file of ['package.json', 'pnpm-lock.yaml', 'slides.md']) assert.equal(existsSync(`talks/${entry.directory}/deck/${file}`), false)
  assert.equal(existsSync('scripts/build-decks.mjs'), false)
})

test('coverage and author notes account for every original source unit', () => {
  const baseline = JSON.parse(readFileSync('tests/fixtures/migration.json', 'utf8'))
  assert.equal(baseline.scenes.length, 39)
  for (const entry of entries) {
    const scenes = baseline.scenes.filter(scene => scene.directory === entry.directory)
    assert.equal(scenes.length, entry.language === 'es' ? 24 : 15)
    const coverage = readFileSync(`talks/${entry.directory}/content/coverage.md`, 'utf8')
    const notes = readFileSync(`talks/${entry.directory}/content/speaker-notes.md`, 'utf8')
    for (const scene of scenes) {
      assert.ok(coverage.includes(`deck/${scene.source} |`), scene.source)
      assert.ok(coverage.includes(`\`${scene.id}\``))
      assert.ok(notes.includes(`## ${scene.id}\n`))
    }
  }
})

test('author-note audit rejects short and escaped notes without publishing note text in diagnostics', () => {
  const note = 'Private rehearsal: say "hello".\nPause here.'
  const notes = `# Author notes\n\n## cover\n\n${note}\n`
  for (const output of [note, JSON.stringify(note), JSON.stringify(note).replace('Private', '\\u0050rivate'), note.replaceAll('"', '&quot;').replaceAll('\n', ' ')]) {
    assert.throws(() => assertNoAuthorNotes(notes, [output], 'fixture-talk'), {
      message: 'Author notes leaked: fixture-talk / cover',
    })
  }
  assert.doesNotThrow(() => assertNoAuthorNotes(notes, ['Public scene content'], 'fixture-talk'))
  assert.doesNotThrow(() => assertNoAuthorNotes('## cover\n\n_No speaker note in original._\n', ['Public scene content'], 'fixture-talk'))
})
