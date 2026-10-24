# 免梯指数内容写作规范（Hub 与长尾选题）

版本 2026-10-24。所有写作子任务先完整读完本文件，再动笔。

## 1. 项目事实

- 站点：`https://mianfeitizi.cc`，中文，VitePress。
- 定位：免费梯子、免费机场、机场试用与低预算方案的核验型知识库。不是机场导航站，不卖机场，不做付费排名。
- 读者：第一次接触免费方案、预算有限、已经被失效节点或营销话术困扰的中文用户；也包含需要做技术判断的进阶用户。
- 当前免费资源收录数：**0 条**。审核日期 `2026-10-24`，下次复核 `2026-11-07`。
- 零结果的含义：本站没有发布同时满足五项标准的条目，不代表全网不存在相关服务。不要写成“全网没有免费机场”。
- 不写具体机场品牌、不写“当前可用”的免费节点、不编造价格、速度、延迟、节点数量、解锁能力、用户评价或测试结果。
- 涉及价格时，只能写预算档位与测算公式，必须标注“测算假设”。例如“假设 10 元/月、100 GB/月，则 0.10 元/GB”，不能写成某家实际报价。
- 涉及软件时，只写可公开核验的开源项目与官方发布页，例如 Mihomo、Xray-core、v2rayNG、FlClash、sing-box、Clash Verge Rev、Hiddify。不要把第三方打包站写成官方。
- 涉及协议时，按公开规范解释 Shadowsocks、VMess、VLESS、Trojan、Hysteria2、TUIC、WireGuard、TLS、QUIC、REALITY 的机制与边界，不编造 RFC 编号或性能数字。
- 涉及法律与合规时，写“不同司法辖区规则不同，使用前自行确认当地法律、服务条款与可接受使用政策”，不提供规避执法或规避实名制的操作指南。
- 所有“测试数据”只能是示例格式或标注为“测算假设/示例，非实测”。没有实测就不能写“我测了”。

## 2. 文风

- 中文技术编辑写作，句子直接，先回答再解释。避免营销腔、空泛排比和 AI 腔。
- 正文避免破折号；不要用“先说结论”“说白了”“值得注意的是”“不是 A 而是 B”这类翻案句或路标句。表格、术语定义与必要标签可以使用冒号。
- 每一节都增加新事实、新区别、新条件或新后果，不靠同义改写凑字数。
- 不编造人物、对话、使用经历与现场。需要例子时用“假设”“示例”“测算”。
- 数据优先于形容词。说“慢”要给出指标、单位、条件；说“便宜”要给出公式。
- 标题层级清晰，H2 下用 H3，不跳级。不要多个 H1。

## 3. Hub 页面必须交付

每个一级专题写两个文件。

### 3.1 内容蓝图 JSON

路径：`docs/.vitepress/data/plans/<topic-slug>.json`

只写对象，键必须是该专题 `docs/.vitepress/data/topics.json` 中 16 个 cluster 的 `slug`，一个不能少。每个键的值是 6 到 8 个选题对象：

```json
{
  "cluster-slug": [
    {
      "slug": "unique-kebab-case",
      "title": "完整、自然、有独立搜索价值的中文标题",
      "type": "解释|对比|核验|教程|清单|故障|成本",
      "intent": "一句话说明这篇要解决的具体问题"
    }
  ]
}
```

要求：

- 每个 cluster 6 到 8 个，合计 96 到 128 个选题。
- 标题不能靠替换关键词制造重复。同集群内每篇的搜索意图必须不同。
- 标题可以包含“免费机场”“10 元”“DNS”“TLS”等词，但不要机械堆砌“2026”“最新”“排名第一”。
- slug 只用小写字母、数字、连字符，专题内唯一。
- 不写具体机场品牌；不承诺免费额度。
- 写完后自行校验键数与数量。

### 3.2 专题 Hub

路径：`docs/<topic-slug>/index.md`

Frontmatter 模板：

```yaml
---
title: 免费梯子
description: 不超过 120 个中文字符的独立描述
lastReviewed: 2026-10-24
readingTime: 24 分钟
pageClass: topic-page
outline: [2, 3]
keywords: [免费梯子, 免费科学上网, 免费VPN]
---
```

