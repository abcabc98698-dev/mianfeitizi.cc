# 42 家机场品牌库数据与内容规范

版本 2026-10-24。所有参与品牌数据整理与撰写的子任务，先完整阅读本文件，再读取对应的 `docs/.vitepress/data/airports/raw/<slug>.txt` 原始资料。

## 1. 目标与边界

在现有 VitePress 站点新增 `/airports/` 机场品牌库与 42 个品牌详情页。品牌库是独立的商业资料区，与 `免费机场` 的零结果台账分开，不改变“没有合格免费资源时显示 0 条”的规则。

每一条品牌数据必须能回答“这条信息来自哪里、什么时候记录、是实测还是品牌声明”。没有资料就写“待核实”，不得编造价格、套餐、节点数、测速、解锁、运营状态、用户评价或使用经历。

## 2. 数据分级

- `measured`：用户提供的测速/解锁截图直接显示的内容。只用于截图所示时间点，不能证明长期稳定或当前可用。
- `vendor`：品牌资料、官网、客服或历史项目记录里的价格、套餐、线路、协议、节点、解锁声明。必须标注“品牌资料”。
- `editorial`：适合人群、限制、风险与选择建议。必须能从资料和条件推导，不能伪装成实测。
- `unverified`：没有来源的字段，写“待核实”，不得补写。

## 3. 42 个 slug 与文件

写入 `docs/.vitepress/data/airports/<slug>.json`。不要写页面，不要改其他文件。

- 图片组 A：`guangsuyun`、`feimao`、`weifeng`、`muguang`、`xingdaomeng`、`ermao`
- 图片组 B：`weitu`、`u1s1`、`lingmao`、`jilian`、`guangnian`、`yifan`
- 图片组 C：`sogo`、`kexin`、`sujie`、`quanqiu`、`yuzhou`
- 资料组 D：`dalaoyun`、`wuyou`、`firefly`、`shanyue`、`shandianshu`、`yunjiexian`、`liulianyun`、`shenxing`、`huanqiuti`
- 资料组 E：`yinxingren`、`tiziyun`、`wgetcloud`、`baiyueguang`、`flyingbird`、`cyberguard`、`longmaoyun`、`fatcat`
- 资料组 F：`tntcloud`、`qingyunti`、`shanshuiyun`、`lingdongyun`、`langwang`、`edgenova`、`yinghuochong`、`sslar`

图片组 17 个品牌有用户提供的 2026-08-11 测速截图（含截图数值与测试条件），`guangsuyun` 还有 5 张 2026-08-19 批次的测速/解锁截图。品牌页由组件自动读取 `/airports/evidence/` 下的图片，JSON 不需要写图片路径，只写 `hasTestImage: true/false`、`evidenceKind` 与 `evidenceNote`。

## 4. JSON 结构

严格使用以下字段。未知值用空字符串、空数组或 `null`，不要编造。

```json
{
  "slug": "guangsuyun",
  "name": "光速云",
  "english": "Guangsu Cloud",
  "shortName": "光速云",
  "logo": "/airports/logos/guangsuyun.webp",
  "accent": "#2fc6a7",
  "tagline": "IEPL 专线 / VLESS / 老牌综合型（品牌资料）",
  "founded": "2020 年（品牌资料）",
  "protocols": ["VLESS", "IEPL"],
  "network": "IEPL 专线与企业级内网专线（品牌资料）",
  "regions": ["香港", "台湾", "日本", "新加坡", "美国"],
  "priceFrom": "约 8 元/月",
  "priceNote": "99 元年付折算，非普通月付价；品牌资料，需官网复核",
  "monthlyFrom": 8.25,
  "packages": [
    {
      "name": "轻量版",
      "price": "¥99",
      "billing": "年付",
      "data": "69GB/月",
      "note": "品牌资料"
    }
  ],
  "affiliateUrl": "https://...",
  "coupon": "AMM",
  "vendorSpeed": [
    {
      "region": "香港",
      "latency": "22ms",
      "download": "529Mbps",
      "date": "2026-10-19",
      "source": "品牌资料标注，非本站独立复测"
    }
  ],
  "unlockClaims": ["ChatGPT：视节点而定（品牌资料）"],
  "features": ["IEPL 专线（品牌资料）", "..."],
  "limitations": ["套餐价格与库存需以官网为准", "..."],
  "suitable": ["..."],
  "notSuitable": ["..."],
  "risk": "一段 80–160 字的风险说明，包含价格/条款/可用性需复核，不承诺解锁或长期稳定。",
  "hasTestImage": true,
  "evidenceKind": "speedtest+unlock",
  "evidenceNote": "2026-08-11 与 2026-08-19 的截图只代表截图所示时间、节点与线路，不证明长期稳定或当前可用。",
  "dataStatus": "with-speedtest",
  "sourceLabel": "品牌资料 + 用户提供的测速/解锁截图",
  "sourceDate": "2026-10-19",
  "reviewDate": "2026-10-24",
  "readingTime": "12 分钟",
  "intro": "300–500 个汉字的直接结论，先回答这个品牌适合谁、核心限制是什么。",
  "analysis": "图片组 1,300–2,200 个汉字；资料组 600–1,000 个汉字。写品牌背景、套餐/线路、适用客户端、适合与不适合、与同类差异、核验建议。不得只替换品牌名。",
  "faq": [
    { "q": "光速云适合哪些人？", "a": "120–220 个汉字的条件化回答。" }
  ],
  "related": ["feimao", "weifeng", "weitu"],
  "seoTitle": "不超过 60 个中文字符的 Title",
  "seoDescription": "80–120 个中文字符的 Meta Description",
  "h1": "光速云机场测评：套餐、线路、测速截图与风险"
}
```

