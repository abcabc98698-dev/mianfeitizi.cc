<script setup lang="ts">
import guides from '../../data/guides.json'

defineProps<{
  compact?: boolean
  limit?: number
}>()
</script>

<template>
  <section class="mf-guides" :class="{ 'mf-guides--compact': compact }" aria-label="核验指南">
    <header v-if="!compact" class="mf-guides__head">
      <div>
        <p class="mf-eyebrow">FIELD NOTES</p>
        <h2>八篇先读完，再决定要不要注册</h2>
        <p>不推荐具体机场，不承诺免费额度。先把概念、成本、协议和失败路径弄清楚。</p>
      </div>
      <a href="/guides/">全部指南 →</a>
    </header>
    <div class="mf-guides__grid">
      <a
        v-for="(guide, index) in guides.slice(0, limit || guides.length)"
        :key="guide.slug"
        class="mf-guide"
        :href="`/guides/${guide.slug}`"
      >
        <span class="mf-guide__index">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="mf-guide__body">
          <div class="mf-guide__meta">
            <span>{{ guide.topicLabel }}</span>
            <span>{{ guide.reading }}</span>
          </div>
          <h3>{{ guide.title }}</h3>
          <p v-if="!compact">{{ guide.description }}</p>
        </div>
        <span class="mf-guide__arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  </section>
</template>
