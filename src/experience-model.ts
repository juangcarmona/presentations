import type { ReactNode } from 'react'

export type Scene = { id: string; title: string; content: ReactNode }
export type Experience = { language: 'en' | 'es'; scenes: Scene[] }
