/**
 * SEO 与主题配置（中文）
 */

import type { SEOConfig, ThemeConfig } from '../../types';

export const seo: SEOConfig = {
  title: 'trueLoving · Profiliuli — 个人品牌中心',
  description:
    'Profiliuli 是 trueLoving 的个人品牌中心：身份与成长、Uli Ecosystem 产品体系，以及关于工程、架构与产品的 Handbook 思考。',
  keywords: [
    'Profiliuli',
    '个人品牌中心',
    'Uli Ecosystem',
    'trueLoving',
    'Handbook',
    '跨平台开发',
    'AI 构建',
    '产品架构',
    'React',
    'Rust',
    'Tauri',
    '杭州',
  ],
  openGraph: {
    type: 'website',
    image: '/og-image.png',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const theme: ThemeConfig = {
  primaryColor: '#1ED760',
  secondaryColor: '#1d1d1f',
  accentColor: '#007AFF',
};
