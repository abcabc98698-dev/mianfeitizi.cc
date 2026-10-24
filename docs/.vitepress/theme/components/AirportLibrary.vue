<script setup lang="ts">
import { computed, ref } from 'vue'
import AirportLogo from './AirportLogo.vue'
import airportsData from '../../data/airports.json'

type Airport = {
  slug: string
  name: string
  shortName?: string
  logo?: string
  accent?: string
  tagline: string
  priceFrom: string
  monthlyFrom: number | null
  protocols: string[]
  network: string
  features: string[]
  hasTestImage: boolean
  dataStatus: string
  reviewedAt?: string
  reviewDate?: string
  featured?: boolean
}

const airports = computed(() => airportsData as unknown as Airport[])

const query = ref('')
const evidence = ref('all')
const protocol = ref('all')
const price = ref('all')
const sortBy = ref('source')

const protocolOptions = computed(() => {
  const set = new Set<string>()
  for (const airport of airports.value) {
    for (const item of airport.protocols || []) {
      if (/VLESS|Shadowsocks|Trojan|WireGuard|Hysteria|TUIC/i.test(item)) set.add(item)
    }
  }
  return [...set]
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  let list = [...airports.value].filter((airport) => {
    const haystack = [
      airport.name,
      airport.shortName || '',
      airport.tagline,
      airport.network,
      ...(airport.protocols || []),
      ...(airport.features || []),
    ].join(' ').toLowerCase()
    if (q && !haystack.includes(q)) return false
    if (evidence.value === 'image' && !airport.hasTestImage) return false
    if (evidence.value === 'vendor' && airport.hasTestImage) return false
    if (protocol.value !== 'all' && !(airport.protocols || []).includes(protocol.value)) return false
    if (price.value === 'low' && (airport.monthlyFrom == null || airport.monthlyFrom > 10)) return false
    if (price.value === 'mid' && (airport.monthlyFrom == null || airport.monthlyFrom <= 10 || airport.monthlyFrom > 25)) return false
    if (price.value === 'high' && (airport.monthlyFrom == null || airport.monthlyFrom <= 25)) return false
    return true
  })
  if (sortBy.value === 'price') list = list.sort((a, b) => (a.monthlyFrom ?? 9999) - (b.monthlyFrom ?? 9999))
  else if (sortBy.value === 'name') list = list.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
  else if (sortBy.value === 'review') list = list.sort((a, b) => String(b.reviewDate || '').localeCompare(String(a.reviewDate || '')))
  return list
})

const featured = computed(() => airports.value.find((item) => item.featured) || airports.value[0])
const imageCount = computed(() => airports.value.filter((item) => item.hasTestImage).length)
const hasActiveFilter = computed(
  () => Boolean(query.value.trim()) || evidence.value !== 'all' || protocol.value !== 'all' || price.value !== 'all',
)

function reset() {
  query.value = ''
  evidence.value = 'all'
  protocol.value = 'all'
  price.value = 'all'
  sortBy.value = 'source'
}

function statusLabel(value: string) {
  if (value === 'with-speedtest') return '有本站测速图'
  if (value === 'vendor-only') return '仅品牌资料'
  return '资料待核实'
}
</script>

