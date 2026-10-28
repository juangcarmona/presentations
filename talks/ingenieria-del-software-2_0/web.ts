import type { Talk } from '../../src/talk-model'

export const talk: Talk = {
  standalone: true,
  title: 'Software Engineering 2.0',
  slug: 'software-engineering-2_0',
  number: '01',
  eyebrow: 'technical talk',
  description:
    'Designing, building and validating AI-powered products without letting speed destroy intent, architecture or evidence.',
  thesis:
    'AI changes the cost of producing software. It does not remove the need to decide what should be built, how it fits together, or how we know it works.',
  status: 'Presented · Albacete 2026',
  meta: ['60 min', 'Spanish', 'Software + AI'],
  deckUrl: '/decks/software-engineering-2_0/',
  chapters: [
    { title: 'The speed trap', description: 'When output becomes abundant, direction and constraints become the scarce resources.' },
    { title: 'A system around the model', description: 'Product intent, architecture, guardrails and an agentic workflow working as one system.' },
    { title: 'Evidence is the finish line', description: 'Validation is not a final ceremony; it is how the system earns the right to ship.' },
  ],
  sourceUrl: 'https://github.com/juangcarmona/presentations/tree/main/talks/ingenieria-del-software-2_0',
  readmeUrl: 'https://github.com/juangcarmona/presentations/blob/main/talks/ingenieria-del-software-2_0/README.md',
  featured: true,
}
