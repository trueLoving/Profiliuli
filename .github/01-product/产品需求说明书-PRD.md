# Profiliuli 产品需求说明书（PRD）

**文档版本**：1.0  
**编写日期**：2025-01-27  
**项目名称**：Profiliuli - 个人作品集 / 简历网站  

---

## 一、文档说明

### 1.1 文档目的

本文档旨在系统描述 Profiliuli 项目的产品需求，包括已实现功能、进行中功能与待实现功能，为产品迭代、开发排期和验收提供依据。

### 1.2 适用范围

- 产品经理、项目经理：需求理解与排期
- 开发工程师：功能实现与接口设计
- 测试工程师：用例设计与验收标准
- 运维与部署：运行环境与约束

### 1.3 术语与缩略语

| 术语 | 说明 |
|------|------|
| PRD | Product Requirements Document，产品需求说明书 |
| i18n | Internationalization，国际化 |
| SEO | Search Engine Optimization，搜索引擎优化 |
| OG | Open Graph，用于社交分享的元数据 |
| RLS | Row Level Security（Supabase 行级安全） |
| PWA | Progressive Web App，渐进式 Web 应用（本项目未采用） |

---

## 二、项目概述

### 2.1 项目背景

Profiliuli 来源于两方面诉求：

1. **实际需求**：求职者、自由职业者与技术创作者需要对外展示个人能力、项目与经历，并收集访客联系信息。
2. **技术实践**：在 macOS 桌面隐喻基础上，使用 Astro + React 技术栈实现可交互、有品牌感的个人作品集站点。

### 2.2 产品定位

Profiliuli 是一款**以 macOS 桌面为隐喻的个人作品集 / 简历网站**，支持多语言与统一体验：

- **访问方式**：浏览器访问单页「桌面」环境（SSR + 客户端交互）
- **核心形态**：仿 macOS 的 Dock、工具栏、可拖拽窗口、Spotlight 搜索、Mission Control 等
- **内容形态**：通过 Notes、GitHub 项目查看器、简历、AI 终端、文章等「应用」窗口展示个人信息、教育、经历、技能、项目与文章

**核心价值**：以可配置的静态/接口数据为内容来源，实现作品集的浏览、搜索、联系与轻量管理，并提供 AI 对话与多语言 SEO 能力。

**产品名称含义**：Profile（个人档案）+ uli（与 Pixuli、Stationuli 等项目的统一后缀），发音 /ˈproʊfɪljuːli/。

### 2.3 目标用户

- **求职者 / 自由职业者**：需要对外展示个人能力、项目与经历，并收集访客联系信息
- **技术创作者**：希望用可交互、有品牌感的作品集页面体现技术品味
- **招聘方 / 合作方**：通过浏览器访问作品集，查看简历、项目、技能与文章，并通过表单或链接发起联系

---

## 三、系统架构与技术栈

### 3.1 工程结构

```
Profiliuli/
├── src/
│   ├── components/       # React / Astro 组件
│   │   ├── global/       # 全局组件（Dock、Toolbar、Spotlight、窗口等）
│   │   ├── admin/        # 管理后台相关
│   │   └── LandingPage.astro
│   ├── layouts/          # 布局（AppLayout、Layout.astro）
│   ├── pages/            # 页面与 API 路由
│   │   ├── index.astro   # 首页
│   │   ├── admin.astro   # 管理后台
│   │   └── api/          # contact、chat、admin/login、admin/messages
│   ├── config/          # 多语言配置与加载器
│   │   ├── en/           # 英文配置
│   │   ├── zh/           # 中文配置
│   │   ├── loader.ts     # getUserConfig(locale)
│   │   └── hooks.tsx     # useUserConfig 等
│   ├── i18n/             # 国际化（context、server、locales）
│   ├── types/            # TypeScript 类型
│   └── styles/           # 全局样式
├── public/               # 静态资源（背景视频/图、简历 PDF、favicon 等）
├── docs/                 # 设计文档、产品说明等
└── astro.config.mjs / package.json 等
```

### 3.2 技术栈概览

| 层次 | 技术选型 | 说明 |
|------|----------|------|
| 前端框架 | Astro 5.x + React 19.x + TypeScript | 内容与交互分离，SSR + 客户端水合 |
| 样式 | Tailwind CSS 4.x | 实用优先 |
| 构建与部署 | Vite（透过 Astro）+ Vercel | output: server，适配器 @astrojs/vercel |
| 数据库/存储 | Supabase（PostgreSQL） | 联系表单留言存储 |
| AI 服务 | Groq（llama-3.3-70b-versatile） | AI 终端对话 |
| 国际化 | 自研 i18n（en / zh-CN） | 服务端推断 + 前端持久化 |
| SEO | @astrolib/seo、sitemap | 标题、描述、OG、站点地图 |

