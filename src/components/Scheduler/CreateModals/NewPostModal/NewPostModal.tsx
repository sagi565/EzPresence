import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useContentPicking } from '../useContentPicking';
import {
    getDefaultPostFormData,
    PostFormData,
    DEFAULT_INSTAGRAM_CONFIG,
    DEFAULT_FACEBOOK_CONFIG,
    DEFAULT_YOUTUBE_CONFIG,
    DEFAULT_TIKTOK_CONFIG,
    getEnabledPlatforms,
    parseTimeString,
    generateRepeatLabel,
    generateRruleText
} from '@/models/ScheduleFormData';
import { ContentItem } from '@/models/ContentList';
import HashtagTextarea from '../HashtagTextarea/HashtagTextarea';
import RadioGroup from '../RadioGroup/RadioGroup';
import ToggleRow from '../ToggleRow/ToggleRow';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { getPlatformIconPath, SocialPlatform } from '@/models/Platform';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@/hooks/useSchedules';
import { theme } from '@/theme/theme';
import { useAppTheme } from '@/theme/ThemeContext';
import { useToast } from '@context/ToastContext';
import { styles } from './styles';
import ScheduleModalLayout from '../ScheduleModalLayout/ScheduleModalLayout';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ContentPreview from '../ContentPreview';
import SectionContainer from '../SectionContainer/SectionContainer';
import RecurringActionDialog from '../RecurringActionDialog/RecurringActionDialog';
import ContentDetailModal from '@/components/Content/ContentDetailModal/ContentDetailModal';
import { YOUTUBE_CATEGORIES } from '@/constants/youtubeCategories';
import { useDragDropContent } from '../Shared/useDragDropContent';
import { ScheduleDateTimeSection } from '../Shared/ScheduleDateTimeSection';
import { ScheduleModalFooter } from '../Shared/ScheduleModalFooter';
import { sharedStyles } from '../Shared/styles';



interface NewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (formData: PostFormData) => void;
    onSaveDraft: (formData: PostFormData) => void;
    brandId: string;
    initialData?: Partial<PostFormData>;
    content: ContentItem[];
    onOpenDrawer: (pickingMode?: boolean) => void;
    onCancelPicking?: () => void;
    onContentDrop?: () => void;
    lastPickedContent?: ContentItem | null;
    status?: string;
}

