// Internal Content type used in the UI
export type ContentOrigin = 'presence' | 'external' | 'upload' | 'creator' | 'producer';

export interface Content {
  id: string;
  title: string;
  thumbnail: string;
  favorite: boolean;
  origin: ContentOrigin;
  // Additional fields from API
  mediaType?: 'video' | 'image';
  filePath?: string;
  sizeBytes?: number;
  durationSec?: number;
  listId?: number;
  createdAt?: string;
}

// ============================================
// API Types - Match OpenAPI MediaContentDto spec
// ============================================

// API Response - matches MediaContentDto from OpenAPI spec
export interface ApiMediaContentDto {
  uuid: string;
  listId?: number | null;
  mediaType?: string | null;       // 'video' | 'image'
  contentName?: string | null;
  filePath?: string | null;
  sizeBytes?: number | null;
  isEzGenerated?: boolean | null;  // Created by EZpresence
  isFavorite?: boolean | null;
  durationSec?: number | null;
  createdAt: string;
}

// API Request - matches MediaContentCreateDto from OpenAPI spec
export interface ApiMediaContentCreateDto {
  listId?: number | null;
  mediaType?: string | null;
  contentName?: string | null;
  filePath?: string | null;
  sizeBytes?: number | null;
  isEzGenerated?: boolean | null;
  isFavorite?: boolean | null;
  durationSec?: number | null;
}

// API Request - matches MediaContentUpdateDto from OpenAPI spec
export interface ApiMediaContentUpdateDto {
  contentName?: string | null;
}

// API Request - matches MediaContentListCreateDto from OpenAPI spec
export interface ApiMediaContentListCreateDto {
  listName?: string | null;
  listIcon?: string | null;
}

// ============================================
// Conversion Helpers
// ============================================

// Determine origin based on API fields
const determineOrigin = (apiContent: ApiMediaContentDto): ContentOrigin => {
  if (apiContent.isEzGenerated) {
    // Check listId or other criteria to determine if creator or producer
    return 'presence';
  }
  return 'external';
};

// Generate thumbnail based on media type
const generateThumbnail = (mediaType?: string | null, contentName?: string | null): string => {
  if (mediaType?.toLowerCase() === 'video') {
    return '🎬';
  }
  if (mediaType?.toLowerCase() === 'image') {
    return '🖼️';
  }
  
  // Try to guess from content name
  const name = (contentName || '').toLowerCase();
  if (name.includes('video') || name.includes('.mp4') || name.includes('.mov')) {
    return '🎬';
  }
  if (name.includes('image') || name.includes('.jpg') || name.includes('.png')) {
    return '🖼️';
  }
  
  return '📄';
};

// Convert API media content to internal Content format
export const convertApiMediaContentToContent = (apiContent: ApiMediaContentDto): Content => ({
  id: apiContent.uuid,
  title: apiContent.contentName || 'Untitled Content',
  thumbnail: generateThumbnail(apiContent.mediaType, apiContent.contentName),
  favorite: apiContent.isFavorite || false,
  origin: determineOrigin(apiContent),
  mediaType: (apiContent.mediaType?.toLowerCase() as 'video' | 'image') || 'image',
  filePath: apiContent.filePath || undefined,
  sizeBytes: apiContent.sizeBytes || undefined,
  durationSec: apiContent.durationSec || undefined,
  listId: apiContent.listId || undefined,
  createdAt: apiContent.createdAt,
});

// Convert internal Content to API create format
export const convertContentToApiCreate = (content: {
  title: string;
  mediaType: 'video' | 'image';
  filePath?: string;
  listId?: number;
  favorite?: boolean;
  isEzGenerated?: boolean;
  sizeBytes?: number;
  durationSec?: number;
}): ApiMediaContentCreateDto => ({
  contentName: content.title,
  mediaType: content.mediaType,
  filePath: content.filePath || null,
  listId: content.listId || null,
  isFavorite: content.favorite || false,
  isEzGenerated: content.isEzGenerated || false,
  sizeBytes: content.sizeBytes || null,
  durationSec: content.durationSec || null,
});

// Format file size for display
export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Format duration for display
export const formatDuration = (seconds?: number): string => {
  if (!seconds) return '';
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};