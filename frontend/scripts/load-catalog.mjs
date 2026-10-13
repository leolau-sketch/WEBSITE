import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'

export async function loadCatalog() {
  const server = await createServer({
    root: fileURLToPath(new URL('../', import.meta.url)),
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
    logLevel: 'error',
  })
  try {
    return await server.ssrLoadModule('/src/site-data.js')
  } finally {
    await server.close()
  }
}
