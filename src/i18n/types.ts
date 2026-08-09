export type Locale = 'en' | 'zh-CN';

/**
 * Locale JSON shape is nested and evolves with product modules.
 * Keep this intentionally loose; `t('a.b.c')` resolves at runtime.
 */
export type Translations = Record<string, unknown>;
