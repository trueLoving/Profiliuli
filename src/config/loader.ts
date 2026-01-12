/**
 * Configuration loader
 * Dynamically loads configuration based on locale
 */

import type { UserConfig } from '../types';
import type { Locale } from '../i18n/types';

// Background configuration (non-localized)
export { backgroundConfig, getBackgroundMap, getRandomBackgroundKey } from './background';

// Non-localized configs (same for all languages) - using English as default
import { social } from './en/social';
import { contact } from './en/contact';
import { projects as enProjects } from './en/projects';
import { projects as zhProjects } from './zh/projects';
import { spotify } from './en/apps';
import { articles as enArticles } from './en/articles';
import { articles as zhArticles } from './zh/articles';

// Localized configs for English
import { personal as enPersonal } from './en/personal';
import { education as enEducation, courses as enCourses } from './en/education';
import { experience as enExperience } from './en/experience';
import { skills as enSkills } from './en/skills';
import { seo as enSeo, theme as enTheme } from './en/site';
import { resume as enResume } from './en/apps';

// Localized configs for Chinese
import { personal as zhPersonal } from './zh/personal';
import { education as zhEducation, courses as zhCourses } from './zh/education';
import { experience as zhExperience } from './zh/experience';
import { skills as zhSkills } from './zh/skills';
import { seo as zhSeo, theme as zhTheme } from './zh/site';
import { resume as zhResume } from './zh/apps';

/**
 * Get user configuration based on locale
 * @param locale - The locale to load config for ('en' or 'zh-CN')
 * @returns UserConfig object with localized content
 */
export function getUserConfig(locale: Locale = 'en'): UserConfig {
  const isZh = locale === 'zh-CN';

  return {
    // Personal Information
    ...(isZh ? zhPersonal : enPersonal),

    // Social & Contact (non-localized)
    social,
    contact,

    // Configuration (non-localized)
    spotify,
    // Resume (localized)
    resume: isZh ? zhResume : enResume,

    // SEO & Theme (localized)
    seo: isZh ? zhSeo : enSeo,
    theme: isZh ? zhTheme : enTheme,

    // Content (localized)
    education: isZh ? zhEducation : enEducation,
    courses: isZh ? zhCourses : enCourses,
    skills: isZh ? zhSkills : enSkills,
    experience: isZh ? zhExperience : enExperience,
    projects: isZh ? zhProjects : enProjects,
    articles: isZh ? zhArticles : enArticles,
  } as const;
}

/**
 * Default configuration (English)
 * Used for server-side rendering and initial load
 */
export const defaultUserConfig = getUserConfig('en');
