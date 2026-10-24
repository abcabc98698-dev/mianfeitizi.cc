<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted } from 'vue'
import topics from '../../data/topics.json'

const props = defineProps<{
  topic: string
}>()

const topic = computed(() => topics.find((item) => item.slug === props.topic))
const categories = computed(() => topic.value?.categories ?? [])
const clusterCount = computed(() =>
  categories.value.reduce((sum, category) => sum + category.clusters.length, 0),
)
const articleCount = computed(() =>
  categories.value.reduce(
    (sum, category) =>
      sum +
      category.clusters.reduce((inner, cluster) => inner + cluster.articles.length, 0),
    0,
  ),
)

function openFromHash() {
  if (typeof window === 'undefined') return
  const hash = window.location.hash
  if (!hash) return
  const el = document.querySelector(hash)
  const details = el?.closest('details')
  if (details) details.setAttribute('open', '')
}

onMounted(() => {
  nextTick(openFromHash)
  window.addEventListener('hashchange', openFromHash)
})
onUnmounted(() => {
  if (typeof window !== 'undefined') window.removeEventListener('hashchange', openFromHash)
})
</script>

<template>
  <section v-if="topic" class="mf-topicmap" :aria-label="`${topic.label}内容蓝图`">
    <header class="mf-topicmap__intro">
      <div>
        <p class="mf-eyebrow">TOPIC CLUSTER MAP</p>
        <h2 class="mf-topicmap__title">{{ topic.label }}内容蓝图</h2>
        <p class="mf-topicmap__desc">
          按搜索意图拆成 {{ categories.length }} 个二级分类、{{ clusterCount }} 个三级内容集群，共
          {{ articleCount }} 个规划选题。每个题目都要能独立回答一个具体问题，不能用换关键词的方式复制。
        </p>
      </div>
      <div class="mf-topicmap__numbers">
        <span><strong>{{ categories.length }}</strong> 分类</span>
        <span><strong>{{ clusterCount }}</strong> 集群</span>
        <span><strong>{{ articleCount }}</strong> 选题</span>
      </div>
    </header>

    <div class="mf-topicmap__notice">
      <span class="mf-topicmap__notice-mark">i</span>
      <p>
        选题是编辑路线图，不是已经发布的页面。未完成独立核验与写作的题目不会生成可点击链接，避免空页面、重复内容和虚假覆盖。已发布的长文在各专题页首屏与页尾单独列出。
      </p>
    </div>

    <article
      v-for="(category, categoryIndex) in categories"
      :id="`cat-${category.slug}`"
      :key="category.slug"
      class="mf-cat"
    >
      <header class="mf-cat__head">
        <span class="mf-cat__index">{{ String(categoryIndex + 1).padStart(2, '0') }}</span>
        <div class="mf-cat__heading">
          <h3>
            {{ category.name }}
            <a class="mf-anchor" :href="`#cat-${category.slug}`" :aria-label="`链接到${category.name}`">#</a>
          </h3>
          <p>{{ category.intent }}</p>
        </div>
        <span class="mf-cat__count">{{ category.clusters.length }} 个集群</span>
      </header>

      <div class="mf-clusters">
        <section
          v-for="cluster in category.clusters"
          :id="`cluster-${cluster.slug}`"
          :key="cluster.slug"
          class="mf-cluster"
        >
          <div class="mf-cluster__head">
            <h4>
              {{ cluster.name }}
              <a class="mf-anchor" :href="`#cluster-${cluster.slug}`" :aria-label="`链接到${cluster.name}`">#</a>
            </h4>
            <span>{{ cluster.articles.length }} 个选题</span>
          </div>
          <p class="mf-cluster__summary">{{ cluster.summary }}</p>
          <details class="mf-titles">
            <summary>
              <span>查看长尾选题</span>
              <span class="mf-titles__count">{{ cluster.articles.length }}</span>
            </summary>
            <ol v-if="cluster.articles.length">
              <li v-for="(article, index) in cluster.articles" :key="article.slug">
                <span class="mf-titles__num">{{ String(index + 1).padStart(2, '0') }}</span>
                <span class="mf-titles__text">{{ article.title }}</span>
                <span class="mf-titles__status">规划</span>
              </li>
            </ol>
            <p v-else class="mf-titles__empty">选题正在按核验标准编排。</p>
          </details>
        </section>
      </div>
    </article>

    <footer class="mf-topicmap__foot">
      <a href="/plan/">查看全部 {{ topics.length }} 个专题的完整内容蓝图 →</a>
      <span>所有题目均需通过事实核验后才进入写作队列。</span>
    </footer>
  </section>
</template>
