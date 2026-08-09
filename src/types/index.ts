/**
 * Type definitions for the portfolio application
 * These types ensure type safety across the application
 */

// ============================================
// Image & Media Types
// ============================================

export interface Image {
  /** Image URL (can be external or local path) */
  url: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Optional description displayed below the image */
  description?: string;
}

// ============================================
// Project Types
// ============================================

export interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: readonly FileNode[];
}

export interface ProjectStructure {
  root: string;
  children: readonly FileNode[];
}

/** Uli Ecosystem product lines */
export type ProductLine =
  | 'media'
  | 'intelligence'
  | 'communication'
  | 'home'
  | 'heritage'
  | 'vitality'
  | 'identity'
  | 'connect'
  | 'dev'
  | 'lab';

/** Product lifecycle in the Uli Ecosystem */
export type ProjectLifecycle = 'active' | 'mvp' | 'maintained' | 'merged' | 'archived';

/** @deprecated Prefer productLine */
export type ProjectEcosystem = 'uli' | 'brand' | 'other';
/** @deprecated Prefer lifecycle */
export type ProjectStatus = 'active' | 'planned' | 'archived' | ProjectLifecycle;

export interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  liveUrl?: string;
  /** Link to design document (e.g. GitHub docs or external design doc site) */
  designDocUrl?: string;
  /** Single demo video URL (deprecated in favor of demoVideoUrls; still supported) */
  demoVideoUrl?: string;
  /** Multiple demo video URLs; user can switch between them in the demo modal */
  demoVideoUrls?: readonly string[];
  techStack: readonly string[];
  structure?: ProjectStructure;
  images: readonly Image[];
  highlights?: readonly string[];
  challenges?: readonly string[];
  /** Uli Ecosystem product line */
  productLine: ProductLine;
  /** Lifecycle: Active / MVP / Maintained / Merged / Archived */
  lifecycle: ProjectLifecycle;
  /** Short operational state, e.g. continuous development / in use */
  currentState?: string;
  /** When lifecycle is merged, target product id */
  mergedInto?: string;
  /** @deprecated Prefer productLine */
  ecosystem?: ProjectEcosystem;
  /** @deprecated Prefer lifecycle */
  status?: ProjectStatus;
  metrics?: {
    users?: string;
    imagesProcessed?: string;
    performance?: string;
    transferSpeed?: string;
    latency?: string;
    maxFileSize?: string;
    [key: string]: string | undefined;
  };
}

// ============================================
// Education Types
// ============================================

export interface Education {
  degree: string;
  major?: string;
  institution: string;
  location: string;
  year: string;
  description?: string;
  relevantCourses?: readonly string[];
  gpa?: string;
  achievements?: readonly string[];
  images?: readonly Image[];
}

export interface Course {
  title: string;
  description: string;
  institution: string;
  location: string;
  year: string;
  images?: readonly Image[];
}

// ============================================
// Experience Types
// ============================================

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string;
  achievements?: readonly string[];
  technologies?: readonly string[];
  images?: readonly Image[];
}

// ============================================
// About Types
// ============================================

export interface AboutIdentity {
  headline: string;
  summary: string;
  values: readonly string[];
  focus: readonly string[];
}

export interface JourneyItem {
  id: string;
  date: string;
  title: string;
  description: string;
  category?: 'career' | 'product' | 'learning' | 'milestone';
}

export interface AboutConfig {
  identity: AboutIdentity;
  journey: readonly JourneyItem[];
}

// ============================================
// Handbook Types
// ============================================

export type HandbookCategory =
  | 'engineering'
  | 'architecture'
  | 'product-thinking'
  | 'decision-records'
  | 'lessons-learned'
  | 'philosophy'
  | 'articles';