### 3.3 页面与路由

| 路径 | 说明 |
|------|------|
| `/` | 主站首页，即「桌面」落地页，承载 AppLayout、背景、Dock、工具栏及所有窗口与弹层 |
| `/admin` | 管理后台，登录后查看联系表单留言 |
| `/api/contact` | 联系表单提交（POST）与存活检查（GET） |
| `/api/chat` | AI 对话（POST） |
| `/api/admin/login` | 管理后台登录（POST） |
| `/api/admin/messages` | 留言列表（GET，需 Bearer token） |

---

## 四、功能需求

### 4.1 macOS 风格桌面隐喻（已实现）

**需求概述**：以仿 macOS 的桌面、背景、工具栏、Dock、可拖拽窗口为统一交互框架。

#### 4.1.1 桌面与背景

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-DESKTOP-01 | 支持图片背景与 MP4 视频背景，可在配置中管理多组 | P0 | ✅ | `config/background.ts` |
| F-DESKTOP-02 | 视频自动播放、循环、静音，加载失败时回退到首张可用图片背景 | P0 | ✅ | AppLayout 内逻辑 |
| F-DESKTOP-03 | 工具栏提供「随机换背景」；Spotlight 支持「换背景」快捷操作 | P1 | ✅ | MacToolbar、Spotlight |
| F-DESKTOP-04 | 用户可开启「减弱动效」，与系统偏好 prefers-reduced-motion 及本地设置同步 | P1 | ✅ | MacToolbar、localStorage |

#### 4.1.2 顶部工具栏（MacToolbar）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-TOOLBAR-01 | 苹果标识点击可重置新手引导（Welcome Tour） | P1 | ✅ | onShowTutorial |
| F-TOOLBAR-02 | Spotlight 入口（与 Cmd/Ctrl + K 一致） | P0 | ✅ | onOpenSpotlight |
| F-TOOLBAR-03 | Mission Control 入口（与 Ctrl/Cmd + ↑ 或 F3 一致） | P0 | ✅ | onOpenMissionControl |
| F-TOOLBAR-04 | 帮助/快捷键说明入口（与 `?` 一致） | P1 | ✅ | onToggleShortcuts |
| F-TOOLBAR-05 | 关闭所有窗口、换背景、新标签页打开管理后台 `/admin` | P0 | ✅ | onCloseAllWindows、onShuffleBackground、onOpenAdmin |
| F-TOOLBAR-06 | 语言切换（中/英）、减弱动效开关、快捷键提示显隐（持久化到 localStorage） | P0 | ✅ | onLanguageSwitch、onToggleReducedMotion、onToggleShortcutHint |

#### 4.1.3 Dock

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-DOCK-01 | 桌面端 Dock：终端、Notes、GitHub、文章等图标，反映各应用打开/聚焦状态 | P0 | ✅ | DesktopDock |
| F-DOCK-02 | 移动端 Dock：精简入口（GitHub、Notes、简历、终端），适配小屏 | P0 | ✅ | MobileDock |

#### 4.1.4 可拖拽窗口（DraggableWindow）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-WINDOW-01 | 标题栏拖拽、多方向缩放（含角落与边）、焦点与 z-index 管理 | P0 | ✅ | DraggableWindow |
| F-WINDOW-02 | 键盘关闭（Escape）、移动端全屏适配 | P0 | ✅ | DraggableWindow |
| F-WINDOW-03 | 作为 Notes、GitHub、简历、终端、文章等应用的统一容器 | P0 | ✅ | 各 Viewer 组件复用 |

---

### 4.2 应用型窗口（已实现）

**需求概述**：在可拖拽窗口内提供 Notes、GitHub、简历、终端、文章等「应用」能力。

#### 4.2.1 Notes（NotesApp）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-NOTES-01 | 教育、经历、课程、技能等分栏展示，数据来自多语言配置 | P0 | ✅ | config 下 education、experience、courses、skills |

#### 4.2.2 GitHub 项目查看器（GitHubViewer）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-GH-01 | 项目列表与详情，含仓库结构、技术栈、截图等 | P0 | ✅ | config 下 projects.ts、projects/*.json |
| F-GH-02 | 支持从 Spotlight 按项目 ID 直接打开并定位到该项目 | P1 | ✅ | openProjectById |

