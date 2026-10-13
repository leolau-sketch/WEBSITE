<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products, materials } from '../site-data'
import { t, locale } from '../locale'
import { languageQuery } from '../language-routing'
import { productName, productLabel } from '../product-labels'
import ProductCard from '../components/ProductCard.vue'
import QuoteBand from '../components/QuoteBand.vue'
import { isFinishedProduct, finishedFirst } from '../product-display'
const route = useRoute(), router = useRouter()
const query = ref('')
const filters = ['All', ...materials.map(m => m.name)]
const forms = ['All forms', ...new Set(products.map(p => p.form))]
const material = computed(() => filters.includes(route.query.material) ? route.query.material : 'All')
const form = computed(() => forms.includes(route.query.form) ? route.query.form : 'All forms')
const collection = computed(() => route.query.collection === 'all' || ['Fiber','Yarn'].includes(form.value) ? 'all' : 'finished')
function filter(key, value) {
  const next = {...route.query}; if(value === 'All' || value === 'All forms') delete next[key]; else next[key]=value
  router.replace({query:next})
}
const filtered = computed(() => finishedFirst(products.filter(p => (collection.value === 'all' || isFinishedProduct(p)) && (material.value === 'All' || p.material === material.value) && (form.value === 'All forms' || p.form === form.value) && [p.name,productName(p),p.material,productLabel(p.form),p.size].join(' ').toLowerCase().includes(query.value.toLowerCase().trim()))))
function reset(){query.value='';router.replace({query:languageQuery({},locale.value)})}
</script>
<template>
  <section class="collection-heading shell"><p class="eyebrow">{{ t("The SENSIN collection / 2026","盛芯产品系列 / 2026") }}</p><div><h1>{{ t("Performance, in every form.","多种形态，同样专注。") }}</h1><p>{{ t("Explore our high-performance fibers and finished textile products.","探索高性能纤维与成品纺织制品。") }}<br>{{ t("Find a starting point. Make it your specification.","从材料出发，确定适合您的产品规格。") }}</p></div></section>
  <section class="shell collection-layout">
    <aside class="collection-filters"><h2>{{ t("Explore products","探索产品") }}</h2><div class="filter-group"><h3>{{ t("Material","材料") }}</h3><button v-for="item in filters" :key="item" :class="{selected:material===item}" :aria-pressed="material===item" @click="filter('material',item)"><span>{{ item === 'All' ? t('All materials','全部材料') : productLabel(item) }}</span><small>{{ item === 'All' ? products.length : products.filter(p=>p.material===item).length }}</small></button></div><div class="filter-group"><h3>{{ t("Product form","产品形态") }}</h3><button v-for="item in forms" :key="item" :class="{selected:form===item}" :aria-pressed="form===item" @click="filter('form',item)">{{ productLabel(item) }}</button></div><div class="filter-help"><span>{{ t("TAILORED TO YOUR PROJECT","根据您的项目定制") }}</span><h3>{{ t("Need something specific?","有特殊规格要求？") }}</h3><p>{{ t("Send a drawing or specification. Let's review your custom requirements.","提供图纸或规格，与我们讨论定制需求。") }}</p><SiteLink class="text-link" to="/request-a-quote/">{{ t("Discuss your project ↗","沟通您的项目 ↗") }}</SiteLink></div></aside>
    <div class="collection-results"><div class="product-collection-switch"><button :class="{selected:collection==='finished'}" :aria-pressed="collection==='finished'" @click="router.replace({query:languageQuery({material:route.query.material},locale)})">{{t('Finished textile products','成品纺织制品')}}</button><button :class="{selected:collection==='all'}" :aria-pressed="collection==='all'" @click="filter('collection','all')">{{t('All products & raw materials','全部产品与原材料')}}</button></div><div class="collection-toolbar"><p aria-live="polite"><strong>{{ filtered.length }}</strong> {{ t(filtered.length === 1 ? 'product' : 'products','项产品') }} <span>/ {{ material === 'All' ? t('All materials','全部材料') : productLabel(material) }}</span></p><label class="product-search"><span class="sr-only">{{ t('Search products','搜索产品') }}</span><input v-model="query" type="search" :placeholder="t('Search by product or size…','搜索产品或尺寸…')" :aria-label="t('Search products','搜索产品')"><span aria-hidden="true">⌕</span></label></div><div class="catalog-grid"><ProductCard v-for="product in filtered" :key="product.slug" :product="product"/></div><div v-if="!filtered.length" class="empty-state"><h2>{{ t("No products match those filters.","没有符合筛选条件的产品。") }}</h2><p>{{ t("Try another material, form or search term.","请尝试其他材料、产品形态或关键词。") }}</p><button class="button button--primary" @click="reset">{{ t("Reset filters","重置筛选") }}</button></div><div class="catalog-footnote"><span>{{ t("SPECIFY WITH CONFIDENCE","了解产品规格") }}</span><p>{{ t("Dimensions are taken from our 2026 catalog. Final tolerances, performance and availability are confirmed for your selected construction.","尺寸来自盛芯 2026 产品手册。最终公差、性能及供货情况需根据所选结构确认。") }}</p></div></div>
  </section><QuoteBand/>
</template>
