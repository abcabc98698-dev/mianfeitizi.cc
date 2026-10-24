import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const dir = resolve(root, 'docs/.vitepress/data/airports')
const raw = JSON.parse(readFileSync(resolve(dir, 'airports.raw.json'), 'utf8'))
const expected = raw.brands.map((brand) => brand.slug)
const images = JSON.parse(readFileSync(resolve(root, 'docs/.vitepress/data/airport-images.json'), 'utf8'))
const errors = []
const warnings = []
const data = []
const seenText = new Map()

const logoSlugs = new Set([
  'guangsuyun', 'feimao', 'quanqiu', 'jilian', 'guangnian', 'tiziyun', 'lingdongyun', 'yinxingren',
  'u1s1', 'sogo', 'sujie', 'xingdaomeng', 'yuzhou', 'ermao', 'longmaoyun', 'qingyunti', 'tntcloud',
  'edgenova', 'flyingbird',
])

for (const slug of expected) {
  const file = resolve(dir, `${slug}.json`)
  if (!existsSync(file)) {
    errors.push(`${slug}: 缺少 JSON`)
    continue
  }
  let brand
  try {
    brand = JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''))
  } catch (error) {
    errors.push(`${slug}: JSON 解析失败 ${error.message}`)
    continue
  }
  if (brand.slug !== slug) errors.push(`${slug}: slug 不一致`)
  for (const key of ['name', 'tagline', 'intro', 'analysis', 'risk', 'sourceLabel', 'seoTitle', 'seoDescription', 'h1']) {
    if (!brand[key]) errors.push(`${slug}: 缺少 ${key}`)
  }
  if (!Array.isArray(brand.faq) || brand.faq.length < 5) errors.push(`${slug}: FAQ 少于 5 条`)
  if (!Array.isArray(brand.related) || brand.related.length < 3) errors.push(`${slug}: related 少于 3 个`)
  if (!Array.isArray(brand.packages)) errors.push(`${slug}: packages 不是数组`)
  if (!Array.isArray(brand.vendorSpeed)) errors.push(`${slug}: vendorSpeed 不是数组`)
  if (!Array.isArray(brand.unlockClaims)) errors.push(`${slug}: unlockClaims 不是数组`)
  if (typeof brand.monthlyFrom !== 'number') warnings.push(`${slug}: monthlyFrom 不是数字，价格筛选会跳过`)
  const page = resolve(root, 'docs/airports', `${slug}.md`)
  if (!existsSync(page)) errors.push(`${slug}: 缺少生成的 Markdown 页面`)
  if (brand.logo) {
    const logo = resolve(root, 'docs/public', brand.logo.replace(/^\//, ''))
    if (!existsSync(logo)) errors.push(`${slug}: logo 文件不存在 ${brand.logo}`)
  } else if (logoSlugs.has(slug)) {
    warnings.push(`${slug}: 有 logo 资源但未填写 logo`)
  }
  if (brand.hasTestImage) {
    const entry = images[slug]
    if (!entry || !entry.speedtest?.length) errors.push(`${slug}: hasTestImage 但图片清单为空`)
    else {
      for (const item of [...entry.speedtest, ...(entry.unlock || [])]) {
        const img = resolve(root, 'docs/public', item.src.replace(/^\//, ''))
        if (!existsSync(img)) errors.push(`${slug}: 图片不存在 ${item.src}`)
      }
    }
  }
  const textKey = `${brand.intro}\n${brand.analysis}`
  if (seenText.has(textKey)) errors.push(`${slug}: 与 ${seenText.get(textKey)} 正文完全相同`)
  seenText.set(textKey, slug)
  data.push(brand)
}

if (data.length !== 42) errors.push(`当前只有 ${data.length}/42 个品牌 JSON`)
const slugs = new Set(data.map((brand) => brand.slug))
for (const brand of data) {
  for (const rel of brand.related || []) {
    if (!expected.includes(rel) || rel === brand.slug) errors.push(`${brand.slug}: related 非法 ${rel}`)
  }
}
console.log(`机场数据检查：${data.length}/42`)
for (const brand of data) {
  console.log(
    `${brand.slug.padEnd(13)} ${String((brand.faq || []).length).padStart(2)} FAQ  ${String((brand.packages || []).length).padStart(2)} 套餐  ${brand.hasTestImage ? '有图' : '资料'}`,
  )
}
if (warnings.length) {
  console.warn(`警告 ${warnings.length} 条`)
  for (const warning of warnings.slice(0, 25)) console.warn(`  - ${warning}`)
}
if (errors.length) {
  console.error(`失败 ${errors.length} 条`)
  for (const error of errors.slice(0, 60)) console.error(`  - ${error}`)
  process.exit(1)
}
console.log('机场数据与页面检查通过。')
