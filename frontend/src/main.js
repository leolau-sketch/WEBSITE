import { createApp, nextTick, watch } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import './catalog.css'
import './corporate.css'
import './applications.css'
import './product-document.css'
import { locale, setLocale } from './locale'
import { languageForRoute, languageLink } from './language-routing'
import SiteLink from './components/SiteLink.vue'
import { tr } from './translations'
import { localizedProduct } from './localized-product'
import { products, company, photo } from './site-data'
import { pageSchema, serializeSchema } from './seo'
import HomeView from './views/HomeView.vue'
import ProductsView from './views/ProductsView.vue'
import ProductDetailView from './views/ProductDetailView.vue'
import InformationView from './views/InformationView.vue'
import ApplicationsView from './views/ApplicationsView.vue'
import QuoteView from './views/QuoteView.vue'
import NotFoundView from './views/NotFoundView.vue'
import companyLogo from './assets/sensin-logo.png'

const routes = [
  { path: '/', component: HomeView, meta: { title: 'High-Performance Fiber & Textile Solutions', description: 'SENSIN develops high-performance fiber, yarn, thread, rope, webbing and sleeve solutions for industrial customers worldwide.' } },
  { path: '/products/', component: ProductsView, meta: { title: 'Industrial Fiber, Thread, Rope & Webbing Products', description: 'Explore SENSIN product forms in UHMWPE, aramid, PTFE and specialty fibers.' } },
  { path: '/products/:slug/', component: ProductDetailView, meta: { title: 'Product Details', description: 'Technical product information and RFQ support from SENSIN.' } },
  { path: '/materials/', component: InformationView, props: { page: 'materials' }, meta: { title: 'Performance Fiber Materials', description: 'Explore UHMWPE, aramid, PTFE and specialty fiber material solutions.' } },
  { path: '/custom-solutions/', component: InformationView, props: { page: 'custom' }, meta: { title: 'Custom Fiber & Textile Solutions', description: 'Work with SENSIN on material, construction and finishing requirements.' } },
  { path: '/manufacturing-quality/', component: InformationView, props: { page: 'quality' }, meta: { title: 'Manufacturing & Quality', description: 'See the manufacturing and quality approach behind SENSIN solutions.' } },
  { path: '/applications/', component: ApplicationsView, meta: { title: 'Industrial Applications', description: 'Fiber and textile solutions for demanding industrial applications.' } },
  { path: '/about-us/', component: InformationView, props: { page: 'about' }, meta: { title: 'About Dongguan Sensin', description: 'Dongguan Sensin supplies engineered fiber and textile solutions to B2B customers.' } },
  { path: '/request-a-quote/', component: QuoteView, meta: { title: 'Request a Quote', description: 'Send SENSIN your material, product and technical requirements.' } },
  { path: '/:pathMatch(.*)*', component: NotFoundView, meta: { title:'Page not found', description:'Explore the SENSIN product collection.' } },
]

const router = createRouter({ history: createWebHistory(), routes, async scrollBehavior(to, from, saved) {
  await nextTick()
  return saved || (to.hash ? { el: to.hash, top: 100 } : to.path === from.path ? undefined : { top: 0 })
} })
router.beforeEach(to => { setLocale(languageForRoute(to)) })
function updateMetadata(to) {
  const product = to.params.slug ? localizedProduct(products.find((item) => item.slug === to.params.slug)) : null
  const missing = Boolean(to.params.pathMatch || (to.params.slug && !product))
  document.title = missing ? `${tr('Page not found')} | SENSIN` : product ? `${product.name} | SENSIN` : `${tr(to.meta.title)} | SENSIN`
  const description = product ? product.overview : tr(to.meta.description)
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
  let meta = document.querySelector('meta[name="description"]')
  if(!meta){meta=document.createElement('meta');meta.name='description';document.head.appendChild(meta)}
  meta.content = description
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
  canonical.href = window.location.origin + languageLink(to.path,locale.value)
  document.querySelectorAll('link[data-sensin-language]').forEach(link => link.remove())
  if (!missing) for (const [language, code] of [['en','en'],['zh','zh-CN'],['en','x-default']]) {
    const alternate = document.createElement('link')
    alternate.rel = 'alternate'; alternate.hreflang = code; alternate.dataset.sensinLanguage = ''
    alternate.href = window.location.origin + languageLink(to.path,language)
    document.head.appendChild(alternate)
  }
  let robots = document.querySelector('meta[name="robots"]')
  if (!robots) { robots = document.createElement('meta'); robots.name = 'robots'; document.head.appendChild(robots) }
  robots.content = missing ? 'noindex, follow' : 'index, follow'
  const schema = pageSchema({ origin: window.location.origin, path: languageLink(to.path,locale.value), title: document.title,
    description, company, logo: companyLogo, product, photo, missing, language: document.documentElement.lang })
  let structuredData = document.getElementById('page-structured-data')
  if (!schema) structuredData?.remove()
  else {
    if (!structuredData) { structuredData = document.createElement('script'); structuredData.id = 'page-structured-data'; structuredData.type = 'application/ld+json'; document.head.appendChild(structuredData) }
    structuredData.textContent = serializeSchema(schema)
  }
}
router.afterEach(updateMetadata)
let favicon = document.querySelector('link[rel="icon"]')
if (!favicon) { favicon = document.createElement('link'); favicon.rel = 'icon'; document.head.appendChild(favicon) }
favicon.href = companyLogo
watch(locale, () => updateMetadata(router.currentRoute.value))
createApp(App).use(router).component('SiteLink',SiteLink).mount('#app')
