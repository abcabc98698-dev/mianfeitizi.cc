import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const brandDir = resolve(root, 'docs/.vitepress/data/airports')
mkdirSync(resolve(brandDir, 'raw'), { recursive: true })

const sources = [
  { file: 'C:/Users/Pro User/Desktop/机场品牌信息/28个机场品牌清单.txt', kind: '28' },
  { file: 'C:/Users/Pro User/Desktop/机场品牌信息/14个机场品牌清单.txt', kind: '14' },
]

const slugMap = {
  光速云: 'guangsuyun', 飞猫云: 'feimao', 微风网络: 'weifeng', 暮光加速: 'muguang', 大佬云: 'dalaoyun',
  星岛梦: 'xingdaomeng', 二猫云: 'ermao', 无忧链接: 'wuyou', 唯兔云: 'weitu', Firefly: 'firefly',
  宇宙云: 'yuzhou', U1S1: 'u1s1', 灵猫网络: 'lingmao', 极连云: 'jilian', 光年梯: 'guangnian',
  一翻云: 'yifan', SOGO云: 'sogo', 可信云: 'kexin', 速界: 'sujie', 闪跃: 'shanyue',
  全球云: 'quanqiu', 闪电鼠: 'shandianshu', 云界线: 'yunjiexian', 榴莲云: 'liulianyun',
  神行加速: 'shenxing', 环球梯: 'huanqiuti', 隐形人: 'yinxingren', 梯子云: 'tiziyun',
  WgetCloud: 'wgetcloud', 白月光: 'baiyueguang', FlyingBird: 'flyingbird', CyberGuard: 'cyberguard',
  龙猫云: 'longmaoyun', FATCAT: 'fatcat', TNTCloud: 'tntcloud', 青云梯: 'qingyunti',
  山水云: 'shanshuiyun', 灵动云: 'lingdongyun', 浪网: 'langwang', EdgeNova: 'edgenova',
  萤火虫: 'yinghuochong', sslar: 'sslar',
}

const speedtestImages = {
  sogo: 'SOGO云-节点测速实测.png',
  u1s1: 'U1S1-节点测速实测.png',
  yifan: '一翻云-节点测速实测.png',
  ermao: '二猫云-节点测速实测.png',
  guangnian: '光年梯-节点测速实测.png',
  guangsuyun: '光速云-节点测速实测.png',
  quanqiu: '全球云-节点测速实测.png',
  kexin: '可信云-节点测速实测.png',
  weitu: '唯兔云-节点测速实测.png',
  yuzhou: '宇宙云-节点测速实测.png',
  muguang: '幕光加速-节点测速实测.png',
  weifeng: '微风-节点测速实测.png',
  xingdaomeng: '星岛梦-节点测速实测.png',
  jilian: '极连云-节点测速实测.png',
  lingmao: '灵猫网络-节点测速实测.png',
  sujie: '速界-节点测速实测.png',
  feimao: '飞猫云-节点测速实测.png',
}

const extraJpgs = {
  guangsuyun: [
    { file: 'C:/Users/Pro User/Desktop/光速云测试图解锁图/photo_2026-08-19_12-13-01.jpg', kind: 'speedtest', batch: '2026-08-19' },
    { file: 'C:/Users/Pro User/Desktop/光速云测试图解锁图/photo_2026-08-19_12-13-50.jpg', kind: 'speedtest', batch: '2026-08-19' },
    { file: 'C:/Users/Pro User/Desktop/光速云测试图解锁图/photo_2026-08-19_12-13-58.jpg', kind: 'speedtest', batch: '2026-08-19' },
    { file: 'C:/Users/Pro User/Desktop/光速云测试图解锁图/photo_2026-08-19_12-18-40.jpg', kind: 'unlock', batch: '2026-08-19' },
    { file: 'C:/Users/Pro User/Desktop/光速云测试图解锁图/photo_2026-08-19_12-20-10.jpg', kind: 'speedtest', batch: '2026-08-19' },
  ],
}

function cleanName(name) {
  return name.replace(/^\d+\.\s*/, '').replace(/\s*（.*$/, '').replace(/\s+/g, '').trim()
}

