import { test } from 'node:test'
import assert from 'node:assert/strict'
import { stampTemplate } from '../scripts/asset-version.mjs'
import { pageSchema, serializeSchema } from '../src/seo.js'
import { loadCatalog } from '../scripts/load-catalog.mjs'

const catalog = await loadCatalog()
const template = `<link href="{% static 'vue/assets/index.css' %}?v=old"><script src="{% static 'vue/assets/index.js' %}?v=old"></script>`
test('build stamp is deterministic and idempotent and preserves other template content', () => {
  const stamped = stampTemplate(template, 'js', 'css')
  assert.match(stamped.version, /^[a-f0-9]{16}$/)
  assert.equal(stampTemplate(stamped.output, 'js', 'css').output, stamped.output)
  assert.equal(stamped.output, template.replaceAll('v=old', `v=${stamped.version}`))
})
test('changes to either script or style invalidate the version', () => {
  const version = stampTemplate(template, 'js', 'css').version
  assert.notEqual(stampTemplate(template, 'new js', 'css').version, version)
  assert.notEqual(stampTemplate(template, 'js', 'new css').version, version)
})
test('missing or duplicate entries fail instead of silently corrupting the template', () => {
  assert.throws(() => stampTemplate('no assets', 'js', 'css'))
  assert.throws(() => stampTemplate(template + template, 'js', 'css'))
  assert.throws(() => stampTemplate(template.replace('index.js', 'index.j'), 'js', 'css'))
})
const base = { origin: 'https://example.com', path: '/', title: 'SENSIN', description: 'Industrial materials',
  company: catalog.company, logo: '/static/vue/assets/sensin-logo.png', photo: name => `/static/vue/assets/${name}.webp` }
for (const product of catalog.products) test(`${product.slug}: schema matches visible catalog facts, without fake commerce data`, () => {
  const schema = pageSchema({...base, product, path: `/products/${product.slug}/`})
  const entity = schema['@graph'].find(e => e['@type'] === 'Product')
  assert.equal(entity.name, product.name)
  assert.equal(entity.material, product.material)
  assert.equal(entity.image.length, product.gallery.length)
  assert.ok(entity.image.every(url => url.startsWith('https://example.com/static/vue/')))
  assert.equal(entity.additionalProperty.length, product.specs.length)
  for (const key of ['offers', 'aggregateRating', 'review', 'sku', 'mpn']) assert.equal(entity[key], undefined)
  if (product.note) assert.ok(entity.description.includes(product.note))
  assert.deepEqual(schema['@graph'].find(e=>e['@type']==='BreadcrumbList').itemListElement.map(e=>e.position), [1,2,3])
})
test('non-product and invalid pages do not retain product schema', () => {
  assert.equal(pageSchema({...base, missing:true}), null)
  assert.ok(!pageSchema(base)['@graph'].some(e=>e['@type']==='Product'))
})
test('JSON-LD serialization cannot prematurely close a script element', () => {
  const schema = {name:'</script><script>alert(1)</script>'}
  assert.ok(!serializeSchema(schema).includes('<'))
  assert.deepEqual(JSON.parse(serializeSchema(schema)), schema)
})
