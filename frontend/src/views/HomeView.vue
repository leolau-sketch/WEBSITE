<script setup>
import { photo } from '../site-data'
import { t } from '../locale'
import QuoteBand from '../components/QuoteBand.vue'
import ApplicationCards from '../components/ApplicationCards.vue'
const collections = [
  {en:'UHMWPE',zh:'超高分子量聚乙烯',image:'uhmwpe-rope',text:'Lightweight fiber. Versatile constructions.',cn:'从轻质纤维，到多种编织结构。'},
  {en:'Aramid',zh:'芳纶',image:'aramid-thread',text:'Technical yarns, threads and braided products.',cn:'技术纱线、缝纫线与编织制品。'},
  {en:'PTFE',zh:'聚四氟乙烯',image:'ptfe-rope',text:'Fiber, thread, rope, webbing and sleeving.',cn:'纤维、线、绳、织带与套管。'},
]
</script>
<template>
  <section class="industrial-hero">
    <img :src="photo('workshop')" :alt="t('Shengxin production workshop','盛芯生产车间')" width="1440" height="680" fetchpriority="high">
    <div class="shell industrial-hero-content"><p class="hero-kicker">DONGGUAN SENSIN</p><h1>{{ t('High-performance fibers.','高性能纤维。') }}<br>{{ t('Purpose-built solutions.','为应用而制造。') }}</h1><div class="hero-rule"></div><p>{{ t('UHMWPE · Aramid · PTFE','UHMWPE · 芳纶 · PTFE') }}<br>{{ t('From material selection to custom textile constructions.','从材料选择，到定制纺织结构。') }}</p><SiteLink class="hero-action" to="/products/">{{ t('Explore our products','探索产品中心') }} <span>→</span></SiteLink></div>
    <div class="hero-caption">{{ t('OUR MANUFACTURING FLOOR / DONGGUAN, CHINA','盛芯生产车间 / 中国 · 东莞') }}</div>
  </section>
  <section class="corporate-products"><div class="centered-heading"><span></span><p>{{ t('SENSIN MATERIALS','盛芯材料系列') }}</p><h2>{{ t('Product Center','产品中心') }}</h2></div><div class="industrial-tiles">
    <SiteLink v-for="item in collections" :key="item.en" class="industrial-tile" :to="{path:'/products/',query:{material:item.en}}"><div class="tile-photo"><img :src="photo(item.image)" :alt="t(item.en+' products',item.zh+'制品')" width="640" height="470" loading="lazy"></div><div class="tile-caption"><div><small>{{ t('MATERIAL COLLECTION','材料系列') }}</small><h3>{{ t(item.en,item.zh) }}</h3><p>{{ t(item.text,item.cn) }}</p></div><span class="tile-arrow">↗</span></div></SiteLink>
  </div><div class="centered-link"><SiteLink class="text-link" to="/products/">{{ t('View all products','查看全部产品') }} →</SiteLink></div></section>
  <section class="manufacturing-feature"><div class="manufacturing-visual"><img :src="photo('building')" :alt="t('Shengxin company building from our catalog','盛芯产品手册中的厂区建筑')" width="900" height="700" loading="lazy"></div><div class="manufacturing-copy"><p class="eyebrow">{{ t('MEET THE MANUFACTURER','走进盛芯') }}</p><h2>{{ t('Material expertise.','材料经验。') }}<br>{{ t('Manufacturing focus.','专注制造。') }}</h2><p>{{ t('Established in 2017 in Dongguan, China, Shengxin develops high-performance ropes, webbing and technical textile products for industrial applications.','盛芯于 2017 年成立于中国东莞，专注于工业应用的高性能绳索、织带及技术纺织制品。') }}</p><p>{{ t('Discuss material, dimensions, braid, color and finishing directly with our team. Build the specification around your application.','与我们的团队直接沟通材料、尺寸、编织结构、颜色和后处理需求，根据实际应用确定产品规格。') }}</p><SiteLink class="text-link" to="/manufacturing-quality/">{{ t('Manufacturing & Quality','制造与品质') }} →</SiteLink><div class="manufacturing-facts"><div><strong>2017</strong><span>{{ t('Established','成立年份') }}</span></div><div><strong>OEM</strong><span>{{ t('Custom processing','定制加工') }}</span></div><div><strong>{{ t('Dongguan','东莞') }}</strong><span>{{ t('Manufacturing base','制造基地') }}</span></div></div></div></section>
  <section class="section shell"><div class="centered-heading"><span></span><p>{{ t('FROM SPECIFICATION TO SOLUTION','从规格到解决方案') }}</p><h2>{{ t('Built around your application','围绕您的应用需求') }}</h2></div><div class="solution-panels"><SiteLink to="/materials/"><b>01</b><h3>{{ t('Choose your material','选择材料') }}</h3><p>{{ t('Compare UHMWPE, aramid and PTFE product families.','了解 UHMWPE、芳纶与 PTFE 产品系列。') }}</p><span>→</span></SiteLink><SiteLink to="/custom-solutions/"><b>02</b><h3>{{ t('Define the construction','确定结构') }}</h3><p>{{ t('Share dimensions, braid, finishing or your drawing.','提供尺寸、编织、后处理要求或图纸。') }}</p><span>→</span></SiteLink><SiteLink to="/request-a-quote/"><b>03</b><h3>{{ t('Discuss your project','沟通项目') }}</h3><p>{{ t('Tell us the application and quantities you need.','告诉我们您的使用场景与采购数量。') }}</p><span>→</span></SiteLink></div></section>
  <section class="home-applications"><div class="shell"><div class="section-head"><div><p class="eyebrow">{{t('APPLICATIONS','应用领域')}}</p><h2>{{t('Materials in context.','让材料连接应用。')}}</h2></div><SiteLink class="text-link" to="/applications/">{{t('Explore all applications','查看全部应用领域')}} →</SiteLink></div><ApplicationCards :limit="3"/></div></section>
  <QuoteBand />
</template>
