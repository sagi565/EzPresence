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
  createdAt?: string; // Added property
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

// Maps backend string keywords to frontend Emojis
const mapBackendIcon = (iconKey: string | null | undefined, listType: 'video' | 'image'): string => {
  if (!iconKey) return '📁';
  const key = iconKey.toLowerCase();

  if (key.includes('upload')) return listType === 'image' ? '🖼️' : '🎬';
  if (key.includes('producer')) return '🎯';
  if (key.includes('star')) return '✨';
  if (key.includes('creators')) return '👥';
  
  return iconKey; // Fallback to original if it's already an emoji
};

export const convertApiContentListToContentList = (apiList: ApiContentListDto): ContentList => {
  const listName = apiList.listName || 'Untitled List';
  const isImage = listName.toLowerCase().includes('image');
  const listType: 'video' | 'image' = isImage ? 'image' : 'video';

  return {
    id: apiList.uuid,
    title: listName,
    icon: mapBackendIcon(apiList.listIcon, listType),
    isSystem: apiList.isSystemList || false,
    items: [],
    listType: listType,
    orderIndex: apiList.orderIndex || 0,
  };
};

export const SYSTEM_LISTS: ContentList[] = [];