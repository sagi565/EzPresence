export type ContentOrigin = 'presence' | 'external' | 'upload' | 'creator' | 'producer';

export interface Content {
  id: string;
  title: string;
  thumbnail: string; // Base64 string (with data URI prefix) or URL
  favorite: boolean;
  origin: ContentOrigin;
  mediaType?: 'video' | 'image';
  sizeBytes?: number;
  durationSec?: number;
  listId?: string; // Changed to string to match UUID
  createdAt?: string;
}

export interface ApiMediaContentDto {
  uuid: string;
  listUuid?: string | null;
  mediaType?: string | null;
  contentName?: string | null;
  contentExtension?: string | null;
  // API uses 'thumbnailObject', not 'thumbnail'
  thumbnailObject?: string | null;
  sizeBytes?: number | null;
  sizeBytesCompressed?: number | null;
  durationMs?: number | null;
  isEzGenerated?: boolean | null;
  isFavorite?: boolean | null;
  status?: string | null;
  softDeleteUntil?: string | null;
  createdAt: string;
}

export interface ApiMediaContentCreateDto {
  listUuid?: string | null;
  contentName?: string | null;
  checksumSha256?: string | null;
  isEzGenerated?: boolean | null;
}

const determineOrigin = (apiContent: ApiMediaContentDto): ContentOrigin => {
  if (apiContent.isEzGenerated) return 'presence';
  return 'upload';
};

// Helper to ensure Base64 strings have the correct prefix for <img> tags
const processThumbnail = (thumb: string | null | undefined, mediaType: string | null | undefined): string => {
  if (!thumb) {
    // Return default emoji if no thumbnail exists
    return (mediaType?.includes('video') ? '🎬' : '🖼️');
  }
  
  // If it's already a URL or has the data prefix, return as is
  if (thumb.startsWith('http') || thumb.startsWith('data:')) {
    return thumb;
  }
  
  // Otherwise, treat as raw base64 (assuming JPEG/PNG) and prepend header
  return `data:image/jpeg;base64,${thumb}`;
};

export const convertApiMediaContentToContent = (apiContent: ApiMediaContentDto): Content => ({
  id: apiContent.uuid,
  title: apiContent.contentName || 'Untitled Content',
  thumbnail: processThumbnail(apiContent.thumbnailObject, apiContent.mediaType),
  favorite: apiContent.isFavorite || false,
  origin: determineOrigin(apiContent),
  mediaType: (apiContent.mediaType?.toLowerCase() as 'video' | 'image') || 'image',
  sizeBytes: apiContent.sizeBytes || undefined,
  durationSec: apiContent.durationMs ? Math.round(apiContent.durationMs / 1000) : undefined,
  listId: apiContent.listUuid || undefined,
  createdAt: apiContent.createdAt,
});

export const convertContentToApiCreate = (content: Partial<Content>): ApiMediaContentCreateDto => ({
  contentName: content.title,
});