// Internal Post type used in the UI
export type PostStatus = 'success' | 'failed' | 'scheduled' | 'draft';
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
  description?: string;
  // Additional fields from API
  scheduleUuid?: string;
  calendarItemId?: string;
  contentUuids?: string[];
  isRecurring?: boolean;
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

// ============================================
// API Types - Match OpenAPI ScheduleDto spec
// ============================================

// API Response/Request - matches ScheduleDto from OpenAPI spec
export interface ApiScheduleDto {
  scheduleName?: string | null;
  scheduleTitle?: string | null;
  scheduleDescription?: string | null;
  postType?: string | null;        // 'image' | 'video'
  rruleText?: string | null;       // Recurrence rule (iCal format)
  startDate?: string | null;       // date format (YYYY-MM-DD)
  endDate?: string | null;         // date format (YYYY-MM-DD)
  plannedAtUtc?: string | null;    // datetime format (ISO 8601)
  targets?: string[] | null;       // Platform targets: ['youtube', 'instagram', etc.]
  contentUuids?: string[] | null;  // Linked content UUIDs
}

// API Request - matches ScheduleUpdateDto from OpenAPI spec
export interface ApiScheduleUpdateDto {
  calendarItemId?: string | null;           // base64-encoded calendar item ID
  updatedProperties?: Record<string, any> | null;  // Partial ScheduleDto properties
  updateOccurrenceOnly?: boolean | null;    // If true, only update this occurrence
}

// ============================================
// Conversion Helpers
// ============================================

// Convert API targets array to Platform array
export const convertTargetsToPlatforms = (targets?: string[] | null): Platform[] => {
  if (!targets || targets.length === 0) return [];
  
  const platformMap: Record<string, Platform> = {
    'youtube': 'youtube',
    'instagram': 'instagram',
    'tiktok': 'tiktok',
    'facebook': 'facebook',
  };
  
  return targets
    .map(t => platformMap[t.toLowerCase()])
    .filter((p): p is Platform => p !== undefined);
};

// Convert postType string to MediaType
export const convertPostTypeToMediaType = (postType?: string | null): MediaType => {
  if (postType?.toLowerCase() === 'video') return 'video';
  return 'image';
};

// Convert Platform array to targets string array
export const convertPlatformsToTargets = (platforms: Platform[]): string[] => {
  return platforms.map(p => p.toLowerCase());
};

// Parse time string "HH:MM AM/PM" to hours and minutes
export const parseTimeString = (time: string): { hours: number; minutes: number } => {
  const [timePart, period] = time.split(' ');
  const [hourStr, minuteStr] = timePart.split(':');
  let hours = parseInt(hourStr);
  const minutes = parseInt(minuteStr);

  if (period?.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period?.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
};

// Format Date to time string "HH:MM AM/PM"
export const formatTimeString = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

// Convert API schedule to internal Post format
export const convertApiScheduleToPost = (apiSchedule: ApiScheduleDto, index: number): Post => {
  // Use plannedAtUtc or startDate for the scheduled time
  const scheduledDateStr = apiSchedule.plannedAtUtc || apiSchedule.startDate;
  const date = scheduledDateStr ? new Date(scheduledDateStr) : new Date();
  
  return {
    id: apiSchedule.scheduleName || `schedule-${index}-${Date.now()}`,
    date: date,
    time: formatTimeString(date),
    platforms: convertTargetsToPlatforms(apiSchedule.targets),
    status: 'scheduled' as PostStatus,
    media: convertPostTypeToMediaType(apiSchedule.postType),
    title: apiSchedule.scheduleTitle || apiSchedule.scheduleName || 'Untitled Post',
    description: apiSchedule.scheduleDescription || undefined,
    contentUuids: apiSchedule.contentUuids || undefined,
    isRecurring: !!apiSchedule.rruleText,
  };
};

// Convert internal Post to API schedule format for creation
export const convertPostToApiSchedule = (post: {
  date: Date;
  time: string;
  platforms: Platform[];
  media: MediaType;
  title: string;
  description?: string;
  contentUuids?: string[];
  rruleText?: string;
  endDate?: Date;
}): ApiScheduleDto => {
  const { hours, minutes } = parseTimeString(post.time);

  const scheduledDate = new Date(post.date);
  scheduledDate.setHours(hours, minutes, 0, 0);

  return {
    scheduleName: post.title,
    scheduleTitle: post.title,
    scheduleDescription: post.description || null,
    postType: post.media,
    plannedAtUtc: scheduledDate.toISOString(),
    startDate: post.date.toISOString().split('T')[0],
    endDate: post.endDate?.toISOString().split('T')[0] || null,
    rruleText: post.rruleText || null,
    targets: convertPlatformsToTargets(post.platforms),
    contentUuids: post.contentUuids || null,
  };
};