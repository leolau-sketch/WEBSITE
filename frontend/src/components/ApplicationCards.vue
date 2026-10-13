<script setup>
import { applications, applicationLink } from '../application-data'
import { photo } from '../site-data'
import { scenarioPhoto, applicationCovers } from '../scenario-images'
import { t } from '../locale'
defineProps({ limit: {type:Number,default:6} })
</script>
<template>
  <div class="application-cards">
    <SiteLink v-for="(item,index) in applications.slice(0,limit)" :key="item.slug" :to="applicationLink(item)" class="application-card">
      <div class="application-image"><img :src="applicationCovers[item.slug] ? scenarioPhoto(applicationCovers[item.slug]) : photo(item.image)" :alt="t(item.en+' — application illustration',item.zh+' — 应用场景示意')" width="600" height="400" loading="lazy"><span>0{{ index+1 }}</span></div>
      <div class="application-card-copy"><h3>{{t(item.en,item.zh)}} <span aria-hidden="true">↗</span></h3><p>{{t(...item.summary)}}</p><span class="text-link">{{t('Explore application','查看应用场景')}} →</span></div>
    </SiteLink>
  </div>
</template>
