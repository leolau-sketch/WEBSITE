import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { applications, applicationLink } from '../src/application-data.js'
import { loadCatalog } from '../scripts/load-catalog.mjs'
import { languageLink } from '../src/language-routing.js'
const { products } = await loadCatalog()
test('six unique bilingual catalog-backed application groups', () => {
  assert.equal(applications.length,6)
  assert.equal(new Set(applications.map(a=>a.slug)).size,6)
  for(const item of applications){
    assert.ok(item.en && item.zh)
    for(const field of ['summary','examples','review']) assert.ok(item[field].length===2 && item[field].every(Boolean))
    assert.ok(item.pages.every(page=>page>=7 && page<=24))
    assert.ok(existsSync(new URL(`../src/assets/catalog/${item.image}.webp`,import.meta.url)))
    assert.ok(item.products.length>=2 && item.products.every(slug=>products.some(p=>p.slug===slug)))
    assert.deepEqual(applicationLink(item),{path:'/applications/',hash:`#${item.slug}`})
    assert.equal(languageLink(applicationLink(item),'zh').query.lang,'zh')
    assert.equal(languageLink(applicationLink(item),'zh').hash,`#${item.slug}`)
  }
})
test('safety-critical catalog examples remain qualified', () => {
  assert.match(applications.find(a=>a.slug==='protective-outdoor').review[0],/not certification/)
  assert.match(applications.find(a=>a.slug==='marine-fishing').review[0],/not a working load limit/)
  assert.match(applications.find(a=>a.slug==='chemical-filtration').review[0],/compliance evidence/)
})
