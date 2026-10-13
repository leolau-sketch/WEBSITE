<script setup>
import { t } from '../locale'
</script>
<template>
  <section class="enquiry-band"><div class="shell"><div><p class="eyebrow eyebrow--light">{{ t('LET’S DISCUSS YOUR SPECIFICATION','与我们沟通您的产品需求') }}</p><h2>{{ t('The right material. The right construction.','选对材料，定制合适的结构。') }}</h2><p>{{ t('Share your drawing, dimensions or application with our team.','向我们的团队提供图纸、尺寸或应用要求。') }}</p></div><SiteLink class="button button--white" to="/request-a-quote/">{{ t('Request a Quote','获取报价') }} <span>↗</span></SiteLink></div></section>
</template>
