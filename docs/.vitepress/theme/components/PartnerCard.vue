<script setup lang="ts">
import partners from '../../data/partners.json'
</script>

<template>
  <aside class="mf-partner" aria-label="工具与商业披露">
    <div class="mf-partner__main">
      <div>
        <p class="mf-eyebrow">OFFICIAL SOURCES</p>
        <h2>先把软件来源搞对</h2>
        <p class="mf-partner__lede">
          软件免费，不等于背后的服务器免费。下面只指向开源项目的官方发布页，不含推广参数；下载前仍要核对版本、校验和与签名。
        </p>
      </div>
      <div class="mf-partner__links">
        <a
          v-for="tool in partners.officialTools"
          :key="tool.name"
          :href="tool.url"
          target="_blank"
          rel="noopener nofollow"
        >
          <span class="mf-partner__tool-name">{{ tool.name }}</span>
          <span class="mf-partner__tool-kind">{{ tool.kind }}</span>
          <span class="mf-partner__arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
    <div class="mf-partner__foot">
      <p><strong>商业披露</strong>{{ partners.disclosure }}</p>
      <p class="mf-partner__slot">
        <span>42 家机场品牌库</span>
        {{ partners.sponsor.note }}
        <a :href="partners.sponsor.href">{{ partners.sponsor.enabled ? '进入品牌库 →' : '合作与披露 →' }}</a>
      </p>
    </div>
  </aside>
</template>
