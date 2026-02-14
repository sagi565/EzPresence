import { ScheduleFormData } from './ScheduleFormData';
import { ApiScheduleDto } from './Post';

// ============================================
// Story-Specific Types
// ============================================

/**
 * Story schedules are simplified - no platform-specific configurations
 * Only Instagram and Facebook support stories
 */
export interface StoryFormData extends Omit<ScheduleFormData, 'platforms'> {
    type: 'story';
    platforms: {
        instagram?: {
            enabled: boolean;
            accountId?: string;
            caption?: string;
            shareToFeed?: boolean;
        };
        facebook?: {
            enabled: boolean;
            accountId?: string;
            postText?: string;
        };
    };
}

// ============================================
// Validation
// ============================================

/**
 * Validate story form data
 */
export const validateStoryForm = (formData: StoryFormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Title validation
    if (!formData.title || formData.title.trim().length === 0) {
        errors.push('Story title is required');
    }

    // Platform validation
    const hasInstagram = formData.platforms.instagram?.enabled;
    const hasFacebook = formData.platforms.facebook?.enabled;

    if (!hasInstagram && !hasFacebook) {
        errors.push('At least one platform must be selected');
    }

    // Content validation
    if (!formData.contentId) {
        errors.push('Content must be attached');
    }

    // Date validation
    const now = new Date();
    if (formData.date < now) {
        errors.push('Scheduled date must be in the future');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// ============================================
// Conversion to API Format
// ============================================

/**
 * Convert story form data to API schedule format
 */
export const convertStoryFormToApiSchedule = (formData: StoryFormData): ApiScheduleDto => {
    const { hours, minutes } = parseTimeString(formData.time);

    const scheduledDate = new Date(formData.date);
    scheduledDate.setHours(hours, minutes, 0, 0);

    const targets: string[] = [];
    if (formData.platforms.instagram?.enabled) targets.push('instagram');
    if (formData.platforms.facebook?.enabled) targets.push('facebook');

    return {
        scheduleName: formData.title,
        scheduleTitle: formData.title,
        scheduleDescription: null,
        postType: 'video', // Stories are typically video format
        plannedAtUtc: scheduledDate.toISOString(),
        startDate: formData.date.toISOString().split('T')[0],
        endDate: formData.repeat.endDate?.toISOString().split('T')[0] || null,
        rruleText: formData.repeat.rruleText || null,
        targets,
        contentUuids: formData.contentId ? [formData.contentId] : null,
    };
};

// Helper function to parse time string
const parseTimeString = (time: string): { hours: number; minutes: number } => {
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
