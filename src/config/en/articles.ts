/**
 * @deprecated Articles are Handbook entries with category: articles
 * Kept for compatibility with any residual imports.
 */

import { handbook } from './handbook';

export const articles = handbook.filter(entry => entry.category === 'articles');