#### 4.2.3 简历（ResumeViewer）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-RESUME-01 | 内嵌 PDF，中英文各一份（resume-en.pdf / resume-zh.pdf），随语言切换 | P0 | ✅ | config apps.resume、public/resume/ |

#### 4.2.4 AI 终端（MacTerminal）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-TERM-01 | 拟终端 UI，对话请求发往 /api/chat，后端使用 Groq | P0 | ✅ | MacTerminal、api/chat.ts |
| F-TERM-02 | GROQ_API_KEY 未配置时接口返回 503，前端可提示「联系站长」 | P1 | ✅ | api/chat.ts |

#### 4.2.5 文章（ArticlesViewer）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-ART-01 | 文章列表与 Markdown 正文，支持平台链接与阅读时长 | P1 | ✅ | config 下 articles.ts、ArticlesViewer |

---

### 4.3 Spotlight 全局搜索（已实现）

**需求概述**：全局搜索项目、经历、教育、技能、文章及快捷操作，支持模糊匹配与键盘操作。

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-SPOT-01 | 触发方式：Cmd/Ctrl + K 或工具栏入口 | P0 | ✅ | AppLayout 键盘与 MacToolbar |
| F-SPOT-02 | 基于 Fuse.js 的模糊匹配，覆盖项目、经历、教育、技能、文章 | P0 | ✅ | Spotlight |
| F-SPOT-03 | 快捷操作：打开终端/Notes/GitHub/简历/文章、新手引导、关窗、换背景、按项目 ID 打开 GitHub | P0 | ✅ | actions 传入 Spotlight |
| F-SPOT-04 | 结果按类别分组展示，支持键盘上下选择与回车执行 | P1 | ✅ | Spotlight |
| F-SPOT-05 | 支持复制邮箱等文本到剪贴板并提示（含 i18n） | P1 | ✅ | copyToClipboard、t('common.copied') |
| F-SPOT-06 | 搜索条目与界面文案随当前语言切换 | P0 | ✅ | useI18n、useUserConfig |

---

### 4.4 Mission Control（已实现）

**需求概述**：以卡片形式总览所有「应用」窗口，支持打开/聚焦与关闭。

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-MC-01 | 触发方式：Ctrl/Cmd + ↑、F3 或工具栏 | P0 | ✅ | AppLayout 键盘与 MacToolbar |
| F-MC-02 | 以卡片形式展示终端、Notes、GitHub、简历、文章，点击打开/聚焦，支持关闭某一应用 | P0 | ✅ | MissionControl |

---

### 4.5 新手引导与帮助（已实现）

**需求概述**：首次访问或主动重置时展示引导，并提供快捷键说明与可选的快捷键提示条。

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-HELP-01 | 首次访问（依据 localStorage hasCompletedTutorial）弹出 WelcomeTour | P1 | ✅ | WelcomeTour、AppLayout |
| F-HELP-02 | 苹果菜单或 Spotlight 可「重新开始引导」 | P1 | ✅ | resetTutorial |
| F-HELP-03 | `?` 唤醒 ShortcutsOverlay，展示全部快捷键说明 | P1 | ✅ | ShortcutsOverlay |
| F-HELP-04 | 桌面端可选的 ShortcutHint 提示条，显隐状态持久化到 localStorage | P2 | ✅ | ShortcutHint |

---

### 4.6 国际化（i18n）（已实现）

**需求概述**：支持中英文切换，服务端推断语言用于 SEO，前端持久化用户选择。

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-I18N-01 | 支持语言：英语（en）、简体中文（zh-CN），默认 en | P0 | ✅ | i18n/types、locales |
| F-I18N-02 | 服务端语言推断顺序：?lang=/?locale= → Cookie locale → Accept-Language → en | P0 | ✅ | i18n/server.ts inferServerLocale |
| F-I18N-03 | 前端将当前语言写入 Cookie/localStorage，便于下次访问与 SEO 一致 | P0 | ✅ | setLocale、updateLang |
| F-I18N-04 | 所有 UI 文案来自 i18n/locales/{en,zh-CN}.json | P0 | ✅ | useI18n().t() |
| F-I18N-05 | 业务数据（个人、教育、经历、技能、项目、文章、简历、SEO）按语言在 config/en、config/zh 维护，由 getUserConfig(locale) 统一加载 | P0 | ✅ | config/loader.ts、hooks.tsx |
| F-I18N-06 | Layout 与首页根据服务端推断的 locale 设置 lang、title、description、canonical、Open Graph | P0 | ✅ | Layout.astro、index.astro |

