import React, { useState, useEffect, useMemo } from 'react';
import {
    getDefaultStoryFormData,
    DEFAULT_INSTAGRAM_CONFIG,
    DEFAULT_FACEBOOK_CONFIG,
    generateRepeatLabel,
    generateRruleText
} from '@/models/ScheduleFormData';
import { StoryFormData } from '@/models/StorySchedule';
import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import RepeatSelector from '../RepeatSelector/RepeatSelector';
import TimezoneSelector, { TIMEZONES, TimezoneOption, getTimezoneLabel } from '../TimezoneSelector/TimezoneSelector';
import { ContentItem } from '@/models/ContentList';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@/hooks/useSchedules';
import { theme } from '@/theme/theme';
import { useContentPicking } from '../useContentPicking';

import ScheduleModalLayout from '../ScheduleModalLayout/ScheduleModalLayout';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ContentPreview from '../ContentPreview';
import ChipButton from '../ChipButton/ChipButton';
import ChipArrow from '../ChipArrow/ChipArrow';
import SectionContainer from '../SectionContainer/SectionContainer';
import RecurringActionDialog from '../RecurringActionDialog/RecurringActionDialog';

interface NewStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (formData: StoryFormData) => void;
    onSaveDraft: (formData: StoryFormData) => void;
    brandId: string;
    initialData?: Partial<StoryFormData>;
    content: ContentItem[];
    onOpenDrawer: (pickingMode?: boolean) => void;
    onCancelPicking?: () => void;
    onContentDrop?: () => void;
    lastPickedContent?: ContentItem | null;
    status?: string;
}

// Helper for parsing time since we need it for validation locally
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

