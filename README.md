<p align="center">
  <img src="docs/public/logo.svg" width="82" height="82" alt="免梯指数 Logo">
</p>

<h1 align="center">免梯指数</h1>

<p align="center">
  <strong>把“免费”“便宜”“高速”“稳定”拆成能核对的条件。</strong>
</p>

<p align="center">
  免费梯子 · 免费机场 · 低预算方案 · 42 家机场品牌资料库
</p>

<p align="center">
  <a href="https://mianfeitizi.cc"><img src="https://img.shields.io/badge/WEBSITE-mianfeitizi.cc-2fc6a7?style=flat-square" alt="Website"></a>
  <img src="https://img.shields.io/badge/VitePress-1.6.4-5c73e7?style=flat-square" alt="VitePress">
  <img src="https://img.shields.io/badge/Vue-3.5-42b883?style=flat-square" alt="Vue">
  <img src="https://img.shields.io/badge/页面-63-2fc6a7?style=flat-square" alt="63 pages">
  <img src="https://img.shields.io/badge/机场品牌-42-e9b44c?style=flat-square" alt="42 airports">
  <img src="https://img.shields.io/badge/免费资源-0-d97757?style=flat-square" alt="0 free resources">
</p>

<p align="center">
  <a href="https://mianfeitizi.cc">在线站点</a> ·
  <a href="https://mianfeitizi.cc/airports/">机场品牌库</a> ·
  <a href="https://mianfeitizi.cc/plan/">内容蓝图</a> ·
  <a href="#本地运行">本地运行</a> ·
  <a href="#部署">部署</a>
</p>

<p align="center">
  <a href="https://mianfeitizi.cc">
    <img src="docs/public/readme/home.png" alt="免梯指数首页：核验状态与方法总览" width="100%">
  </a>
</p>

> 没有可复核证据的免费资源，不发布。当前免费资源收录为 **0 条**，页面显示真实零结果，不用“限时领取”“内部渠道”补位。

---

## 这是什么

**免梯指数（mianfeitizi.cc）** 是一个关于免费梯子、免费机场、低预算机场与代理软件的中文核验型知识库。

它不销售机场，不运营节点，也不出售排名。它做的事情只有一件：把容易被营销使用的词，拆成可以核对的条件，再把条件写成能复现的测试、成本模型与失败路径。

站点现在包含：

| 模块 | 内容 |
| --- | --- |
| 8 个专题 Hub | 免费梯子、免费机场、免费试用、便宜梯子、机场推荐、代理软件、资源检测、新手帮助 |
| 8 篇核验指南 | 每篇 1 万字以上，覆盖概念、试用、失效、成本、安全、流量包与排障 |
| 42 家机场品牌库 | 套餐、协议、线路、品牌测速、解锁声明、适合人群与风险提示 |
| 17 家测速截图 | 用户提供的 2026-08-11 批次截图，外加光速云 2026-08-19 批次的 5 张测速/解锁图 |
| 内容蓝图 | 8 专题 · 64 分类 · 128 集群 · 923 个规划选题 |
| SEO / GEO | canonical、OG、Breadcrumb、Article、CollectionPage、FAQPage、speakable、sitemap、llms.txt |

## 三条原则

### 01 · 零结果也是结果

免费资源必须同时具备可追溯的官方来源、明确额度与有效期、可复核时间和允许引用的条款。少一项就不收录。**当前收录为 0 条**，这不是加载失败，也不会用“即将上线”填空。

### 02 · 品牌资料不是本站实测

机场品牌库里的价格、套餐、线路和解锁声明来自品牌资料或历史记录；只有截图能证明截图所示时间与线路。页面把 `measured`、`vendor`、`editorial`、`unverified` 分开标注，不把品牌声明升级成实测。

### 03 · 推广必须披露

品牌库部分注册链接为推广链接，光速云页面有一个明确标注的“商业合作 · 主推位”。链接统一使用 `rel="nofollow sponsored noopener"`，佣金不影响测速截图、价格字段与风险提示。

## 机场品牌库

<p align="center">
  <a href="https://mianfeitizi.cc/airports/">
    <img src="docs/public/readme/airports.png" alt="42 家机场品牌库：搜索、筛选、测速证据与品牌资料" width="100%">
  </a>
</p>

- **42 个独立品牌页**：套餐表、品牌资料测速、解锁声明、优缺点、适合/不适合、风险与 FAQ。
- **17 家带本站测速图**：截图保留测试批次与限制，不做跨品牌严格排名。
- **光速云解锁矩阵**：2026-08-19 批次的解锁/可用性截图，只代表图内批次。
- **19 个品牌 Logo**：没有可靠 Logo 的品牌使用首字标记，不伪造品牌资产。
- **6 家没有独立入口**：页面显示“官方入口待核实”，不填占位链接。

