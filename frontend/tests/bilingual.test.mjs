import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'vite'
import { fileURLToPath } from 'node:url'
import { formatErrors } from '../src/rfq-utils.js'
import { createSSRApp } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import { renderToString } from '@vue/server-renderer'

const server = await createServer({root:fileURLToPath(new URL('../',import.meta.url)),server:{middlewareMode:true,hmr:false},appType:'custom',logLevel:'error'})
const catalog = await server.ssrLoadModule('/src/site-data.js')
const { setLocale } = await server.ssrLoadModule('/src/locale.js')
const { localizedProduct, descriptions } = await server.ssrLoadModule('/src/localized-product.js')
const { tr } = await server.ssrLoadModule('/src/translations.js')
const { pageSchema } = await server.ssrLoadModule('/src/seo.js')
const { default: QuoteView } = await server.ssrLoadModule('/src/views/QuoteView.vue')
const { default: SiteLink } = await server.ssrLoadModule('/src/components/SiteLink.vue')
await server.close()

for (const product of catalog.products) test(`${product.slug}: Chinese translation preserves numeric data and source`, () => {
  const original = JSON.stringify(product)
  setLocale('zh')
  const translated = localizedProduct(product)
  assert.match(translated.name, /[\u3400-\u9fff]/)
  assert.equal(translated.overview, descriptions[product.slug])
  assert.ok(translated.overview)
  assert.deepEqual(translated.table?.rows, product.table?.rows)
  assert.deepEqual(translated.gallery, product.gallery)
  assert.equal(translated.page, product.page)
  assert.equal(translated.slug, product.slug)
  assert.deepEqual(translated.size.match(/[0-9][0-9,.–]*/g), product.size.match(/[0-9][0-9,.–]*/g))
  assert.deepEqual(translated.specs.flat().join('|').match(/[0-9][0-9,.–]*/g), product.specs.flat().join('|').match(/[0-9][0-9,.–]*/g))
  assert.ok(translated.properties.every(s => /[\u3400-\u9fff]/.test(s)))
  assert.ok(translated.applications.every(s => /[\u3400-\u9fff]/.test(s)))
  assert.equal(JSON.stringify(product), original)
  const graph = pageSchema({origin:'https://example.test',path:'/products/'+product.slug+'/',title:translated.name,description:translated.overview,company:catalog.company,logo:'/logo.png',product:translated,photo:catalog.photo,language:'zh-CN'})['@graph']
  assert.equal(graph.find(n=>n['@type']==='Product').name,translated.name)
  assert.equal(graph.find(n=>n['@type']==='ItemPage').inLanguage,'zh-CN')
  setLocale('en')
  assert.equal(localizedProduct(product),product)
})
test('safety qualifications remain explicit in Chinese', () => {
  setLocale('zh')
  assert.match(localizedProduct(catalog.products.find(p=>p.slug==='uhmwpe-fine-braided-thread')).note,/不代表获得临床使用批准/)
  assert.match(localizedProduct(catalog.products.find(p=>p.slug==='aramid-staple-fiber')).size,/询价时确认/)
  setLocale('en')
})
test('RFQ errors use safe messages in both languages and tolerate malformed errors', () => {
  const errors = { name:[{code:'required'}],business_email:[{code:'invalid'}],message:[{code:'max_length'}] }
  assert.deepEqual(formatErrors(errors,'zh'),['请填写姓名。','请输入有效的商务邮箱。','留言过长，请缩短。'])
  assert.match(formatErrors(errors,'en')[0],/Name is required/)
  assert.deepEqual(formatErrors(null,'zh'),[])
  assert.deepEqual(formatErrors({name:[null]},'zh'),['请检查姓名后重试。'])
  setLocale('zh'); assert.match(tr('Attachment must be 10 MB or smaller.'),/不能超过 10 MB/)
  setLocale('en')
})
test('Chinese RFQ renders translated labels with unchanged submission values', async () => {
  setLocale('zh')
  const router = createRouter({history:createMemoryHistory(),routes:[{path:'/request-a-quote/',component:QuoteView}]})
  await router.push('/request-a-quote/?product=aramid-sewing-thread')
  await router.isReady()
  const app = createSSRApp(QuoteView).use(router).component('SiteLink',SiteLink)
  const html = await renderToString(app)
  assert.match(html,/姓名\*/)
  assert.match(html,/商务邮箱\*/)
  assert.match(html,/提交询盘/)
  assert.match(html,/value="Aramid" selected>芳纶/)
  assert.match(html,/value="Aramid Filament Sewing Thread" selected>芳纶长丝缝纫线/)
  for (const name of ['name','company','country','business_email','whatsapp','material','product','diameter_size','required_strength','required_length','estimated_quantity','application','custom_requirements','drawing_specification_pdf','message']) assert.ok(html.includes('name="'+name+'"'),name)
  assert.match(html,/enctype="multipart\/form-data"/)
  setLocale('en')
})
