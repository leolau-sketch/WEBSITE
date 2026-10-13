<script setup>
import { t } from '../locale'
import { scenarioPhoto } from '../scenario-images'
const textile = ['textile','pharmaceutical','food']
const process = ['refining','dye','aerospace']
const safety = ['occupational','marine','electroplating']
const fishing = ['protection','aquaculture','automotive']
const scenes = [
 {image:textile, en:'Textiles & process industries',zh:'纺织与流程工业', labels:['Textile manufacturing · Pharmaceuticals · Food industry','纺织制造 · 制药 · 食品工业'], text:['Thread and textile options for production environments. Confirm chemical exposure, cleaning conditions and any food-contact or pharmaceutical compliance requirements.','面向生产环境的缝纫线与纺织品选项，需确认化学介质、清洗条件及食品接触或制药合规要求。'],target:'textile-apparel'},
 {image:process,en:'Process engineering & aerospace',zh:'流程工程与航空航天',labels:['Petroleum refining · Dye manufacturing · Aerospace','石油炼化 · 染料制造 · 航空航天'],text:['Start with temperature, media and component specifications. Aerospace examples illustrate a development direction, not an approved or qualified Shengxin flight component.','从温度、介质及部件规格出发进行评估。航空航天图片仅说明开发方向，不代表盛芯产品已获飞行部件批准或认证。'],target:'chemical-filtration'},
 {image:safety,en:'Safety & marine engineering',zh:'安全防护与海洋工程',labels:['Occupational safety · Marine engineering · Electroplating','职业安全 · 海洋工程 · 电镀工业'],text:['Discuss ropes, webbing and textile components against the actual operating conditions. Safety-critical uses require finished-product testing and the applicable approvals.','根据真实工况讨论绳索、织带及纺织部件。涉及生命安全的用途需完成成品测试及适用批准。'],target:'protective-outdoor'},
 {image:fishing,en:'Equipment & outdoor environments',zh:'装备与户外环境',labels:['Law enforcement & military protection · Aquaculture & commercial fishing · Automotive manufacturing','执法与军事防护 · 水产养殖与商业捕捞 · 汽车制造'],text:['Explore material choices for marine and industrial equipment. These scenes are illustrative, not customer references or evidence of ballistic protection performance.','探索海洋与工业装备的材料选项。图片仅为场景示意，并非客户案例，也不是防弹性能的证明。'],target:'marine-fishing'},
]
</script>
<template>
 <section class="shell application-scenes"><div class="section-head"><div><p class="eyebrow">{{t('APPLICATION SCENARIOS','应用场景展示')}}</p><h2>{{t('From process to possibility.','从实际场景，探索应用可能。')}}</h2></div></div>
 <article v-for="scene in scenes" :key="scene.target+scene.en" class="scene-row"><div class="scene-photos"><figure v-for="(image,index) in scene.image" :key="image"><img :src="scenarioPhoto(image)" :alt="t(...scene.labels).split(' · ')[index]" width="434" height="269" loading="lazy"><figcaption>{{t(...scene.labels).split(' · ')[index]}}</figcaption></figure></div><div><h3>{{t(scene.en,scene.zh)}}</h3><p>{{t(...scene.text)}}</p><SiteLink class="text-link" :to="{path:'/applications/',hash:'#'+scene.target}">{{t('Explore products for review','了解待评估产品')}} →</SiteLink></div></article>
 <p class="application-notice">{{t('Application illustrations supplied by Shengxin. They do not represent verified customer projects, product approvals or certifications.','应用示意图片由盛芯提供，不代表已核实的客户项目、产品批准或认证。')}}</p>
 </section>
</template>
