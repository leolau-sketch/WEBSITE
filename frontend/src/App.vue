<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import companyLogo from './assets/sensin-logo.png'
import { company, products } from './site-data'
import { locale, t } from './locale'
import { languageQuery } from './language-routing'
import { productName } from './product-labels'
import { createPageMotion } from './page-motion'
import { applications, applicationLink } from './application-data'
const mainContent = ref(null)
let pageMotion
onMounted(() => { pageMotion = createPageMotion(mainContent.value); pageMotion.enter() })
onBeforeUnmount(() => pageMotion?.dispose())
const menuOpen = ref(false)
const menuButton = ref(null)
const expanded = ref(null)
const route = useRoute()
watch(() => route.path, () => pageMotion?.enter(), {flush:'post'})
const router = useRouter()
function changeLanguage(value) { router.push({path: route.path,query:languageQuery(route.query,value),hash:route.hash}) }
function hoverMenu(index, event) { if (event.pointerType === 'mouse' && window.innerWidth > 1050) expanded.value = index }
function toggleSubmenu(index) { expanded.value = window.innerWidth > 1050 ? index : expanded.value === index ? null : index }
function closeMenu() { menuOpen.value = false; expanded.value = null }
watch(() => route.fullPath, closeMenu)
function dismissMenu(event) {
  const trigger = event.target.closest('.nav-group')?.querySelector('button')
  closeMenu()
  ;(trigger || menuButton.value)?.focus()
}
const nav = [
  { en:'Products', zh:'产品中心', to:'/products/', children: ['UHMWPE','Aramid','PTFE'].map(material => ({en:material,zh:material === 'Aramid' ? 'Aramid 芳纶' : material,to:{path:'/products/',query:{material}}})) },
  { en:'Materials', zh:'材料方案', to:'/materials/' },
  { en:'Solutions', zh:'定制方案', to:'/custom-solutions/' },
  { en:'Applications', zh:'应用领域', to:'/applications/', children:applications.map(item=>({en:item.en,zh:item.zh,to:applicationLink(item)})) },
  { en:'Manufacturing', zh:'制造与品质', to:'/manufacturing-quality/' },
  { en:'About Us', zh:'关于盛芯', to:'/about-us/' },
]
const materialNames = { UHMWPE:'超高分子量聚乙烯', Aramid:'芳纶', PTFE:'聚四氟乙烯' }
</script>
<template>
  <a class="skip-link" href="#main-content">{{ t('Skip to content','跳转至正文') }}</a>
  <header class="site-header corporate-header" @keydown.esc="dismissMenu">
    <div class="shell header-inner">
      <SiteLink class="brand" to="/" :aria-label="t('SENSIN home','盛芯首页')" @click="closeMenu"><img class="brand-logo" :src="companyLogo" alt="SENSIN"><span><strong>{{ t('SENSIN','盛芯 SENSIN') }}</strong><small>{{ t('HIGH-PERFORMANCE TEXTILES','高性能纤维 · 绳带解决方案') }}</small></span></SiteLink>
      <div class="language-switch" aria-label="Language / 语言"><button :aria-pressed="locale==='en'" @click="changeLanguage('en')">EN</button><span>/</span><button :aria-pressed="locale==='zh'" @click="changeLanguage('zh')">中文</button></div>
      <button ref="menuButton" class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="main-navigation" :aria-label="t('Toggle navigation','展开导航')" @click="menuOpen = !menuOpen"><span></span><span></span><span></span></button>
      <nav id="main-navigation" class="main-nav" :class="{'is-open':menuOpen}" :aria-label="t('Main navigation','主导航')">
        <SiteLink to="/" @click="closeMenu">{{ t('Home','首页') }}</SiteLink>
        <div v-for="(item,index) in nav" :key="item.to" class="nav-group" @pointerenter="hoverMenu(index,$event)" @pointerleave="expanded=null" @focusout="!$event.currentTarget.contains($event.relatedTarget) && (expanded=null)">
          <div class="nav-label"><SiteLink :to="item.to" @click="closeMenu">{{ t(item.en,item.zh) }}</SiteLink><button v-if="item.children" :aria-label="t('Expand '+item.en,'展开'+item.zh)" :aria-expanded="expanded===index" :aria-controls="'submenu-'+index" @click="toggleSubmenu(index)">⌄</button></div>
          <div v-if="item.children" :id="'submenu-'+index" class="nav-dropdown" :class="{'is-expanded':expanded===index}" :inert="expanded!==index"><SiteLink v-for="child in item.children" :key="child.en" :to="child.to" @click="closeMenu">{{ t(child.en,child.zh) }} <span>→</span></SiteLink></div>
        </div>
        <SiteLink class="nav-cta" to="/request-a-quote/" @click="closeMenu">{{ t('Request a Quote','获取报价') }} ↗</SiteLink>
      </nav>
    </div>
  </header>
  <main ref="mainContent" id="main-content" tabindex="-1"><RouterView /></main>
  <footer class="corporate-footer">
    <div class="shell footer-directory">
      <section v-for="material in ['UHMWPE','Aramid','PTFE']" :key="material"><h2>{{ t(material,materialNames[material]) }}</h2><SiteLink v-for="product in products.filter(p=>p.material===material)" :key="product.slug" :to="'/products/'+product.slug+'/'">{{ productName(product) }}</SiteLink></section>
      <section><h2>{{ t('Solutions','解决方案') }}</h2><SiteLink to="/materials/">{{ t('Material expertise','材料选择') }}</SiteLink><SiteLink to="/custom-solutions/">{{ t('Custom processing','定制加工') }}</SiteLink><SiteLink to="/applications/">{{ t('Applications','应用领域') }}</SiteLink><SiteLink to="/manufacturing-quality/">{{ t('Manufacturing & Quality','制造与品质') }}</SiteLink></section>
      <section><h2>{{ t('Contact','联系盛芯') }}</h2><SiteLink to="/about-us/">{{ t('About Shengxin','关于盛芯') }}</SiteLink><SiteLink to="/request-a-quote/">{{ t('Request a Quote','获取报价') }}</SiteLink><a :href="'mailto:'+company.email">{{ company.email }}</a><a href="https://wa.me/8615827308889" target="_blank" rel="noopener">WhatsApp ↗</a><div class="marketplace-placeholder"><a href="https://shengxintech.en.alibaba.com/?spm=a2700.micro_cgs_home.0.0.2ef43e5fVFndbt" target="_blank" rel="noopener noreferrer">Alibaba</a></div></section>
    </div>
    <div class="shell corporate-footer-bottom"><span>{{ t('Dongguan, China · High-performance fiber & textile solutions','中国 · 东莞｜高性能纤维与纺织解决方案') }}</span><span>© {{ new Date().getFullYear() }} {{ t(company.name,'东莞市盛芯特种绳带有限公司') }}</span></div>
  </footer>
</template>
