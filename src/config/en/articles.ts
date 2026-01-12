/**
 * Articles configuration (English)
 * List your recent articles here
 */

import type { Article } from '../../types';

export const articles: readonly Article[] = [
  {
    id: 'building-tauri-apps',
    title: 'Building Cross-Platform Desktop Apps with Tauri',
    description: 'A comprehensive guide to building desktop apps with Tauri and React',
    content: `# Building Cross-Platform Desktop Apps with Tauri

## Introduction

Tauri is a framework for building desktop applications using web technologies. It's a great alternative to Electron, offering smaller bundle sizes and better performance.

## Why Tauri?

- **Smaller bundle size**: Tauri apps are typically much smaller than Electron apps
- **Better performance**: Native performance with Rust backend
- **Security**: Built with security in mind
- **Cross-platform**: Works on Windows, macOS, and Linux

## Getting Started

\`\`\`bash
npm create tauri-app@latest
\`\`\`

## Conclusion

Tauri is an excellent choice for building modern desktop applications.`,
    publishDate: '2024-01-15',
    tags: ['Tauri', 'Rust', 'React', 'Desktop Apps'],
    platforms: {
      juejin: {
        url: 'https://juejin.cn/post/...',
        views: 5000,
        likes: 200,
      },
      medium: {
        url: 'https://medium.com/@yourname/...',
        views: 2000,
        claps: 150,
      },
    },
    readTime: 10,
  },
] as const;
