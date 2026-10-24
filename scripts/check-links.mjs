import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, join, relative, extname } from 'node:path'

const root = resolve(process.cwd())
const docs = resolve(root, 'docs')
const errors = []
const skipped = new Set()

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (name === '.vitepress' || name === 'node_modules' || name.startsWith('.')) continue
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, files)
    else if (extname(full) === '.md') files.push(full)
  }
  return files
}

function targetFile(link) {
  const clean = decodeURIComponent(link.split('#')[0].split('?')[0])
  if (!clean || clean.startsWith('http') || clean.startsWith('mailto:') || clean.startsWith('tel:')) return null
  if (!clean.startsWith('/')) return null
  if (/\.(json|xml|txt|png|jpe?g|webp|svg|ico|webmanifest)$/.test(clean)) {
    return resolve(docs, `public${clean}`)
  }
  const path = clean === '/' ? '/index' : clean.replace(/\/$/, '')
  const candidates = path.endsWith('.md')
    ? [resolve(docs, `.${path}`)]
    : [resolve(docs, `.${path}.md`), resolve(docs, `.${path}/index.md`)]
  return candidates.find((candidate) => existsSync(candidate)) || candidates[0]
}

const files = walk(docs)
for (const file of files) {
  const raw = readFileSync(file, 'utf8')
  const content = raw.replace(/```[\s\S]*?```/g, '')
  const links = []
  for (const match of content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) links.push(match[1].trim())
  for (const match of content.matchAll(/<a\s+[^>]*href="([^"]+)"/g)) links.push(match[1].trim())
  for (const link of links) {
    if (link.startsWith('#') || link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('tel:')) continue
    if (link.startsWith('/assets/') || link.startsWith('/og-') || link.startsWith('/logo') || link.startsWith('/favicon')) continue
    const target = targetFile(link)
    if (!target) {
      skipped.add(`${relative(root, file)} -> ${link}`)
      continue
    }
    if (!existsSync(target)) {
      errors.push(`${relative(root, file)} -> ${link}（找不到 ${relative(root, target)}）`)
    }
  }
}

if (errors.length) {
  console.error('内链检查失败：')
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}
console.log(`内链检查通过，扫描 ${files.length} 个 Markdown 文件。`)
if (skipped.size) {
  console.log(`跳过 ${skipped.size} 个无法映射为本地 Markdown 的链接（多为外部资源或静态文件）。`)
}