---

### 4.7 联系表单（已实现）

**需求概述**：访客通过表单提交姓名、邮箱、留言，写入 Supabase，并可配合防垃圾策略。

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-CONTACT-01 | 表单字段：姓名、邮箱、留言必填；可选 honeypot（company）、发送前停留时间（t）防垃圾 | P0 | ✅ | 前端表单、api/contact.ts |
| F-CONTACT-02 | POST /api/contact 校验格式与 honeypot 后，将 name、email、message、time_on_page、ip、user_agent 写入 Supabase 表 contact_messages | P0 | ✅ | api/contact.ts |
| F-CONTACT-03 | 未配置 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY 时接口返回 503，提示使用邮件链接等方式联系 | P1 | ✅ | api/contact.ts |

---

### 4.8 管理后台（已实现）

**需求概述**：管理员使用预设账号密码登录，查看联系表单留言列表。

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-ADMIN-01 | 独立路由 /admin，使用 AdminDashboard（client:only React） | P0 | ✅ | admin.astro、AdminDashboard.tsx |
| F-ADMIN-02 | POST /api/admin/login 校验 ADMIN_USERNAME、ADMIN_PASSWORD，通过后返回简易 token，前端存于 sessionStorage | P0 | ✅ | api/admin/login.ts |
| F-ADMIN-03 | GET /api/admin/messages?limit=...&offset=...，Header 带 Authorization: Bearer <token>，从 Supabase 分页读取 contact_messages | P0 | ✅ | api/admin/messages.ts |
| F-ADMIN-04 | 未配置 Admin 或 Supabase 时，对应接口返回 503/401，不暴露业务数据 | P1 | ✅ | login.ts、messages.ts |

---

### 4.9 无障碍与体验（已实现）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-A11Y-01 | 布局与焦点管理支持键盘与屏幕阅读器（含 focus trap、焦点还原等），重要图片具备 alt/描述 | P1 | ✅ | DraggableWindow 等 |
| F-A11Y-02 | 减弱动效可关闭部分动画，与 prefers-reduced-motion 及本地设置同步 | P1 | ✅ | reducedMotion、document.documentElement.classList |

---

### 4.10 开发与质量（已实现）

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-DEV-01 | 全量 TypeScript，ESLint + Prettier，Husky + lint-staged 提交前对暂存文件执行 lint 与格式化 | P1 | ✅ | package.json、eslint.config.mjs、.husky |
| F-DEV-02 | dev / build / preview / type-check / lint / format 等脚本 | P1 | ✅ | package.json |

---

### 4.11 待实现 / 可选增强

| 编号 | 需求描述 | 优先级 | 实现状态 | 说明 |
|------|----------|--------|----------|------|
| F-FUTURE-01 | 管理后台会话 refresh、注销及更细粒度权限 | P2 | ⏳ 待实现 | 当前为简易 token |
| F-FUTURE-02 | 联系表单前端入口的显式「联系我」弹窗（若当前仅在 Spotlight 等处间接打开） | P2 | ⏳ 视设计而定 | 可补充全局快捷键如 Cmd/Ctrl+C |
| F-FUTURE-03 | 更多语言（如日语、韩语）扩展 | P2 | ⏳ 待实现 | i18n + config 增语言目录即可 |

---

## 五、非功能需求

### 5.1 性能

| 编号 | 需求描述 | 说明 |
|------|----------|------|
| NF-PERF-01 | 视频背景加载失败时回退到图片，并有 Toast 提示 | 已实现 |
| NF-PERF-02 | 可接入 Vercel Analytics / Speed Insights；sitemap 由 Astro 生成 | 已支持或已配置 |
| NF-PERF-03 | 首屏与关键交互可考虑资源预加载（如 defaultPreloadVideo） | 可在 background 配置中扩展 |

### 5.2 安全与隐私

| 编号 | 需求描述 |
|------|----------|
| NF-SEC-01 | Supabase 使用 service_role 仅限服务端，不在前端暴露 |
| NF-SEC-02 | Admin 账号密码仅通过环境变量配置，仅用于服务端校验 |
| NF-SEC-03 | 联系表单可配合 honeypot、发送间隔等简单防滥用策略 |

### 5.3 兼容性

