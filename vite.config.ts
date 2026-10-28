import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), {
    name: 'standalone-talk-dev-entry',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const incoming = request as { url?: string }
        if (/^\/(?:decks\/)?software-engineering-2_0\/?(?:\?.*)?$/.test(incoming.url || '')) {
          incoming.url = '/talks/ingenieria-del-software-2_0/deck/index.html'
        }
        next()
      })
    },
  }],
  publicDir: false,
  build: { target: 'es2022', sourcemap: false },
})