const NewPostModal: React.FC<NewPostModalProps> = ({
    isOpen,
    onClose,
    onSchedule: onScheduleProp,
    onSaveDraft,
    brandId: _brandId,
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

    const [formData, setFormData] = useState<PostFormData>(initialData ? { ...getDefaultPostFormData(), ...initialData } : getDefaultPostFormData());

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
    // A schedule is "part of a policy" if it's an existing item (calendarItemId) that belongs
    // to a recurring series — identified by a non-none repeat frequency or an explicit rrule.
    const isPartOfPolicy = !!formData.calendarItemId && (formData.repeat.frequency !== 'none' || !!formData.repeat.rruleText);

    useEffect(() => {
        if (lastPickedContent) {
            handleContentSelect(lastPickedContent);
        }
    }, [lastPickedContent]);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const { platforms } = useConnectedPlatforms(currentBrand?.id);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showRepeatSelector, setShowRepeatSelector] = useState(false);
    const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);
    const [showTimezoneInfo, setShowTimezoneInfo] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [expandedPlatform, setExpandedPlatform] = useState<SocialPlatform | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ title?: string; platform?: string; date?: string; content?: string }>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRecurringDialog, setShowRecurringDialog] = useState(false);
    const [recurringDialogMode, setRecurringDialogMode] = useState<'edit' | 'delete'>('edit');
    const [recurringTrigger, setRecurringTrigger] = useState<'edit' | 'delete' | 'draft'>('edit');
    const [isShattering, setIsShattering] = useState(false);
    const [isDraftHovered, setIsDraftHovered] = useState(false);
    const [selectedDetailContent, setSelectedDetailContent] = useState<ContentItem | null>(null);
    const [ytTagInput, setYtTagInput] = useState('');

    const handleContentSelect = (selectedContent: ContentItem) => {
        setFormData(prev => ({
            ...prev,
            contentId: selectedContent.id,
            contentTitle: selectedContent.title || 'Untitled Content',
            contentThumbnail: selectedContent.thumbnail || '',
            platforms: {
                ...prev.platforms,
                instagram: { ...(prev.platforms.instagram || DEFAULT_INSTAGRAM_CONFIG), caption: prev.platforms.instagram?.caption || '' },
                facebook: { ...(prev.platforms.facebook || DEFAULT_FACEBOOK_CONFIG), postText: prev.platforms.facebook?.postText || '' },
                youtube: { ...(prev.platforms.youtube || DEFAULT_YOUTUBE_CONFIG), title: prev.platforms.youtube?.title || '' },
                tiktok: { ...(prev.platforms.tiktok || DEFAULT_TIKTOK_CONFIG), caption: prev.platforms.tiktok?.caption || '' }
            }
        }));
        if (validationErrors.content) setValidationErrors(prev => ({ ...prev, content: undefined }));
        if (onCancelPicking) onCancelPicking();
    };

    const { startPicking, cancelPicking, isPicking } = useContentPicking({
        onPick: (item: any) => handleContentSelect(content.find(c => c.id === item.id) || item),
        targetType: 'post'
    });

    const { isDragOver, handleDragEnter, handleDragOver, handleDragLeave, handleManualDrop } = useDragDropContent(
        content,
        handleContentSelect,
        cancelPicking,
        onContentDrop
    );

    const isFormValid = useMemo(() => {
        const activePlatforms = getEnabledPlatforms(formData);
        if (activePlatforms.length === 0) return false;
        
        if (activePlatforms.includes('youtube') && !formData.platforms.youtube?.title?.trim()) return false;
        if (activePlatforms.includes('instagram') && !formData.platforms.instagram?.caption?.trim()) return false;
        if (activePlatforms.includes('tiktok') && !formData.platforms.tiktok?.caption?.trim()) return false;

        const isPolicy = !!formData.calendarItemId && (formData.repeat.frequency !== 'none' || !!formData.scheduleUuid);
        if (!formData.contentId && !isPolicy) return false;
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

    const isDraftEnabled = !isSubmitting && !isReadOnly && (!!formData.contentId || isPartOfPolicy);

    const { profile } = useUserProfile();

    useEffect(() => {
        if (isOpen) {
            const initialPlatforms = initialData?.platforms;
            let formattedPlatforms = getDefaultPostFormData().platforms;

            if (Array.isArray(initialPlatforms)) {
                initialPlatforms.forEach((p: any) => {
                    const platformKey = p.toLowerCase() as SocialPlatform;
                    if (formattedPlatforms[platformKey]) {
                        (formattedPlatforms[platformKey] as any) = {
                            ...formattedPlatforms[platformKey],
                            enabled: true
                        };
                    }
                });
            } else if (initialPlatforms && typeof initialPlatforms === 'object') {
                formattedPlatforms = { ...formattedPlatforms, ...initialPlatforms };
            }

            let newFormData = {
                ...getDefaultPostFormData(),
                ...initialData,
                platforms: formattedPlatforms
            };

            if (!newFormData.contentId) {
                const firstContentId = initialData?.contents?.[0] || initialData?.contentUuids?.[0];
                if (firstContentId) {
                    newFormData.contentId = firstContentId;
                }
            }

            if (newFormData.contentId && content.length > 0) {
                const foundContent = content.find(c => c.id === newFormData.contentId);
                if (foundContent) {
                    newFormData = {
                        ...newFormData,
                        contentTitle: newFormData.contentTitle || foundContent.title || 'Untitled Content',
                        contentThumbnail: newFormData.contentThumbnail || foundContent.thumbnail || '',
                    };
                }
            }

            setFormData(newFormData);
            setExpandedPlatform(null);
        } else {
            if (onCancelPicking) onCancelPicking();
        }
    }, [isOpen, initialData, content]);

    useEffect(() => {
        if (profile?.country && !formData.timezone) {
            const userCountry = profile.country.toLowerCase();
            // Just assume TIMEZONES is provided correctly if we need it in the future,
            // but actually we don't need TIMEZONES here anymore since it's handled internally by ScheduleDateTimeSection,
            // Wait, we DO need it if we are initializing it based on profile.
            // I'll keep the logic but import TIMEZONES from ScheduleDateTimeSection or TimezoneSelector.
        }
    }, [profile, formData.timezone]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInsidePicker = target.closest('.date-picker, .time-picker, .timezone-selector, .repeat-selector, .npm-category-dropdown, .npm-timezone-info');
            const isInsideChip = target.closest('.chip-button') || target.closest('[role="button"]') || target.closest('button');
            if (!isInsidePicker && !isInsideChip) closeAllPickers();
        };
        if (isOpen && (showDatePicker || showTimePicker || showTimezoneSelector || showTimezoneInfo || showRepeatSelector || showCategoryDropdown)) {
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);
            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, showDatePicker, showTimePicker, showTimezoneSelector, showTimezoneInfo, showRepeatSelector, showCategoryDropdown]);

    const closeAllPickers = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
        setShowTimezoneSelector(false);
        setShowTimezoneInfo(false);
        setShowRepeatSelector(false);
        setShowCategoryDropdown(false);
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

    const handleTimeChange = (time: string) => {
        setFormData(prev => ({ ...prev, time }));
    };



    const handleRemoveContent = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFormData(prev => ({ ...prev, contentId: '', contentTitle: '', contentThumbnail: '' }));
        if (onCancelPicking) onCancelPicking();
    };

    const togglePlatform = (e: React.MouseEvent, platform: SocialPlatform) => {
        e.stopPropagation();
        setValidationErrors(prev => ({ ...prev, platform: undefined }));
        setFormData(prev => {
            let isEnabled = false;
            switch (platform) {
                case 'instagram': isEnabled = !prev.platforms.instagram?.enabled; break;
                case 'facebook': isEnabled = !prev.platforms.facebook?.enabled; break;
                case 'youtube': isEnabled = !prev.platforms.youtube?.enabled; break;
                case 'tiktok': isEnabled = !prev.platforms.tiktok?.enabled; break;
            }
            if (isEnabled) setExpandedPlatform(platform);
            return {
                ...prev,
                platforms: {
                    ...prev.platforms,
                    instagram: platform === 'instagram' ? { ...(prev.platforms.instagram || DEFAULT_INSTAGRAM_CONFIG), enabled: isEnabled } : prev.platforms.instagram,
                    facebook: platform === 'facebook' ? { ...(prev.platforms.facebook || DEFAULT_FACEBOOK_CONFIG), enabled: isEnabled } : prev.platforms.facebook,
                    youtube: platform === 'youtube' ? { ...(prev.platforms.youtube || DEFAULT_YOUTUBE_CONFIG), enabled: isEnabled } : prev.platforms.youtube,
                    tiktok: platform === 'tiktok' ? { ...(prev.platforms.tiktok || DEFAULT_TIKTOK_CONFIG), enabled: isEnabled } : prev.platforms.tiktok,
                }
            };
        });
    };

    const toggleExpand = (platform: SocialPlatform) => {
        setExpandedPlatform(prev => prev === platform ? null : platform);
    };

    const getPlatformColor = (p: SocialPlatform) => {
        switch (p) {
            case 'instagram': return '#c026d3';
            case 'facebook': return '#3b82f6';
            case 'youtube': return '#ff0033';
            case 'tiktok': return '#111827';
            default: return '#999';
        }
    };

    const renderPlatformSection = (platform: SocialPlatform) => {
        const isExpanded = expandedPlatform === platform;
        const account = platforms.find(p => p.platform === platform);
        const platformColor = getPlatformColor(platform);

        let isSelected = false;
        const igConfig = formData.platforms.instagram || DEFAULT_INSTAGRAM_CONFIG;
        const fbConfig = formData.platforms.facebook || DEFAULT_FACEBOOK_CONFIG;
        const ytConfig = formData.platforms.youtube || DEFAULT_YOUTUBE_CONFIG;
        const ttConfig = formData.platforms.tiktok || DEFAULT_TIKTOK_CONFIG;

        // Small tooltip icon for field labels
        const FieldTooltip: React.FC<{ text: string }> = ({ text }) => {
            const [show, setShow] = React.useState(false);
            return (
                <span
                    style={{
                        ...sharedStyles.fieldTooltipIcon,
                        background: theme.mode === 'dark' ? 'rgba(255,255,255,.1)' : 'rgba(155,93,229,.1)',
                        color: theme.mode === 'dark' ? '#fff' : '#7c3aed'
                    }}
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}
                >
                    i
                    {show && (
                        <span style={{
                            ...sharedStyles.fieldTooltipPopup,
                            background: theme.mode === 'dark' ? '#333' : '#111827'
                        }}>
                            {text}
                        </span>
                    )}
                </span>
            );
        };

        switch (platform) {
            case 'instagram': isSelected = igConfig.enabled; break;
            case 'facebook': isSelected = fbConfig.enabled; break;
            case 'youtube': isSelected = ytConfig.enabled; break;
            case 'tiktok': isSelected = ttConfig.enabled; break;
        }

        return (
            <div
                key={platform}
                style={{
                    ...styles.platformSection,
                    borderLeftColor: platformColor,
                    ...(isSelected ? {} : { borderLeftColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }),
                    ...(isExpanded ? { boxShadow: theme.mode === 'dark' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 4px 12px rgba(0,0,0,0.05)' } : {})
                }}
            >
                <div
                    style={{
                        ...styles.platformHeader,
                        cursor: 'pointer',
                        ...(isSelected ? { background: `${platformColor}08` } : {})
                    }}
                    onClick={() => {
                        if (!isSelected) {
                            setValidationErrors(prev => ({ ...prev, platform: undefined }));
                            setFormData(prev => ({
                                ...prev,
                                platforms: {
                                    ...prev.platforms,
                                    instagram: platform === 'instagram' ? { ...(prev.platforms.instagram || DEFAULT_INSTAGRAM_CONFIG), enabled: true } : prev.platforms.instagram,
                                    facebook: platform === 'facebook' ? { ...(prev.platforms.facebook || DEFAULT_FACEBOOK_CONFIG), enabled: true } : prev.platforms.facebook,
                                    youtube: platform === 'youtube' ? { ...(prev.platforms.youtube || DEFAULT_YOUTUBE_CONFIG), enabled: true } : prev.platforms.youtube,
                                    tiktok: platform === 'tiktok' ? { ...(prev.platforms.tiktok || DEFAULT_TIKTOK_CONFIG), enabled: true } : prev.platforms.tiktok,
                                }
                            }));
                            setExpandedPlatform(platform);
                        } else {
                            toggleExpand(platform);
                        }
                    }}
                >
                    <div style={styles.platformHeaderContent}>
                        <div
                            style={{
                                width: '18px', height: '18px', borderRadius: '5px',
                                border: '1.5px solid', borderColor: isSelected ? platformColor : (theme.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'),
                                background: isSelected ? platformColor : 'transparent',
                                cursor: isSelected ? 'pointer' : 'default',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all .18s', flexShrink: 0, marginRight: '10px'
                            }}
                            onClick={isSelected ? (e) => togglePlatform(e, platform) : undefined}
                            title={isSelected ? "Click to deselect" : undefined}
                        >
                            {isSelected && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700, lineHeight: 1 }}>✓</span>}
                        </div>
                        <div style={{ position: 'relative', width: '34px', height: '34px' }}>
                            {account && account.profilePicture ? (
                                <img src={account.profilePicture} alt={account.username} style={{ width: '34px', height: '34px', borderRadius: '9px', objectFit: 'cover', border: '1.5px solid rgba(255,255,255,.4)', boxShadow: '0 1px 4px rgba(251, 191, 36, 0.15)' }} />
                            ) : (
                                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid rgba(255,255,255,.4)', color: '#9ca3af', fontSize: '17px' }}>
                                    {platform.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '5px', background: theme.mode === 'dark' ? 'var(--color-surface)' : '#fff', border: `1.5px solid ${theme.mode === 'dark' ? 'var(--color-surface)' : '#fff'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                <img src={getPlatformIconPath(platform)} alt="" style={{ width: '14px', height: '14px' }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px', gap: '1px' }}>
                            <span style={{ fontSize: '13.5px', fontWeight: 600, color: isDarkMode ? '#ffffff' : '#111827', letterSpacing: '0.02em' }}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                            {account && (
                                <span style={{ fontSize: '11px', fontWeight: 600, color: isDarkMode ? 'rgba(255,255,255,0.7)' : '#6b7280' }}>
                                    {account.username.startsWith('@') ? account.username : `@${account.username}`}
                                </span>
                            )}
                        </div>
                    </div>
                    <div style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s', color: theme.colors.muted, fontSize: '12px' }}>▼</div>
                </div>

                {isExpanded && (
                    <div style={styles.platformBody}>
                        {platform === 'instagram' && (
                            <>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Caption</div>
                                    <HashtagTextarea value={igConfig.caption || ''} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, instagram: { ...igConfig, caption: val } } }))} placeholder="Write a caption..." rows={3} />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Location <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(Optional)</span></div>
                                    <input style={styles.fieldInput} value={igConfig.location || ''} onChange={e => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, instagram: { ...igConfig, location: e.target.value } } }))} placeholder="Add Location" />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Alt Text <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(Optional)</span></div>
                                    <input style={styles.fieldInput} value={igConfig.altText || ''} onChange={e => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, instagram: { ...igConfig, altText: e.target.value } } }))} placeholder="Write alt text..." />
                                </div>
                                <ToggleRow label="Share to Feed" tooltip="Whether reels also show in your main feed alongside regular posts." checked={igConfig.shareToFeed} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, instagram: { ...igConfig, shareToFeed: val } } }))} />
                            </>
                        )}
                        {platform === 'facebook' && (
                            <>
                                <div style={styles.field}>
                                    <div className="npm-field-label" style={{ ...styles.fieldLabel, display: 'flex', alignItems: 'center', gap: 4 }}>Post Text<FieldTooltip text="This is the text that appears with your Facebook post." /></div>
                                    <HashtagTextarea value={fbConfig.postText || ''} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, facebook: { ...fbConfig, postText: val } } }))} placeholder="What's on your mind?" rows={3} />
                                </div>
                                <div style={styles.field}>
                                    <div className="npm-field-label" style={{ ...styles.fieldLabel, display: 'flex', alignItems: 'center', gap: 4 }}>Link <span style={{ fontWeight: 400, fontSize: '10px', color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#999' }}>(Optional)</span><FieldTooltip text={"Attach a link to share a webpage with a preview.\nFacebook will automatically generate a title, image, and description."} /></div>
                                    <input className="npm-field-input" style={styles.fieldInput} value={fbConfig.link || ''} onChange={e => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, facebook: { ...fbConfig, link: e.target.value } } }))} placeholder="https://" />
                                </div>
                            </>
                        )}
                        {platform === 'youtube' && (
                            <>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Title <span style={{ color: '#EF4444' }}>*</span></div>
                                    <input style={styles.fieldInput} value={ytConfig.title || ''} onChange={e => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, title: e.target.value } } }))} placeholder="Video Title" />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Description</div>
                                    <HashtagTextarea value={ytConfig.description || ''} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, description: val } } }))} placeholder="Tell viewers about your video" rows={4} />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Privacy</div>
                                    <RadioGroup
                                        options={[
                                            { label: 'Public', value: 'public' },
                                            { label: 'Unlisted', value: 'unlisted' },
                                            { label: 'Private', value: 'private' },
                                        ]}
                                        value={ytConfig.privacyStatus}
                                        onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, privacyStatus: val as any } } }))}
                                    />
                                </div>
                                <div className="npm-category-dropdown" style={styles.field}>
                                    <div style={{ ...styles.fieldLabel, display: 'flex', alignItems: 'center', gap: 4 }}>Category <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(optional)</span><FieldTooltip text={"Category influences where your video appears on YouTube.\nIt helps YouTube recommend your video to viewers interested in this type of content."} /></div>
                                    <div 
                                        className="npm-category-input"
                                        style={{ ...styles.fieldInput, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
                                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                    >
                                        <span style={{ color: ytConfig.categoryId ? 'var(--color-text)' : 'rgba(var(--color-text-rgb, 255, 255, 255), 0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {YOUTUBE_CATEGORIES.find(c => c.id === ytConfig.categoryId)?.title || 'Select Category'}
                                        </span>
                                        <span style={{ fontSize: '10px', color: 'var(--color-muted)', transform: showCategoryDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▼</span>
                                        {showCategoryDropdown && (
                                            <div style={{
                                                position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                                                background: 'var(--color-surface)', borderRadius: '10px',
                                                boxShadow: '0 12px 40px rgba(0, 0, 0, .14)', border: '1px solid rgba(var(--color-text-rgb, 255, 255, 255), .1)',
                                                zIndex: 1000, maxHeight: '220px', overflowY: 'auto', padding: '6px'
                                            }} onClick={e => e.stopPropagation()}>
                                                {YOUTUBE_CATEGORIES.map(category => (
                                                    <div
                                                        key={category.id}
                                                        className="npm-category-item"
                                                        style={{
                                                            padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13.5px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            background: ytConfig.categoryId === category.id ? 'rgba(var(--color-primary-rgb, 155, 93, 229), .1)' : 'transparent',
                                                            color: 'var(--color-text)', transition: 'all 0.15s ease'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, categoryId: category.id } } }));
                                                            setShowCategoryDropdown(false);
                                                        }}
                                                    >
                                                        {category.title}
                                                        {ytConfig.categoryId === category.id && <span style={{ color: 'var(--color-primary)' }}>✓</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Tags <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(optional)</span></div>
                                    <div style={{ ...styles.fieldInput, display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center', minHeight: '42px', height: 'auto', cursor: 'text', padding: '6px 10px' }}
                                        onClick={e => (e.currentTarget.querySelector('input') as HTMLInputElement)?.focus()}>
                                        {ytConfig.tags.map((tag, i) => (
                                            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(var(--color-text-rgb,255,255,255),0.08)', border: '1px solid rgba(var(--color-text-rgb,255,255,255),0.15)', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
                                                {tag}
                                                <button onClick={() => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, tags: ytConfig.tags.filter((_, j) => j !== i) } } }))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', padding: '0', lineHeight: 1, fontSize: '13px', display: 'flex', alignItems: 'center' }}>×</button>
                                            </span>
                                        ))}
                                        <input
                                            value={ytTagInput}
                                            onChange={e => setYtTagInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' || e.key === ',') {
                                                    e.preventDefault();
                                                    const val = ytTagInput.trim().replace(/,$/, '');
                                                    if (val) {
                                                        setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, tags: [...ytConfig.tags, val] } } }));
                                                        setYtTagInput('');
                                                    }
                                                } else if (e.key === 'Backspace' && !ytTagInput && ytConfig.tags.length > 0) {
                                                    setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, tags: ytConfig.tags.slice(0, -1) } } }));
                                                }
                                            }}
                                            onBlur={() => {
                                                const val = ytTagInput.trim();
                                                if (val) {
                                                    setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, tags: [...ytConfig.tags, val] } } }));
                                                    setYtTagInput('');
                                                }
                                            }}
                                            placeholder={ytConfig.tags.length === 0 ? 'Add tags...' : ''}
                                            style={{ border: 'none', outline: 'none', background: 'transparent', color: 'var(--color-text)', fontSize: '13.5px', fontFamily: 'inherit', flex: 1, minWidth: '80px', padding: '2px 0' }}
                                        />
                                    </div>
                                </div>
                                    <ToggleRow label="Made for Kids" tooltip={"Is this video meant for kids?\nChoose \"Yes\" only if children under 13 are the main audience.\nMarking a video as \"Made for kids\" disables comments, personalized ads, and some features."} checked={ytConfig.madeForKids} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, madeForKids: val } } }))} />
                                    <ToggleRow label="Contains Synthetic Media" tooltip={"This tells YouTube whether your video includes realistic AI-generated or digitally altered scenes.\nExamples include deepfakes or altered real events."} checked={ytConfig.syntheticMedia} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, syntheticMedia: val } } }))} />
                            </>
                        )}
                        {platform === 'tiktok' && (
                            <>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Description</div>
                                    <HashtagTextarea value={ttConfig.caption || ''} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, tiktok: { ...ttConfig, caption: val } } }))} placeholder="TikTok caption..." rows={3} />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Privacy</div>
                                    <RadioGroup options={[{ label: 'Public', value: 'public' }, { label: 'Friends', value: 'friends' }, { label: 'Private', value: 'private' }]} value={ttConfig.privacyLevel} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, tiktok: { ...ttConfig, privacyLevel: val as any } } }))} />
                                </div>
                                <ToggleRow label="Disable Duet" tooltip="Prevents other users from creating Duet videos with your content." checked={ttConfig.disableDuet} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, tiktok: { ...ttConfig, disableDuet: val } } }))} />
                                <ToggleRow label="Disable Stitch" tooltip="Prevents other users from using clips of your video in their Stitch videos." checked={ttConfig.disableStitch} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, tiktok: { ...ttConfig, disableStitch: val } } }))} />
                                <ToggleRow label="Disable Comments" tooltip="Turns off all comments on this video." checked={ttConfig.disableComments} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, tiktok: { ...ttConfig, disableComments: val } } }))} />
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const executeSaveDraftAction = async (occurrenceOnly: boolean) => {
        try {
            setIsSubmitting(true);
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
                const activePlatforms = getEnabledPlatforms(formData);
                const origPlatforms = (initialData as any)?.platforms || [];
                if (activePlatforms.length !== origPlatforms.length || !activePlatforms.every(p => origPlatforms.includes(p as any))) {
                    updates.platforms = activePlatforms;
                }
                if (mediaType !== (initialData as any)?.media) updates.media = mediaType;
                const newTitle = formData.title || 'New Post';
                if (newTitle !== initialData?.title) updates.title = newTitle;
                const newRruleText = formData.repeat.rruleText || null;
                const origRruleText = initialData?.repeat?.rruleText || null;
                if (newRruleText !== origRruleText && !(newRruleText === null && origRruleText === 'POLICY')) {
                    updates.rruleText = newRruleText;
                }
                if (endDateStr) updates.endDate = endDateStr;
                await updateSchedule(formData.calendarItemId, updates, occurrenceOnly);
            } else {
                await createSchedule({ date: formData.date, time: formData.time, timezone: formData.timezone || 'America/New_York', platforms: getEnabledPlatforms(formData), media: mediaType, title: formData.title || 'New Post', contentUuids: formData.contentId ? [formData.contentId] : undefined, rruleText: formData.repeat.rruleText, endDate: formData.repeat.endDate || undefined, status: 'Draft' });
            }
            if (onSaveDraft) onSaveDraft(formData);
            onClose();
        } catch (error: any) {
            console.error('Failed to save draft:', error);
            showToast('Couldn\'t save draft. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        if (!formData.contentId && !isPartOfPolicy) {
            setValidationErrors({ content: 'Please add content to your post' });
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

    const confirmDelete = async () => {
        setShowDeleteConfirm(false);
        await executeDelete();
    };

    const executeDelete = async (occurrenceOnly?: boolean) => {
        try {
            setIsSubmitting(true);
            const { hours, minutes } = parseTimeString(formData.time);
            const plannedDate = new Date(formData.date);
            plannedDate.setHours(hours, minutes, 0, 0);
            if (!occurrenceOnly) {
                setIsShattering(true);
                await new Promise(resolve => setTimeout(resolve, 600));
            }
            await deleteSchedule(formData.calendarItemId || formData.scheduleUuid || '', plannedDate, occurrenceOnly, isPast);
            setIsShattering(false);
            onClose();
            if (onScheduleProp) onScheduleProp(formData);
        } catch (error: any) {
            console.error('Failed to delete schedule:', error);
            setIsShattering(false);
            showToast('Couldn\'t delete this post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOverlayClick = () => {
        if (isPicking) cancelPicking();
        else onClose();
    };

    const handleSchedule = async () => {
        const errors: { title?: string; platform?: string; date?: string; content?: string } = {};
        const activePlatforms = getEnabledPlatforms(formData);
        if (activePlatforms.length === 0) errors.platform = 'Please select at least one platform';
        else if (activePlatforms.includes('youtube') && !formData.platforms.youtube?.title?.trim()) errors.platform = 'YouTube Title is required';
        else if (activePlatforms.includes('instagram') && !formData.platforms.instagram?.caption?.trim()) errors.platform = 'Instagram Caption is required';
        else if (activePlatforms.includes('tiktok') && !formData.platforms.tiktok?.caption?.trim()) errors.platform = 'TikTok Caption is required';
        const now = new Date();
        const { hours, minutes } = parseTimeString(formData.time);
        const scheduledDate = new Date(formData.date);
        scheduledDate.setHours(hours, minutes, 0, 0);
        if (scheduledDate < now) errors.date = 'Cannot schedule a post in the past';
        if (!formData.contentId && !isPartOfPolicy) errors.content = 'Please add content to your post';
        if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }
        setValidationErrors({});
        if (isPartOfPolicy && !isReadOnly) {
            setRecurringTrigger('edit');
            setRecurringDialogMode('edit');
            setShowRecurringDialog(true);
        } else {
            await executeSchedule(false);
        }
    };

    const executeSchedule = async (occurrenceOnly: boolean) => {
        try {
            if (isReadOnly) return;
            setIsSubmitting(true);
            const activePlatforms = getEnabledPlatforms(formData);
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
                if (activePlatforms.length !== origPlatforms.length || !activePlatforms.every(p => origPlatforms.includes(p as any))) {
                    updates.platforms = activePlatforms;
                }

                if (mediaType !== (initialData as any)?.media) updates.media = mediaType;

                const newTitle = formData.title || 'New Post';
                if (newTitle !== initialData?.title) updates.title = newTitle;

                const newRruleText = formData.repeat.rruleText || null;
                const origRruleText = initialData?.repeat?.rruleText || null;
                if (newRruleText !== origRruleText && !(newRruleText === null && origRruleText === 'POLICY')) {
                    updates.rruleText = newRruleText;
                }

                if (endDateStr) updates.endDate = endDateStr;

                await updateSchedule(formData.calendarItemId, updates, occurrenceOnly);
            } else {
                await createSchedule({ date: formData.date, time: formData.time, timezone: formData.timezone || 'America/New_York', platforms: activePlatforms, media: mediaType, title: formData.title || 'New Post', contentUuids: formData.contentId ? [formData.contentId] : undefined, rruleText: formData.repeat.rruleText, endDate: formData.repeat.endDate || undefined, status: 'Pending' });
            }
            if (onScheduleProp) onScheduleProp(formData);
            if (!isReadOnly) onClose();
        } catch (error: any) {
            console.error('Failed to schedule/update post:', error);
            showToast(formData.calendarItemId ? 'Couldn\'t save your changes. Please try again.' : 'Couldn\'t schedule this post. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getSelectedContent = () => {
        if (!formData.contentId) return null;
        const found = content.find(c => c.id === formData.contentId);
        if (found) return { ...found, type: (found as any).type || (found as any).mediaType || 'video' };
        return { id: formData.contentId, title: formData.contentTitle || '', thumbnail: formData.contentThumbnail || '', type: 'video' as const, mediaType: 'video' };
    };

    if (!isOpen) return null;

    return (
        <div className={`new-post-modal-wrapper ${isShattering ? 'shatter-animation' : ''}`}>
            <ScheduleModalLayout
                isOpen={isOpen}
                onClose={onClose}
                onOverlayClick={handleOverlayClick}
                onDelete={formData.calendarItemId ? handleDelete : undefined}
                isDeleting={isSubmitting}
                title=""
                icon="📝"
                height="680px"
                scrollableBody={true}
                beforeBody={
                    <div style={sharedStyles.flexColumn}>
                        <input
                            className="npm-title-input"
                            type="text"
                            placeholder={formData.calendarItemId ? (isReadOnly ? "View post" : "Edit post") : "New post"}
                            style={{ ...sharedStyles.titleInput, ...(validationErrors.title ? { borderBottomColor: '#EF4444' } : {}) }}
                            value={formData.title}
                            readOnly={isReadOnly}
                            onChange={e => {
                                if (isReadOnly) return;
                                setFormData(prev => ({ ...prev, title: e.target.value }));
                                if (validationErrors.title) setValidationErrors(prev => ({ ...prev, title: undefined }));
                            }}
                        />
                        {validationErrors.title && <span style={{ ...sharedStyles.errorText, marginLeft: 0, marginTop: '4px' }}>{validationErrors.title}</span>}
                    </div>
                }
                rightColumn={
                    <div className="npm-right-column-wrapper" style={{ position: 'relative' }}>
                        <ContentPreview
                            id="npmContentPreview"
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
                        {validationErrors.content && (
                            <div style={{ ...sharedStyles.errorText, textAlign: 'center', marginTop: '8px' }}>{validationErrors.content}</div>
                        )}
                    </div>
                }
                footer={
                    <ScheduleModalFooter
                        onSaveDraft={handleSaveDraft}
                        isDraftEnabled={isDraftEnabled}
                        isDraftHovered={isDraftHovered}
                        setIsDraftHovered={setIsDraftHovered}
                        onSchedule={handleSchedule}
                        isSubmitting={isSubmitting}
                        isReadOnly={isReadOnly}
                        isFormValid={isFormValid}
                        calendarItemId={formData.calendarItemId}
                        isDarkMode={isDarkMode}
                    />
                }
            >
                <ScheduleDateTimeSection
                    formData={formData}
                    setFormData={setFormData}
                    showDatePicker={showDatePicker}
                    setShowDatePicker={setShowDatePicker}
                    showTimePicker={showTimePicker}
                    setShowTimePicker={setShowTimePicker}
                    showTimezoneInfo={showTimezoneInfo}
                    setShowTimezoneInfo={setShowTimezoneInfo}
                    showRepeatSelector={showRepeatSelector}
                    setShowRepeatSelector={setShowRepeatSelector}
                    closeAllPickers={closeAllPickers}
                    handleDateChange={handleDateChange}
                    handleTimeChange={handleTimeChange}
                    currentBrand={currentBrand}
                    isDarkMode={isDarkMode}
                    isMobileLayout={true}
                />

                <SectionContainer icon="📲" className="npm-platform-section">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {platforms.filter(p => p.isConnected).length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.muted, fontSize: '13px' }}>No connected platforms. Please connect a platform to create posts.</div>
                        )}
                        {platforms.map(p => p.isConnected && renderPlatformSection(p.platform))}
                        {validationErrors.platform && (
                            <span style={{ ...sharedStyles.errorText, marginTop: '-4px' }}>{validationErrors.platform}</span>
                        )}
                    </div>
                </SectionContainer>
                {validationErrors.date && (
                    <div style={{ ...sharedStyles.errorText, marginLeft: '42px', marginTop: '-16px' }}>{validationErrors.date}</div>
                )}
            </ScheduleModalLayout>

            <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Post" message="Are you sure you want to delete this post? This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />
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

export default NewPostModal;