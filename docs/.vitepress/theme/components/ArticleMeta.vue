<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = defineProps<{
  reading?: string
  note?: string
}>()

const { frontmatter } = useData()
const formatDate = (value: unknown) => {
  const raw = String(value || '2026-10-24')
  return raw.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || raw
}
const date = computed(() => formatDate(frontmatter.value.lastReviewed))
const reading = computed(() => props.reading || (frontmatter.value.readingTime as string) || '约 12 分钟')
const note = computed(
  () => props.note || '方法说明，不构成对任何具体服务的可用性承诺。',
)
</script>

<template>
  <div class="mf-artmeta">
    <span><b>核验日期</b><time :datetime="date">{{ date }}</time></span>
    <span><b>阅读</b>{{ reading }}</span>
    <span><b>编辑</b>免梯指数编辑部</span>
    <span class="mf-artmeta__note">{{ note }}</span>
  </div>
</template>