正文第一行 H1，第二段用 blockquote 给直接结论，然后放 `<ArticleMeta reading="24 分钟" />`。

必须包含以下部分，顺序可以微调，但不能缺失：

1. 直接结论与适用边界
2. 这个专题解决什么问题（谁该读、谁不该读、不回答什么）
3. 概念与实体关系（至少 8 个实体，含关系表与一个 ASCII 关系图）
4. 技术参数对比大表（至少 10 行、6 列；必须标注单位、口径、数据性质）
5. ASCII 决策树（至少 3 层分支，放在 `text` 代码块）
6. 底层网络协议原理（TCP/UDP、TLS、QUIC、DNS、MTU、代理握手；至少两个 ASCII 图）
7. 成本模型与预算测算（公式、至少 2 个测算例子、一个假设表）
8. 核验方法与可复现条件（时间、环境、单位、证据；链接到 `/resource-check/#method`）
9. 安全、隐私与合规边界（威胁模型；不承诺匿名）
10. 分类地图（解释 8 个二级分类的定位），并插入 `<TopicMap topic="<topic-slug>" />`
11. 跨专题选择路径（至少 4 个其他 Hub 链接 + 3 篇指南链接）
12. 常见问题（10 到 12 个 H3 问题，答案优先，单个答案 120 到 350 字）
13. 数据来源与更新记录（公开规范、官方文档、核验日期；不要伪造来源）
14. 下一步（3 个明确内链）

涉及免费资源状态的 Hub，在分类地图前插入 `<ZeroResult />`。页尾插入 `<PartnerCard />`。不要把组件放进列表或 blockquote 内。

## 4. 内链白名单

只使用这些路径，避免构建死链：

- `/`、`/free-vpn/`、`/free-airport/`、`/free-trial/`、`/budget-vpn/`、`/airport-recommendation/`、`/proxy-software/`、`/resource-check/`、`/beginner/`
- `/guides/`、`/plan/`、`/about/`
- 八篇指南：`/guides/free-vpn-vs-free-airport`、`/guides/free-open-source-clients`、`/guides/trial-verification`、`/guides/why-free-nodes-fail`、`/guides/is-10-yuan-airport-worth-it`、`/guides/is-free-proxy-software-safe`、`/guides/one-time-data-pack`、`/guides/free-airport-not-working`
- 锚点：`/free-airport/#zero-result`、`/resource-check/#method`、`/about/#sponsor`，以及本页 `#cat-<slug>`、`#cluster-<slug>`。

外链只链接官方规范、官方仓库和可核验文档，优先：RFC Editor、MDN、GitHub 官方仓库、Cloudflare Learning、IETF Datatracker、NIST。

## 5. 长度与验收

- 每个 Hub 正文的汉字数必须在 **10,000 到 15,000** 之间，目标 11,500 到 13,500。只统计 `[\u4e00-\u9fff]` 汉字，不把表格符号、代码和英文算进去。
- 写作后运行下面命令自查：

```powershell
$t = Get-Content -Raw -Encoding utf8 docs/<slug>/index.md
([regex]::Matches($t, '[\u4e00-\u9fff]')).Count
```

- 少于 10,000 就增加有信息增量的内容，例如更多协议字段、失败模式、参数口径、成本分支、验收表、真实公开规范的差异。不要重复解释、不要编故事、不要灌水。
- 超过 15,000 就压缩重复段落，但保留所有必需结构。
- 完成后检查：无死链（只使用白名单）、无具体机场品牌、无虚构实测、无“2026 最新排名”承诺、无 HTML `<script>`、只有一个 H1。
- 不要修改其他专题文件、`topics.json`、主题文件或配置。

## 6. 当前内容蓝图的边界

`topics.json` 是唯一权威分类结构。不要新增一级专题，不要改动现有 category/cluster 的 slug 与名称。选题只写入 `plans/<topic>.json`，发布页由后续合并脚本生成链接状态。

当前已发布的人工长文只有 8 篇指南（见内链白名单）。Hub 里可以链接它们，但不要假装所有选题都已发布。
