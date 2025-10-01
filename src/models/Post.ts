export type PostStatus = 'success' | 'failed' | 'scheduled';
export type MediaType = 'image' | 'video';
export type Platform = 'youtube' | 'instagram' | 'tiktok' | 'facebook';

export interface Post {
  id: string;
  date: Date;
  time: string;
  platforms: Platform[];
  status: PostStatus;
  media: MediaType;
  title: string;
}

export interface PlatformBadge {
  cls: string;
  label: string;
}

export const PLATFORM_BADGES: Record<Platform, PlatformBadge> = {
  youtube: { cls: 'yt', label: 'YT' },
  instagram: { cls: 'ig', label: 'IG' },
  tiktok: { cls: 'tt', label: 'TT' },
  facebook: { cls: 'fb', label: 'FB' },
};