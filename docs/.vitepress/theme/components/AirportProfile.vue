<script setup lang="ts">
import { computed } from 'vue'
import AirportLogo from './AirportLogo.vue'
import airportsData from '../../data/airports.json'
import imagesData from '../../data/airport-images.json'

type Airport = {
  slug: string
  name: string
  english?: string
  logo?: string
  accent?: string
  tagline: string
  founded: string
  protocols: string[]
  network: string
  regions: string[]
  priceFrom: string
  priceNote?: string
  packages: Array<{ name: string; price: string; billing: string; data: string; note?: string }>
  affiliateUrl: string
  coupon?: string
  vendorSpeed: Array<{ region: string; latency: string; download: string; date?: string; source?: string }>
  unlockClaims: string[]
  features: string[]
  limitations: string[]
  suitable: string[]
  notSuitable: string[]
  risk: string
  hasTestImage: boolean
  evidenceKind?: string
  evidenceNote?: string
  dataStatus: string
  sourceLabel: string
  sourceDate?: string
  reviewDate: string
  readingTime?: string
  intro: string
  analysis: string
  faq: Array<{ q: string; a: string }>
  related: string[]
  seoTitle?: string
  seoDescription?: string
  h1?: string
}

type Evidence = {
  src: string
  alt: string
  caption: string
  date?: string
  dateNote?: string
  source?: string
  kind: string
}

const props = defineProps<{ slug: string }>()
const airports = airportsData as unknown as Airport[]
const airport = computed(() => airports.find((item) => item.slug === props.slug))
const evidence = computed(() => {
  const all = imagesData as Record<string, { speedtest?: Evidence[]; unlock?: Evidence[] }>
  return all[props.slug] || { speedtest: [], unlock: [] }
})
const paragraphs = computed(() => (airport.value?.analysis || '').split(/\n{2,}/).filter(Boolean))
const related = computed(() =>
  (airport.value?.related || [])
    .map((slug) => airports.find((item) => item.slug === slug))
    .filter(Boolean) as Airport[],
)
const hasEvidence = computed(
  () => airport.value?.hasTestImage && ((evidence.value.speedtest?.length || 0) > 0 || (evidence.value.unlock?.length || 0) > 0),
)

function statusLabel(value?: string) {
  if (value === 'with-speedtest') return '有本站测速图'
  if (value === 'vendor-only') return '仅品牌资料'
  return '资料待核实'
}

function protocolLine(airport: Airport) {
  return (airport.protocols || []).filter(Boolean).join(' · ') || '待核实'
}
</script>

