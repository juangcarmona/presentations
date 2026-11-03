import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), {
    name: 'moved-talk-dev-redirect',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const incoming = request as { url?: string }
        if (/^\/(?:decks\/)?software-engineering-2_0\/?(?:\?.*)?$/.test(incoming.url || '')) {
          const query = incoming.url?.split('?')[1]
          response.statusCode = 302
          response.setHeader('Location', `https://se2.jgcarmona.com/${query ? `?${query}` : ''}`)
          response.end()
          return
        }
        next()
      })
    },
  }],
  publicDir: false,
  build: { target: 'es2022', sourcemap: false },
})
