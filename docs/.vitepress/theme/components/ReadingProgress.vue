<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const width = ref(0)
let raf = 0

function update() {
  raf = 0
  const doc = document.documentElement
  const total = doc.scrollHeight - window.innerHeight
  width.value = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0
}

function onScroll() {
  if (!raf) raf = window.requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  if (raf) window.cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="mf-progress" aria-hidden="true">
    <span :style="{ width: `${width}%` }"></span>
  </div>
</template>
