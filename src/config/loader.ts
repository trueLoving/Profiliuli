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

// Localized configs for English
import { personal as enPersonal } from './en/personal';
import { about as enAbout } from './en/about';
import { education as enEducation, courses as enCourses } from './en/education';
import { experience as enExperience } from './en/experience';
import { skills as enSkills, skillsByCategory as enSkillsByCategory } from './en/skills';
import { seo as enSeo, theme as enTheme } from './en/site';
import { resume as enResume } from './en/apps';
import { handbook as enHandbook } from './en/handbook';
import { now as enNow } from './en/now';

// Localized configs for Chinese
import { personal as zhPersonal } from './zh/personal';
import { about as zhAbout } from './zh/about';
import { education as zhEducation, courses as zhCourses } from './zh/education';
import { experience as zhExperience } from './zh/experience';
import { skills as zhSkills, skillsByCategory as zhSkillsByCategory } from './zh/skills';
import { seo as zhSeo, theme as zhTheme } from './zh/site';
import { resume as zhResume } from './zh/apps';
import { handbook as zhHandbook } from './zh/handbook';
import { now as zhNow } from './zh/now';

/**
 * Get user configuration based on locale
 * @param locale - The locale to load config for ('en' or 'zh-CN')
 * @returns UserConfig object with localized content
 */
export function getUserConfig(locale: Locale = 'en'): UserConfig {
  const isZh = locale === 'zh-CN';
  const handbook = isZh ? zhHandbook : enHandbook;

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
    about: isZh ? zhAbout : enAbout,
    education: isZh ? zhEducation : enEducation,
    courses: isZh ? zhCourses : enCourses,
    skills: isZh ? zhSkills : enSkills,
    skillsByCategory: isZh ? zhSkillsByCategory : enSkillsByCategory,
    experience: isZh ? zhExperience : enExperience,
    projects: isZh ? zhProjects : enProjects,
    handbook,
    articles: handbook,
    now: isZh ? zhNow : enNow,
  } as const;
}

/**
 * Default configuration (English)
 * Used for server-side rendering and initial load
 */
export const defaultUserConfig = getUserConfig('en');
