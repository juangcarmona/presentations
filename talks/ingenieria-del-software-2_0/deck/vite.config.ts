import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  base: '/software-engineering-2_0/',
  publicDir: false,
  build: { target: 'es2022', sourcemap: false, assetsDir: 'assets', assetsInlineLimit: 0 },
})
