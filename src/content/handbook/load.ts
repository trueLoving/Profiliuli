/**
 * Handbook Markdown content loader
 * Metadata from YAML frontmatter; body is Markdown rendered by HandbookViewer.
 * Uses a browser-safe parser (no gray-matter / Node Buffer).
 */

import type { HandbookCategory, HandbookEntry } from '../../types';
import { parseFrontmatter } from './parseFrontmatter';

type HandbookPlatforms = NonNullable<HandbookEntry['platforms']>;

const VALID_CATEGORIES: readonly HandbookCategory[] = [
  'engineering',
  'architecture',
  'product-thinking',
  'decision-records',
  'lessons-learned',
  'philosophy',
  'articles',
] as const;

type HandbookLocale = 'en' | 'zh';

const handbookModules = {
  en: import.meta.glob('./en/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
  zh: import.meta.glob('./zh/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  }) as Record<string, string>,
};

function isHandbookCategory(value: unknown): value is HandbookCategory {
  return typeof value === 'string' && (VALID_CATEGORIES as readonly string[]).includes(value);
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map(part => part.trim()).filter(Boolean);
  }
  return [];
}

function parseEntry(raw: string, filePath: string): HandbookEntry {
  const { data, content } = parseFrontmatter(raw);
  const id =
    typeof data.id === 'string' ? data.id : filePath.split('/').pop()?.replace(/\.md$/, '');

  if (!id) {
    throw new Error(`Handbook entry missing id: ${filePath}`);
  }
  if (!isHandbookCategory(data.category)) {
    throw new Error(`Handbook entry "${id}" has invalid category: ${String(data.category)}`);
  }
  if (typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error(`Handbook entry "${id}" missing title`);
  }

  return {
    id,
    title: data.title.trim(),
    description: typeof data.description === 'string' ? data.description.trim() : '',
    category: data.category,
    publishDate: typeof data.publishDate === 'string' ? data.publishDate : '1970-01-01',
    tags: normalizeTags(data.tags),
    readTime: typeof data.readTime === 'number' ? data.readTime : undefined,
    coverImage: typeof data.coverImage === 'string' ? data.coverImage : undefined,
    platforms:
      data.platforms && typeof data.platforms === 'object'
        ? (data.platforms as HandbookPlatforms)
        : undefined,
    content: content.trim(),
  };
}

/**
 * Load all Handbook Markdown entries for a locale directory (`en` | `zh`).
 * Sorted by publishDate descending.
 */
export function loadHandbookEntries(locale: HandbookLocale): readonly HandbookEntry[] {
  const modules = handbookModules[locale];
  const entries = Object.entries(modules).map(([filePath, raw]) => parseEntry(raw, filePath));

  return entries.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}
