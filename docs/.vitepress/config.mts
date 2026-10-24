import { defineConfig } from 'vitepress'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import topics from './data/topics.json'
import airports from './data/airports.json'

const SITE = 'https://mianfeitizi.cc'
const SITE_NAME = '免梯指数'
const SITE_TAGLINE = '免费梯子与低预算机场的核验型知识库'
const DEFAULT_OG = `${SITE}/og-default.png`

type Topic = (typeof topics)[number]

function loadEnvFile(file: string) {
  try {
    const raw = readFileSync(resolve(process.cwd(), file), 'utf8')
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (!match) continue
      const [, key, value] = match
      if (!(key in process.env)) process.env[key] = value.replace(/^['"]|['"]$/g, '')
    }
  } catch {
    // .env is optional
  }
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const algoliaAppId = process.env.ALGOLIA_APP_ID?.trim()
const algoliaApiKey = process.env.ALGOLIA_API_KEY?.trim()
const algoliaIndexName = process.env.ALGOLIA_INDEX_NAME?.trim()
const algoliaEnabled = Boolean(algoliaAppId && algoliaApiKey && algoliaIndexName)

function routeOf(relativePath: string) {
  if (relativePath === 'index.md') return '/'
  const withoutExt = relativePath.replace(/\.md$/, '')
  if (withoutExt.endsWith('/index')) return `/${withoutExt.slice(0, -'index'.length)}`
  return `/${withoutExt}`
}

function dateOnly(value: unknown, fallback = '2026-10-24') {
  if (!value) return fallback
  const raw = value instanceof Date ? value.toISOString() : String(value)
  return raw.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || fallback
}

function breadcrumbFor(route: string, title: string) {
  const items: Array<Record<string, unknown>> = [
    { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
  ]
  if (route === '/airports/' || route.startsWith('/airports/')) {
    items.push({ '@type': 'ListItem', position: 2, name: '机场品牌库', item: `${SITE}/airports/` })
    if (route !== '/airports/') {
      items.push({ '@type': 'ListItem', position: 3, name: title, item: `${SITE}${route}` })
    }
    return { '@type': 'BreadcrumbList', itemListElement: items }
  }
  const topic = topics.find((item) => route === `/${item.slug}/` || route.startsWith(`/${item.slug}/`))
  if (topic) {
    if (route === `/${topic.slug}/`) {
      items.push({ '@type': 'ListItem', position: 2, name: topic.label, item: `${SITE}/${topic.slug}/` })
    } else {
      items.push({ '@type': 'ListItem', position: 2, name: topic.label, item: `${SITE}/${topic.slug}/` })
      items.push({ '@type': 'ListItem', position: 3, name: title, item: `${SITE}${route}` })
    }
  } else if (route !== '/') {
    items.push({ '@type': 'ListItem', position: 2, name: title, item: `${SITE}${route}` })
  }
  return { '@type': 'BreadcrumbList', itemListElement: items }
}

export default defineConfig({
  lang: 'zh-CN',
  title: SITE_NAME,
  titleTemplate: ':title | 免梯指数',
  description: `${SITE_TAGLINE}。免费资源零结果可公开核验，价格、流量与性能数据均标注口径。`,
  cleanUrls: true,
  lastUpdated: false,
  ignoreDeadLinks: process.env.IGNORE_DEAD_LINKS === '1' ? true : false,
  sitemap: {
    hostname: SITE,
    transformItems(items) {
      return items.filter((item) => !/(^|\/)404\/?$/.test(item.url))
    },
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
    ['meta', { name: 'application-name', content: SITE_NAME }],
    ['meta', { name: 'apple-mobile-web-app-title', content: SITE_NAME }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'theme-color', content: '#07110f' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    ['meta', { name: 'format-detection', content: 'telephone=no' }],
    ['meta', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }],
    ['meta', { property: 'og:site_name', content: SITE_NAME }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: DEFAULT_OG }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: DEFAULT_OG }],
    ['link', { rel: 'alternate', type: 'application/json', href: '/content-plan.json', title: '内容蓝图 JSON' }],
  ],
  markdown: {
    image: { lazyLoading: true },
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: false,
    config(md) {
      const open = md.renderer.rules.table_open
      const close = md.renderer.rules.table_close
      md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
        const rendered = open
          ? open(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
        return `<div class="mf-table-scroll">${rendered}`
      }
      md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
        const rendered = close
          ? close(tokens, idx, options, env, self)
          : self.renderToken(tokens, idx, options)
        return `${rendered}</div>`
      }
    },
  },
  transformHead({ pageData }) {
    const route = routeOf(pageData.relativePath)
    const fm = pageData.frontmatter || {}
    const title = (fm.title as string) || pageData.title || SITE_NAME
    const description = (fm.description as string) || (pageData.description as string) || `${SITE_TAGLINE}。`
    const canonical = `${SITE}${route}`
    const isHome = route === '/'
    const isTopic = topics.some((item) => route === `/${item.slug}/`)
    const isGuide = route.startsWith('/guides/')
    const isAirportLibrary = route === '/airports/'
    const isAirport = route.startsWith('/airports/') && !isAirportLibrary
    const dateModified = dateOnly(fm.lastReviewed)
    const topic = topics.find((item) => route === `/${item.slug}/`)
    const ogType = isGuide || isAirport ? 'article' : 'website'

    const head: Array<[string, Record<string, string>, string?]> = [
      ['link', { rel: 'canonical', href: canonical }],
      ['link', { rel: 'alternate', hreflang: 'zh-CN', href: canonical }],
      ['link', { rel: 'alternate', hreflang: 'x-default', href: canonical }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:type', content: ogType }],
      ['meta', { property: 'og:url', content: canonical }],
      ['meta', { property: 'og:image:alt', content: `${title} · ${SITE_NAME}` }],
      ['meta', { name: 'twitter:title', content: title }],
      ['meta', { name: 'twitter:description', content: description }],
      ['meta', { name: 'twitter:image:alt', content: `${title} · ${SITE_NAME}` }],
    ]

    const metaKeywords = (fm.keywords as string[] | undefined) || topic?.keywords
    if (metaKeywords?.length) {
      head.push(['meta', { name: 'keywords', content: metaKeywords.join(', ') }])
    }
    if (isGuide) {
      head.push(['meta', { property: 'article:published_time', content: dateOnly(fm.datePublished) }])
      head.push(['meta', { property: 'article:modified_time', content: dateModified }])
      head.push(['meta', { property: 'article:section', content: '核验指南' }])
    }
    if (isAirport) {
      head.push(['meta', { property: 'article:published_time', content: dateOnly(fm.datePublished) }])
      head.push(['meta', { property: 'article:modified_time', content: dateModified }])
      head.push(['meta', { property: 'article:section', content: '机场品牌测评' }])
    }

    const organization = {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: SITE_NAME,
      url: `${SITE}/`,
      logo: `${SITE}/logo.svg`,
      description: SITE_TAGLINE,
      knowsAbout: topics.flatMap((item) => item.keywords),
    }
    const website = {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: SITE_NAME,
      inLanguage: 'zh-CN',
      publisher: { '@id': `${SITE}/#organization` },
    }

    const graph: Array<Record<string, unknown>> = [organization]
    if (isHome) graph.push(website)

    if (route !== '/') {
      graph.push(breadcrumbFor(route, title))
    }

    const pageSchema: Record<string, unknown> = {
      '@type': isTopic || isAirportLibrary ? 'CollectionPage' : isGuide || isAirport ? 'Article' : 'WebPage',
      '@id': `${canonical}#page`,
      url: canonical,
      name: title,
      description,
      inLanguage: 'zh-CN',
      isPartOf: { '@id': `${SITE}/#website` },
      about: isAirport
        ? { '@type': 'Service', name: (fm.airportName as string) || title }
        : topic
          ? { '@type': 'Thing', name: topic.label }
          : undefined,
      dateModified,
      datePublished: dateOnly(fm.datePublished),
      author: { '@id': `${SITE}/#organization` },
      publisher: { '@id': `${SITE}/#organization` },
      isAccessibleForFree: true,
      keywords: (fm.keywords as string[] | undefined)?.join(', ') || topic?.keywords.join(', '),
    }
    if (isGuide || isAirport) {
      pageSchema.headline = title
      pageSchema.articleSection = isAirport ? '机场品牌测评' : '核验指南'
      pageSchema.mainEntityOfPage = { '@id': `${canonical}#page` }
      pageSchema.image = [DEFAULT_OG]
    }
    if (isAirportLibrary) {
      pageSchema.mainEntity = {
        '@type': 'ItemList',
        name: '42家机场品牌库',
        numberOfItems: airports.length,
        itemListElement: (airports as Array<{ slug: string; name: string; tagline?: string }>).map((airport, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: airport.name,
          url: `${SITE}/airports/${airport.slug}`,
        })),
      }
    }
    if (isTopic && topic) {
      pageSchema.hasPart = topic.categories.flatMap((category) => {
        const categoryPart: Record<string, unknown> = {
          '@type': 'ItemList',
          name: category.name,
          url: `${canonical}#cat-${category.slug}`,
          numberOfItems: category.clusters.length,
        }
        return [categoryPart]
      })
      pageSchema.mainEntity = {
        '@type': 'ItemList',
        name: `${topic.label}分类与内容集群`,
        numberOfItems: topic.categories.length,
        itemListElement: topic.categories.map((category, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: category.name,
          url: `${canonical}#cat-${category.slug}`,
        })),
      }
    }
    graph.push(pageSchema)

    head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
    ])

    if (fm.noindex) {
      head.push(['meta', { name: 'robots', content: 'noindex, nofollow' }])
    }

    return head
  },
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '免梯指数',
    nav: [
      { text: '首页', link: '/' },
      { text: '免费梯子', link: '/free-vpn/' },
      { text: '免费机场', link: '/free-airport/' },
      { text: '免费试用', link: '/free-trial/' },
      { text: '便宜梯子', link: '/budget-vpn/' },
      { text: '机场推荐', items: [
        { text: '筛选方法', link: '/airport-recommendation/' },
        { text: '42 家品牌库', link: '/airports/' },
      ] },
      { text: '免费代理软件', link: '/proxy-software/' },
      { text: '资源检测', link: '/resource-check/' },
      { text: '新手帮助', link: '/beginner/' },
    ],
    search: algoliaEnabled
      ? {
          provider: 'algolia',
          options: {
            appId: algoliaAppId,
            apiKey: algoliaApiKey,
            indexName: algoliaIndexName,
            placeholder: '搜索专题、指标或问题',
            translations: {
              button: { buttonText: '搜索内容', buttonAriaLabel: '搜索内容' },
              modal: {
                searchBox: { resetButtonTitle: '清空', cancelButtonText: '关闭' },
                startScreen: { noRecentSearchesText: '暂无搜索历史' },
                noResultsText: '没有找到结果，试试更具体的关键词',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        }
      : {
          provider: 'local',
          options: {
            placeholder: '搜索专题、指标或问题',
            translations: {
              button: { buttonText: '搜索内容', buttonAriaLabel: '搜索内容' },
              modal: {
                noResultsText: '没有找到结果，试试更具体的关键词',
                resetButtonTitle: '清空查询',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
    outline: { level: [2, 3], label: '本页目录' },
    docFooter: { prev: '上一节', next: '下一节' },
    darkModeSwitchLabel: '外观',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    sidebarMenuLabel: '菜单',
    returnToTopLabel: '回到顶部',
    externalLinkIcon: true,
    footer: {
      message: '只发布可复核的信息。没有合格免费资源时，页面显示真实的零结果。',
      copyright: '© 2026 免梯指数 · mianfeitizi.cc',
    },
  },
  vite: {
    build: { chunkSizeWarningLimit: 1600 },
    server: {
      watch: {
        ignored: ['**/.index.md.*.tmpdir/**', '**/*.tmp', '**/.~*'],
      },
    },
  },
})
