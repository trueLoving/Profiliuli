# Profiliuli

<div align="center">

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)
![pnpm](https://img.shields.io/badge/pnpm-10.18.3-orange.svg)
![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)

[English](./README.md) | [中文](#项目简介)

</div>

---

## 项目简介

**Profiliuli** 是一个个人品牌中心：About（身份与成长）、Projects（Uli Ecosystem）、Handbook（思想与文章）、Now（当前状态），采用 macOS 风格界面与中英双语。

本项目基于 [macos-terminal-portfolio](https://github.com/aabdoo23/portfolio) 开发，技术栈为 Astro、React 和 Tailwind CSS。

### 📛 项目名称：Profiliuli

**名称来源**：项目名称 "Profiliuli" 由 **Profile**（个人档案）+ **uli** 组成，遵循了作品集中其他项目的命名规范（Pixuli、Stationuli）。后缀 "uli" 保持了项目间一致的品牌标识。

**含义**：
- **Profile** 代表个人档案或专业作品集，强调项目展示个人竞争力、技能和成就的核心目的。
- 后缀 "uli" 与现有项目命名模式保持一致，形成统一的品牌形象。

**发音**：/ˈproʊfɪljuːli/

### 🎯 核心特性

- **个人品牌模块**：About（身份/成长/教育/经历/技能）、Projects（Uli Ecosystem）、Handbook、Now
- **macOS 风格界面**：Dock、工具栏、可拖拽窗口、项目查看器
- **动态视频背景**：支持 MP4 视频作为桌面壁纸，自动播放、循环、静音
- **双语支持**：完整的中英文切换，所有 UI 和内容都支持多语言
- **全局搜索**：Spotlight 搜索功能，支持模糊匹配和深度链接
- **AI 终端**：基于 Groq 的智能聊天终端
- **联系表单**：集成 Supabase 的联系表单和管理后台

### ✨ 扩展功能

在原始项目基础上，本项目新增了以下功能：

**1. 动态视频背景支持**

- 支持 MP4 视频文件作为桌面壁纸
- 自动播放、循环播放、静音
- 背景切换时的平滑过渡
- 视频加载失败时自动回退到静态图片
- 视频文件放置在 `public/background/video/` 目录

**2. 完整的国际化支持**

- 中英文双语切换（默认英文）
- 语言偏好保存在 localStorage
- 所有 UI 元素和内容都支持多语言
- 配置文件按语言组织：`src/config/en/` 和 `src/config/zh/`
- 易于扩展到其他语言

**3. 多语言配置系统**

- 配置文件按语言目录组织（`src/config/en/` 和 `src/config/zh/`）
- 支持个人信息、教育背景、工作经历、技能等内容的本地化
- 统一的配置加载器和 React hooks

**4. 服务端语言推断（SEO 跟随语言）**

- 服务端按优先级推断语言：Query（`?lang=` / `?locale=`）→ Cookie（`locale=`）→ `Accept-Language`
- SEO/OG 元信息由服务端 `getUserConfig(locale)` 生成，随语言切换

**5. 简历 PDF 本地化**

- 英文：`/resume/resume-en.pdf`
- 中文：`/resume/resume-zh.pdf`

## 🛠️ 技术栈

- [Astro](https://astro.build/) — 内容优先的 Web 框架
- [React](https://reactjs.org/) — UI 交互
- [Tailwind CSS](https://tailwindcss.com/) — 实用优先的样式框架
- [TypeScript](https://www.typescriptlang.org/) — 类型安全
- [Vercel](https://vercel.com/) — 部署和数据分析
- [Supabase](https://supabase.com/) — 数据库和联系表单存储
- [Groq](https://groq.com/) — AI 终端聊天服务

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/your-username/portfolio
cd portfolio
```

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

复制 `.env.example` 到 `.env` 并填写（详细注释见 `.env.example`）：

```env
# AI Terminal
GROQ_API_KEY=your_groq_api_key_here

# Site
PUBLIC_SITE_URL=https://your-domain.tld

# Supabase (server-only; do NOT expose in PUBLIC_ vars)
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Admin dashboard credentials (server-only)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_me
```

### 4. 创建数据库表

在 Supabase SQL 编辑器中运行以下 SQL：

```sql
create table if not exists public.contact_messages (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz not null default now(),
    name text not null,
    email text not null,
    message text not null,
    time_on_page int,
    ip text,
    user_agent text
);

-- Enable RLS and do NOT add anon policies (server-only access via service_role)
alter table public.contact_messages enable row level security;
```

### 5. 配置个人信息

配置文件位于 `src/config/` 目录，按语言组织：

**英文配置** (`src/config/en/`):

- `personal.ts` — 个人信息（姓名、角色、位置、网站）
- `education.ts` — 教育背景
- `experience.ts` — 工作经历
- `skills.ts` — 技能列表
- `site.ts` — SEO 和主题配置
- `social.ts` — 社交媒体链接
- `contact.ts` — 联系方式
- `projects.ts` — 项目配置
- `apps.ts` — 简历和 Spotify 配置

**中文配置** (`src/config/zh/`):

- 结构同英文配置，包含对应的中文翻译内容

### 6. 添加背景资源

- **静态图片**：放置在 `public/background/images/` 目录
- **视频文件**：放置在 `public/background/video/` 目录（MP4 格式）
- **背景配置**：在 `src/config/background.ts` 统一管理（页面不再硬编码）

## 💻 开发

### 启动开发服务器

```bash
pnpm run dev
```

开发服务器将在 `http://localhost:4321` 启动。

### 构建生产版本

```bash
pnpm run build
```

### 预览生产构建

```bash
pnpm run preview
```

## 🚀 部署

### 部署到 Vercel

#### 方法一：使用 Vercel CLI（推荐）

1. **构建项目**

```bash
pnpm run build
```

2. **部署到生产环境**

```bash
npx vercel deploy --prod
```

或者先部署到预览环境：

```bash
npx vercel deploy
```

然后在 Vercel 仪表板中选择部署。

#### 方法二：通过 GitHub 自动部署

1. 将代码推送到 GitHub
2. 在 Vercel 中连接仓库
3. 配置环境变量（见下方）
4. Vercel 会自动部署

> **注意**：如果 GitHub 自动部署有问题，请使用方法一（CLI 部署）。

### 配置环境变量

在 Vercel 项目设置 → 环境变量中配置：

**必需变量**：

- `PUBLIC_SITE_URL` — 生产环境 URL（如：`https://your-domain.tld`）
- `GROQ_API_KEY` — Groq API 密钥（用于 AI 终端）

**可选变量**（用于联系表单和管理后台）：

- `SUPABASE_URL` — Supabase 项目 URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase 服务角色密钥
- `ADMIN_USERNAME` — 管理后台用户名
- `ADMIN_PASSWORD` — 管理后台密码

### 部署提示

- 确保所有环境变量都已正确配置
- 检查 `PUBLIC_SITE_URL` 是否正确，这会影响 SEO 和 Open Graph 链接
- 如果使用自定义域名，需要在 Vercel 中配置 DNS 记录

## 📁 项目结构

```
├── src/
│   ├── components/      # React 组件
│   │   └── global/      # 全局组件（Dock、Toolbar、Spotlight 等）
│   ├── layouts/         # Astro/React 布局
│   ├── pages/           # Astro 页面（包含 API 路由）
│   ├── config/          # 配置文件
│   │   ├── en/          # 英文配置
│   │   ├── zh/          # 中文配置
│   │   ├── loader.ts    # 配置加载器
│   │   └── hooks.tsx    # React hooks
│   ├── i18n/            # 国际化
│   │   ├── locales/     # 语言文件（en.json, zh-CN.json）
│   │   └── context.tsx   # i18n Context
│   ├── types/           # TypeScript 类型定义
│   └── styles/          # 全局样式
├── public/              # 公共资源
│   └── background/      # 背景资源（图片和视频）
├── util/                # 工具脚本
└── astro.config.mjs     # Astro 配置
```

## ⌨️ 快捷键

- `Cmd/Ctrl + K` — 打开 Spotlight 搜索
- `?` — 显示快捷键帮助
- `Ctrl/Cmd + ↑` 或 `F3` — 打开 Mission Control
- `Cmd/Ctrl + C` — 打开联系表单

## 🔧 配置说明

### 多语言配置

配置文件按语言组织在 `src/config/en/` 和 `src/config/zh/` 目录下：

- **本地化内容**：`personal.ts`、`education.ts`、`experience.ts`、`skills.ts`、`site.ts`
- **本地化内容补充**：`apps.ts`（简历配置随语言切换）
- **非本地化内容**：`social.ts`、`contact.ts`、`projects.ts`、`spotify`（统一从 `src/config/en/` 加载）

### 使用配置

**在 React 组件中**：

```typescript
import { useUserConfig } from '../../config/hooks';

function MyComponent() {
  const userConfig = useUserConfig(); // 自动根据当前语言加载配置
  // ...
}
```

**在 Astro 页面中**（服务端，按语言加载配置）：

```typescript
import { getUserConfig } from '../config/loader';
import { inferServerLocale } from '../i18n/server';

const url = new URL(Astro.request.url);
const locale = inferServerLocale({ request: Astro.request, url });
const config = getUserConfig(locale); // 'en' | 'zh-CN'
```

## 📝 功能特性

- ✅ macOS 风格界面（Dock、工具栏、可拖拽窗口）
- ✅ 动态视频背景支持
- ✅ 中英文双语切换
- ✅ Spotlight 全局搜索
- ✅ Mission Control 窗口管理
- ✅ AI 终端聊天
- ✅ 联系表单（Supabase 存储）
- ✅ 管理后台
- ✅ 响应式设计
- ✅ SEO 优化
- ✅ 无障碍支持

## 📜 致谢

- **原始项目**：[macos-terminal-portfolio](https://github.com/aabdoo23/portfolio)
- **原始作者**：Johnny Culbreth (Austin, TX)
- **修改者**：aabdoo23 (Giza, Egypt)
- **增强功能**：trueLoving - 添加了动态视频背景和双语语言支持

## 📄 许可证

本项目采用 MIT 许可证 - 详见 LICENSE 文件。

## 📞 支持

如有问题或需要支持，请在 GitHub 上提交 Issue。
