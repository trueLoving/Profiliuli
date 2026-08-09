/**
 * SEO and theme configuration
 */

import type { SEOConfig, ThemeConfig } from '../../types';

export const seo: SEOConfig = {
  title: 'trueLoving · Profiliuli — Personal Brand Hub',
  description:
    'Profiliuli is trueLoving’s personal brand hub: identity and journey, Uli Ecosystem projects, and Handbook thinking on engineering, architecture, and product.',
  keywords: [
    'Profiliuli',
    'Personal Brand Hub',
    'Uli Ecosystem',
    'trueLoving',
    'Handbook',
    'Cross-Platform Developer',
    'AI Builder',
    'Product Architecture',
    'React',
    'Rust',
    'Tauri',
    'Hangzhou',
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