<template>
  <article v-if="airport" class="ap-profile" :style="{ '--ap-accent': airport.accent || '#2fc6a7' }">
    <header class="ap-profile__hero">
      <AirportLogo :name="airport.name" :slug="airport.slug" :logo="airport.logo" :accent="airport.accent" size="lg" />
      <div class="ap-profile__identity">
        <p class="mf-eyebrow">AIRPORT BRAND RECORD</p>
        <p class="ap-profile__tagline">{{ airport.tagline }}</p>
        <div class="ap-profile__badges">
          <span class="ap-badge" :class="`is-${airport.dataStatus}`">{{ statusLabel(airport.dataStatus) }}</span>
          <span class="ap-badge">{{ airport.founded || '成立时间待核实' }}</span>
          <span class="ap-badge">核验 {{ airport.reviewDate }}</span>
        </div>
      </div>
      <a
        v-if="airport.affiliateUrl"
        class="ap-cta ap-cta--hero"
        :href="airport.affiliateUrl"
        target="_blank"
        rel="nofollow sponsored noopener"
      >
        查看官网套餐
        <span>推广</span>
      </a>
      <span v-else class="ap-cta ap-cta--disabled">官方入口待核实</span>
    </header>

    <div class="ap-profile__statusline">
      <span><b>数据状态</b>{{ statusLabel(airport.dataStatus) }}</span>
      <span><b>资料来源</b>{{ airport.sourceLabel }}</span>
      <span><b>资料日期</b>{{ airport.sourceDate || '待核实' }}</span>
      <span><b>本站核验</b>{{ airport.reviewDate }}</span>
    </div>

    <p class="ap-profile__intro">{{ airport.intro }}</p>

    <div class="ap-facts">
      <div><span>成立时间</span><strong>{{ airport.founded || '待核实' }}</strong></div>
      <div><span>协议 / 线路</span><strong>{{ protocolLine(airport) }}</strong></div>
      <div><span>网络定位</span><strong>{{ airport.network || '待核实' }}</strong></div>
      <div><span>起步价格</span><strong>{{ airport.priceFrom || '待核实' }}</strong></div>
      <div><span>优惠码</span><strong>{{ airport.coupon || '未记录' }}</strong></div>
      <div><span>覆盖地区</span><strong>{{ (airport.regions || []).slice(0, 8).join('、') || '待核实' }}</strong></div>
    </div>

    <div v-if="airport.priceNote" class="ap-inline-note">{{ airport.priceNote }}</div>

    <h2 id="packages">套餐与价格</h2>
    <p class="ap-section-lead">
      以下为品牌资料或历史项目记录中的套餐字段。价格、流量、计费周期与库存可能在核验后变化，付款前必须以官网当前页面为准；本站不把折算价写成普通月付价。
    </p>
    <div v-if="airport.packages?.length" class="mf-table-scroll">
      <table>
        <thead>
          <tr><th>套餐</th><th>价格</th><th>计费方式</th><th>流量</th><th>备注</th></tr>
        </thead>
        <tbody>
          <tr v-for="(pkg, index) in airport.packages" :key="`${pkg.name}-${index}`">
            <td>{{ pkg.name }}</td>
            <td>{{ pkg.price }}</td>
            <td>{{ pkg.billing }}</td>
            <td>{{ pkg.data }}</td>
            <td>{{ pkg.note || '品牌资料' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="ap-empty-inline">原始资料中没有可结构化的套餐表，价格与周期待官网核实。</p>

    <h2 id="speed">品牌资料标注的测速</h2>
    <p class="ap-section-lead">
      这一节只抄录品牌资料或历史记录中的测速字段，不是本站独立复测。没有数值的字段写“待核实”，不把缺失值补成 0。
    </p>
    <div v-if="airport.vendorSpeed?.length" class="mf-table-scroll">
      <table>
        <thead>
          <tr><th>地区</th><th>延迟</th><th>下载</th><th>记录日期</th><th>来源</th></tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in airport.vendorSpeed" :key="`${row.region}-${index}`">
            <td>{{ row.region }}</td>
            <td>{{ row.latency || '待核实' }}</td>
            <td>{{ row.download || '待核实' }}</td>
            <td>{{ row.date || '待核实' }}</td>
            <td>{{ row.source || '品牌资料' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="ap-empty-inline">品牌资料没有提供可比的逐地区测速表，不能据此推断速度或稳定性。</p>

    <template v-if="airport.unlockClaims?.length">
      <h2 id="unlock">品牌资料声明的 AI 与流媒体</h2>
      <p class="ap-section-lead">
        以下内容是品牌资料的单方声明，不是逐项独立测试。没有截图的品牌只保留声明；有截图的品牌也要区分“截图批次中的结果”和“当前可用性”。
      </p>
      <ul class="ap-claim-list">
        <li v-for="item in airport.unlockClaims" :key="item">{{ item }}</li>
      </ul>
    </template>

    <template v-if="hasEvidence">
      <h2 id="evidence">测速与解锁截图</h2>
      <p class="ap-section-lead">
        {{ airport.evidenceNote || '截图只代表截图所示时间、节点与线路，不代表长期稳定性或当前可用性。' }}
      </p>
      <div class="ap-evidence">
        <figure v-for="item in [...(evidence.speedtest || []), ...(evidence.unlock || [])]" :key="item.src" class="ap-evidence__item">
          <a :href="item.src" target="_blank" rel="noopener" :aria-label="`打开原图：${item.alt}`">
            <img :src="item.src" :alt="item.alt" loading="lazy" decoding="async" />
          </a>
          <figcaption>
            <span class="ap-evidence__kind">{{ item.kind === 'unlock' ? '解锁/可用性矩阵' : '节点测速' }}</span>
            <span>{{ item.caption }}</span>
            <small>{{ item.dateNote || '测试时间以图内记录为准' }} · {{ item.source || '用户提供的原始截图' }}</small>
          </figcaption>
        </figure>
      </div>
    </template>
    <div v-else class="ap-empty-inline ap-empty-inline--block">
      该品牌暂未提供本站可展示的测速或解锁截图。页面只展示品牌资料，不能据此判断真实速度、稳定性或解锁能力。
    </div>

    <h2 id="analysis">线路、协议与使用条件</h2>
    <p v-for="(paragraph, index) in paragraphs" :key="index">{{ paragraph }}</p>

    <h2 id="pros-cons">优点与限制</h2>
    <div class="ap-two-col">
      <div class="ap-list-box ap-list-box--good">
        <h3>可以确认或由资料支持</h3>
        <ul><li v-for="item in airport.features" :key="item">{{ item }}</li></ul>
      </div>
      <div class="ap-list-box ap-list-box--warn">
        <h3>限制与需要核实</h3>
        <ul><li v-for="item in airport.limitations" :key="item">{{ item }}</li></ul>
      </div>
    </div>

    <h2 id="fit">适合谁，不适合谁</h2>
    <div class="ap-two-col">
      <div class="ap-list-box ap-list-box--good">
        <h3>适合</h3>
        <ul><li v-for="item in airport.suitable" :key="item">{{ item }}</li></ul>
      </div>
      <div class="ap-list-box ap-list-box--warn">
        <h3>不适合</h3>
        <ul><li v-for="item in airport.notSuitable" :key="item">{{ item }}</li></ul>
      </div>
    </div>

    <h2 id="risk">风险与核验建议</h2>
    <p>{{ airport.risk }}</p>
    <ul class="ap-checklist">
      <li>先买最短周期或小额套餐，用 7 天记录晚高峰、掉线、出口与目标站点表现。</li>
      <li>付款前确认自动续费、退款窗口、设备数、倍率与流量重置规则。</li>
      <li>不要为了免费或低价关闭证书校验、交出账号密码或安装来历不明的客户端。</li>
      <li>测速截图只证明当次结果，不能替代条款审查与长期可用率记录。</li>
    </ul>

    <h2 id="faq">常见问题</h2>
    <template v-for="item in airport.faq" :key="item.q">
      <h3 class="ap-faq__q">{{ item.q }}</h3>
      <p class="ap-faq__a">{{ item.a }}</p>
    </template>

    <h2 id="related">相关品牌</h2>
    <div class="ap-related">
      <a v-for="item in related" :key="item.slug" :href="`/airports/${item.slug}`" class="ap-related__item">
        <AirportLogo :name="item.name" :slug="item.slug" :logo="item.logo" :accent="item.accent" size="sm" />
        <span>
          <strong>{{ item.name }}</strong>
          <small>{{ item.priceFrom }}</small>
        </span>
        <span aria-hidden="true">→</span>
      </a>
    </div>

    <div class="ap-disclosure">
      <strong>商业披露</strong>
      <p>
        本页的注册链接可能是推广链接，点击或注册后本站可能获得佣金。佣金不影响测速截图的展示、价格字段的抄录与风险提示。本站不销售机场服务，不承诺任何品牌长期稳定、当前可用或解锁能力。
      </p>
      <p v-if="airport.affiliateUrl">
        <a :href="airport.affiliateUrl" target="_blank" rel="nofollow sponsored noopener">查看 {{ airport.name }} 官网套餐（推广链接） ↗</a>
      </p>
    </div>
  </article>
  <div v-else class="ap-empty-inline">未找到该品牌资料。</div>
</template>
