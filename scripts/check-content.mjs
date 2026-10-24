import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(process.cwd())
const topics = JSON.parse(readFileSync(resolve(root, 'docs/.vitepress/data/topics.json'), 'utf8'))
const topicSlugs = topics.map((topic) => topic.slug)
const errors = []
const rows = []

const requiredZero = new Set(['free-vpn', 'free-airport', 'free-trial', 'resource-check'])
const requiredSections = [
  [['决策', '判定'], 'ASCII 决策/判定树'],
  [['协议'], '协议原理'],
  [['成本'], '成本模型'],
  [['核验'], '核验方法'],
  [['常见问题'], 'FAQ'],
]

for (const topic of topics) {
  const file = resolve(root, `docs/${topic.slug}/index.md`)
  if (!existsSync(file)) {
    errors.push(`${topic.slug}: 缺少 ${file}`)
    continue
  }
  const raw = readFileSync(file, 'utf8')
  const body = raw.replace(/^---[\s\S]*?---\s*/, '')
  const bodyForHeadings = body.replace(/```[\s\S]*?```/g, '')
  const cjk = (body.match(/[\u4e00-\u9fff]/g) || []).length
  const h1 = (bodyForHeadings.match(/^# .+$/gm) || []).length
  rows.push({ topic: topic.label, cjk, h1, file: `docs/${topic.slug}/index.md` })

  if (cjk < 10000) errors.push(`${topic.slug}: 汉字数 ${cjk}，低于 10,000`)
  if (cjk > 15000) errors.push(`${topic.slug}: 汉字数 ${cjk}，高于 15,000`)
  if (h1 !== 1) errors.push(`${topic.slug}: H1 数量 ${h1}，应为 1`)
  if (!raw.includes('<TopicMap')) errors.push(`${topic.slug}: 缺少 <TopicMap>`)
  if (!raw.includes('<ArticleMeta')) errors.push(`${topic.slug}: 缺少 <ArticleMeta>`)
  if (!raw.includes('<PartnerCard')) errors.push(`${topic.slug}: 缺少 <PartnerCard>`)
  if (requiredZero.has(topic.slug) && !raw.includes('<ZeroResult')) {
    errors.push(`${topic.slug}: 缺少 <ZeroResult>`)
  }
  for (const [needles, label] of requiredSections) {
    if (!needles.some((needle) => raw.includes(needle))) errors.push(`${topic.slug}: 缺少${label}相关内容`)
  }
  if (!raw.includes('2026-10-24')) errors.push(`${topic.slug}: 缺少核验日期 2026-10-24`)
}

const homeFile = resolve(root, 'docs/index.md')
if (existsSync(homeFile)) {
  const raw = readFileSync(homeFile, 'utf8')
  const body = raw.replace(/^---[\s\S]*?---\s*/, '')
  const cjk = (body.match(/[\u4e00-\u9fff]/g) || []).length
  rows.unshift({ topic: '首页', cjk, h1: 0, file: 'docs/index.md' })
  if (!raw.includes('<HomeHero')) errors.push('首页: 缺少 <HomeHero>')
  if (cjk < 10000) errors.push(`首页: 汉字数 ${cjk}，低于 10,000`)
}

const guideSlugs = [
  'free-vpn-vs-free-airport',
  'free-open-source-clients',
  'trial-verification',
  'why-free-nodes-fail',
  'is-10-yuan-airport-worth-it',
  'is-free-proxy-software-safe',
  'one-time-data-pack',
  'free-airport-not-working',
]

for (const slug of guideSlugs) {
  const file = resolve(root, `docs/guides/${slug}.md`)
  if (!existsSync(file)) {
    errors.push(`guides/${slug}: 缺少文件`)
    continue
  }
  const raw = readFileSync(file, 'utf8')
  const body = raw.replace(/^---[\s\S]*?---\s*/, '')
  const bodyForHeadings = body.replace(/```[\s\S]*?```/g, '')
  const cjk = (body.match(/[\u4e00-\u9fff]/g) || []).length
  const h1 = (bodyForHeadings.match(/^# .+$/gm) || []).length
  rows.push({ topic: `指南 ${slug.slice(0, 14)}`, cjk, h1, file: `docs/guides/${slug}.md` })
  if (cjk < 8000) errors.push(`guides/${slug}: 汉字数 ${cjk}，低于 8,000`)
  if (cjk < 10000) console.warn(`WARN guides/${slug}: 汉字数 ${cjk}，低于 10,000 目标`)
  if (cjk > 15000) errors.push(`guides/${slug}: 汉字数 ${cjk}，高于 15,000`)
  if (h1 !== 1) errors.push(`guides/${slug}: H1 数量 ${h1}，应为 1`)
  if (!raw.includes('<ArticleMeta')) errors.push(`guides/${slug}: 缺少 <ArticleMeta>`)
  if (!raw.includes('<PartnerCard')) errors.push(`guides/${slug}: 缺少 <PartnerCard>`)
  if (!raw.includes('常见问题')) errors.push(`guides/${slug}: 缺少常见问题`)
  if (!raw.includes('2026-10-24')) errors.push(`guides/${slug}: 缺少核验日期 2026-10-24`)
}

console.log('内容字数与结构检查')
console.log('专题'.padEnd(16, ' ') + '汉字数'.padStart(8, ' ') + '  H1  文件')
for (const row of rows) {
  console.log(
    row.topic.padEnd(16, ' ') + String(row.cjk).padStart(8, ' ') + String(row.h1).padStart(4, ' ') + '  ' + row.file,
  )
}

if (errors.length) {
  console.error('\n检查失败：')
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}
console.log('\n全部 Hub 字数与结构检查通过。')
