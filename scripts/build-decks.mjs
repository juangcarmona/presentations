import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = resolve(import.meta.dirname, '..')
const decks = [
  ['talks/ingenieria-del-software-2_0/deck', 'software-engineering-2_0'],
  ['talks/soft-and-hard-guardrails/deck', 'soft-and-hard-guardrails'],
]

for (const [relativeDeck, slug] of decks) {
  const deckDir = join(root, relativeDeck)
  const outputDir = join(root, 'public', 'decks', slug)

  if (!existsSync(join(deckDir, 'node_modules'))) {
    const install = spawnSync('corepack', ['pnpm', 'install', '--frozen-lockfile'], {
      cwd: deckDir,
      stdio: 'inherit',
    })
    if (install.status !== 0) process.exit(install.status ?? 1)
  }

  const build = spawnSync('corepack', [
    'pnpm', 'exec', 'slidev', 'build', 'slides.md',
    '--out', outputDir,
    '--base', `/decks/${slug}/`,
    '--router-mode', 'history',
    '--without-notes',
  ], { cwd: deckDir, stdio: 'inherit' })

  if (build.status !== 0) process.exit(build.status ?? 1)
}
