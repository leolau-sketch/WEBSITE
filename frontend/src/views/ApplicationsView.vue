<script setup>
import { applications } from '../application-data'
import { products } from '../site-data'
import { t } from '../locale'
import ApplicationCards from '../components/ApplicationCards.vue'
import ProductCard from '../components/ProductCard.vue'
import QuoteBand from '../components/QuoteBand.vue'
import ApplicationScenes from '../components/ApplicationScenes.vue'
import { finishedFirst } from '../product-display'
const related = item => finishedFirst(item.products.map(slug => products.find(p => p.slug === slug)))
</script>
<template>
  <section class="shell collection-heading"><p class="eyebrow">{{t('APPLICATIONS','应用领域')}}</p><h1>{{t('Built for your industry.','从行业需求出发。')}}<br>{{t('Selected for your process.','为具体工况选材。')}}</h1><p>{{t('Explore application directions from our 2026 catalog. Connect your process requirements with fibers, threads and braided constructions.','从盛芯 2026 产品画册中的应用方向出发，将工艺需求与纤维、缝纫线及编织结构相连接。')}}</p></section>
  <section class="shell application-overview" :aria-label="t('Application directory','应用领域目录')"><ApplicationCards/><p class="application-notice">{{t('Images illustrate application directions and product options, not completed customer projects. Application examples do not establish certification or fitness for a particular use.','图片展示应用方向与产品选项，不代表已交付的客户项目。应用示例不构成认证或特定用途适用性的证明。')}}</p></section>
  <ApplicationScenes/>
  <section v-for="(item,index) in applications" :id="item.slug" :key="item.slug" class="application-detail">
    <div class="shell"><div class="application-detail-heading"><div><p class="eyebrow">0{{index+1}} / {{t('APPLICATION FOCUS','应用方向')}}</p><h2>{{t(item.en,item.zh)}}</h2><p>{{t(...item.summary)}}</p><p class="application-examples">{{t(...item.examples)}}</p></div><aside><h3>{{t('What to confirm','选型前需确认')}}</h3><p>{{t(...item.review)}}</p><SiteLink class="text-link" to="/request-a-quote/">{{t('Discuss this application','咨询此应用')}} ↗</SiteLink></aside></div>
    <h3 class="application-related-title">{{t('Products to explore','可进一步了解的产品')}}</h3><div class="catalog-grid"><ProductCard v-for="product in related(item)" :key="product.slug" :product="product"/></div><p class="application-source">{{t('Application references: Shengxin 2026 catalog, PDF pages ','应用依据：盛芯 2026 产品画册，PDF 页码 ')}}{{item.pages.join(', ')}} · {{t('Selection subject to technical review','具体选型须经技术评估')}}</p></div>
  </section><QuoteBand/>
</template>
