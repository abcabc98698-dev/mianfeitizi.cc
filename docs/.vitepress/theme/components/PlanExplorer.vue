<script setup lang="ts">
import { computed, ref } from 'vue'
import topics from '../../data/topics.json'

type Article = { slug: string; title: string; href?: string; type?: string }
type Cluster = { slug: string; name: string; summary: string; articles: Article[] }
type Category = { slug: string; name: string; intent: string; clusters: Cluster[] }
type Topic = { slug: string; label: string; tagline: string; categories: Category[] }

const rawTopics = topics as unknown as Topic[]
const query = ref('')
const activeTopic = ref('all')
const openAll = computed(() => Boolean(query.value.trim()) || activeTopic.value !== 'all')

const totalArticles = computed(() =>
  rawTopics.reduce(
    (sum, topic) =>
      sum +
      topic.categories.reduce(
        (inner, category) =>
          inner + category.clusters.reduce((count, cluster) => count + cluster.articles.length, 0),
        0,
      ),
    0,
  ),
)

function includes(value: string, needle: string) {
  return value.toLowerCase().includes(needle)
}

const filteredTopics = computed(() => {
  const q = query.value.trim().toLowerCase()
  return rawTopics
    .filter((topic) => activeTopic.value === 'all' || topic.slug === activeTopic.value)
    .map((topic) => {
      const categories = topic.categories
        .map((category) => {
          const categoryHit = includes(category.name, q) || includes(category.intent, q)
          const clusters = category.clusters
            .map((cluster) => {
              const clusterHit = includes(cluster.name, q) || includes(cluster.summary, q)
              const articles =
                !q || categoryHit || clusterHit
                  ? cluster.articles
                  : cluster.articles.filter((article) => includes(article.title, q))
              return { ...cluster, articles }
            })
            .filter((cluster) => !q || categoryHit || cluster.articles.length > 0)
          return { ...category, clusters }
        })
        .filter((category) => !q || category.clusters.length > 0)
      return { ...topic, categories }
    })
    .filter((topic) => !q || topic.categories.length > 0)
})

const visibleArticles = computed(() =>
  filteredTopics.value.reduce(
    (sum, topic) =>
      sum +
      topic.categories.reduce(
        (inner, category) =>
          inner + category.clusters.reduce((count, cluster) => count + cluster.articles.length, 0),
        0,
      ),
    0,
  ),
)
</script>

<template>
  <section class="mf-plan" aria-label="内容蓝图检索">
    <div class="mf-plan__bar">
      <label class="mf-plan__search">
        <span>筛选题目</span>
        <input v-model="query" type="search" placeholder="输入关键词，例如：试用、DNS、10 元" />
      </label>
      <a class="mf-plan__download" href="/content-plan.json" download>下载 JSON 蓝图</a>
    </div>

    <div class="mf-plan__chips" role="group" aria-label="按专题筛选">
      <button :class="{ active: activeTopic === 'all' }" @click="activeTopic = 'all'">
        全部 <span>{{ totalArticles }}</span>
      </button>
      <button
        v-for="topic in rawTopics"
        :key="topic.slug"
        :class="{ active: activeTopic === topic.slug }"
        @click="activeTopic = topic.slug"
      >
        {{ topic.label }}
      </button>
    </div>

    <p class="mf-plan__count">
      当前显示 <strong>{{ visibleArticles }}</strong> 个选题，{{ filteredTopics.length }} 个专题。
      选题状态为“规划”，未发布页面不会生成链接。
    </p>

    <div v-if="filteredTopics.length" class="mf-plan__topics">
      <section v-for="topic in filteredTopics" :id="`topic-${topic.slug}`" :key="topic.slug" class="mf-plan__topic">
        <header>
          <div>
            <p class="mf-eyebrow">{{ topic.slug }}</p>
            <h2>{{ topic.label }}</h2>
            <p>{{ topic.tagline }}</p>
          </div>
          <a :href="`/${topic.slug}/`">打开专题 →</a>
        </header>

        <details v-for="(category, categoryIndex) in topic.categories" :key="category.slug" class="mf-plan__cat" :open="openAll">
          <summary>
            <span class="mf-plan__num">{{ String(categoryIndex + 1).padStart(2, '0') }}</span>
            <span class="mf-plan__cat-name">{{ category.name }}</span>
            <span class="mf-plan__cat-count">{{ category.clusters.length }} 集群</span>
          </summary>
          <p class="mf-plan__cat-intent">{{ category.intent }}</p>
          <div class="mf-plan__clusters">
            <section v-for="cluster in category.clusters" :key="cluster.slug" class="mf-plan__cluster">
              <header>
                <h4>{{ cluster.name }}</h4>
                <span>{{ cluster.articles.length }} 选题</span>
              </header>
              <p>{{ cluster.summary }}</p>
              <ol v-if="cluster.articles.length">
                <li v-for="article in cluster.articles" :key="article.slug">
                  <a v-if="article.href" :href="article.href">{{ article.title }}</a>
                  <span v-else>{{ article.title }}</span>
                  <em>{{ article.type || '规划' }}</em>
                </li>
              </ol>
              <p v-else class="mf-plan__empty">选题待编排。</p>
            </section>
          </div>
        </details>
      </section>
    </div>
    <p v-else class="mf-plan__empty">没有匹配的题目，试试更短的关键词。</p>
  </section>
</template>
