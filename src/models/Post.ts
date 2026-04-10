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

  scheduleUuid?: string;
  calendarItemId?: string;
  contentUuids?: string[];
  isRecurring?: boolean;
  rruleText?: string | null;
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

// Matches the backend SchedulePolicyDto schema (lowercase camelCase)
export interface SchedulePolicyDto {
  rrule?: string | null;
  endTime?: string | null;
}

// Shape of a schedule returned by GET /api/schedules
export interface ApiScheduleDto {
  calendarItemId?: string;
  scheduleId?: string;
  scheduleName?: string | null;
  calendarItemName?: string | null;
  uploadType?: string | null;
  policy?: SchedulePolicyDto | null;
  plannedAt?: string | null;
  targets?: string[] | null;
  contents?: string[] | null;
  isDraft?: boolean;
}

// Shape of the PUT /api/schedules request body
export interface ApiScheduleUpdateDto {
  calendarItemId?: string | null;
  updatedProperties?: Record<string, any> | null;
  updateOccurrenceOnly?: boolean | null;
}

export const convertTargetsToPlatforms = (targets?: string[] | null): Platform[] => {
  if (!targets || targets.length === 0) return [];

  const map: Record<string, Platform> = {
    youtube: 'youtube',
    instagram: 'instagram',
    tiktok: 'tiktok',
    facebook: 'facebook',
  };

  return targets
    .map(t => map[t.toLowerCase()])
    .filter((p): p is Platform => p !== undefined);
};

export const convertPostTypeToMediaType = (uploadType?: string | null): MediaType => {
  const type = uploadType?.toLowerCase();
  if (type === 'video' || type === 'reel') return 'video';
  return 'image';
};

export const convertPlatformsToTargets = (platforms: Platform[]): string[] =>
  platforms.map(p => p.toUpperCase());

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
  const date = apiSchedule.plannedAt ? new Date(apiSchedule.plannedAt) : new Date();

  const uploadType = (apiSchedule.uploadType || 'Post').toUpperCase();
  const isStory = uploadType === 'STORY';

  const status: PostStatus = apiSchedule.isDraft ? 'draft' : 'scheduled';

  const rruleText = apiSchedule.policy?.rrule ?? null;

  return {
    id: apiSchedule.scheduleId || apiSchedule.calendarItemId || `schedule-${index}-${Date.now()}`,
    date,
    time: formatTimeString(date),
    platforms: convertTargetsToPlatforms(apiSchedule.targets),
    status,
    media: convertPostTypeToMediaType(uploadType),
    type: isStory ? 'Story' : 'Post',
    title: apiSchedule.calendarItemName || apiSchedule.scheduleName || 'Untitled Post',
    contentUuids: apiSchedule.contents ?? undefined,
    isRecurring: !!rruleText,
    rruleText,
    scheduleUuid: apiSchedule.scheduleId,
    calendarItemId: apiSchedule.calendarItemId,
  };
};

const pad = (n: number) => String(n).padStart(2, '0');

const formatLocalDateTime = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

export const convertPostToApiSchedule = (post: {
  date: Date;
  time: string;
  platforms: Platform[];
  media: MediaType;
  title: string;
  contentUuids?: string[];
  rruleText?: string | null;
  endDate?: Date | null;
  type?: 'Post' | 'Story';
  status?: string;
}): ApiScheduleDto => {
  const { hours, minutes } = parseTimeString(post.time);
  const scheduledDate = new Date(post.date);
  scheduledDate.setHours(hours, minutes, 0, 0);

  let uploadType = 'Post';
  if (post.type === 'Story') {
    uploadType = 'Story';
  }

  const policy: SchedulePolicyDto | null = post.rruleText
    ? {
        rrule: post.rruleText,
        endTime: post.endDate ? `${post.endDate.getFullYear()}-${pad(post.endDate.getMonth() + 1)}-${pad(post.endDate.getDate())}T23:59:59` : null,
      }
    : null;

  return {
    scheduleName: post.title,
    uploadType,
    policy,
    plannedAt: formatLocalDateTime(scheduledDate),
    targets: convertPlatformsToTargets(post.platforms),
    contents: post.contentUuids ?? null,
    isDraft: post.status?.toLowerCase() === 'draft',
  };
};