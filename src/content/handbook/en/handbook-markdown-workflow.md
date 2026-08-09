---
id: handbook-markdown-workflow
title: Handbook Markdown Workflow
description: How to add Handbook entries with config-backed Markdown files and frontmatter metadata.
category: engineering
publishDate: 2026-08-09
tags:
  - Handbook
  - Markdown
  - Engineering
readTime: 4
---

# Handbook Markdown Workflow

Handbook content lives in Markdown files under `src/content/handbook/{en,zh}/`.

## File layout

```text
src/content/handbook/
  load.ts
  en/*.md
  zh/*.md
```

## Frontmatter

Each file starts with YAML frontmatter:

```yaml
---
id: my-entry
title: My Entry
description: One-line summary
category: engineering
publishDate: 2026-08-09
tags:
  - Engineering
readTime: 5
---
```

Supported `category` values:

- `engineering`
- `architecture`
- `product-thinking`
- `decision-records`
- `lessons-learned`
- `philosophy`
- `articles`

## Body

Everything below the second `---` is Markdown and rendered in the Handbook window (GFM + syntax highlighting).

## Locale config

`src/config/en/handbook.ts` and `src/config/zh/handbook.ts` only load the Markdown library — do not paste long-form content into TypeScript.
