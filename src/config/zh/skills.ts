/**
 * 技能配置（按分类）
 * 与 en/skills 结构一致，便于 NotesApp 按分类展示；可按需增删或翻译技能名
 */

import type { SkillItem } from '../../types';

export const skillsByCategory: Readonly<Record<string, readonly SkillItem[]>> = {
  languages: [
    { name: 'JavaScript', level: 'expert', years: 5 },
    { name: 'TypeScript', level: 'expert', years: 4 },
    { name: 'Rust', level: 'intermediate', years: 2 },
    { name: 'Python', level: 'intermediate', years: 3 },
  ],
  frontend: [
    { name: 'React', level: 'expert', years: 4 },
    { name: 'Vue.js', level: 'expert', years: 3 },
    { name: 'Next.js', level: 'advanced', years: 2 },
    { name: 'Tailwind CSS', level: 'expert', years: 3 },
    { name: 'Astro', level: 'advanced', years: 1 },
  ],
  backend: [
    { name: 'Node.js', level: 'expert', years: 4 },
    { name: 'NestJS', level: 'advanced', years: 2 },
  ],
  mobile: [
    { name: 'React Native', level: 'advanced', years: 2 },
  ],
  desktop: [
    { name: 'Electron', level: 'advanced', years: 2 },
    { name: 'Tauri', level: 'intermediate', years: 1 },
  ],
  databases: [
    { name: 'PostgreSQL', level: 'intermediate', years: 2 },
    { name: 'MongoDB', level: 'intermediate', years: 2 },
    { name: 'MySQL', level: 'intermediate', years: 2 },
  ],
  devops: [
    { name: 'Docker', level: 'advanced', years: 3 },
    { name: 'AWS', level: 'intermediate', years: 2 },
    { name: 'CI/CD', level: 'intermediate', years: 2 },
  ],
  emerging: [
    { name: 'Web3', level: 'intermediate', years: 1 },
    { name: 'AI/ML', level: 'learning', years: 1 },
    { name: 'Dify', level: 'learning', years: 1 },
    { name: 'Chatwoot', level: 'intermediate', years: 1 },
  ],
};

// 扁平列表，供 ResumeViewer 等使用，与分类顺序一致
export const skills: readonly string[] = [
  ...skillsByCategory.languages.map((s) => s.name),
  ...skillsByCategory.frontend.map((s) => s.name),
  ...skillsByCategory.backend.map((s) => s.name),
  ...skillsByCategory.mobile.map((s) => s.name),
  ...skillsByCategory.desktop.map((s) => s.name),
  ...skillsByCategory.databases.map((s) => s.name),
  ...skillsByCategory.devops.map((s) => s.name),
  ...skillsByCategory.emerging.map((s) => s.name),
] as const;
