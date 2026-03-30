import { ScheduleFormData } from './ScheduleFormData';
import { ApiScheduleDto, parseTimeString, SchedulePolicyDto } from './Post';

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

export const validateStoryForm = (formData: StoryFormData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!formData.title || formData.title.trim().length === 0) {
        errors.push('Story title is required');
    }

    const hasInstagram = formData.platforms.instagram?.enabled;
    const hasFacebook = formData.platforms.facebook?.enabled;

    if (!hasInstagram && !hasFacebook) {
        errors.push('At least one platform must be selected');
    }

    if (!formData.contentId) {
        errors.push('Content must be attached');
    }

    if (formData.date < new Date()) {
        errors.push('Scheduled date must be in the future');
    }

    return { isValid: errors.length === 0, errors };
};

const pad = (n: number) => String(n).padStart(2, '0');

const formatLocalDateTime = (date: Date): string =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:00`;

export const convertStoryFormToApiSchedule = (formData: StoryFormData): ApiScheduleDto => {
    const { hours, minutes } = parseTimeString(formData.time);

    const scheduledDate = new Date(formData.date);
    scheduledDate.setHours(hours, minutes, 0, 0);

    const targets: string[] = [];
    if (formData.platforms.instagram?.enabled) targets.push('INSTAGRAM');
    if (formData.platforms.facebook?.enabled) targets.push('FACEBOOK');

    const policy: SchedulePolicyDto | null = formData.repeat.rruleText
        ? {
              rrule: formData.repeat.rruleText,
              endTime: formData.repeat.endDate
                  ? `${formData.repeat.endDate.getFullYear()}-${pad(formData.repeat.endDate.getMonth() + 1)}-${pad(formData.repeat.endDate.getDate())}T23:59:59`
                  : null,
          }
        : null;

    return {
        scheduleName: formData.title,
        uploadType: 'Story',
        policy,
        plannedAt: formatLocalDateTime(scheduledDate),
        targets,
        contents: formData.contentId ? [formData.contentId] : null,
        isDraft: false,
    };
};
