import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import TimezoneSelector, { TIMEZONES, TimezoneOption } from '../TimezoneSelector/TimezoneSelector';
import { ContentItem } from '@/models/ContentList';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@/hooks/useSchedules';
import { theme } from '@/theme/theme';
import { useAppTheme } from '@/theme/ThemeContext';
import { useToast } from '@context/ToastContext';
import { useContentPicking } from '../useContentPicking';

import ScheduleModalLayout from '../ScheduleModalLayout/ScheduleModalLayout';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ContentPreview from '../ContentPreview';
import ChipButton from '../ChipButton/ChipButton';
import ChipArrow from '../ChipArrow/ChipArrow';
import SectionContainer from '../SectionContainer/SectionContainer';
import RecurringActionDialog from '../RecurringActionDialog/RecurringActionDialog';
import ContentDetailModal from '@/components/Content/ContentDetailModal/ContentDetailModal';


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

const parseTimeString = (time: string): { hours: number; minutes: number } => {
    const [timePart, period] = time.split(' ');
    const [hourStr, minuteStr] = timePart.split(':');
    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr);
    if (period?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    else if (period?.toUpperCase() === 'AM' && hours === 12) hours = 0;
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
    status,
}) => {
    const { currentBrand } = useBrands();
    const { showToast } = useToast();
    const { isDarkMode } = useAppTheme();
    const { createSchedule, updateSchedule, deleteSchedule } = useSchedules(currentBrand?.id || '');
    const [formData, setFormData] = useState<StoryFormData>(getDefaultStoryFormData() as StoryFormData);

    const isPast = useMemo(() => {
        if (!formData.date) return false;
        try {
            const { hours, minutes } = parseTimeString(formData.time);
            const scheduledDate = new Date(formData.date);
            scheduledDate.setHours(hours, minutes, 0, 0);
            return scheduledDate < new Date();
        } catch (e) { return false; }
    }, [formData.date, formData.time]);

    const isPublished = status === 'success';
    const isReadOnly = (isPast || isPublished) && !!formData.calendarItemId;
    const isPartOfPolicy = !!formData.calendarItemId && (formData.repeat.frequency !== 'none' || !!formData.repeat.rruleText);

    useEffect(() => {
        if (lastPickedContent) handleContentSelect(lastPickedContent);
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
    const [recurringTrigger, setRecurringTrigger] = useState<'edit' | 'delete' | 'draft'>('edit');
    const [isShattering, setIsShattering] = useState(false);
    const [isDraftHovered, setIsDraftHovered] = useState(false);
    const [selectedDetailContent, setSelectedDetailContent] = useState<ContentItem | null>(null);

    // ✅ THE FIX: drag counter lives in the parent, not ContentPreview
    const dragCounter = useRef(0);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current += 1;
        if (dragCounter.current === 1) setIsDragOver(true);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (_e: React.DragEvent) => {
        dragCounter.current -= 1;
        if (dragCounter.current <= 0) {
            dragCounter.current = 0;
            setIsDragOver(false);
        }
    };

    const handleManualDrop = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current = 0;
        setIsDragOver(false);
        const contentId = e.dataTransfer.getData('contentId');
        if (contentId) {
            const droppedContent = content.find(c => c.id === contentId);
            if (droppedContent) {
                handleContentSelect(droppedContent);
                cancelPicking(); // Ensure picking state and scrim are cleaned up
                if (onContentDrop) onContentDrop();
            }
        }
    };

    // Reset counter when drag ends anywhere on page
    useEffect(() => {
        const reset = () => {
            dragCounter.current = 0;
            setIsDragOver(false);
        };
        window.addEventListener('dragend', reset);
        return () => window.removeEventListener('dragend', reset);
    }, []);

    const { platforms } = useConnectedPlatforms(brandId);
    const { profile } = useUserProfile();

    const handleContentPick = (item: any) => {
        const contentItem = content.find(c => c.id === item.id) || item;
        handleContentSelect(contentItem);
    };

    const { startPicking, cancelPicking, isPicking } = useContentPicking({
        onPick: handleContentPick,
        targetType: 'story'
    });

    useEffect(() => {
        if (profile?.country && !formData.timezone) {
            const userCountry = profile.country.toLowerCase();
            const matchedTz = TIMEZONES.find((tz: TimezoneOption) =>
                tz.country.toLowerCase() === userCountry || tz.country.toLowerCase().includes(userCountry)
            );
            if (matchedTz) setFormData(prev => ({ ...prev, timezone: matchedTz.value }));
        }
    }, [profile, formData.timezone]);

    useEffect(() => {
        if (isOpen) {
            const defaultData = getDefaultStoryFormData() as StoryFormData;
            const initialPlatforms = initialData?.platforms;
            let formattedPlatforms = defaultData.platforms;
            if (Array.isArray(initialPlatforms)) {
                initialPlatforms.forEach((p: any) => {
                    const platformKey = p.toLowerCase() as 'instagram' | 'facebook';
                    if (formattedPlatforms[platformKey]) {
                        formattedPlatforms[platformKey] = { ...formattedPlatforms[platformKey]!, enabled: true };
                    }
                });
            } else if (initialPlatforms && typeof initialPlatforms === 'object') {
                formattedPlatforms = { ...formattedPlatforms, ...initialPlatforms };
            }
            let newFormData = { ...defaultData, ...initialData, platforms: formattedPlatforms };
            if (!newFormData.contentId) {
                const firstContentId = initialData?.contents?.[0] || initialData?.contentUuids?.[0];
                if (firstContentId) newFormData.contentId = firstContentId;
            }
            if (newFormData.contentId && content.length > 0) {
                const foundContent = content.find(c => c.id === newFormData.contentId);
                if (foundContent) {
                    newFormData = { ...newFormData, contentTitle: newFormData.contentTitle || foundContent.title || 'Untitled', contentThumbnail: newFormData.contentThumbnail || foundContent.thumbnail || '' };
                }
            }
            setFormData(newFormData);
        } else {
            if (onCancelPicking) onCancelPicking();
            cancelPicking();
        }
    }, [isOpen, initialData, cancelPicking, content]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInsidePicker = target.closest('.date-picker, .time-picker, .timezone-selector, .repeat-selector');
            const isInsideChip = target.closest('.chip-button') || target.closest('[role="button"]') || target.closest('button');
            if (!isInsidePicker && !isInsideChip) closeAllPickers();
        };
        if (isOpen && (showDatePicker || showTimePicker || showTimezoneSelector || showRepeatSelector)) {
            const timeoutId = setTimeout(() => { document.addEventListener('mousedown', handleClickOutside); }, 100);
            return () => { clearTimeout(timeoutId); document.removeEventListener('mousedown', handleClickOutside); };
        }
    }, [isOpen, showDatePicker, showTimePicker, showTimezoneSelector, showRepeatSelector]);

    const isFormValid = useMemo(() => {
        const selectedPlatforms = (Object.keys(formData.platforms) as Array<'instagram' | 'facebook'>).filter(k => formData.platforms[k]?.enabled);
        if (selectedPlatforms.length === 0) return false;
        const isPolicy = !!formData.calendarItemId && (formData.repeat.frequency !== 'none' || !!formData.repeat.rruleText);
        if (!formData.contentId && !isPolicy) return false;
        try {
            const now = new Date();
            const { hours, minutes } = parseTimeString(formData.time);
            const scheduledDate = new Date(formData.date);
            scheduledDate.setHours(hours, minutes, 0, 0);
            if (scheduledDate < now) return false;
        } catch (e) { return false; }
        return true;
    }, [formData]);

    const isDraftEnabled = !isSubmitting && !isReadOnly && (!!formData.contentId || isPartOfPolicy);

    if (!isOpen) return null;

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
            return { ...prev, date, repeat: nextRepeat };
        });
        setShowDatePicker(false);
    };

    const handleTimeChange = (time: string) => setFormData(prev => ({ ...prev, time }));

    const handlePlatformToggle = (e: React.MouseEvent, platform: 'instagram' | 'facebook') => {
        e.stopPropagation();
        setValidationErrors(prev => ({ ...prev, platform: undefined }));
        setFormData(prev => {
            const currentPlatform = prev.platforms[platform];
            const isEnabled = !currentPlatform?.enabled;
            const defaultConfig = platform === 'instagram' ? { ...DEFAULT_INSTAGRAM_CONFIG } : { ...DEFAULT_FACEBOOK_CONFIG };
            return { ...prev, platforms: { ...prev.platforms, [platform]: { ...(currentPlatform || defaultConfig), enabled: isEnabled } } };
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
            const errors: { title?: string; platform?: string; date?: string; content?: string } = {};
            const selectedPlatforms = (Object.keys(formData.platforms) as Array<'instagram' | 'facebook'>).filter(k => formData.platforms[k]?.enabled);
            if (selectedPlatforms.length === 0) errors.platform = 'Please select at least one platform';
            const now = new Date();
            const { hours, minutes } = parseTimeString(formData.time);
            const scheduledDate = new Date(formData.date);
            scheduledDate.setHours(hours, minutes, 0, 0);
            if (scheduledDate < now) errors.date = 'Cannot schedule a story in the past';
            if (!formData.contentId && !isPartOfPolicy) errors.content = 'Please add content to your story';
            if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }
            setValidationErrors({});
            if (isPartOfPolicy && !isReadOnly) {
                setRecurringTrigger('edit');
                setRecurringDialogMode('edit');
                setShowRecurringDialog(true);
            } else {
                await executeSchedule(false);
            }
        } catch (error) { console.error('Failed to trigger schedule flow:', error); }
    };

    const executeSchedule = async (occurrenceOnly: boolean) => {
        try {
            setIsSubmitting(true);
            const selectedPlatforms = (Object.keys(formData.platforms) as Array<'instagram' | 'facebook'>).filter(k => formData.platforms[k]?.enabled);
            const selectedContent = getSelectedContent();
            const mediaType = selectedContent?.mediaType === 'video' || selectedContent?.type === 'video' ? 'video' : 'image';
            const isRecurring = !!formData.repeat.rruleText;
            const endDateStr = isRecurring && formData.repeat.endDate ? `${formData.repeat.endDate.getFullYear()}-${String(formData.repeat.endDate.getMonth() + 1).padStart(2, '0')}-${String(formData.repeat.endDate.getDate()).padStart(2, '0')}` : null;
            if (formData.calendarItemId) {
                const updates: Partial<any> = {};
                let dateOrTimeChanged = false;
                if (formData.date?.getTime() !== initialData?.date?.getTime()) { updates.date = formData.date; dateOrTimeChanged = true; }
                if (formData.time !== initialData?.time) { updates.time = formData.time; dateOrTimeChanged = true; }
                if (dateOrTimeChanged) {
                    updates.date = formData.date;
                    updates.time = formData.time;
                    updates.timezone = formData.timezone;
                }

                const origPlatforms = (initialData as any)?.platforms || [];
                if (selectedPlatforms.length !== origPlatforms.length || !selectedPlatforms.every(p => origPlatforms.includes(p as any))) {
                    updates.platforms = selectedPlatforms;
                }

                if (mediaType !== (initialData as any)?.media) updates.media = mediaType;

                const newTitle = formData.title || formData.contentTitle || 'New Story';
                if (newTitle !== initialData?.title) updates.title = newTitle;

                const newRruleText = formData.repeat.rruleText || null;
                const origRruleText = initialData?.repeat?.rruleText || null;
                if (newRruleText !== origRruleText && !(newRruleText === null && origRruleText === 'POLICY')) {
                    updates.rruleText = newRruleText;
                }

                if (endDateStr) updates.endDate = endDateStr;

                await updateSchedule(formData.calendarItemId, updates, occurrenceOnly);
            } else {
                await createSchedule({ date: formData.date, time: formData.time, platforms: selectedPlatforms, media: mediaType, title: formData.title || formData.contentTitle || 'New Story', contentUuids: formData.contentId ? [formData.contentId] : undefined, type: 'Story', rruleText: formData.repeat.rruleText, endDate: formData.repeat.endDate || undefined, status: 'Pending' });
            }
            if (onScheduleProp) onScheduleProp(formData);
            if (!isReadOnly) onClose();
        } catch (error: any) {
            console.error('Failed to schedule story:', error);
            showToast(formData.calendarItemId ? 'Couldn\'t save your changes. Please try again.' : 'Couldn\'t schedule this story. Please try again.');
        } finally { setIsSubmitting(false); }
    };

    const executeSaveDraftAction = async (occurrenceOnly: boolean) => {
        try {
            setIsSubmitting(true);
            const selectedPlatforms = (Object.keys(formData.platforms) as Array<'instagram' | 'facebook'>).filter(k => formData.platforms[k]?.enabled);
            const selectedContent = getSelectedContent();
            const mediaType = selectedContent?.mediaType === 'video' || selectedContent?.type === 'video' ? 'video' : 'image';
            const isRecurring = !!formData.repeat.rruleText;
            const endDateStr = isRecurring && formData.repeat.endDate ? `${formData.repeat.endDate.getFullYear()}-${String(formData.repeat.endDate.getMonth() + 1).padStart(2, '0')}-${String(formData.repeat.endDate.getDate()).padStart(2, '0')}` : null;
            if (formData.calendarItemId) {
                const updates: Partial<any> = {};
                let dateOrTimeChanged = false;
                if (formData.date?.getTime() !== initialData?.date?.getTime()) { updates.date = formData.date; dateOrTimeChanged = true; }
                if (formData.time !== initialData?.time) { updates.time = formData.time; dateOrTimeChanged = true; }
                if (dateOrTimeChanged) {
                    updates.date = formData.date;
                    updates.time = formData.time;
                }
                const origPlatforms = (initialData as any)?.platforms || [];
                if (selectedPlatforms.length !== origPlatforms.length || !selectedPlatforms.every(p => origPlatforms.includes(p as any))) {
                    updates.platforms = selectedPlatforms;
                }
                if (mediaType !== (initialData as any)?.media) updates.media = mediaType;
                const newTitle = formData.title || formData.contentTitle || 'New Story';
                if (newTitle !== initialData?.title) updates.title = newTitle;
                const newRruleText = formData.repeat.rruleText || null;
                const origRruleText = initialData?.repeat?.rruleText || null;
                if (newRruleText !== origRruleText && !(newRruleText === null && origRruleText === 'POLICY')) {
                    updates.rruleText = newRruleText;
                }
                if (endDateStr) updates.endDate = endDateStr;
                await updateSchedule(formData.calendarItemId, updates, occurrenceOnly);
            } else {
                await createSchedule({ date: formData.date, time: formData.time, platforms: selectedPlatforms, media: mediaType, title: formData.title || formData.contentTitle || 'New Story', contentUuids: formData.contentId ? [formData.contentId] : undefined, type: 'Story', rruleText: formData.repeat.rruleText, endDate: formData.repeat.endDate || undefined, status: 'Draft' });
            }
            if (onSaveDraft) onSaveDraft(formData);
            onClose();
        } catch (error: any) {
            console.error('Failed to save story draft:', error);
            showToast('Couldn\'t save draft. Please try again.');
        } finally { setIsSubmitting(false); }
    };

    const handleSaveDraft = async () => {
        if (!formData.contentId && !isPartOfPolicy) {
            setValidationErrors({ content: 'Please add content to your story' });
            return;
        }
        setValidationErrors({});
        if (isPartOfPolicy) {
            setRecurringTrigger('draft');
            setRecurringDialogMode('edit');
            setShowRecurringDialog(true);
            return;
        }
        await executeSaveDraftAction(false);
    };

    const handleDelete = async () => {
        if (!formData.scheduleUuid && !formData.calendarItemId) return;
        if (isPartOfPolicy) {
            setRecurringTrigger('delete');
            setRecurringDialogMode('delete');
            setShowRecurringDialog(true);
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const handleRecurringConfirm = async (option: 'this' | 'following' | 'all') => {
        setShowRecurringDialog(false);
        const occurrenceOnly = option === 'this';
        if (recurringTrigger === 'delete') {
            await executeDelete(occurrenceOnly);
        } else if (recurringTrigger === 'draft') {
            await executeSaveDraftAction(occurrenceOnly);
        } else {
            await executeSchedule(occurrenceOnly);
        }
    };

    const confirmDelete = async () => { setShowDeleteConfirm(false); await executeDelete(); };

    const executeDelete = async (occurrenceOnly?: boolean) => {
        try {
            setIsSubmitting(true);
            const { hours, minutes } = parseTimeString(formData.time);
            const plannedDate = new Date(formData.date);
            plannedDate.setHours(hours, minutes, 0, 0);
            if (!occurrenceOnly) { setIsShattering(true); await new Promise(resolve => setTimeout(resolve, 600)); }
            await deleteSchedule(formData.calendarItemId || formData.scheduleUuid || '', plannedDate, occurrenceOnly, isPast);
            setIsShattering(false);
            onClose();
            if (onScheduleProp) onScheduleProp(formData);
        } catch (error: any) {
            console.error('Failed to delete schedule:', error);
            setIsShattering(false);
            showToast('Couldn\'t delete this story. Please try again.');
        } finally { setIsSubmitting(false); }
    };

    const handleOverlayClick = () => {
        if (isPicking) cancelPicking();
        else onClose();
    };

    const getPlatformIconPath = (platform: 'instagram' | 'facebook'): string => `/icons/social/${platform}.png`;

    const renderPlatformSection = (platform: 'instagram' | 'facebook') => {
        const account = platforms.find(p => p.platform === platform);
        const platformColor = getPlatformColor(platform);
        const isSelected = formData.platforms[platform]?.enabled || false;

        const platformSectionStyle: React.CSSProperties = { 
            borderRadius: '12px', 
            border: theme.mode === 'dark' ? '1.5px solid rgba(255,255,255,.1)' : '1.5px solid rgba(0,0,0,.06)', 
            borderLeftWidth: '3px', 
            borderLeftColor: isSelected ? platformColor : (theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'), 
            overflow: 'visible', 
            transition: 'all .25s cubic-bezier(.4,0,.2,1)', 
            marginBottom: '12px', 
            background: 'var(--color-surface)', 
            cursor: 'pointer' 
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
            ...(isSelected ? { background: `${platformColor}0D` } : {}) 
        };

        return (
            <div key={platform} style={platformSectionStyle} onClick={(e) => handlePlatformToggle(e, platform)}>
                <div style={platformHeaderStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: '1.5px solid', borderColor: isSelected ? platformColor : (theme.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'), background: isSelected ? platformColor : 'var(--color-surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .18s', flexShrink: 0, marginRight: '10px' }}>
                            {isSelected && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
                        </div>
                        <div style={{ position: 'relative', width: '34px', height: '34px' }}>
                            {account && account.profilePicture ? (
                                <img src={account.profilePicture} alt={account.username} style={{ width: '34px', height: '34px', borderRadius: '9px', objectFit: 'cover', border: `1.5px solid ${theme.mode === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.4)'}` }} />
                            ) : (
                                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontSize: '17px' }}>
                                    {platform.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '50%', background: theme.mode === 'dark' ? 'var(--color-surface)' : '#fff', border: `1.5px solid ${theme.mode === 'dark' ? 'var(--color-surface)' : '#fff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                <img src={getPlatformIconPath(platform)} alt="" style={{ width: '14px', height: '14px' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', gap: '1px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 600, color: isDarkMode ? '#ffffff' : '#111827' }}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                            {account && <span style={{ fontSize: '11px', fontWeight: 600, color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>{account.username.startsWith('@') ? account.username : `@${account.username}`}</span>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const handleContentSelect = (selectedContent: ContentItem) => {
        setFormData(prev => ({ ...prev, contentId: selectedContent.id, contentTitle: selectedContent.title || 'Untitled', contentThumbnail: selectedContent.thumbnail || '' }));
        if (validationErrors.content) setValidationErrors(prev => ({ ...prev, content: undefined }));
        if (onCancelPicking) onCancelPicking();
    };

    const handleRemoveContent = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData(prev => ({ ...prev, contentId: '', contentTitle: '', contentThumbnail: '' }));
        if (onCancelPicking) onCancelPicking();
    };

    const formatDateLabel = (date: Date): string => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
    };

    const getSelectedContent = () => {
        if (!formData.contentId) return null;
        const found = content.find(c => c.id === formData.contentId);
        if (found) return { ...found, type: (found as any).type || (found as any).mediaType || 'video' };
        return { id: formData.contentId, title: formData.contentTitle || '', thumbnail: formData.contentThumbnail || '', type: 'video' as const, mediaType: 'video' };
    };


    const draftBtnStyle: React.CSSProperties = { padding: '10px 22px', border: 'none', borderRadius: '10px', background: 'var(--color-surface)', fontSize: '14px', fontWeight: 600, color: 'var(--color-muted)', cursor: 'pointer', transition: 'all .18s', boxShadow: '0 1px 4px rgba(0, 0, 0, .08)' };
    const scheduleBtnStyle: React.CSSProperties = { padding: '10px 28px', border: 'none', borderRadius: '10px', background: theme.gradients.innovator, color: '#fff', fontSize: '14px', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all .2s', boxShadow: '0 3px 12px rgba(155, 93, 229, .25)', opacity: isSubmitting ? 0.7 : 1 };
    const titleInputStyle: React.CSSProperties = { width: 'calc(70% - 28px)', border: 'none', borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, .2)' : 'rgba(0, 0, 0, .1)'}`, outline: 'none', fontSize: '22px', fontWeight: 700, color: isDarkMode ? '#fff' : '#111827', padding: '16px 0 6px', marginLeft: '28px', background: 'transparent', fontFamily: 'inherit', transition: 'border-color .2s ease' };

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
                            className="nsm-title-input"
                            type="text"
                            style={{ ...titleInputStyle, ...(validationErrors.title ? { borderBottomColor: '#EF4444' } : {}) }}
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
                        {validationErrors.title && <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginLeft: 0, marginTop: '4px' }}>{validationErrors.title}</span>}
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
                                startPicking();
                                onOpenDrawer(true);
                            }}
                            onClickDetail={(item) => setSelectedDetailContent(item)}
                            onDrop={handleManualDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDragEnter={handleDragEnter}
                            placeholderText="Click to add content"
                        />
                        {validationErrors.content && <div style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, textAlign: 'center', marginTop: '8px' }}>{validationErrors.content}</div>}
                    </div>
                }
                footer={
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <button
                            className="nsm-draft-btn"
                            onClick={handleSaveDraft} 
                            disabled={!isDraftEnabled}
                            onMouseEnter={() => setIsDraftHovered(true)}
                            onMouseLeave={() => setIsDraftHovered(false)}
                            style={{ ...draftBtnStyle, opacity: !isDraftEnabled ? 0.5 : 1, cursor: !isDraftEnabled ? 'not-allowed' : 'pointer', ...(isDraftHovered && isDraftEnabled ? { background: 'rgba(155, 93, 229, 0.1)', color: '#9b5de5', boxShadow: '0 2px 8px rgba(155, 93, 229, 0.2)' } : {}) }}
                        >
                            Save as Draft
                        </button>
                        <button 
                            className="nsm-schedule-btn"
                            onClick={handleSchedule} 
                            disabled={isSubmitting || isReadOnly || !isFormValid}
                            style={{ ...scheduleBtnStyle, opacity: (isSubmitting || isReadOnly || !isFormValid) ? 0.7 : 1, cursor: (isSubmitting || isReadOnly || !isFormValid) ? 'not-allowed' : 'pointer' }}
                        >
                            {isSubmitting ? 'Processing...' : (isReadOnly ? 'View Only' : (formData.calendarItemId ? 'Update' : 'Schedule'))}
                        </button>
                        </div>
                    </div>
                }
            >
                <SectionContainer icon="🕐" className="nsm-date-section">
                    <div className="chip-row-container" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <ChipButton className="chip-button" minWidth="148px" onClick={() => { if (showDatePicker) { closeAllPickers(); } else { closeAllPickers(); setShowDatePicker(true); } }}>
                                <span>{formatDateLabel(formData.date)}</span><ChipArrow />
                            </ChipButton>
                            <DatePicker selectedDate={formData.date} onChange={handleDateChange} minDate={new Date()} show={showDatePicker} onClose={() => setShowDatePicker(false)} />
                        </div>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <ChipButton className="chip-button" minWidth="88px" onClick={() => { if (showTimePicker) { closeAllPickers(); } else { closeAllPickers(); setShowTimePicker(true); } }}>
                                <span>{formData.time}</span><ChipArrow />
                            </ChipButton>
                            <TimePicker selectedTime={formData.time} onChange={handleTimeChange} show={showTimePicker} onClose={() => setShowTimePicker(false)} />
                        </div>
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <ChipButton className="chip-button" minWidth="120px" onClick={() => { if (showTimezoneSelector) { closeAllPickers(); } else { closeAllPickers(); setShowTimezoneSelector(true); } }}>
                                <span style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px' }}>Timezone</span><ChipArrow />
                            </ChipButton>
                            <TimezoneSelector selectedTimezone={formData.timezone || 'America/New_York'} onChange={(tz) => { setFormData(prev => ({ ...prev, timezone: tz })); setShowTimezoneSelector(false); }} show={showTimezoneSelector} onClose={() => setShowTimezoneSelector(false)} />
                        </div>
                        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                            <ChipButton className="chip-button" minWidth="100%" style={{ width: '100%', boxSizing: 'border-box' }} onClick={() => { if (showRepeatSelector) { closeAllPickers(); } else { closeAllPickers(); setShowRepeatSelector(true); } }}>
                                <span>{formData.repeat.label}</span><ChipArrow />
                            </ChipButton>
                            <RepeatSelector selectedRepeat={formData.repeat} onChange={(repeat) => { setFormData({ ...formData, repeat }); setShowRepeatSelector(false); }} baseDate={formData.date} show={showRepeatSelector} onClose={() => setShowRepeatSelector(false)} />
                        </div>
                    </div>
                </SectionContainer>

                <SectionContainer icon="📲" className="nsm-platform-section">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {platforms.filter(p => (p.platform === 'instagram' || p.platform === 'facebook') && p.isConnected).length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.muted, fontSize: '13px' }}>No connected platforms. Please connect Instagram or Facebook to create stories.</div>
                        )}
                        {platforms.some(p => p.platform === 'instagram' && p.isConnected) && renderPlatformSection('instagram')}
                        {platforms.some(p => p.platform === 'facebook' && p.isConnected) && renderPlatformSection('facebook')}
                        {validationErrors.platform && <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginTop: '-4px' }}>{validationErrors.platform}</span>}
                    </div>
                </SectionContainer>
                {validationErrors.date && <div style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginLeft: '42px', marginTop: '-16px' }}>{validationErrors.date}</div>}
            </ScheduleModalLayout>

            <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Story" message="Are you sure you want to delete this story? This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />
            <RecurringActionDialog isOpen={showRecurringDialog} mode={recurringDialogMode} onConfirm={handleRecurringConfirm} onCancel={() => setShowRecurringDialog(false)} />
            <ContentDetailModal 
                isOpen={!!selectedDetailContent} 
                item={selectedDetailContent} 
                onClose={() => setSelectedDetailContent(null)} 
                onRename={() => {}} 
                onDelete={() => {}} 
                onToggleFavorite={() => {}} 
            />
        </div>
    );
};

export default NewStoryModal;