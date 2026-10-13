// Query-based language URLs work with the existing Django route allowlist.
export const languageForRoute = route => route.query?.lang === 'zh' ? 'zh' : 'en'
export function languageQuery(query = {}, language) {
  const next = {...query}
  if (language === 'zh') next.lang = 'zh'
  else delete next.lang
  return next
}
export function languageLink(to, language) {
  if (typeof to === 'string') {
    if (!to.startsWith('/') || to.startsWith('//') || /^\/(admin|api|static|media)(\/|$)/.test(to)) return to
    const url = new URL(to,'https://local.invalid')
    if (language === 'zh') url.searchParams.set('lang','zh')
    else url.searchParams.delete('lang')
    return url.pathname + url.search + url.hash
  }
  return to ? { ...to, query: languageQuery(to.query, language) } : to
}
