import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { locale, setLocale, t } from '../src/locale.js'
test('language switches safely and rejects unsupported values', () => {
  setLocale('zh'); assert.equal(t('Products','产品'),'产品')
  setLocale('invalid'); assert.equal(locale.value,'zh')
  setLocale('en'); assert.equal(t('Products','产品'),'Products')
})
test('redesigned shell uses no reference-site assets or outbound store URL', () => {
  for (const file of ['App.vue','views/HomeView.vue','corporate.css']) {
    const source = readFileSync(new URL('../src/'+file, import.meta.url),'utf8')
    assert.doesNotMatch(source, /bjtyz|made-in-china|tongyizhong|京ICP备/i)
  }
})
