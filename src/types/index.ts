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

export interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  liveUrl?: string;
  /** Link to design document (e.g. GitHub docs or external design doc site) */
  designDocUrl?: string;
  /** URL to demo video (direct .mp4/.webm or YouTube/Vimeo watch URL for in-page playback) */
  demoVideoUrl?: string;
  techStack: readonly string[];
  structure?: ProjectStructure;
  images: readonly Image[];
  highlights?: readonly string[];
  challenges?: readonly string[];
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
  education: readonly Education[];
  courses: readonly Course[];
  skills: readonly string[];
  experience: readonly Experience[];
  projects: readonly Project[];
  articles?: readonly Article[];
}

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

export type AppId = 'terminal' | 'notes' | 'github' | 'resume' | 'spotify' | 'articles';

export interface ActiveApps {
  terminal: boolean;
  notes: boolean;
  github: boolean;
  resume: boolean;
  spotify: boolean;
  articles: boolean;
}

// ============================================
// Article Types
// ============================================

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown content
  publishDate: string;
  tags: readonly string[];
  platforms?: {
    juejin?: { url: string; views?: number; likes?: number };
    medium?: { url: string; views?: number; claps?: number };
    wechat?: { url: string; views?: number; likes?: number };
  };
  readTime?: number; // Reading time in minutes
  coverImage?: string;
}
