<script setup>
import { tr } from '../translations'
</script>
<template><section class="shell empty-state"><p class="eyebrow">{{ tr("404 / Page not found") }}</p><h1>{{ tr("A different direction.") }}</h1><p>{{ tr("The page you're looking for isn't in our current collection.") }}</p><SiteLink class="button button--primary" to="/products/">{{ tr("Explore our products ↗") }}</SiteLink></section></template>
