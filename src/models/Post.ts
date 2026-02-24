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
  type: 'Post' | 'Story';
  title: string;

  description?: string;
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

export interface ApiScheduleDto {
  calendarItemId?: string;
  calendarItemName?: string;
  scheduleId?: string;
  scheduleType?: string;
  postType?: string;        // 'POST' | 'VIDEO' | 'STORY'
  targets?: string[];       // ['INSTAGRAM', 'FACEBOOK', etc.]
  plannedAtLocalTime?: string; // ISO 8601
  failReason?: Record<string, any>;
  status?: string;
  postStatus?: string; // New field for draft/pending

  // Legacy/Optional fields if still used by create payload
  scheduleName?: string | null;
  scheduleTitle?: string | null;
  scheduleDescription?: string | null;
  rruleText?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  plannedAtUtc?: string | null;
  contentUuids?: string[] | null;
  contents?: string[] | null;
}

export interface ApiScheduleUpdateDto {
  calendarItemId?: string | null;
  updatedProperties?: Record<string, any> | null;
  updateOccurrenceOnly?: boolean | null;
}

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

export const convertPostTypeToMediaType = (postType?: string | null): MediaType => {
  const type = postType?.toLowerCase();
  if (type === 'video' || type === 'reel') return 'video';
  return 'image'; // 'post', 'story', 'image', or unknown → image
};

export const convertPlatformsToTargets = (platforms: Platform[]): string[] => {
  return platforms.map(p => p.toUpperCase());
};

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

export const formatTimeString = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export const convertApiScheduleToPost = (apiSchedule: ApiScheduleDto, index: number): Post => {
  // Use plannedAtLocalTime first, fallback to plannedAtUtc or startDate
  const scheduledDateStr = apiSchedule.plannedAtLocalTime || apiSchedule.plannedAtUtc || apiSchedule.startDate;
  const date = scheduledDateStr ? new Date(scheduledDateStr) : new Date();

  const isStory = apiSchedule.postType?.toUpperCase() === 'STORY';
  // postType is now either 'POST' or 'STORY'

  // Extract contentUuids from multiple potential fields returned by the API
  const contentUuids = apiSchedule.contentUuids || apiSchedule.contents || undefined;

  return {
    id: apiSchedule.scheduleId || apiSchedule.calendarItemId || `schedule-${index}-${Date.now()}`,
    date: date,
    time: formatTimeString(date),
    platforms: convertTargetsToPlatforms(apiSchedule.targets),
    status: (apiSchedule.status?.toLowerCase() === 'pending' ? 'scheduled' : apiSchedule.status?.toLowerCase() as PostStatus) || 'scheduled',
    media: convertPostTypeToMediaType(apiSchedule.postType),
    type: isStory ? 'Story' : 'Post',
    title: apiSchedule.scheduleTitle || apiSchedule.calendarItemName || apiSchedule.scheduleName || 'Untitled Post',
    description: apiSchedule.scheduleDescription || undefined,
    contentUuids: contentUuids,
    isRecurring: !!apiSchedule.rruleText || apiSchedule.scheduleType === 'Recurring',
    scheduleUuid: apiSchedule.scheduleId,
    calendarItemId: apiSchedule.calendarItemId
  };
};

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
  type?: 'Post' | 'Story';
  status?: string; // Added status
}): ApiScheduleDto => {
  const { hours, minutes } = parseTimeString(post.time);

  const scheduledDate = new Date(post.date);
  scheduledDate.setHours(hours, minutes, 0, 0);

  // Format date as YYYY-MM-DD using local time to avoid timezone shifts
  const startDateStr = `${post.date.getFullYear()}-${String(post.date.getMonth() + 1).padStart(2, '0')}-${String(post.date.getDate()).padStart(2, '0')}`;

  let endDateStr = null;
  if (post.endDate) {
    endDateStr = `${post.endDate.getFullYear()}-${String(post.endDate.getMonth() + 1).padStart(2, '0')}-${String(post.endDate.getDate()).padStart(2, '0')}`;
  }

  // Determine if this is a recurring schedule or one-time
  const isRecurring = !!post.rruleText;

  return {
    scheduleName: post.title,
    scheduleTitle: post.title,
    scheduleDescription: post.description || null,

    postType: post.type === 'Story' ? 'STORY' : 'POST',

    plannedAtUtc: isRecurring ? null : scheduledDate.toISOString(),

    startDate: isRecurring ? startDateStr : null,
    endDate: isRecurring ? endDateStr : null,
    rruleText: isRecurring ? post.rruleText || null : null,

    targets: convertPlatformsToTargets(post.platforms),
    contentUuids: post.contentUuids || null,
    status: post.status || undefined,
  };
};