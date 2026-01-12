import { Content } from './Content';

export type ContentItemType = 'video' | 'image' | 'upload';
export type ContentStatus = 'success' | 'failed' | 'scheduled' | 'uploading';

export interface ContentItem {
  id: string;
  type: ContentItemType;
  title?: string;
  date?: string;
  thumbnail: string;
  favorite?: boolean;
  status?: ContentStatus;
  filePath?: string;
  sizeBytes?: number;
  durationSec?: number;
  createdAt?: string;
  mediaType?: string;
}

export interface ContentList {
  id: string;
  icon: string;
  title: string;
  subtitle?: string;
  isSystem: boolean;
  items: ContentItem[];
  listType: 'video' | 'image';
  orderIndex?: number;
}

export interface ApiContentListDto {
  uuid: string;
  listName?: string | null;
  listIcon?: string | null;
  isSystemList?: boolean;
  orderIndex?: number;
  createdAt?: string;
}

export interface ApiContentListCreateDto {
  listName?: string | null;
  listIcon?: string | null;
}

export interface ApiContentListUpdateDto {
  updatedProperties?: {
    ListName?: string;
    ListIcon?: string;
    OrderIndex?: number;
  };
}

// System list identifiers
export const SYSTEM_LIST_NAMES = {
  UPLOADED_VIDEOS: 'Uploaded Videos',
  UPLOADED_IMAGES: 'Uploaded Images',
  MADE_BY_CREATORS: 'Made by Creators',
  MADE_BY_PRODUCER: 'Made by Producer Mode',
};

// Maps backend string keywords to frontend Emojis
const mapBackendIcon = (iconKey: string | null | undefined, listName: string | null | undefined): string => {
  if (!iconKey) return '📁';
  const key = iconKey.toLowerCase();
  const name = (listName || '').toLowerCase();

  // System list icons
  if (name.includes('uploaded videos') || key.includes('upload') && name.includes('video')) return '🎬';
  if (name.includes('uploaded images') || key.includes('upload') && name.includes('image')) return '🖼️';
  if (name.includes('producer') || key.includes('producer')) return '🎯';
  if (name.includes('creators') || key.includes('creators')) return '👥';
  
  return iconKey; // Fallback to original if it's already an emoji
};

// Check if a list name indicates it's a system list
const isSystemListName = (name: string | null | undefined): boolean => {
  if (!name) return false;
  const lowerName = name.toLowerCase();
  return (
    lowerName.includes('uploaded videos') ||
    lowerName.includes('uploaded images') ||
    lowerName.includes('made by creators') ||
    lowerName.includes('made by producer') ||
    lowerName.includes('producer mode')
  );
};

export const convertApiContentListToContentList = (apiList: ApiContentListDto): ContentList => {
  const listName = apiList.listName || 'Untitled List';
  
  // All lists now use vertical (video) format - no more horizontal images
  const listType: 'video' | 'image' = 'video';

  return {
    id: apiList.uuid,
    title: listName,
    icon: mapBackendIcon(apiList.listIcon, listName),
    isSystem: apiList.isSystemList || isSystemListName(listName),
    items: [],
    listType: listType,
    orderIndex: apiList.orderIndex ?? 0,
  };
};

// Helper to format system list titles with gradient
export const formatSystemListTitle = (title: string): { prefix: string; gradient: string } | null => {
  if (title.includes('Made by Creators')) {
    return { prefix: 'Made by ', gradient: 'Creators' };
  }
  if (title.includes('Made by Producer Mode') || title.includes('Producer Mode')) {
    return { prefix: 'Made by ', gradient: 'Producer Mode' };
  }
  return null;
};

export const SYSTEM_LISTS: ContentList[] = [];