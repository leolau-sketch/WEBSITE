import {test} from 'node:test'
import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import {loadCatalog} from '../scripts/load-catalog.mjs'
import {isFinishedProduct,finishedFirst} from '../src/product-display.js'
const {products}=await loadCatalog()
test('finished-first order keeps all catalog products and does not mutate source',()=>{
 const original=products.map(p=>p.slug)
 const ordered=finishedFirst(products)
 assert.deepEqual(products.map(p=>p.slug),original)
 assert.equal(ordered.length,23)
 const finished=ordered.filter(isFinishedProduct)
 assert.ok(finished.length>10 && finished.length<23)
 assert.ok(ordered.slice(0,finished.length).every(isFinishedProduct))
 assert.ok(ordered.slice(finished.length).every(p=>['Fiber','Yarn'].includes(p.form)))
})
test('all twelve user-selected application illustrations have local optimized assets',()=>{
 for(const name of ['textile','pharmaceutical','food','refining','dye','aerospace','occupational','marine','electroplating','protection','aquaculture','automotive'])
   assert.ok(existsSync(new URL(`../src/assets/applications/${name}.webp`,import.meta.url)))
})
