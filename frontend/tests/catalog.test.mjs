import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { loadCatalog } from '../scripts/load-catalog.mjs'
import { attachmentError, maxAttachmentSize, allowedAttachmentExtensions, formatErrors } from '../src/rfq-utils.js'

const { products, materials, photo, quoteLink } = await loadCatalog()

test('catalog has 23 unique product routes in the three reviewed material families', () => {
  assert.equal(products.length, 23)
  assert.equal(new Set(products.map(p => p.slug)).size, 23)
  assert.deepEqual(materials.map(m => [m.name, products.filter(p => p.material === m.name).length]), [['UHMWPE',8],['Aramid',9],['PTFE',6]])
})

for (const p of products) test(`${p.slug}: real photos, source, specifications and RFQ route`, () => {
  assert.match(p.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  assert.ok(p.name && p.overview && p.applications.length && p.properties.length)
  assert.ok(p.page >= 7 && p.page <= 24)
  assert.ok(p.specs.length >= 3)
  assert.ok(p.specs.every(row => row.length === 2 && row.every(Boolean)))
  assert.ok(p.gallery.includes(p.image))
  for (const name of p.gallery) {
    assert.ok(photo(name), `${name}: Vite asset URL`)
    assert.ok(existsSync(new URL(`../src/assets/catalog/${name}.webp`, import.meta.url)), `${name}: image file`)
  }
  if (p.table) assert.ok(p.table.rows.every(row => row.length === p.table.headings.length && row.every(Boolean)))
  assert.deepEqual(quoteLink(p), { path: '/request-a-quote/', query: { product: p.slug } })
})

test('sensitive or contradictory catalog content stays qualified', () => {
  assert.match(products.find(p => p.slug === 'uhmwpe-fine-braided-thread').note, /does not establish approval/)
  assert.match(products.find(p => p.slug === 'aramid-staple-fiber').size, /confirm/)
})

test('attachment validation accepts allowed formats, including uppercase, up to 10 MB', () => {
  assert.equal(attachmentError(null), '')
  for (const ext of allowedAttachmentExtensions) assert.equal(attachmentError({name:`drawing.${ext.toUpperCase()}`,size:maxAttachmentSize}), '')
})

test('attachment validation rejects oversized or unsupported files', () => {
  assert.match(attachmentError({name:'drawing.pdf',size:maxAttachmentSize+1}), /10 MB/)
  for (const name of ['drawing', 'drawing.pdf.exe', 'drawing.svg']) assert.match(attachmentError({name,size:1}), /Choose a PDF/)
})

test('public RFQ errors stay readable in English', () => {
  assert.deepEqual(formatErrors({name:[{code:'required',message:'这个字段是必填项。'}]}), ['Name is required.'])
  assert.deepEqual(formatErrors({business_email:[{code:'invalid',message:'请输入有效地址。'}]}), ['Please enter a valid business email.'])
  assert.deepEqual(formatErrors({company:[{code:'max_length',message:'太长'}]}), ['Company is too long. Please shorten it.'])
  assert.deepEqual(formatErrors({drawing_specification_pdf:[{code:'',message:'Attachment must be 10 MB or smaller.'}]}), ['Attachment must be 10 MB or smaller.'])
  assert.deepEqual(formatErrors({company:'bad shape'}), [])
})
