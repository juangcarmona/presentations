import type { Talk } from '../../src/talk-model'

export const talk: Talk = {
  title: 'Soft & Hard Guardrails',
  slug: 'soft-and-hard-guardrails',
  number: '02',
  eyebrow: 'technical talk',
  description:
    'The difference between guiding behaviour during development and mechanically blocking outcomes that cannot pass.',
  thesis:
    'Soft guardrails make intent easier to follow. Hard guardrails make critical invariants impossible to ignore. Reliable systems need both.',
  status: 'In development',
  meta: ['English', 'Agents', 'Engineering'],
  deckUrl: '/decks/soft-and-hard-guardrails/',
  chapters: [
    { title: 'Soft guardrails', description: 'Conventions, prompts, templates and documentation that shape behaviour before the work runs.' },
    { title: 'Hard guardrails', description: 'Tests, schemas, policies and CI checks that block unsafe outcomes mechanically.' },
    { title: 'The boundary', description: 'Use guidance to scale intent and enforcement to protect the things that must not drift.' },
  ],
  sourceUrl: 'https://github.com/juangcarmona/presentations/tree/main/talks/soft-and-hard-guardrails',
  readmeUrl: 'https://github.com/juangcarmona/presentations/blob/main/talks/soft-and-hard-guardrails/README.md',
}