| 编号 | 需求描述 |
|------|----------|
| NF-COMPAT-01 | 运行环境：Node ≥ 22，包管理推荐 pnpm 10.x |
| NF-COMPAT-02 | 部署以 Vercel 为默认，Astro 使用 output: 'server' 与 @astrojs/vercel adapter |
| NF-COMPAT-03 | 浏览器：现代浏览器（Chrome、Firefox、Safari、Edge 等），需支持视频自动播放策略（静音等） |

### 5.4 可用性与可维护性

| 编号 | 需求描述 |
|------|----------|
| NF-USAB-01 | 主要流程支持中英双语，关键操作有反馈（如 Toast、加载态） |
| NF-MAINT-01 | 业务数据与 UI 文案通过 config 与 i18n 分离，便于维护与扩语言 |
| NF-MAINT-02 | 新增「应用」：在 Dock / Mission Control / Spotlight 注册入口与动作，并用 DraggableWindow 包裹新组件 |

---

## 六、与 Supabase / 管理后台的集成

Profiliuli 前端默认可**不依赖** Supabase 与管理后台运行（此时 AI 终端、联系表单、后台需对应配置或隐藏）。若启用 Supabase 与 Admin，则需满足以下约定。

### 6.1 环境变量

| 变量 | 用途 | 必填 |
|------|------|------|
| PUBLIC_SITE_URL | 站点根 URL，用于 SEO、OG、sitemap | 是 |
| GROQ_API_KEY | AI 终端对话 | 是（若需终端对话） |
| SUPABASE_URL | 联系表单与后台数据存储 | 否（不用则不提供联系/后台） |
| SUPABASE_SERVICE_ROLE_KEY | 服务端写留言、后台读留言 | 否 |
| ADMIN_USERNAME / ADMIN_PASSWORD | 管理后台登录 | 否 |

详见项目根目录 `.env.example`。

### 6.2 数据与接口约定

- **联系表单**：POST /api/contact，写入表 `contact_messages`，字段含 name、email、message、time_on_page、ip、user_agent 等。
- **管理后台**：POST /api/admin/login 校验用户名密码后返回 token；GET /api/admin/messages 需 Bearer token，从 `contact_messages` 分页读取。
- **数据库**：需在 Supabase 中创建 `contact_messages` 表并启用 RLS，且不向 anon 开放写权限（仅服务端 service_role 读写）。建表 SQL 见 README。

---

## 七、需求优先级说明

- **P0**：核心流程，无则产品不可用或价值明显受损。
- **P1**：重要功能，影响体验与差异化。
- **P2**：增强功能，可后续迭代。

---

## 八、附录

### 8.1 功能与代码对应关系

| 功能点 | 主要文件/目录 |
|--------|----------------|
| 桌面布局、窗口与导航状态 | `src/layouts/AppLayout.tsx` |
| 背景配置与随机逻辑 | `src/config/background.ts`，`LandingPage.astro` |
| 顶部工具栏 | `src/components/global/MacToolbar.tsx` |
| 桌面/移动 Dock | `DesktopDock.tsx`，`MobileDock.tsx` |
| 可拖拽窗口 | `src/components/global/DraggableWindow.tsx` |
| Notes / GitHub / 简历 / 终端 / 文章 | `NotesApp.tsx`、`GitHubViewer.tsx`、`ResumeViewer.tsx`、`MacTerminal.tsx`、`ArticlesViewer.tsx` |
| Spotlight 搜索 | `src/components/global/Spotlight.tsx` |
| Mission Control | `src/components/global/MissionControl.tsx` |
| 新手引导与快捷键说明 | `WelcomeTour.tsx`、`ShortcutsOverlay.tsx`、`ShortcutHint.tsx` |
| 多语言配置加载 | `src/config/loader.ts`，`src/config/hooks.tsx` |
| 语言推断与 SEO | `src/i18n/server.ts`，`Layout.astro`，`index.astro` |
| 联系表单 API | `src/pages/api/contact.ts` |
| AI 对话 API | `src/pages/api/chat.ts` |
| 管理后台与 API | `src/pages/admin.astro`，`AdminDashboard.tsx`，`api/admin/login.ts`，`api/admin/messages.ts` |

### 8.2 相关文档

- [项目 README](../README.md)
- [README 中文](../README.zh-CN.md)
- [.env 示例](../.env.example)

### 8.3 修订历史

| 版本 | 日期 | 变更说明 | 作者 |
|------|------|----------|------|
| 1.0 | 2025-01-27 | 初稿，按 Pixuli PRD 格式重写，基于仓库代码与文档整理 | — |

---

*本文档随项目迭代更新，请以代码与最新设计文档为准。*
