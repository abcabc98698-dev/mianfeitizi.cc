<script setup lang="ts">
import { computed } from 'vue'
import topics from '../../data/topics.json'
import verification from '../../data/verification.json'

const categories = computed(() => topics.reduce((sum, topic) => sum + topic.categories.length, 0))
const clusters = computed(() =>
  topics.reduce(
    (sum, topic) =>
      sum + topic.categories.reduce((inner, category) => inner + category.clusters.length, 0),
    0,
  ),
)
const plannedArticles = computed(() =>
  topics.reduce(
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
  <section class="mf-hero" aria-labelledby="mf-hero-title">
    <div class="mf-hero__grid" aria-hidden="true"></div>
    <div class="mf-hero__inner">
      <div class="mf-hero__copy">
        <p class="mf-kicker">
          <span class="mf-kicker__dot"></span>
          VERIFY FIRST
          <span class="mf-kicker__sep">/</span>
          2026 核验版
        </p>
        <h1 id="mf-hero-title">
          免费梯子，<br />
          <span class="mf-hero__em">先核验，再用。</span>
        </h1>
        <p class="mf-lede">
          我们把“免费机场、免费节点、机场试用”拆成可查的证据、可复算的成本和可复现的测试。没有合格资源时，页面就显示零结果。
        </p>
        <div class="mf-actions">
          <a class="mf-btn mf-btn--solid" href="/free-vpn/">从免费梯子开始 <span aria-hidden="true">→</span></a>
          <a class="mf-btn mf-btn--ghost" href="/resource-check/">看核验方法</a>
        </div>
        <ul class="mf-checks">
          <li>不虚构可领取额度</li>
          <li>价格与流量标注口径</li>
          <li>每个结论保留时间戳</li>
        </ul>
      </div>

      <aside class="mf-console" aria-label="免费资源核验状态">
        <div class="mf-console__bar">
          <span class="mf-console__lights" aria-hidden="true"><i></i><i></i><i></i></span>
          <span>verification.log</span>
          <span class="mf-console__live">ZERO RESULT</span>
        </div>
        <div class="mf-console__body">
          <p class="mf-console__cmd"><span>$</span> status --free-resources</p>
          <p class="mf-console__count"><strong>{{ verification.resultCount }}</strong> 条合格资源</p>
          <dl class="mf-console__rows">
            <div><dt>最近审核</dt><dd>{{ verification.lastReviewed }}</dd></div>
            <div><dt>下次复核</dt><dd>{{ verification.nextReview }}</dd></div>
            <div><dt>发布标准</dt><dd>{{ verification.criteria.length }} 项硬门槛</dd></div>
            <div><dt>已覆盖专题</dt><dd>{{ topics.length }} 个</dd></div>
          </dl>
          <p class="mf-console__note">
            零结果不是故障，也不是“全网没有”。它表示本站拒绝把无法复核的限时活动写成可用资源。
          </p>
          <a class="mf-console__link" href="/free-airport/#zero-result">查看零结果说明 →</a>
        </div>
        <div class="mf-console__foot">
          <span>sha256 / editorial-audit</span>
          <span>{{ categories }} 分类 · {{ clusters }} 集群</span>
        </div>
      </aside>
    </div>

    <div class="mf-hero__stats">
      <div><strong>{{ topics.length }}</strong><span>一级专题</span></div>
      <div><strong>{{ categories }}</strong><span>搜索意图分类</span></div>
      <div><strong>{{ clusters }}</strong><span>内容集群</span></div>
      <div><strong>{{ plannedArticles }}</strong><span>规划选题</span></div>
    </div>
  </section>
</template>
