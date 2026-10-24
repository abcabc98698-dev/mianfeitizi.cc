import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'

const root = resolve(process.cwd())
const topicsPath = resolve(root, 'docs/.vitepress/data/topics.json')
const plansDir = resolve(root, 'docs/.vitepress/data/plans')
const publicPlanPath = resolve(root, 'docs/public/content-plan.json')
const topics = JSON.parse(readFileSync(topicsPath, 'utf8'))

const errors = []
const warnings = []
let totalCats = 0
let totalClusters = 0
let totalTitles = 0

for (const topic of topics) {
  const planPath = resolve(plansDir, `${topic.slug}.json`)
  if (!existsSync(planPath)) {
    errors.push(`${topic.slug}: 缺少 ${planPath}`)
    continue
  }
  let plan
  try {
    plan = JSON.parse(readFileSync(planPath, 'utf8'))
  } catch (error) {
    errors.push(`${topic.slug}: plan JSON 解析失败 ${error.message}`)
    continue
  }

  const clusterSlugs = new Set()
  for (const category of topic.categories) {
    totalCats += 1
    for (const cluster of category.clusters) {
      totalClusters += 1
      clusterSlugs.add(cluster.slug)
      const list = plan[cluster.slug]
      if (!Array.isArray(list)) {
        errors.push(`${topic.slug}/${cluster.slug}: 缺少选题数组`)
        cluster.articles = []
        continue
      }
      if (list.length < 6 || list.length > 8) {
        errors.push(`${topic.slug}/${cluster.slug}: 选题数 ${list.length}，要求 6–8`)
      }
      const seen = new Set()
      cluster.articles = list.map((article, index) => {
        const title = String(article.title || '').trim()
        const slug = String(article.slug || '').trim()
        if (!title) errors.push(`${topic.slug}/${cluster.slug}[${index}]: 空标题`)
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          errors.push(`${topic.slug}/${cluster.slug}[${index}]: slug 不合法 ${slug}`)
        }
        if (seen.has(slug)) errors.push(`${topic.slug}/${cluster.slug}: 重复 slug ${slug}`)
        seen.add(slug)
        return {
          slug,
          title,
          type: article.type || '解释',
          intent: article.intent || '',
          status: 'planned',
        }
      })
      totalTitles += cluster.articles.length
    }
  }

  const extra = Object.keys(plan).filter((key) => !clusterSlugs.has(key))
  if (extra.length) errors.push(`${topic.slug}: plan 含未知 cluster 键 ${extra.join(', ')}`)
  const missing = [...clusterSlugs].filter((key) => !(key in plan))
  if (missing.length) errors.push(`${topic.slug}: plan 缺少 cluster 键 ${missing.join(', ')}`)
}

if (errors.length) {
  console.error('内容蓝图校验失败：')
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

writeFileSync(topicsPath, `${JSON.stringify(topics, null, 2)}\n`, 'utf8')

const plan = {
  site: 'https://mianfeitizi.cc',
  generatedAt: '2026-10-24',
  policy:
    '选题为编辑路线图，不是已发布页面。未完成独立核验与写作的题目不会生成可点击链接，也不进入 sitemap。',
  totals: {
    topics: topics.length,
    categories: totalCats,
    clusters: totalClusters,
    titles: totalTitles,
  },
  topics,
}
mkdirSync(dirname(publicPlanPath), { recursive: true })
writeFileSync(publicPlanPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8')

if (warnings.length) {
  for (const warning of warnings) console.warn(`WARN ${warning}`)
}
console.log(
  `已合并 ${topics.length} 个专题 / ${totalCats} 个分类 / ${totalClusters} 个集群 / ${totalTitles} 个选题`,
)
console.log(`公开蓝图：${publicPlanPath}`)
