import test from 'node:test'
import assert from 'node:assert/strict'
import { languageLink, languageForRoute, languageQuery } from '../src/language-routing.js'
test('language URLs round-trip without requiring new server routes', () => {
  for (const path of ['/','/products/','/products/uhmwpe-fiber/','/request-a-quote/']) {
    const zh = languageLink(path,'zh')
    assert.equal(zh,path+'?lang=zh')
    assert.equal(languageLink(zh,'zh'),zh)
    assert.equal(languageLink(zh,'en'),path)
  }
  assert.equal(languageForRoute({query:{lang:'zh'}}),'zh')
  assert.equal(languageForRoute({query:{lang:'other'}}),'en')
  assert.equal(languageForRoute({query:{lang:['zh','en']}}),'en')
})
test('links preserve filters and anchors without touching admin/API/external destinations', () => {
  assert.equal(languageLink('/products/?material=PTFE#list','zh'),'/products/?material=PTFE&lang=zh#list')
  const to = {path:'/request-a-quote/',query:{product:'aramid-fiber'},hash:'#form'}
  assert.deepEqual(languageLink(to,'zh'),{...to,query:{product:'aramid-fiber',lang:'zh'}})
  assert.equal(to.query.lang,undefined)
  assert.deepEqual(languageQuery({lang:'zh',material:'PTFE'},'en'),{material:'PTFE'})
  assert.deepEqual(languageQuery({},'zh'),{lang:'zh'})
  for (const path of ['/admin/','/api/rfq/','/static/vue/assets/logo.png','/media/file.pdf','mailto:test@example.com','https://example.com/','//example.com/','#specifications']) assert.equal(languageLink(path,'zh'),path)
})