### 字段要求

- `logo` 只用现有 logo 的品牌填写：`guangsuyun`、`feimao`、`quanqiu`、`jilian`、`guangnian`、`tiziyun`、`lingdongyun`、`yinxingren`、`u1s1`、`sogo`、`sujie`、`xingdaomeng`、`yuzhou`、`ermao`、`longmaoyun`、`qingyunti`、`tntcloud`、`edgenova`、`flyingbird`。其余留空字符串。
- `accent` 用提供的品牌识别色之一：`#2fc6a7`、`#e9b44c`、`#6f9bff`、`#e88762`、`#b18cff`、`#55c8e8`、`#9ed36a`、`#f2d06b`、`#ef8fb3`、`#8bd3c7`。这是界面识别色，不宣称是官方标准色。
- `priceFrom` 与 `monthlyFrom` 必须从资料计算或抄录。年付/季付要注明折算；不能把折算价写成普通月付价。
- `packages` 保留资料中的套餐名、价格、计费周期、流量；多周期套餐可列代表性行，最多 14 行，并注明“资料记录多档，完整价格以官网为准”。没有套餐表时从 `基础数据` 中提取，不能空着不解释。
- `vendorSpeed` 只抄资料中的测速表；日期与来源要写。没有测速就 `[]`。
- `unlockClaims` 只写品牌资料声明的项目，必须带“品牌资料”或“视节点而定”。不能写成已实测。
- `hasTestImage` 只对有用户测速图的 17 个品牌为 true。`guangsuyun` 的 `evidenceKind` 写 `speedtest+unlock`；其余图片品牌写 `speedtest`。
- `dataStatus`：图片品牌 `with-speedtest`；只有品牌资料 `vendor-only`；关键字段缺失 `unverified`。
- `related` 必须从 42 个 slug 中选 3–5 个，不能引用不存在页面。
- `faq` 5–8 条，答案必须能独立成立；不要把同一问答复制到多个品牌。

## 5. 内容写作要求

- 先回答，再解释。`intro` 第一句直接说品牌定位和最大限制。
- 不写“最快”“最稳”“全网第一”“保证解锁”“100% 可用”。
- 不把品牌资料写成“实测”；所有品牌声明都带括号标注。
- 价格、流量、节点数、解锁状态必须带头注；没有资料就写“待核实”。
- 不编造用户评价、客服体验、跑路历史、退款记录。
- 不提供注册教程、支付教程或绕过实名/风控的步骤。CTA 只写“查看官网套餐（推广链接）”。
- 图片组要写清楚：截图是单日单线路记录，可能同时包含高速度、0B、超时节点；不能用来做跨品牌排行。
- 资料组要写清楚：没有本站测速图，页面以品牌资料为主，建议先月付/小额验证。
- 每篇至少 3 个内链意图：品牌库、机场推荐方法、资源检测；`related` 由组件渲染。

## 6. 图片与证据

不要在 JSON 中写图片路径；页面组件会读取 `docs/.vitepress/data/airport-images.json`。你只需要：
- `hasTestImage: true/false`
- `evidenceKind`
- `evidenceNote`（说明截图日期、局限，60–120 字）

不要把测速图数值 OCR 成精确统计；需要引用具体数值时，只抄原始资料文字，不改写图片。

## 7. 验收

完成后自行检查：
- JSON 可解析，UTF-8，无 BOM。
- slug 与文件名一致。
- 42 个品牌都有唯一 `slug`。
- `packages`、`vendorSpeed`、`faq`、`related` 字段存在。
- 内容没有品牌资料之外的虚构事实。
- 标点自然，避免破折号和“不是 A 而是 B”句式。
- 只有你负责的品牌 JSON 被修改。
