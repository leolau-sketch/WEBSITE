<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { locale } from '../locale'
import { languageLink } from '../language-routing'
const props = defineProps({to:{type:[String,Object],required:true}})
const target = computed(() => languageLink(props.to,locale.value))
</script>
<template><RouterLink :to="target"><slot /></RouterLink></template>
