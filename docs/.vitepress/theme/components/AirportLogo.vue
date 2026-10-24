<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  slug: string
  logo?: string
  accent?: string
  size?: 'sm' | 'md' | 'lg'
}>()

const initials = computed(() => {
  const name = props.name.replace(/\s+/g, '')
  if (/^[A-Za-z]/.test(name)) return name.slice(0, 2).toUpperCase()
  return name.slice(0, 2)
})
</script>

<template>
  <span
    class="ap-logo"
    :class="[`ap-logo--${size || 'md'}`, { 'ap-logo--image': logo }]"
    :style="{ '--ap-accent': accent || '#2fc6a7' }"
    :aria-label="`${name} 品牌标识`"
  >
    <img v-if="logo" :src="logo" :alt="`${name} 品牌 Logo`" loading="lazy" decoding="async" />
    <span v-else class="ap-logo__mark" aria-hidden="true">{{ initials }}</span>
  </span>
</template>