function parseSection(section, name, file, kind) {
  const lines = section.split(/\r?\n/)
  const url = section.match(/https?:\/\/[^\s`）)]+/)?.[0] || ''
  const baseLines = []
  const featureLines = []
  const packageLines = []
  const speedLines = []
  const unlockLines = []
  const pendingLines = []
  let mode = 'base'
  let intro = ''

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (/^核心特色/.test(trimmed)) { mode = 'features'; continue }
    if (/^套餐价格/.test(trimmed)) { mode = 'packages'; continue }
    if (/^测速/.test(trimmed)) { mode = 'speed'; continue }
    if (/^流媒体\s*&\s*AI|^流媒体/.test(trimmed)) { mode = 'unlock'; continue }
    if (/^介绍说明/.test(trimmed)) { mode = 'intro'; continue }
    if (/^待核实信息/.test(trimmed)) { mode = 'pending'; continue }
    if (/^基础信息/.test(trimmed)) { mode = 'base'; continue }
    if (trimmed === '---') continue

    if (mode === 'base') baseLines.push(trimmed)
    else if (mode === 'features') featureLines.push(trimmed)
    else if (mode === 'packages') {
      if (/套餐名称|计费方式|价格|流量周期/.test(trimmed)) continue
      if (/^套餐日期|^此表|^旧资料/.test(trimmed)) continue
      if (trimmed.includes('¥') || trimmed.includes('GB') || trimmed.includes('G\t')) packageLines.push(trimmed)
    } else if (mode === 'speed') {
      if (/节点地区|统计延迟|统计下载|测试日期/.test(trimmed)) continue
      if (/\d+\s*(ms|Mbps|MB\/s)/.test(trimmed)) speedLines.push(trimmed)
    } else if (mode === 'unlock') {
      if (/^-\s*(AI|流媒体)/.test(trimmed) || /^(AI|流媒体)/.test(trimmed)) unlockLines.push(trimmed)
      else if (unlockLines.length) unlockLines.push(trimmed)
    } else if (mode === 'intro') {
      intro += `${trimmed}\n`
    } else if (mode === 'pending') {
      pendingLines.push(trimmed)
    }
  }

  const slug = slugMap[name] || ''
  const evidence = []
  if (speedtestImages[slug]) {
    evidence.push({
      file: `C:/Users/Pro User/Desktop/机场品牌信息/extracted/${speedtestImages[slug]}`,
      kind: 'speedtest',
      batch: '2026-08-11',
      label: '本站保留的节点测速截图',
    })
  }
  if (extraJpgs[slug]) evidence.push(...extraJpgs[slug])

  return {
    name,
    slug,
    source: file,
    sourceKind: kind,
    affiliateUrl: url,
    baseLines,
    featureLines,
    packageLines,
    speedLines,
    unlockLines,
    pendingLines,
    intro: intro.trim(),
    rawText: section,
    evidence,
    hasTestImage: Boolean(speedtestImages[slug]),
  }
}

const brands = []
for (const source of sources) {
  const text = readFileSync(source.file, 'utf8')
  if (source.kind === '28') {
    const re = /^(?:主推)?##\s*\d+\.\s*(.+)$/gm
    const matches = [...text.matchAll(re)]
    for (let i = 0; i < matches.length; i++) {
      const start = matches[i].index
      const end = i + 1 < matches.length ? matches[i + 1].index : text.length
      brands.push(parseSection(text.slice(start, end), cleanName(matches[i][1]), source.file, source.kind))
    }
  } else {
    const lines = text.split(/\r?\n/)
    const starts = []
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].trim() && lines[i + 1].trim() === '基础信息') starts.push({ index: i, name: cleanName(lines[i].trim()) })
    }
    for (let i = 0; i < starts.length; i++) {
      const start = starts[i].index
      const end = i + 1 < starts.length ? starts[i + 1].index : lines.length
      brands.push(parseSection(lines.slice(start, end).join('\n'), starts[i].name, source.file, source.kind))
    }
  }
}

const seen = new Set()
for (const brand of brands) {
  if (!brand.slug) console.error('NO SLUG', brand.name)
  if (seen.has(brand.slug)) console.error('DUPLICATE', brand.slug)
  seen.add(brand.slug)
  writeFileSync(resolve(brandDir, 'raw', `${brand.slug}.txt`), `${brand.name}\n\n${brand.rawText}\n`, 'utf8')
}

writeFileSync(resolve(brandDir, 'airports.raw.json'), JSON.stringify({ brands }, null, 2), 'utf8')
console.log('parsed', brands.length, 'brands; image brands', brands.filter((b) => b.hasTestImage).length)
for (const b of brands) console.log(b.slug, b.name, 'pkg', b.packageLines.length, 'speed', b.speedLines.length, 'img', b.hasTestImage)
