/**
 * @deprecated 文章已并入 Handbook（category: articles）
 * 保留以兼容残留引用。
 */

import { handbook } from './handbook';

export const articles = handbook.filter(entry => entry.category === 'articles');
