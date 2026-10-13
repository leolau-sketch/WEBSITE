// Read-only local HTTP checks. Never posts an RFQ or accesses private admin data.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { loadCatalog } from './load-catalog.mjs'
import { stampTemplate } from './asset-version.mjs'

const { products } = await loadCatalog()
const origin = 'http://127.0.0.1:8000'
const template = readFileSync(new URL('../../templates/index.html', import.meta.url), 'utf8')
const { version, output } = stampTemplate(template,
  readFileSync(new URL('../../static/vue/assets/index.js', import.meta.url)),
  readFileSync(new URL('../../static/vue/assets/index.css', import.meta.url)))
assert.equal(template, output, 'Run npm run build to update the Django asset version')
const pages = ['/', '/products/', '/materials/', '/custom-solutions/', '/manufacturing-quality/', '/applications/', '/about-us/', '/request-a-quote/', ...products.map(p=>`/products/${p.slug}/`)]
const languagePages = pages.flatMap(path => [path, path+'?lang=zh'])
for (const path of languagePages) {
  const response = await fetch(origin + path)
  assert.equal(response.status, 200, path)
  const html = await response.text()
  assert.match(html, /id="app"/, path)
  assert.ok(html.includes(`index.js?v=${version}`) && html.includes(`index.css?v=${version}`), `${path}: server has stale template; restart Django`)
}
const assets = readdirSync(new URL('../../static/vue/assets/', import.meta.url))
for (const name of assets) {
  const response = await fetch(`${origin}/static/vue/assets/${name}`, {method:'HEAD'})
  assert.equal(response.status, 200, name)
  if (name.endsWith('.webp')) assert.match(response.headers.get('content-type'), /image\/webp/)
}
assert.equal((await fetch(`${origin}/api/not-a-route/`)).status, 404)
assert.equal((await fetch(`${origin}/api/csrf/`)).status, 200)
console.log(`PASS: ${languagePages.length} bilingual public URLs, ${assets.length} built assets, CSRF endpoint and unknown API 404.`)
