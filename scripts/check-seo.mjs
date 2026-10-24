import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, resolve, extname } from 'node:path'
import { load } from 'cheerio'

const root = resolve(process.cwd())
const dist = resolve(root, 'docs/.vitepress/dist')
const site = 'https://mianfeitizi.cc'

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, files)
    else if (extname(full) === '.html') files.push(full)
  }
  return files
}

function routeOf(file) {
  const rel = relative(dist, file).replace(/\\/g, '/')
  if (rel === 'index.html') return '/'
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`
  return `/${rel.replace(/\.html$/, '')}`
}

function targetHtml(pathname) {
  let clean = pathname.split('#')[0].split('?')[0]
  if (clean === '/') return resolve(dist, 'index.html')
  clean = clean.replace(/\/$/, '')
  return [resolve(dist, `.${clean}.html`), resolve(dist, `.${clean}/index.html`)].find(existsSync)
}

const errors = []
const warnings = []
const pages = walk(dist).filter((file) => !file.endsWith('404.html'))
let faqPages = 0
let schemaScripts = 0

for (const file of pages) {
  const route = routeOf(file)
  const $ = load(readFileSync(file, 'utf8'))
  const title = $('title').first().text().trim()
  const description = $('meta[name="description"]').attr('content')?.trim() || ''
  const canonical = $('link[rel="canonical"]').attr('href')
  const h1 = $('h1').length

  if (!title) errors.push(`${route}: 缺少 title`)
  if (title.length > 65) warnings.push(`${route}: title ${title.length} 字符，可能被截断`)
  if (!description) errors.push(`${route}: 缺少 meta description`)
  if (description.length < 40) warnings.push(`${route}: description 偏短（${description.length}）`)
  if (description.length > 180) warnings.push(`${route}: description 偏长（${description.length}）`)
  if (!canonical || canonical !== `${site}${route}`) {
    errors.push(`${route}: canonical 异常 ${canonical || '缺失'}，期望 ${site}${route}`)
  }
  if (h1 !== 1) errors.push(`${route}: H1 数量 ${h1}`)
  if ($('meta[name="robots"][content*="noindex"]').length) errors.push(`${route}: 页面被 noindex`)
  if (!$('meta[property="og:image"]').attr('content')) errors.push(`${route}: 缺少 og:image`)

  const scripts = $('script[type="application/ld+json"]')
  schemaScripts += scripts.length
  let hasFaq = false
  scripts.each((_, el) => {
    try {
      const data = JSON.parse($(el).text())
      if (JSON.stringify(data).includes('"FAQPage"')) hasFaq = true
    } catch {
      errors.push(`${route}: JSON-LD 解析失败`)
    }
  })
  if (hasFaq) faqPages += 1
  const topicRoutes = new Set([
    '/free-vpn/',
    '/free-airport/',
    '/free-trial/',
    '/budget-vpn/',
    '/airport-recommendation/',
    '/proxy-software/',
    '/resource-check/',
    '/beginner/',
  ])
  const needsFaq =
    topicRoutes.has(route) ||
    (route.startsWith('/guides/') && route !== '/guides/') ||
    route === '/airports/' ||
    (route.startsWith('/airports/') && route !== '/airports/')
  if (needsFaq && !hasFaq) errors.push(`${route}: 缺少 FAQPage`)

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) return
    if (href.startsWith('/assets/') || /\.(png|svg|jpe?g|webp|ico|json|xml|txt)$/.test(href)) return

    let path = href
    let hash = ''
    if (href.startsWith('#')) {
      path = route
      hash = href.slice(1)
    } else if (href.startsWith('/') && href.includes('#')) {
      path = href.slice(0, href.indexOf('#'))
      hash = href.slice(href.indexOf('#') + 1)
    } else if (href.startsWith('/')) {
      path = href
    } else {
      return
    }

    const target = targetHtml(path)
    if (!target) {
      errors.push(`${route}: 死链 ${href}`)
      return
    }
    if (hash) {
      const id = decodeURIComponent(hash)
      const target$ = load(readFileSync(target, 'utf8'))
      const found = target$('[id]').toArray().some((node) => target$(node).attr('id') === id)
      if (!found) errors.push(`${route}: 锚点不存在 ${href}`)
    }
  })
}

if (warnings.length) {
  console.warn(`SEO 警告 ${warnings.length} 条：`)
  for (const warning of warnings.slice(0, 20)) console.warn(`  - ${warning}`)
}
if (errors.length) {
  console.error(`SEO 检查失败，共 ${errors.length} 条：`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}
console.log(`SEO 检查通过：${pages.length} 个页面，${faqPages} 个 FAQPage，${schemaScripts} 个 JSON-LD 脚本。`)
