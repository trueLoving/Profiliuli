---
id: handbook-markdown-workflow
title: Handbook Markdown 写作流程
description: 如何用 frontmatter 元数据 + Markdown 正文新增 Handbook 条目。
category: engineering
publishDate: 2026-08-09
tags:
  - Handbook
  - Markdown
  - 工程
readTime: 4
---

# Handbook Markdown 写作流程

Handbook 正文存放在 `src/content/handbook/{en,zh}/` 下的 Markdown 文件中。

## 目录结构

```text
src/content/handbook/
  load.ts
  en/*.md
  zh/*.md
```

## Frontmatter

每个文件以 YAML frontmatter 开头：

```yaml
---
id: my-entry
title: 我的条目
description: 一句话摘要
category: engineering
publishDate: 2026-08-09
tags:
  - 工程
readTime: 5
---
```

支持的 `category`：

- `engineering`
- `architecture`
- `product-thinking`
- `decision-records`
- `lessons-learned`
- `philosophy`
- `articles`

## 正文

第二个 `---` 之后的内容为 Markdown，会在 Handbook 窗口中渲染（GFM + 代码高亮）。

## 语言配置

`src/config/en/handbook.ts` 与 `src/config/zh/handbook.ts` 只负责加载 Markdown 内容库——不要把长文写进 TypeScript。
