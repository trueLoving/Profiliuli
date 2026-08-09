/**
 * About configuration (English)
 * Identity + Journey; education / experience / skills stay in their own files.
 */

import type { AboutConfig } from '../../types';

export const about: AboutConfig = {
  identity: {
    headline: 'Builder of personal brand systems and the Uli product ecosystem',
    summary:
      'I design and ship cross-platform products with a long-term brand architecture: Profiliuli as the personal brand hub, Handbook as thinking artifacts, and Uli products as living engineering proof.',
    values: [
      'Clarity over cleverness',
      'Systems thinking with shipping discipline',
      'Bilingual communication for global collaborators',
      'Products that compound into an ecosystem',
    ],
    focus: ['AI-assisted product building', 'Cross-platform architecture', 'Personal brand systems', 'Developer experience'],
  },
  journey: [
    {
      id: 'journey-start-frontend',
      date: '2021',
      title: 'Started professional frontend engineering',
      description: 'Began building production web apps and forming a cross-platform skill foundation.',
      category: 'career',
    },
    {
      id: 'journey-pixuli',
      date: '2024',
      title: 'Shipped Pixuli across web, desktop, and mobile',
      description: 'Built an AI image platform with shared codebase and WASM performance work.',
      category: 'product',
    },
    {
      id: 'journey-stationuli',
      date: '2024',
      title: 'Launched Stationuli offline P2P transfer',
      description: 'Explored privacy-first local networking with Rust/Tauri and low-latency transfer.',
      category: 'product',
    },
    {
      id: 'journey-profiliuli',
      date: '2025',
      title: 'Evolved Profiliuli into a personal brand hub',
      description: 'Reframed the portfolio from a demo shell into Identity, Projects, and Handbook.',
      category: 'milestone',
    },
    {
      id: 'journey-uli-ecosystem',
      date: '2026',
      title: 'Defined the Uli Ecosystem roadmap',
      description: 'Organized long-term product lines under a coherent brand and engineering story.',
      category: 'product',
    },
  ],
};
