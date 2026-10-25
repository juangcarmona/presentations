import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'

const root = resolve(process.argv[2] || 'dist')
const port = Number(process.argv[3] || 4173)
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' }
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost')
    let path = resolve(root, `.${decodeURIComponent(url.pathname)}`)
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return }
    if ((await stat(path)).isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end(); return }
      path = resolve(path, 'index.html')
    }
    response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' })
    response.end(await readFile(path))
  } catch { response.writeHead(404).end('Not found') }
}).listen(port, '127.0.0.1', () => console.log(`Static files: http://127.0.0.1:${port} (no SPA fallback)`))
