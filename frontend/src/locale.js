import { ref } from 'vue'
let saved = 'en'
try { saved = globalThis.localStorage?.getItem('sensin-language') || 'en' } catch {}
export const locale = ref(saved === 'zh' ? 'zh' : 'en')
export const t = (en, zh) => locale.value === 'zh' ? zh : en
export function setLocale(value) {
  if (!['en', 'zh'].includes(value)) return
  locale.value = value
  try { globalThis.localStorage?.setItem('sensin-language', value) } catch {}
}
