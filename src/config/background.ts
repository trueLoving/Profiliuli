/**
 * Background configuration
 * Defines all available background images and videos
 */
import type { BackgroundItem } from '../types';

export interface BackgroundConfig {
  images: string[];
  videos: string[];
  defaultOgImage?: string; // Default image for Open Graph (SEO)
  defaultPreloadImage?: string; // Default image to preload
  defaultPreloadVideo?: string; // Default video to preload
}

/**
 * Background resources configuration
 * All paths are relative to the public directory
 */
export const backgroundConfig: BackgroundConfig = {
  images: [],
  videos: [
    '/background/video/Honkai-Star-Rail-QHD.mp4',
    '/background/video/Toy-Aeroplane-4K.mp4',
    '/background/video/Glowing-Star-Girl-4096x2160.mp4',
  ],
  // Only set default images if they exist in the images array
  defaultOgImage: undefined,
  defaultPreloadImage: undefined,
  defaultPreloadVideo: '/background/video/Honkai-Star-Rail-QHD.mp4',
};

/**
 * Generate background map from configuration
 * @returns Record mapping background keys to BackgroundItem objects
 */
export function getBackgroundMap(): Record<string, BackgroundItem> {
  const map: Record<string, BackgroundItem> = {};

  // Add image backgrounds
  backgroundConfig.images.forEach((path, index) => {
    map[`bg-${index}`] = {
      type: 'image',
      src: path,
    };
  });

  // Add video backgrounds
  backgroundConfig.videos.forEach((path, index) => {
    map[`bg-${backgroundConfig.images.length + index}`] = {
      type: 'video',
      src: path,
    };
  });

  return map;
}

/**
 * Get a random background key
 * @returns A random background key from the map, or 'bg-0' if no backgrounds are available
 */
export function getRandomBackgroundKey(): string {
  const map = getBackgroundMap();
  const keys = Object.keys(map);
  if (keys.length === 0) {
    // Return a fallback key if no backgrounds are configured
    return 'bg-0';
  }
  return keys[Math.floor(Math.random() * keys.length)];
}