export interface HandbookEntry {
  id: string;
  title: string;
  description: string;
  content: string;
  publishDate: string;
  tags: readonly string[];
  category: HandbookCategory;
  platforms?: {
    juejin?: { url: string; views?: number; likes?: number };
    medium?: { url: string; views?: number; claps?: number };
    wechat?: { url: string; views?: number; likes?: number };
  };
  readTime?: number;
  coverImage?: string;
}

/** @deprecated Use HandbookEntry — kept for gradual migration */
export type Article = HandbookEntry;

// ============================================
// Now Types
// ============================================

export interface NowItem {
  id: string;
  title: string;
  description: string;
  kind: 'building' | 'learning' | 'reading' | 'focus';
}

export interface NowConfig {
  updatedAt: string;
  headline: string;
  items: readonly NowItem[];
}

// ============================================
// Contact & Social Types
// ============================================

export interface SocialLinks {
  github: string;
  linkedin?: string;
  medium?: string;
  juejin?: string;
  dailydev?: string;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  calendly?: string;
}

// ============================================
// Configuration Types
// ============================================

export interface PersonalInfo {
  name: string;
  role: string;
  location: string;
  email: string;
  website: string;
  roleFocus: string;
  yearOfBirth: number;
}

export interface SpotifyConfig {
  playlistId: string;
  playlistName: string;
}

export interface ResumeConfig {
  url: string;
  localPath: string;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: readonly string[];
  openGraph?: {
    type?: string;
    image?: string;
  };
  twitter?: {
    card?: string;
    creator?: string;
  };
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

// ============================================
// Main Config Type
// ============================================

export interface UserConfig {
  // Personal Information
  name: string;
  role: string;
  location: string;
  email: string;
  website: string;
  roleFocus: string;
  yearOfBirth: number;

  // Social & Contact
  social: SocialLinks;
  contact: ContactInfo;

  // Configuration
  spotify: SpotifyConfig;
  resume: ResumeConfig;
  seo: SEOConfig;
  theme: ThemeConfig;

  // Content
  about: AboutConfig;
  education: readonly Education[];
  courses: readonly Course[];
  skills: readonly string[];
  /** When set, About shows skills grouped by category */
  skillsByCategory?: SkillsByCategory;
  experience: readonly Experience[];
  projects: readonly Project[];
  handbook: readonly HandbookEntry[];
  /** @deprecated Prefer handbook */
  articles?: readonly HandbookEntry[];
  now: NowConfig;
}

/** Single skill with optional level/years (for categorized display) */
export interface SkillItem {
  name: string;
  level?: 'expert' | 'advanced' | 'intermediate' | 'learning';
  years?: number;
}

/** Category key -> list of skills. Keys e.g. languages, frontend, backend, mobile, desktop, databases, devops, emerging */
export type SkillsByCategory = Readonly<Record<string, readonly SkillItem[]>>;

// ============================================
// Component Prop Types
// ============================================

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface DraggableWindowProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  initialPosition?: WindowPosition;
  initialSize?: WindowSize;
  className?: string;
}

export interface BackgroundItem {
  type: 'image' | 'video';
  src: string;
}

export interface AppLayoutProps {
  initialBg: string;
  backgroundMap: Record<string, BackgroundItem>;
}

// ============================================
// Chat/Terminal Types
// ============================================

export type MessageRole = 'system' | 'user' | 'assistant';

export interface Message {
  role: MessageRole;
  content: string;
}

export interface ChatHistory {
  messages: Message[];
  input: string;
}

// ============================================
// App State Types
// ============================================

export type AppId =
  | 'terminal'
  | 'about'
  | 'github'
  | 'resume'
  | 'spotify'
  | 'handbook'
  | 'now'
  | 'systemApps';

export interface ActiveApps {
  terminal: boolean;
  about: boolean;
  github: boolean;
  resume: boolean;
  spotify: boolean;
  handbook: boolean;
  now: boolean;
  systemApps: boolean;
}

export type AboutSection = 'menu' | 'identity' | 'education' | 'experience' | 'skills' | 'journey';
