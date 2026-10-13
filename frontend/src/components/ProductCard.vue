<script setup>
import { photo } from '../site-data'
import { t } from '../locale'
import { descriptions } from '../localized-product'
import { tr } from '../translations'
import { productName, productLabel } from '../product-labels'
defineProps({ product: { type: Object, required: true } })
</script>
<template>
  <SiteLink class="catalog-card" :to="`/products/${product.slug}/`">
    <div class="catalog-card-image"><img :src="photo(product.image)" :alt="productName(product) + t(' from the Shengxin product catalog',' · 盛芯产品手册')" loading="lazy" width="480" height="380"><span>{{ productLabel(product.material) }}</span></div>
    <div class="catalog-card-copy"><p class="eyebrow">{{ productLabel(product.form) }}</p><h3>{{ productName(product) }}</h3><p>{{ t(product.short,descriptions[product.slug]) }}</p><div class="card-spec"><span>{{ tr(product.size) }}</span><b aria-hidden="true">↗</b></div></div>
  </SiteLink>
</template>
