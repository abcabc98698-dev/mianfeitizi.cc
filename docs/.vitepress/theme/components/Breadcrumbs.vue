<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import topics from '../../data/topics.json'

const { page } = useData()
const route = useRoute()
const path = computed(() => route.path || '/')
const label = computed(() => (page.value.frontmatter.title as string) || page.value.title || '')
const isHome = computed(() => path.value === '/')

const topic = computed(() =>
  topics.find((item) => path.value === `/${item.slug}/` || path.value.startsWith(`/${item.slug}/`)),
)

const crumbs = computed(() => {
  const items = [{ text: '首页', href: '/' }]
  if (path.value === '/') return items
  if (topic.value) {
    items.push({ text: topic.value.label, href: `/${topic.value.slug}/` })
    if (path.value !== `/${topic.value.slug}/`) items.push({ text: label.value, href: path.value })
    return items
  }
  if (path.value.startsWith('/airports/')) {
    items.push({ text: '机场品牌库', href: '/airports/' })
    if (path.value !== '/airports/') items.push({ text: label.value, href: path.value })
    return items
  }
  if (path.value.startsWith('/guides/')) {
    items.push({ text: '核验指南', href: '/guides/' })
    if (path.value !== '/guides/') items.push({ text: label.value, href: path.value })
    return items
  }
  if (path.value === '/plan/') items.push({ text: '内容蓝图', href: '/plan/' })
  else if (path.value === '/about/') items.push({ text: '关于与披露', href: '/about/' })
  else items.push({ text: label.value, href: path.value })
  return items
})
</script>

<template>
  <nav v-if="!isHome" class="mf-crumbs" aria-label="面包屑">
    <ol>
      <li v-for="(crumb, index) in crumbs" :key="crumb.href">
        <a v-if="index < crumbs.length - 1" :href="crumb.href">{{ crumb.text }}</a>
        <span v-else aria-current="page">{{ crumb.text }}</span>
        <span v-if="index < crumbs.length - 1" class="mf-crumbs__sep" aria-hidden="true">/</span>
      </li>
    </ol>
  </nav>
</template>
