/**
 * Now 配置（中文）
 */

import type { NowConfig } from '../../types';

export const now: NowConfig = {
  updatedAt: '2026-08-09',
  headline: '正在把 Profiliuli 升级为个人品牌中心，并扩展 Uli Ecosystem',
  items: [
    {
      id: 'now-profiliuli-refactor',
      title: '重构 Profiliuli 为品牌中心',
      description: '在 macOS 桌面体验中落地 About、Handbook、Now，以及 Uli Ecosystem 分组。',
      kind: 'building',
    },
    {
      id: 'now-uli-roadmap',
      title: '梳理 Uli 产品路线图',
      description: '对齐已交付产品（Pixuli、Stationuli）与规划中产品线（Readuli、Omnivuli、Calluli、Vireuli、Rootuli）。',
      kind: 'focus',
    },
    {
      id: 'now-ai-architecture',
      title: '学习 AI 产品架构模式',
      description: '探索个人工具与产品界面中可落地的 AI 辅助工作流模式。',
      kind: 'learning',
    },
  ],
};
