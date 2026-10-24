import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const dataDir = resolve(root, 'docs/.vitepress/data/airports')
const pagesDir = resolve(root, 'docs/airports')
const registryPath = resolve(root, 'docs/.vitepress/data/airports.json')
const raw = JSON.parse(readFileSync(resolve(dataDir, 'airports.raw.json'), 'utf8'))
const order = raw.brands.map((brand) => brand.slug)
const errors = []
const brands = []

for (const slug of order) {
  const file = resolve(dataDir, `${slug}.json`)
  if (!existsSync(file)) {
    errors.push(`${slug}: 缺少数据文件`)
    continue
  }
  let brand
  try {
    brand = JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
  } catch (error) {
    errors.push(`${slug}: JSON 解析失败 ${error.message}`)
    continue
  }
  if (brand.slug !== slug) errors.push(`${slug}: slug 不一致 ${brand.slug}`)
  for (const key of ['name', 'tagline', 'intro', 'analysis', 'risk']) {
    if (!brand[key]) errors.push(`${slug}: 缺少 ${key}`)
  }
  if (!Array.isArray(brand.packages)) errors.push(`${slug}: packages 不是数组`)
  if (!Array.isArray(brand.faq) || brand.faq.length < 3) errors.push(`${slug}: faq 不足`)
  if (!Array.isArray(brand.related)) errors.push(`${slug}: related 不是数组`)
  brand.featured = slug === 'guangsuyun'
  brand.reviewDate ||= '2026-10-24'
  brand.sourceDate ||= '待核实'
  brand.readingTime ||= '10 分钟'

  if (brand.logo) {
    const logoPath = resolve(root, 'docs/public', String(brand.logo).replace(/^\//, ''))
    if (!existsSync(logoPath)) {
      errors.push(`${slug}: logo 不存在 ${brand.logo}`)
      brand.logo = ''
    }
  }
  if (brand.affiliateUrl && !/^https?:\/\//.test(brand.affiliateUrl)) {
    errors.push(`${slug}: 推广链接不是 http(s) 地址`)
    brand.affiliateUrl = ''
  }
  brands.push(brand)
}

if (brands.length !== 42) errors.push(`品牌数 ${brands.length}，应为 42`)
if (errors.length) {
  console.error('机场数据校验失败：')
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

writeFileSync(registryPath, `${JSON.stringify(brands, null, 2)}\n`, 'utf8')
mkdirSync(pagesDir, { recursive: true })

function quote(value) {
  return JSON.stringify(String(value || ''))
}

function trimMeta(value, max = 120) {
  const text = String(value || '').replace(/\s+/g, ' ').trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  const punctuation = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('；'), cut.lastIndexOf('，'))
  const body = punctuation >= Math.floor(max * 0.65) ? cut.slice(0, punctuation + 1) : cut
  return `${body.replace(/[，；、]$/, '')}…`
}

for (const brand of brands) {
  const title = brand.seoTitle || `${brand.name}机场测评：套餐、线路、测速截图与风险`
  const description = trimMeta(
    brand.seoDescription ||
      `${brand.name}机场资料页：套餐价格、协议线路、测速截图、适用人群与风险提示。品牌资料与实测证据分开标注。`,
  )
  const h1 = brand.h1 || `${brand.name}机场测评：套餐、线路、测速截图与风险`
  const keywords = [brand.name, `${brand.name}机场`, `${brand.name}测评`, '机场品牌库', '机场套餐', '机场测速']
  const page = `---
title: ${quote(title)}
description: ${quote(description)}
lastReviewed: ${brand.reviewDate}
datePublished: 2026-10-24
readingTime: ${quote(brand.readingTime)}
pageClass: airport-page
outline: [2, 3]
keywords: ${JSON.stringify(keywords)}
schemaType: AirportReview
airportName: ${quote(brand.name)}
airportSlug: ${quote(brand.slug)}
---

# ${h1}

<AirportProfile slug=${quote(brand.slug)} />
`
  writeFileSync(resolve(pagesDir, `${brand.slug}.md`), page, 'utf8')
}

console.log(`已合并 ${brands.length} 个机场品牌，生成 ${brands.length} 个详情页。`)
console.log(`数据：${registryPath}`)
console.log(`页面：${pagesDir}`)
