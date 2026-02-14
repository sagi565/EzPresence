import { Platform } from './Post';

// ============================================
// Repeat/Recurrence Types
// ============================================

export type RepeatFrequency = 'none' | 'daily' | 'weekly' | 'monthly' | 'annually' | 'custom';

export interface RepeatOption {
    frequency: RepeatFrequency;
    label: string;
    rruleText?: string; // iCal recurrence rule format
    endDate?: Date;
}

// ============================================
// Platform-Specific Configuration Types
// ============================================

export interface PlatformConfig {
    enabled: boolean;
    accountId?: string;
}

export interface InstagramConfig extends PlatformConfig {
    caption: string;
    location?: string;
    altText?: string;
    userTags?: string[]; // WIP - not yet implemented
    shareToFeed: boolean;
}

export interface FacebookConfig extends PlatformConfig {
    postText: string;
    link?: string;
}

export interface YouTubeConfig extends PlatformConfig {
    title: string;
    description: string;
    privacyStatus: 'public' | 'private' | 'unlisted';
    category: string;
    tags: string[];
    madeForKids: boolean;
    syntheticMedia: boolean;
}

export interface TikTokConfig extends PlatformConfig {
    caption: string;
    privacyLevel: 'public' | 'friends' | 'private';
    disableDuet: boolean;
    disableStitch: boolean;
    disableComments: boolean;
}

// ============================================
// Main Form Data Types
// ============================================

export interface ScheduleFormData {
    // Basic info
    title: string;
    type: 'post' | 'story';

    // Scheduling
    date: Date;
    time: string; // Format: "HH:MM AM/PM"
    timezone?: string;
    repeat: RepeatOption;

    // Content
    contentId?: string;
    contentThumbnail?: string;
    contentTitle?: string;

    // Platform configurations
    platforms: {
        instagram?: InstagramConfig;
        facebook?: FacebookConfig;
        youtube?: YouTubeConfig;
        tiktok?: TikTokConfig;
    };
}

// Type alias for clarity
export type PostFormData = ScheduleFormData;


// ============================================
// Default Configurations
// ============================================

export const DEFAULT_INSTAGRAM_CONFIG: InstagramConfig = {
    enabled: false,
    caption: '',
    shareToFeed: true,
};

export const DEFAULT_FACEBOOK_CONFIG: FacebookConfig = {
    enabled: false,
    postText: '',
};

export const DEFAULT_YOUTUBE_CONFIG: YouTubeConfig = {
    enabled: false,
    title: '',
    description: '',
    privacyStatus: 'public',
    category: '',
    tags: [],
    madeForKids: false,
    syntheticMedia: false,
};

export const DEFAULT_TIKTOK_CONFIG: TikTokConfig = {
    enabled: false,
    caption: '',
    privacyLevel: 'public',
    disableDuet: false,
    disableStitch: false,
    disableComments: false,
};

export const DEFAULT_REPEAT_OPTION: RepeatOption = {
    frequency: 'none',
    label: 'Does not repeat',
};

// ============================================
// Helper Functions
// ============================================

/**
 * Get default form data for a new post
 */
export const getDefaultPostFormData = (): ScheduleFormData => {
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    return {
        title: '',
        type: 'post',
        date: scheduledTime,
        time: formatTimeString(scheduledTime),
        repeat: DEFAULT_REPEAT_OPTION,
        platforms: {
            instagram: { ...DEFAULT_INSTAGRAM_CONFIG },
            facebook: { ...DEFAULT_FACEBOOK_CONFIG },
            youtube: { ...DEFAULT_YOUTUBE_CONFIG },
            tiktok: { ...DEFAULT_TIKTOK_CONFIG },
        },
    };
};

/**
 * Get default form data for a new story
 */
export const getDefaultStoryFormData = (): ScheduleFormData => {
    const now = new Date();
    const scheduledTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now

    return {
        title: '',
        type: 'story',
        date: scheduledTime,
        time: formatTimeString(scheduledTime),
        repeat: DEFAULT_REPEAT_OPTION,
        platforms: {
            instagram: { ...DEFAULT_INSTAGRAM_CONFIG },
            facebook: { ...DEFAULT_FACEBOOK_CONFIG },
        },
    };
};

/**
 * Format Date to time string "HH:MM AM/PM"
 */
export const formatTimeString = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const period = hours >= 12 ? 'PM' : 'AM';
    return `${displayHour}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Parse time string "HH:MM AM/PM" to hours and minutes
 */
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

/**
 * Get enabled platforms from form data
 */
export const getEnabledPlatforms = (formData: ScheduleFormData): Platform[] => {
    const enabled: Platform[] = [];

    if (formData.platforms.instagram?.enabled) enabled.push('instagram');
    if (formData.platforms.facebook?.enabled) enabled.push('facebook');
    if (formData.platforms.youtube?.enabled) enabled.push('youtube');
    if (formData.platforms.tiktok?.enabled) enabled.push('tiktok');

    return enabled;
};

/**
 * Generate repeat label based on selected date
 */
export const generateRepeatLabel = (frequency: RepeatFrequency, date: Date): string => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    switch (frequency) {
        case 'none':
            return 'Does not repeat';
        case 'daily':
            return 'Daily';
        case 'weekly':
            return `Weekly on ${dayNames[date.getDay()]}`;
        case 'monthly':
            const weekOfMonth = Math.ceil(date.getDate() / 7);
            const ordinals = ['first', 'second', 'third', 'fourth', 'fifth'];
            return `Monthly on the ${ordinals[weekOfMonth - 1]} ${dayNames[date.getDay()]}`;
        case 'annually':
            return `Annually on ${monthNames[date.getMonth()]} ${date.getDate()}`;
        case 'custom':
            return 'Custom...';
        default:
            return 'Does not repeat';
    }
};

/**
 * Validate that at least one platform is enabled
 */
export const hasEnabledPlatform = (formData: ScheduleFormData): boolean => {
    return getEnabledPlatforms(formData).length > 0;
};

/**
 * Validate that content is attached
 */
export const hasContent = (formData: ScheduleFormData): boolean => {
    return !!formData.contentId;
};
