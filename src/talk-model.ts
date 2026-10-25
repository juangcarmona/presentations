export type TalkChapter = {
  title: string
  description: string
}

export type Talk = {
  load: () => Promise<{ default: import('./experience-model').Experience }>
  title: string
  slug: string
  number: string
  eyebrow: string
  description: string
  thesis: string
  status: string
  meta: string[]
  chapters: TalkChapter[]
  deckUrl: string
  sourceUrl: string
  readmeUrl: string
  featured?: boolean
}