数据状态可以直接在页面上看到：

| 状态 | 含义 |
| --- | --- |
| `有本站测速图` | 有原始截图，可核对批次、节点与图内结果 |
| `仅品牌资料` | 没有本站测速图，价格与声明需官网复核 |
| `资料待核实` | 关键字段缺失，不给出确定结论 |

## 本地运行

要求：Node.js 20+，pnpm 9+。

```bash
pnpm install
pnpm dev
```

默认地址：`http://127.0.0.1:5173/`

生产构建与预览：

```bash
pnpm build
pnpm preview
```

构建输出在 `docs/.vitepress/dist/`。这个目录不提交到 Git。

## 数据与验收

```bash
# 内容结构、字数与组件
pnpm check:content

# 站内链接
pnpm check:links

# 42 份机场 JSON、图片文件、42 个详情页
pnpm check:airports

# 从 42 份品牌 JSON 合并数据并生成详情页
pnpm airports:merge

# 构建后做 SEO 增强与检查
pnpm build
pnpm seo:enhance
pnpm check:seo
```

`pnpm check` 会串起内容、链接与机场数据三项检查。`check:seo` 需要先构建，因为它读取 `dist/` 里的真实 HTML。

当前验收结果：

```text
内容检查：通过
站内链接：64 个 Markdown 文件，通过
机场数据：42/42，通过
SEO：63 个页面，60 个 FAQPage，123 个 JSON-LD，通过
生产构建：通过
```

## 项目结构

```text
.
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts              # 导航、SEO、schema、sitemap
│  │  ├─ theme/                  # 自定义主题与 Vue 组件
│  │  └─ data/
│  │     ├─ topics.json          # 8 专题 / 64 分类 / 128 集群
│  │     ├─ airports.json        # 42 家品牌聚合数据
│  │     ├─ airports/            # 42 份品牌 JSON + 原始资料
│  │     └─ airport-images.json  # 测速/解锁图清单
│  ├─ airports/                  # 品牌库首页 + 42 个详情页
│  ├─ guides/                    # 8 篇长指南
│  ├─ free-vpn/ ...              # 8 个专题 Hub
│  └─ public/                    # Logo、截图、robots、llms.txt、.htaccess
├─ scripts/                      # 检查、合并、SEO 增强、索引脚本
├─ README.md
└─ package.json
```

机场详情页由 `scripts/merge-airports.mjs` 从 42 份 JSON 生成；不要手改生成的页面，改数据后重新运行 `pnpm airports:merge`。

## 部署

目标环境是 Apache 虚拟主机。

1. 执行 `pnpm build` 与 `pnpm seo:enhance`。
2. 将 `docs/.vitepress/dist/` 内的全部文件上传到站点根目录。
3. 确认 `.htaccess` 一同上传。

`.htaccess` 已处理 HTTPS 与 `www` 归一、clean URLs、压缩、静态资源缓存、安全响应头与 404。部署包 `mianfeitizi-cc-dist.zip` 只包含构建产物，不包含源码与依赖。

## 数据边界

- 价格、套餐、线路、节点数与解锁声明，以品牌官网和核验当日条款为准。
- 测速截图只代表截图所示时间、测试环境与节点，不代表长期稳定或当前可用。
- AI 与流媒体解锁受出口 IP、账号地区、平台风控影响，任何“支持”字样都不构成保证。
- 不同司法辖区对代理服务与内容访问的规则不同，使用前请自行确认当地法律、服务条款与可接受使用政策。
- 本站不销售机场，不代购，不运营节点，也不承诺任何品牌长期稳定。

## 纠错与贡献

发现事实错误、过期价格、失效入口或图片问题，请提供：

1. 页面 URL 与错误位置；
2. 可复核的截图或官方链接；
3. 核验时间与测试条件。

优先处理会改变结论的错误，例如价格、额度、退款条款与安全风险。没有证据的口头反馈会记录，但不会直接改写页面。

联系：`hello@mianfeitizi.cc`

## 版权

本仓库的代码、文案、数据整理与截图说明归项目作者所有。转载、商用、镜像或批量抓取前请先联系。品牌名称、Logo 与截图归各自权利人所有，仅用于资料识别与证据展示。

---

<p align="center">
  <sub>Built with VitePress · 以证据为先，不以关键词为先。</sub>
</p>
