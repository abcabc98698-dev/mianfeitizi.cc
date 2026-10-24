<script setup lang="ts">
import verification from '../../data/verification.json'

const hasOffers = verification.offers.length > 0
</script>

<template>
  <section class="mf-zero" id="zero-result" aria-labelledby="mf-zero-title">
    <div class="mf-zero__status">
      <div class="mf-zero__number">{{ verification.resultCount }}</div>
      <div>
        <p class="mf-eyebrow">VERIFIED RESOURCE LEDGER</p>
        <h2 id="mf-zero-title">本期合格免费资源</h2>
        <p class="mf-zero__sub">审核日期 {{ verification.lastReviewed }} · 下次复核 {{ verification.nextReview }}</p>
      </div>
      <span class="mf-zero__badge">ZERO RESULT</span>
    </div>

    <p class="mf-zero__reason">{{ verification.reason }}</p>

    <div class="mf-zero__grid">
      <div class="mf-zero__criteria">
        <h3>一条资源要同时过五关</h3>
        <ol>
          <li v-for="item in verification.criteria" :key="item">{{ item }}</li>
        </ol>
      </div>
      <div class="mf-zero__meta">
        <h3>这张表怎么读</h3>
        <dl>
          <div><dt>审核范围</dt><dd>{{ verification.scope }}</dd></div>
          <div><dt>证据单位</dt><dd>{{ verification.method.evidence }}</dd></div>
          <div><dt>更新规则</dt><dd>{{ verification.method.updatePolicy }}</dd></div>
        </dl>
        <p class="mf-zero__disclosure">{{ verification.disclosure }}</p>
      </div>
    </div>

    <div v-if="!hasOffers" class="mf-zero__empty">
      <strong>没有可展示的条目。</strong>
      <span>这不是加载失败，也不会用“即将上线”“内部渠道”之类的文案补齐。</span>
      <a href="/resource-check/#method">学习自行核验的方法 →</a>
    </div>

    <div v-else class="mf-zero__offers">
      <article v-for="offer in verification.offers" :key="offer.name" class="mf-offer">
        <h3>{{ offer.name }}</h3>
        <p>{{ offer.notes }}</p>
        <dl>
          <div><dt>额度</dt><dd>{{ offer.quota }}</dd></div>
          <div><dt>有效期</dt><dd>{{ offer.validity }}</dd></div>
          <div><dt>复核时间</dt><dd>{{ offer.verifiedAt }}</dd></div>
        </dl>
        <a v-if="offer.termsUrl" :href="offer.termsUrl" rel="noopener nofollow" target="_blank">查看官方条款</a>
      </article>
    </div>
  </section>
</template>
