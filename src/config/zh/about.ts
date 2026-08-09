/**
 * About 配置（中文）
 * Identity + Journey；教育 / 经历 / 技能仍在各自文件中维护。
 */

import type { AboutConfig } from '../../types';

export const about: AboutConfig = {
  identity: {
    headline: '个人品牌体系与 Uli 产品生态的构建者',
    summary:
      '我以长期品牌架构设计并交付跨平台产品：Profiliuli 作为个人品牌中心，Handbook 沉淀思考，Uli 产品线提供可持续的工程证明。',
    values: ['清晰优于聪明', '系统思考与交付纪律并重', '双语协作面向全球合作者', '产品应能复利成生态'],
    focus: ['AI 辅助产品构建', '跨平台架构', '个人品牌体系', '开发者体验'],
  },
  journey: [
    {
      id: 'journey-start-frontend',
      date: '2021',
      title: '开始职业前端工程之路',
      description: '开始交付生产级 Web 应用，并逐步建立跨平台能力基础。',
      category: 'career',
    },
    {
      id: 'journey-pixuli',
      date: '2024',
      title: '交付跨端 Pixuli',
      description: '构建 AI 图像平台，覆盖 Web / Desktop / Mobile，并完成 WASM 性能优化。',
      category: 'product',
    },
    {
      id: 'journey-stationuli',
      date: '2024',
      title: '上线 Stationuli 离线 P2P 传输',
      description: '用 Rust/Tauri 探索隐私优先的本机网络与低延迟传输。',
      category: 'product',
    },
    {
      id: 'journey-profiliuli',
      date: '2025',
      title: '将 Profiliuli 升级为个人品牌中心',
      description: '从演示型作品集重构为 Identity / Projects / Handbook 的品牌枢纽。',
      category: 'milestone',
    },
    {
      id: 'journey-uli-ecosystem',
      date: '2026',
      title: '明确 Uli Ecosystem 路线图',
      description: '在统一品牌叙事下组织长期产品线与工程证明路径。',
      category: 'product',
    },
  ],
};