const NewStoryModal: React.FC<NewStoryModalProps> = ({
    isOpen,
    onClose,
    onSchedule: onScheduleProp,
    onSaveDraft,
    brandId,
    initialData,
    content,
    onOpenDrawer,
    onCancelPicking,
    onContentDrop,
    lastPickedContent,
    status
}) => {
    const { currentBrand } = useBrands();
    const { createSchedule, updateSchedule, deleteSchedule } = useSchedules(currentBrand?.id || '');

    const [formData, setFormData] = useState<StoryFormData>(getDefaultStoryFormData() as StoryFormData);

    // Determine if the story is read-only (in the past or already published)
    const isPast = useMemo(() => {
        if (!formData.date) return false;
        try {
            const { hours, minutes } = parseTimeString(formData.time);
            const scheduledDate = new Date(formData.date);
            scheduledDate.setHours(hours, minutes, 0, 0);
            return scheduledDate < new Date();
        } catch (e) {
            return false;
        }
    }, [formData.date, formData.time]);

    const isPublished = status === 'success';
    const isReadOnly = (isPast || isPublished) && !!formData.calendarItemId;

    // Listen for external picks (drawer double-click)
    useEffect(() => {
        if (lastPickedContent) {
            handleContentSelect(lastPickedContent);
        }
    }, [lastPickedContent]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showRepeatSelector, setShowRepeatSelector] = useState(false);
    const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ title?: string; platform?: string; date?: string; content?: string }>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRecurringDialog, setShowRecurringDialog] = useState(false);
    const [recurringDialogMode, setRecurringDialogMode] = useState<'edit' | 'delete'>('edit');
    const [isShattering, setIsShattering] = useState(false);
    const [isDraftHovered, setIsDraftHovered] = useState(false);

    const handleDelete = async () => {
        if (!formData.scheduleUuid && !formData.calendarItemId) return;

        if (formData.repeat.frequency && formData.repeat.frequency !== 'none') {
            setRecurringDialogMode('delete');
            setShowRecurringDialog(true);
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const handleRecurringConfirm = async (option: 'this' | 'following' | 'all') => {
        setShowRecurringDialog(false);
        const occurrenceOnly = option === 'this';

        if (recurringDialogMode === 'delete') {
            await executeDelete(occurrenceOnly);
        } else {
            await executeSchedule(occurrenceOnly);
        }
    };

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        await executeDelete(false);
    };

    const executeDelete = async (occurrenceOnly: boolean) => {
        try {
            setIsSubmitting(true);
            const { hours, minutes } = parseTimeString(formData.time);
            const plannedDate = new Date(formData.date);
            plannedDate.setHours(hours, minutes, 0, 0);

            if (!occurrenceOnly) {
                setIsShattering(true);
                await new Promise(resolve => setTimeout(resolve, 600));
            }

            await deleteSchedule(formData.calendarItemId || formData.scheduleUuid || '', plannedDate, occurrenceOnly);

            setIsShattering(false);
            onClose();
            if (onScheduleProp) onScheduleProp(formData);
        } catch (error) {
            console.error('Failed to delete schedule:', error);
            setIsShattering(false);
        } finally {
            setIsSubmitting(false);
        }
    };


    // Fetch connected platforms
    const { platforms } = useConnectedPlatforms(brandId);

    // Fetch user profile for auto-timezone
    const { profile } = useUserProfile();

    // Content Picking Hook

    const handleContentPick = (item: any) => {
        const contentItem = content.find(c => c.id === item.id) || item;
        handleContentSelect(contentItem);
    };

    const { startPicking, cancelPicking, isPicking } = useContentPicking({
        onPick: handleContentPick,
        targetType: 'story'
    });

    // Auto-detect timezone based on user country
    useEffect(() => {
        if (profile?.country && !formData.timezone) {
            const userCountry = profile.country.toLowerCase();
            const matchedTz = TIMEZONES.find((tz: TimezoneOption) =>
                tz.country.toLowerCase() === userCountry ||
                tz.country.toLowerCase().includes(userCountry)
            );

            if (matchedTz) {
                setFormData(prev => ({ ...prev, timezone: matchedTz.value }));
            }
        }
    }, [profile, formData.timezone]);

    // Initialize form data
    useEffect(() => {
        if (isOpen) {
            const defaultData = getDefaultStoryFormData() as StoryFormData;

            // Handle platform mapping from Post model (array) to Form data (object)
            const initialPlatforms = initialData?.platforms;
            let formattedPlatforms = defaultData.platforms;

            if (Array.isArray(initialPlatforms)) {
                // If coming from Post model (array of strings)
                initialPlatforms.forEach((p: any) => {
                    const platformKey = p.toLowerCase() as 'instagram' | 'facebook';
                    if (formattedPlatforms[platformKey]) {
                        formattedPlatforms[platformKey] = {
                            ...formattedPlatforms[platformKey]!,
                            enabled: true
                        };
                    }
                });
            } else if (initialPlatforms && typeof initialPlatforms === 'object') {
                // If it's already in the correct format (e.g. from draft)
                formattedPlatforms = { ...formattedPlatforms, ...initialPlatforms };
            }

            let newFormData = {
                ...defaultData,
                ...initialData,
                platforms: formattedPlatforms
            };

            // Hydrate content details if ID is present
            // NEW: Take first element from contents/contentUuids if contentId is not yet set
            if (!newFormData.contentId) {
                const firstContentId = initialData?.contents?.[0] || initialData?.contentUuids?.[0];
                if (firstContentId) {
                    newFormData.contentId = firstContentId;
                }
            }

            if (newFormData.contentId && content.length > 0) {
                const foundContent = content.find(c => c.id === newFormData.contentId);
                // Only override if missing or explicit sync needed. For now, trust initialData if present, else fallback to content list
                if (foundContent) {
                    newFormData = {
                        ...newFormData,
                        contentTitle: newFormData.contentTitle || foundContent.title || 'Untitled',
                        contentThumbnail: newFormData.contentThumbnail || foundContent.thumbnail || ''
                    };
                }
            }

            setFormData(newFormData);
        } else {
            console.log('🚪 [NewStoryModal] Not open, cleaning up or resetting state.');
            // Ensure picking is cancelled if modal closes externally
            if (onCancelPicking) {
                console.log('🧹 [NewStoryModal] Calling onCancelPicking via state reset effect');
                onCancelPicking();
            }
            cancelPicking(); // Explicitly cancel local picking state
        }
    }, [isOpen, initialData, cancelPicking, content]);

    // Handle escape key and custom selection events
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isOpen, onClose]);

    // Handle click outside pickers to close them
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if click is inside any picker or chip button
            const isInsidePicker = target.closest('.date-picker, .time-picker, .timezone-selector, .repeat-selector');
            const isInsideChip = target.closest('.chip-button') || target.closest('[role="button"]') || target.closest('button');

            // If clicked outside all pickers and chips, close all pickers
            if (!isInsidePicker && !isInsideChip) {
                closeAllPickers();
            }
        };

        if (isOpen && (showDatePicker || showTimePicker || showTimezoneSelector || showRepeatSelector)) {
            // Delay adding listener to avoid closing immediately after opening
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, showDatePicker, showTimePicker, showTimezoneSelector, showRepeatSelector]);

    const isFormValid = useMemo(() => {
        if (!formData.title?.trim()) return false;

        const selectedPlatforms = (Object.keys(formData.platforms) as Array<'instagram' | 'facebook'>).filter(
            (platformKey) => formData.platforms[platformKey]?.enabled
        );
        if (selectedPlatforms.length === 0) return false;

        if (!formData.contentId) return false;

        try {
            const now = new Date();
            const { hours, minutes } = parseTimeString(formData.time);
            const scheduledDate = new Date(formData.date);
            scheduledDate.setHours(hours, minutes, 0, 0);
            if (scheduledDate < now) return false;
        } catch (e) {
            return false;
        }

        return true;
    }, [formData]);

    if (!isOpen) return null;

    // Helper to close all pickers
    const closeAllPickers = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
        setShowTimezoneSelector(false);
        setShowRepeatSelector(false);
    };

    const handleDateChange = (date: Date) => {
        setFormData(prev => {
            const nextRepeat = { ...prev.repeat };
            if (nextRepeat.frequency !== 'none' && nextRepeat.frequency !== 'custom') {
                nextRepeat.label = generateRepeatLabel(nextRepeat.frequency, date);
                nextRepeat.rruleText = generateRruleText(nextRepeat.frequency, date);
            }
            return {
                ...prev,
                date,
                repeat: nextRepeat
            };
        });
        setShowDatePicker(false);
    };

    const handleTimeChange = (time: string) => {
        setFormData(prev => ({ ...prev, time }));
        // Don't close time picker automatically, let user click outside or close
    };

    const handlePlatformToggle = (e: React.MouseEvent, platform: 'instagram' | 'facebook') => {
        e.stopPropagation();
        setValidationErrors(prev => ({ ...prev, platform: undefined }));
        setFormData(prev => {
            const currentPlatform = prev.platforms[platform];
            const isEnabled = !currentPlatform?.enabled;

            // Get default config based on platform
            const defaultConfig = platform === 'instagram'
                ? { ...DEFAULT_INSTAGRAM_CONFIG }
                : { ...DEFAULT_FACEBOOK_CONFIG };

            return {
                ...prev,
                platforms: {
                    ...prev.platforms,
                    [platform]: {
                        ...(currentPlatform || defaultConfig),
                        enabled: isEnabled,
                    }
                }
            };
        });
    };

    const getPlatformColor = (platform: 'instagram' | 'facebook'): string => {
        switch (platform) {
            case 'instagram': return '#E4405F';
            case 'facebook': return '#1877F2';
            default: return theme.colors.primary;
        }
    };


    const handleSchedule = async () => {
        if (isReadOnly) return;
        try {
            // Validate all fields
            const errors: { title?: string; platform?: string; date?: string; content?: string } = {};

            if (!formData.title.trim()) {
                errors.title = 'Title is required';
            }

            const selectedPlatforms = (Object.keys(formData.platforms) as Array<'instagram' | 'facebook'>).filter(
                (platformKey) => formData.platforms[platformKey]?.enabled
            );

            if (selectedPlatforms.length === 0) {
                errors.platform = 'Please select at least one platform';
            }

            const now = new Date();
            const { hours, minutes } = parseTimeString(formData.time);
            const scheduledDate = new Date(formData.date);
            scheduledDate.setHours(hours, minutes, 0, 0);

            if (scheduledDate < now) {
                errors.date = 'Cannot schedule a story in the past';
            }

            if (!formData.contentId) {
                errors.content = 'Please add content to your story';
            }

            if (Object.keys(errors).length > 0) {
                setValidationErrors(errors);
                return;
            }

            setValidationErrors({});

            // If editing a recurring post, ask for scope
            if (formData.calendarItemId && formData.repeat.frequency !== 'none' && !isReadOnly) {
                setRecurringDialogMode('edit');
                setShowRecurringDialog(true);
            } else {
                await executeSchedule(false);
            }
        } catch (error) {
            console.error('Failed to trigger schedule flow:', error);
        }
    };

    const executeSchedule = async (occurrenceOnly: boolean) => {
        try {
            setIsSubmitting(true);

            const selectedPlatforms = (Object.keys(formData.platforms) as Array<'instagram' | 'facebook'>).filter(
                (platformKey) => formData.platforms[platformKey]?.enabled
            );

            // Determine media type based on content
            const selectedContent = getSelectedContent();
            console.log('🚀 [NewStoryModal] Selected Content for media type:', selectedContent);
            const mediaType = selectedContent?.mediaType === 'video' || selectedContent?.type === 'video' ? 'video' : 'image';
            console.log('🚀 [NewStoryModal] Determined Media Type:', mediaType);

            const isRecurring = !!formData.repeat.rruleText;
            const startDateStr = isRecurring ? `${formData.date.getFullYear()}-${String(formData.date.getMonth() + 1).padStart(2, '0')}-${String(formData.date.getDate()).padStart(2, '0')}` : null;
            const endDateStr = isRecurring && formData.repeat.endDate ? `${formData.repeat.endDate.getFullYear()}-${String(formData.repeat.endDate.getMonth() + 1).padStart(2, '0')}-${String(formData.repeat.endDate.getDate()).padStart(2, '0')}` : null;

            if (formData.calendarItemId) {
                // UPDATE existing schedule
                await updateSchedule(formData.calendarItemId, {
                    date: formData.date,
                    time: formData.time,
                    platforms: selectedPlatforms,
                    media: mediaType,
                    title: formData.contentTitle || 'Story',
                    rruleText: formData.repeat.rruleText || null,
                    startDate: startDateStr,
                    endDate: endDateStr,
                    status: 'Pending',
                }, occurrenceOnly);
            } else {
                // Create schedule via API
                await createSchedule({
                    date: formData.date,
                    time: formData.time,
                    platforms: selectedPlatforms,
                    media: mediaType,
                    title: formData.contentTitle || 'Story',
                    contentUuids: formData.contentId ? [formData.contentId] : undefined,
                    type: 'Story',
                    // Pass rruleText and endDate if they exist, otherwise they will be null
                    rruleText: formData.repeat.rruleText,
                    endDate: formData.repeat.endDate || undefined,
                    status: 'Pending',
                });
            }

            // Done — close modal and refresh
            if (onScheduleProp) onScheduleProp(formData);
            if (!isReadOnly) onClose();

        } catch (error) {
            console.error('Failed to schedule story:', error);
            alert('Failed to schedule story. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            setIsSubmitting(true);
            const selectedPlatforms = (Object.keys(formData.platforms) as Array<'instagram' | 'facebook'>).filter(
                (platformKey) => formData.platforms[platformKey]?.enabled
            );

            const selectedContent = getSelectedContent();
            const mediaType = selectedContent?.mediaType === 'video' || selectedContent?.type === 'video' ? 'video' : 'image';

            const isRecurring = !!formData.repeat.rruleText;
            const startDateStr = isRecurring ? `${formData.date.getFullYear()}-${String(formData.date.getMonth() + 1).padStart(2, '0')}-${String(formData.date.getDate()).padStart(2, '0')}` : null;
            const endDateStr = isRecurring && formData.repeat.endDate ? `${formData.repeat.endDate.getFullYear()}-${String(formData.repeat.endDate.getMonth() + 1).padStart(2, '0')}-${String(formData.repeat.endDate.getDate()).padStart(2, '0')}` : null;

            if (formData.calendarItemId) {
                await updateSchedule(formData.calendarItemId, {
                    date: formData.date,
                    time: formData.time,
                    platforms: selectedPlatforms,
                    media: mediaType,
                    title: formData.contentTitle || 'Story Draft',
                    rruleText: formData.repeat.rruleText || null,
                    startDate: startDateStr,
                    endDate: endDateStr,
                    status: 'Draft',
                });
            } else {
                await createSchedule({
                    date: formData.date,
                    time: formData.time,
                    platforms: selectedPlatforms,
                    media: mediaType,
                    title: formData.contentTitle || 'Story Draft',
                    contentUuids: formData.contentId ? [formData.contentId] : undefined,
                    type: 'Story',
                    rruleText: formData.repeat.rruleText,
                    endDate: formData.repeat.endDate || undefined,
                    status: 'Draft',
                });
            }

            if (onSaveDraft) onSaveDraft(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save story draft:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = () => {
        if (isPicking) {
            cancelPicking();
        } else {
            onClose();
        }
    };

    const getPlatformIconPath = (platform: 'instagram' | 'facebook'): string => {
        return `/icons/social/${platform}.png`;
    };


    // Render platform section (Selection Only)
    const renderPlatformSection = (platform: 'instagram' | 'facebook') => {
        const account = platforms.find(p => p.platform === platform);
        const platformColor = getPlatformColor(platform);
        const isSelected = formData.platforms[platform]?.enabled || false;

        return (
            <div
                key={platform}
                style={{
                    ...platformSectionStyle,
                    borderLeftColor: isSelected ? platformColor : 'rgba(0,0,0,0.1)',
                    cursor: 'pointer', // Make the whole card clickable
                }}
                onClick={(e) => handlePlatformToggle(e, platform)}
            >
                <div
                    style={{
                        ...platformHeaderStyle,
                        ...(isSelected ? { background: `${platformColor}08` } : {})
                    }}
                >
                    <div style={platformHeaderContentStyle}>
                        {/* Checkbox Toggle */}
                        <div
                            style={{
                                width: '18px', height: '18px', borderRadius: '5px',
                                border: '1.5px solid', borderColor: isSelected ? platformColor : 'rgba(0,0,0,0.15)',
                                background: isSelected ? platformColor : '#fff',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all .18s', flexShrink: 0, marginRight: '10px'
                            }}
                            title={isSelected ? "Click to disable" : "Click to enable"}
                        >
                            {isSelected && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
                        </div>

                        {/* Profile Picture (or Placeholder) */}
                        <div style={{ position: 'relative', width: '34px', height: '34px' }}>
                            {account && account.profilePicture ? (
                                <img
                                    src={account.profilePicture}
                                    alt={account.username}
                                    style={{
                                        width: '34px',
                                        height: '34px',
                                        borderRadius: '9px',
                                        objectFit: 'cover',
                                        border: '1.5px solid rgba(255,255,255,.4)',
                                        boxShadow: '0 1px 4px rgba(251, 191, 36, 0.15)',
                                    }}
                                />
                            ) : (
                                <div style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '9px',
                                    background: '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1.5px solid rgba(255,255,255,.4)',
                                    boxShadow: '0 1px 4px rgba(251, 191, 36, 0.15)',
                                    color: '#9ca3af',
                                    fontSize: '17px'
                                }}>
                                    {platform.charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Platform Logo Badge (Bottom Right) */}
                            <div style={{
                                position: 'absolute',
                                bottom: '-4px',
                                right: '-4px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: '#fff',
                                border: '1.5px solid #fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={getPlatformIconPath(platform)}
                                    alt=""
                                    style={{ width: '14px', height: '14px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', gap: '1px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 400, color: theme.colors.text, letterSpacing: '0.02em' }}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                            {account && (
                                <span style={{ fontSize: '11px', fontWeight: 600, color: theme.colors.muted }}>
                                    {account.username.startsWith('@') ? account.username : `@${account.username}`}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const handleContentSelect = (selectedContent: ContentItem) => {
        setFormData(prev => ({
            ...prev,
            contentId: selectedContent.id,
            contentTitle: selectedContent.title || 'Untitled',
            contentThumbnail: selectedContent.thumbnail || ''
        }));
        if (validationErrors.content) setValidationErrors(prev => ({ ...prev, content: undefined }));
        if (onCancelPicking) onCancelPicking();
    };

    // Manual drop for standard drag-and-drop
    const handleManualDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const contentId = e.dataTransfer.getData('contentId');
        if (contentId) {
            const droppedContent = content.find(c => c.id === contentId);
            if (droppedContent) {
                handleContentSelect(droppedContent);
                if (onContentDrop) onContentDrop();
            }
        }
    };

    const handleRemoveContent = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData(prev => ({
            ...prev,
            contentId: '',
            contentTitle: '',
            contentThumbnail: ''
        }));
        if (onCancelPicking) onCancelPicking();
    };

    const formatDateLabel = (date: Date): string => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    };

    const getSelectedContent = () => {
        if (!formData.contentId) return null;
        // Try to find in content list first for full details
        const found = content.find(c => c.id === formData.contentId);
        if (found) {
            // Map Content.mediaType to ContentItem.type for ContentPreview compatibility
            return {
                ...found,
                type: (found as any).type || (found as any).mediaType || 'video',
            };
        }
        // Fallback to formData details
        return {
            id: formData.contentId,
            title: formData.contentTitle || '',
            thumbnail: formData.contentThumbnail || '',
            type: 'video' as const,
            mediaType: 'video'
        };
    };

    // Inline styles matching demo design
    const titleInputStyle: React.CSSProperties = {
        width: 'calc(70% - 28px)',
        border: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, .1)',
        outline: 'none',
        fontSize: '22px',
        fontWeight: 700,
        color: theme.colors.text,
        padding: '16px 0 6px',
        marginLeft: '28px',
        background: 'transparent',
        fontFamily: 'inherit',
        transition: 'border-color .2s ease, border-bottom-width .15s ease',
    };

    const chipRowStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
    };



    // Platform accordion section styles (matching Post modal)
    const platformSectionStyle: React.CSSProperties = {
        borderRadius: '12px',
        border: '1.5px solid rgba(0,0,0,.06)',
        borderLeftWidth: '3px',
        overflow: 'visible',
        transition: 'all .25s cubic-bezier(.4,0,.2,1)',
        marginBottom: '12px',
        background: '#fff',
    };

    const platformHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        cursor: 'pointer',
        userSelect: 'none',
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        transition: 'background .15s',
    };

    const platformHeaderContentStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    };



    const draftBtnStyle: React.CSSProperties = {
        padding: '10px 22px',
        border: 'none',
        borderRadius: '10px',
        background: '#fff',
        fontSize: '14px',
        fontWeight: 600,
        color: theme.colors.muted,
        cursor: 'pointer',
        transition: 'all .18s',
        boxShadow: '0 1px 4px rgba(0, 0, 0, .08)',
    };

    const scheduleBtnStyle: React.CSSProperties = {
        padding: '10px 28px',
        border: 'none',
        borderRadius: '10px',
        background: theme.gradients.innovator,
        color: '#fff',
        fontSize: '14px',
        fontWeight: 700,
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
        transition: 'all .2s',
        boxShadow: '0 3px 12px rgba(155, 93, 229, .25)',
        opacity: isSubmitting ? 0.7 : 1,
    };



    return (
        <div className={`new-story-modal-wrapper ${isShattering ? 'shatter-animation' : ''}`}>
            <ScheduleModalLayout
                isOpen={isOpen}
                onClose={onClose}
                onOverlayClick={handleOverlayClick}
                onDelete={formData.calendarItemId ? handleDelete : undefined}
                isDeleting={isSubmitting}
                title=""
                icon="📖"
                beforeBody={
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input
                            type="text"
                            style={{
                                ...titleInputStyle,
                                ...(validationErrors.title ? { borderBottomColor: '#EF4444' } : {})
                            }}
                            placeholder={formData.calendarItemId ? (isReadOnly ? "View story" : "Edit story") : "New story"}
                            value={formData.title}
                            readOnly={isReadOnly}
                            onChange={(e) => {
                                if (isReadOnly) return;
                                setFormData({ ...formData, title: e.target.value });
                                if (validationErrors.title) setValidationErrors(prev => ({ ...prev, title: undefined }));
                            }}
                            maxLength={80}
                        />
                        {validationErrors.title && (
                            <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginLeft: '28px', marginTop: '4px' }}>
                                {validationErrors.title}
                            </span>
                        )}
                    </div>
                }
                rightColumn={
                    <div style={{ position: 'relative' }}>
                        <ContentPreview
                            id="nsmContentPreview"
                            content={getSelectedContent()}
                            isDragOver={isDragOver}
                            onRemove={handleRemoveContent}
                            onOpenDrawer={() => {
                                console.log('🖱️ [NewStoryModal] Click on ContentPreview, starting picking');
                                startPicking();
                                onOpenDrawer(true);
                            }}
                            onDrop={handleManualDrop}
                            onDragOver={(e: React.DragEvent) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = 'copy';
                                setIsDragOver(true);
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                            placeholderText="Click to add content"
                        />
                        {validationErrors.content && (
                            <div style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, textAlign: 'center', marginTop: '8px' }}>
                                {validationErrors.content}
                            </div>
                        )}
                    </div>
                }
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <button
                            onClick={handleSaveDraft}
                            disabled={isSubmitting || isReadOnly}
                            onMouseEnter={() => setIsDraftHovered(true)}
                            onMouseLeave={() => setIsDraftHovered(false)}
                            style={{
                                ...draftBtnStyle,
                                opacity: (isSubmitting || isReadOnly) ? 0.5 : 1,
                                cursor: (isSubmitting || isReadOnly) ? 'not-allowed' : 'pointer',
                                ...((isDraftHovered && !isSubmitting && !isReadOnly) ? {
                                    background: 'rgba(155, 93, 229, 0.1)',
                                    color: '#9b5de5',
                                    boxShadow: '0 2px 8px rgba(155, 93, 229, 0.2)'
                                } : {})
                            }}
                        >
                            Save as Draft
                        </button>
                        <button
                            onClick={handleSchedule}
                            disabled={isSubmitting || isReadOnly || !isFormValid}
                            style={{
                                ...scheduleBtnStyle,
                                opacity: (isSubmitting || isReadOnly || !isFormValid) ? 0.7 : 1,
                                cursor: (isSubmitting || isReadOnly || !isFormValid) ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSubmitting ? 'Processing...' : (isReadOnly ? 'View Only' : (formData.calendarItemId ? 'Update Story' : 'Schedule Story'))}
                        </button>
                    </div>
                }
            >
                {/* Time Section */}
                <SectionContainer icon="🕐">
                    <div style={chipRowStyle}>
                        {/* Date Chip */}
                        <div style={{ position: 'relative' }}>
                            <ChipButton
                                minWidth="200px"
                                onClick={() => {
                                    closeAllPickers();
                                    setShowDatePicker(true);
                                }}
                            >
                                <span>{formatDateLabel(formData.date)}</span>
                                <ChipArrow />
                            </ChipButton>
                            <DatePicker
                                selectedDate={formData.date}
                                onChange={handleDateChange}
                                minDate={new Date()}
                                show={showDatePicker}
                                onClose={() => setShowDatePicker(false)}
                            />
                        </div>

                        {/* Time Chip */}
                        <div style={{ position: 'relative' }}>
                            <ChipButton
                                minWidth="120px"
                                onClick={() => {
                                    closeAllPickers();
                                    setShowTimePicker(true);
                                }}
                            >
                                <span>{formData.time}</span>
                                <ChipArrow />
                            </ChipButton>
                            <TimePicker
                                selectedTime={formData.time}
                                onChange={handleTimeChange}
                                show={showTimePicker}
                                onClose={() => setShowTimePicker(false)}
                            />
                        </div>

                        {/* Timezone Chip */}
                        <div style={{ position: 'relative' }}>
                            <ChipButton
                                minWidth="120px"
                                onClick={() => {
                                    closeAllPickers();
                                    setShowTimezoneSelector(true);
                                }}
                            >
                                <span style={{ minWidth: '80px', display: 'inline-block' }}>
                                    {formData.timezone ? getTimezoneLabel(formData.timezone) : 'Timezone'}
                                </span>
                                <ChipArrow />
                            </ChipButton>
                            <TimezoneSelector
                                selectedTimezone={formData.timezone || 'America/New_York'}
                                onChange={(tz) => {
                                    setFormData(prev => ({ ...prev, timezone: tz }));
                                    setShowTimezoneSelector(false);
                                }}
                                show={showTimezoneSelector}
                                onClose={() => setShowTimezoneSelector(false)}
                            />
                        </div>
                    </div>

                    {/* Repeat Chip */}
                    <div style={chipRowStyle}>
                        <div style={{ position: 'relative' }}>
                            <ChipButton
                                minWidth="260px"
                                maxWidth="260px"
                                style={{ position: 'relative' }}
                                onClick={() => {
                                    closeAllPickers();
                                    setShowRepeatSelector(true);
                                }}
                            >
                                <span>{formData.repeat.label}</span>
                                <ChipArrow />
                            </ChipButton>
                            <RepeatSelector
                                selectedRepeat={formData.repeat}
                                onChange={(repeat) => {
                                    setFormData({ ...formData, repeat });
                                    setShowRepeatSelector(false);
                                }}
                                baseDate={formData.date}
                                show={showRepeatSelector}
                                onClose={() => setShowRepeatSelector(false)}
                            />
                        </div>
                    </div>
                </SectionContainer>

                {/* Platforms Section */}
                <SectionContainer icon="📲">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {platforms.filter(p => (p.platform === 'instagram' || p.platform === 'facebook') && p.isConnected).length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.muted, fontSize: '13px' }}>
                                No connected platforms. Please connect Instagram or Facebook to create stories.
                            </div>
                        )}
                        {platforms.some(p => p.platform === 'instagram' && p.isConnected) && renderPlatformSection('instagram')}
                        {platforms.some(p => p.platform === 'facebook' && p.isConnected) && renderPlatformSection('facebook')}
                        {validationErrors.platform && (
                            <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginTop: '-4px' }}>
                                {validationErrors.platform}
                            </span>
                        )}
                    </div>
                </SectionContainer>
                {validationErrors.date && (
                    <div style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginLeft: '42px', marginTop: '-16px' }}>
                        {validationErrors.date}
                    </div>
                )}
            </ScheduleModalLayout>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Delete Story"
                message="Are you sure you want to delete this story? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setShowDeleteConfirm(false)}
            />

            <RecurringActionDialog
                isOpen={showRecurringDialog}
                mode={recurringDialogMode}
                onConfirm={handleRecurringConfirm}
                onCancel={() => setShowRecurringDialog(false)}
            />
        </div>
    );
};

export default NewStoryModal;