<template>
  <section class="ap-library" aria-label="机场品牌库">
    <div class="ap-library__stats">
      <div><strong>{{ airports.length }}</strong><span>品牌资料</span></div>
      <div><strong>{{ imageCount }}</strong><span>有本站测速图</span></div>
      <div><strong>{{ airports.length }}</strong><span>独立品牌页</span></div>
      <div><strong>0</strong><span>付费排名</span></div>
    </div>

    <a v-if="featured" class="ap-featured" :href="`/airports/${featured.slug}`">
      <span class="ap-featured__label">商业合作 · 主推位</span>
      <div class="ap-featured__main">
        <AirportLogo :name="featured.name" :slug="featured.slug" :logo="featured.logo" :accent="featured.accent" size="lg" />
        <div>
          <h2>{{ featured.name }}</h2>
          <p>{{ featured.tagline }}</p>
          <div class="ap-featured__meta">
            <span>{{ featured.priceFrom }}</span>
            <span v-if="featured.hasTestImage">含测速截图</span>
            <span>主推位已披露</span>
          </div>
        </div>
        <span class="ap-featured__arrow" aria-hidden="true">↗</span>
      </div>
      <p class="ap-featured__note">
        主推位是商业合作展示，不代表本站对品牌长期稳定性或解锁能力作出保证。其他品牌的资料与测速截图按同一标准呈现。
      </p>
    </a>

    <div class="ap-filters">
      <label class="ap-search">
        <span>搜索品牌、协议或线路</span>
        <input v-model="query" type="search" placeholder="例如：光速云、VLESS" />
      </label>
      <label>
        <span>测速证据</span>
        <select v-model="evidence">
          <option value="all">全部</option>
          <option value="image">有本站测速图</option>
          <option value="vendor">仅品牌资料</option>
        </select>
      </label>
      <label>
        <span>协议</span>
        <select v-model="protocol">
          <option value="all">全部</option>
          <option v-for="item in protocolOptions" :key="item" :value="item">{{ item }}</option>
        </select>
      </label>
      <label>
        <span>起价</span>
        <select v-model="price">
          <option value="all">全部</option>
          <option value="low">≤ 10 元/月</option>
          <option value="mid">10–25 元/月</option>
          <option value="high">&gt; 25 元/月</option>
        </select>
      </label>
      <label>
        <span>排序</span>
        <select v-model="sortBy">
          <option value="source">资料顺序</option>
          <option value="price">起价从低到高</option>
          <option value="name">品牌名</option>
          <option value="review">最近核实</option>
        </select>
      </label>
    </div>

    <div class="ap-library__bar">
      <p>当前显示 <strong>{{ filtered.length }}</strong> 个品牌。排序不是推荐排名。</p>
      <button v-if="hasActiveFilter" type="button" @click="reset">重置筛选</button>
    </div>

    <div v-if="filtered.length" class="ap-grid">
      <a v-for="airport in filtered" :key="airport.slug" class="ap-card" :href="`/airports/${airport.slug}`">
        <div class="ap-card__head">
          <AirportLogo :name="airport.name" :slug="airport.slug" :logo="airport.logo" :accent="airport.accent" />
          <div class="ap-card__title">
            <h3>{{ airport.name }}</h3>
            <span class="ap-card__status" :class="`is-${airport.dataStatus}`">{{ statusLabel(airport.dataStatus) }}</span>
          </div>
        </div>
        <p class="ap-card__tagline">{{ airport.tagline }}</p>
        <div class="ap-card__meta">
          <span>{{ airport.priceFrom }}</span>
          <span>{{ (airport.protocols || []).slice(0, 2).join(' / ') || '协议待核实' }}</span>
        </div>
        <ul class="ap-card__features">
          <li v-for="feature in (airport.features || []).slice(0, 2)" :key="feature">{{ feature }}</li>
        </ul>
        <div class="ap-card__foot">
          <span>{{ airport.hasTestImage ? '含本站测速截图' : '未提供本站测速图' }}</span>
          <span aria-hidden="true">查看测评 →</span>
        </div>
      </a>
    </div>
    <div v-else class="ap-empty">
      <h3>没有匹配的品牌</h3>
      <p>试试更短的关键词，或重置筛选。品牌库不会为了填满结果而展示不存在的条目。</p>
      <button type="button" @click="reset">重置筛选</button>
    </div>

    <p class="ap-library__note">
      测速图是用户提供的单批次截图，只代表截图所示时间、节点与线路。品牌资料、价格与解锁声明均需以官网和核验当日条款为准。部分注册链接为推广链接，点击后本站可能获得佣金。
    </p>
  </section>
</template>
