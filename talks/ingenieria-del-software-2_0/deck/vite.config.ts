import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  base: '/software-engineering-2_0/',
  publicDir: false,
  plugins: [react()],
  build: {
    outDir: fileURLToPath(new URL('../../../dist/software-engineering-2_0', import.meta.url)),
    emptyOutDir: true,
    assetsInlineLimit: 0,
    sourcemap: false,
    target: 'es2022',
  },
})
