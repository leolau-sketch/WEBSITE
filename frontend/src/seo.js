// Only describe facts displayed on the page. RFQ products have no invented price,
// stock status, reviews, certifications or merchant offers.
export function pageSchema({ origin, path, title, description, company, logo, product, photo, missing = false, language = 'en' }) {
  if (missing) return null
  const home = new URL('/', origin).href
  const languageHome = new URL(language === 'zh-CN' ? '/?lang=zh' : '/', origin).href
  const url = new URL(path, origin).href
  const organizationId = `${home}#organization`
  const graph = [
    { '@type': 'Organization', '@id': organizationId, name: company.name, alternateName: 'SENSIN', url: home,
      logo: new URL(logo, origin).href, email: company.email, telephone: company.phone,
      address: { '@type': 'PostalAddress', streetAddress: company.address, addressCountry: 'CN' } },
    { '@type': 'WebSite', '@id': `${home}#website`, url: home, name: 'SENSIN', inLanguage: ['en','zh-CN'], publisher: { '@id': organizationId } },
    { '@type': product ? 'ItemPage' : 'WebPage', '@id': `${url}#webpage`, url, name: title, description,
      inLanguage: language, isPartOf: { '@id': `${home}#website` }, ...(product ? { mainEntity: { '@id': `${url}#product` } } : {}) },
  ]
  if (product) {
    graph.push({ '@type': 'Product', '@id': `${url}#product`, url, name: product.name,
      description: product.note ? `${product.overview} ${product.note}` : product.overview,
      image: product.gallery.map(name => new URL(photo(name), origin).href),
      material: product.material, category: product.form,
      manufacturer: { '@id': organizationId }, brand: { '@type': 'Brand', name: 'SENSIN' },
      additionalProperty: product.specs.map(([name, value]) => ({ '@type': 'PropertyValue', name, value })) })
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      { '@type': 'ListItem', position: 1, name: language === 'zh-CN' ? '首页' : 'Home', item: languageHome },
      { '@type': 'ListItem', position: 2, name: language === 'zh-CN' ? '产品中心' : 'Products', item: new URL(language === 'zh-CN' ? '/products/?lang=zh' : '/products/', origin).href },
      { '@type': 'ListItem', position: 3, name: product.name, item: url },
    ] })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function serializeSchema(schema) {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}
