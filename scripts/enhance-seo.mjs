import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve, extname } from 'node:path'
import { load } from 'cheerio'

const root = resolve(process.cwd())
const dist = resolve(root, 'docs/.vitepress/dist')

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, files)
    else if (extname(full) === '.html') files.push(full)
  }
  return files
}

function cleanText(value) {
  return value.replace(/\s+/g, ' ').replace(/\u200b/g, '').trim()
}

function extractFaq($) {
  const items = []
  $('h2').each((_, heading) => {
    const title = cleanText($(heading).text())
    if (!/常见问题|FAQ|faq/i.test(title)) return
    let node = $(heading).next()
    let current = null
    while (node.length) {
      const tag = (node.get(0).tagName || '').toLowerCase()
      if (tag === 'h2') break
      if (tag === 'h3' || tag === 'h4') {
        current = { q: cleanText(node.text()), a: [] }
        items.push(current)
      } else if (current) {
        const text = cleanText(node.text())
        if (text) current.a.push(text)
      }
      node = node.next()
    }
  })
  return items
    .map((item) => ({
      q: item.q.replace(/^Q\d*[.、:：]\s*/i, ''),
      a: cleanText(item.a.join(' ')).slice(0, 1200),
    }))
    .filter((item) => item.q.length > 4 && item.a.length > 20)
}

let pages = 0
let faqPages = 0
let faqCount = 0
let schemaUpdated = 0

for (const file of walk(dist)) {
  if (file.endsWith('404.html')) continue
  const html = readFileSync(file, 'utf8')
  const $ = load(html, { decodeEntities: false })
  let changed = false

  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).text()
    if (!raw.trim()) return
    let data
    try {
      data = JSON.parse(raw)
    } catch {
      return
    }
    const nodes = Array.isArray(data['@graph']) ? data['@graph'] : [data]
    for (const node of nodes) {
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
      if (!types.some((type) => ['Article', 'CollectionPage', 'WebPage'].includes(type))) continue
      if (!node.speakable) {
        node.speakable = {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.vp-doc > blockquote:first-of-type', '.VPPage blockquote:first-of-type', 'h1'],
        }
        changed = true
        schemaUpdated += 1
      }
    }
    $(element).text(JSON.stringify(data))
  })

  const hasFaq = $('script[type="application/ld+json"]')
    .toArray()
    .some((element) => $(element).text().includes('"FAQPage"'))
  if (!hasFaq) {
    const faq = extractFaq($)
    if (faq.length >= 3) {
      const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }
      const script = $('<script>').attr('type', 'application/ld+json').text(JSON.stringify(faqSchema))
      $('head').append(script)
      faqPages += 1
      faqCount += faq.length
      changed = true
    }
  }

  if (!$('meta[property="og:image:width"]').length) {
    $('head').append('<meta property="og:image:width" content="1200">')
    $('head').append('<meta property="og:image:height" content="630">')
    changed = true
  }

  if (!$('link[rel="alternate"][type="text/plain"]').length) {
    $('head').append('<link rel="alternate" type="text/plain" href="/llms.txt" title="站点机器可读摘要">')
    changed = true
  }

  if (changed) {
    writeFileSync(file, $.html(), 'utf8')
    pages += 1
  }
}

console.log(
  `SEO 增强完成：处理 ${pages} 个页面，注入 ${faqPages} 个 FAQPage（${faqCount} 个问答），补充 ${schemaUpdated} 个 speakable 声明。`,
)
if (faqPages === 0) {
  console.warn('WARN 没有识别到 FAQPage。请确认专题页与指南使用“常见问题”作为 H2，且问题使用 H3。')
}
console.log(`输出目录：${relative(root, dist)}`)
