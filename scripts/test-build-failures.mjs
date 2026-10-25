import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { verifyStatic } from './verify-static.mjs'

mkdirSync('test-results', { recursive: true })
const fixture = mkdtempSync(resolve('test-results/build-failure-'))
try {
  for (const path of ['src', 'talks', 'scripts', 'index.html', 'package.json', 'vite.config.ts', ...readdirSync('.').filter(name => /^tsconfig.*\.json$/.test(name))]) cpSync(path, resolve(fixture, path), { recursive: true })
  symlinkSync(resolve('node_modules'), resolve(fixture, 'node_modules'), 'dir')
  const talk = resolve(fixture, 'talks/soft-and-hard-guardrails/deck/experience.tsx')
  const source = readFileSync(talk, 'utf8')
  for (const [name, invalid, diagnostic] of [
    ['invalid-talk', '\nconst broken: string = 42\n', /experience\.tsx/],
    ['missing-asset', '\nimport absentAsset from "./required-but-missing.svg"\nconsole.log(absentAsset)\n', /required-but-missing/],
  ]) {
    writeFileSync(talk, source + invalid)
    const result = spawnSync('npm', ['run', 'build'], { cwd: fixture, encoding: 'utf8' })
    writeFileSync(`test-results/${name}.log`, result.stdout + result.stderr)
    assert.notEqual(result.status, 0, `${name} must fail the complete root build`)
    assert.match(result.stdout + result.stderr, diagnostic)
    console.log(`PASS: ${name} fails the complete root build with a talk diagnostic`)
  }
  writeFileSync(talk, source)
  cpSync('dist', resolve(fixture, 'dist'), { recursive: true })
  const asset = readdirSync(resolve(fixture, 'dist/assets')).find(name => name.endsWith('.js'))
  rmSync(resolve(fixture, `dist/assets/${asset}`))
  assert.throws(() => verifyStatic(fixture, false), /Missing required asset/)
  console.log('PASS: missing emitted asset fails static output verification')
} finally { rmSync(fixture, { recursive: true, force: true }) }
