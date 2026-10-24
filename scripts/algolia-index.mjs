import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve, extname } from 'node:path'
import { load } from 'cheerio'

const root = resolve(process.cwd())
const dist = resolve(root, 'docs/.vitepress/dist')
const appId = process.env.ALGOLIA_APP_ID?.trim()
const adminKey = process.env.ALGOLIA_ADMIN_KEY?.trim()
const indexName = process.env.ALGOLIA_INDEX_NAME?.trim()
const site = 'https://mianfeitizi.cc'

if (!appId || !adminKey || !indexName) {
  console.error('缺少 ALGOLIA_APP_ID、ALGOLIA_ADMIN_KEY 或 ALGOLIA_INDEX_NAME。请在 .env 或环境中配置。')
  process.exit(1)
}

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

function clean(value) {
  return value.replace(/\s+/g, ' ').replace(/\u200b/g, '').trim()
}

const records = []

for (const file of walk(dist)) {
  if (file.endsWith('404.html')) continue
  const route = routeOf(file)
  const $ = load(readFileSync(file, 'utf8'))
  const h1 = clean($('h1').first().text())
  const description = clean($('meta[name="description"]').attr('content') || '')
  const topic = route.split('/').filter(Boolean)[0] || 'home'

  const push = (objectID, lvl1, lvl2, lvl3, content, anchor) => {
    const text = clean(content)
    if (!text) return
    records.push({
      objectID,
      url: `${site}${route}${anchor ? `#${anchor}` : ''}`,
      hierarchy: {
        lvl0: '免梯指数',
        lvl1,
        lvl2,
        lvl3,
      },
      content: text.slice(0, 1800),
      description,
      topic,
      type: route.startsWith('/guides/') ? 'guide' : 'topic',
      lang: 'zh-CN',
    })
  }

  push(`${route}#intro`, h1 || '免梯指数', null, null, description, '')
  let lvl2 = ''
  $('h2, h3').each((index, element) => {
    const tag = (element.tagName || '').toLowerCase()
    const heading = clean($(element).text())
    const id = $(element).attr('id') || `heading-${index}`
    if (tag === 'h2') {
      lvl2 = heading
      push(`${route}#${id}`, h1 || '免梯指数', heading, null, heading, id)
    } else {
      let content = ''
      let node = $(element).next()
      while (node.length) {
        const nextTag = (node.get(0).tagName || '').toLowerCase()
        if (nextTag === 'h2' || nextTag === 'h3') break
        content += ` ${node.text()}`
        node = node.next()
      }
      push(`${route}#${id}`, h1 || '免梯指数', lvl2, heading, `${heading} ${content}`, id)
    }
  })
}

async function algolia(path, init) {
  const response = await fetch(`https://${appId}.algolia.net${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Algolia-API-Key': adminKey,
      'X-Algolia-Application-Id': appId,
      ...(init?.headers || {}),
    },
  })
  if (!response.ok) {
    throw new Error(`Algolia ${response.status}: ${await response.text()}`)
  }
  return response.json()
}

await algolia(`/1/indexes/${encodeURIComponent(indexName)}/clear`, { method: 'POST', body: '{}' })

for (let i = 0; i < records.length; i += 500) {
  const chunk = records.slice(i, i + 500)
  await algolia(`/1/indexes/${encodeURIComponent(indexName)}/batch`, {
    method: 'POST',
    body: JSON.stringify({
      requests: chunk.map((record) => ({ action: 'addObject', body: record })),
    }),
  })
  console.log(`上传 ${Math.min(i + 500, records.length)} / ${records.length}`)
}

console.log(`Algolia 索引完成：${records.length} 条记录，索引 ${indexName}。`)
