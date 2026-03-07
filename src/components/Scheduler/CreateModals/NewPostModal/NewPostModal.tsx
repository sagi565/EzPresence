import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import TimezoneSelector, { TIMEZONES, TimezoneOption, getTimezoneLabel } from '../TimezoneSelector/TimezoneSelector';
import RepeatSelector from '../RepeatSelector/RepeatSelector';
import { ContentItem } from '@/models/ContentList';
import HashtagTextarea from '../HashtagTextarea/HashtagTextarea';
import RadioGroup from '../RadioGroup/RadioGroup';
import ToggleRow from '../ToggleRow/ToggleRow';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { getPlatformIconPath, SocialPlatform } from '@/models/Platform';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@/hooks/useSchedules';
import { styles } from './styles';
import { theme } from '@/theme/theme';
import ScheduleModalLayout from '../ScheduleModalLayout/ScheduleModalLayout';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import ContentPreview from '../ContentPreview';
import ChipButton from '../ChipButton/ChipButton';
import ChipArrow from '../ChipArrow/ChipArrow';
import SectionContainer from '../SectionContainer/SectionContainer';
import RecurringActionDialog from '../RecurringActionDialog/RecurringActionDialog';

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
    const [expandedPlatform, setExpandedPlatform] = useState<SocialPlatform | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{ title?: string; platform?: string; date?: string; content?: string }>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRecurringDialog, setShowRecurringDialog] = useState(false);
    const [recurringDialogMode, setRecurringDialogMode] = useState<'edit' | 'delete'>('edit');
    const [isShattering, setIsShattering] = useState(false);
    const [isDraftHovered, setIsDraftHovered] = useState(false);

    // ✅ THE FIX: counter in the PARENT so dragLeave from child crossings is absorbed here
    const dragCounter = useRef(0);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        dragCounter.current += 1;
        if (dragCounter.current === 1) setIsDragOver(true);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        // Keep isDragOver true — don't call setIsDragOver here, counter manages it
    };

    const handleDragLeave = (e: React.DragEvent) => {
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

    const isFormValid = useMemo(() => {
        if (!formData.title?.trim()) return false;
        const activePlatforms = getEnabledPlatforms(formData);
        if (activePlatforms.length === 0) return false;
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

    const { profile } = useUserProfile();

    const handleContentPick = (item: any) => {
        const contentItem = content.find(c => c.id === item.id) || item;
        handleContentSelect(contentItem);
    };

    const { startPicking, cancelPicking, isPicking } = useContentPicking({
        onPick: handleContentPick,
        targetType: 'post'
    });

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
            const matchedTz = TIMEZONES.find((tz: TimezoneOption) =>
                tz.country.toLowerCase() === userCountry ||
                tz.country.toLowerCase().includes(userCountry)
            );
            if (matchedTz) {
                setFormData(prev => ({ ...prev, timezone: matchedTz.value }));
            }
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
            const isInsidePicker = target.closest('.date-picker, .time-picker, .timezone-selector, .repeat-selector');
            const isInsideChip = target.closest('.chip-button') || target.closest('[role="button"]') || target.closest('button');
            if (!isInsidePicker && !isInsideChip) closeAllPickers();
        };
        if (isOpen && (showDatePicker || showTimePicker || showTimezoneSelector || showRepeatSelector)) {
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);
            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, showDatePicker, showTimePicker, showTimezoneSelector, showRepeatSelector]);

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

    const handleTimeChange = (time: string) => {
        setFormData(prev => ({ ...prev, time }));
    };

    const handleContentSelect = (selectedContent: ContentItem) => {
        setFormData(prev => ({
            ...prev,
            contentId: selectedContent.id,
            contentTitle: selectedContent.title || 'Untitled Content',
            contentThumbnail: selectedContent.thumbnail || '',
            platforms: {
                ...prev.platforms,
                instagram: { ...(prev.platforms.instagram || DEFAULT_INSTAGRAM_CONFIG), caption: prev.platforms.instagram?.caption || selectedContent.title || '' },
                facebook: { ...(prev.platforms.facebook || DEFAULT_FACEBOOK_CONFIG), postText: prev.platforms.facebook?.postText || selectedContent.title || '' },
                youtube: { ...(prev.platforms.youtube || DEFAULT_YOUTUBE_CONFIG), title: prev.platforms.youtube?.title || selectedContent.title || '' },
                tiktok: { ...(prev.platforms.tiktok || DEFAULT_TIKTOK_CONFIG), caption: prev.platforms.tiktok?.caption || selectedContent.title || '' }
            }
        }));
        if (validationErrors.content) setValidationErrors(prev => ({ ...prev, content: undefined }));
        if (onCancelPicking) onCancelPicking();
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
                    style={{ width: 15, height: 15, borderRadius: '50%', background: 'rgba(155,93,229,.1)', fontSize: '9px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', cursor: 'help', fontStyle: 'italic', flexShrink: 0, position: 'relative', marginLeft: '4px' }}
                    onMouseEnter={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}
                >
                    i
                    {show && (
                        <span style={{ display: 'block', position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', background: '#111827', color: '#fff', fontSize: '11px', fontWeight: 400, lineHeight: 1.4, padding: '8px 12px', borderRadius: '8px', whiteSpace: 'pre-line', width: '220px', zIndex: 1800, boxShadow: '0 4px 16px rgba(0,0,0,.25)', pointerEvents: 'none' }}>
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
                    ...(isSelected ? {} : { borderLeftColor: 'rgba(0,0,0,0.1)' }),
                    ...(isExpanded ? { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } : {})
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
                                border: '1.5px solid', borderColor: isSelected ? platformColor : 'rgba(0,0,0,0.15)',
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
                            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', borderRadius: '5px', background: '#fff', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                <img src={getPlatformIconPath(platform)} alt="" style={{ width: '14px', height: '14px' }} />
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
                                    <div style={{ ...styles.fieldLabel, display: 'flex', alignItems: 'center', gap: 4 }}>Post Text<FieldTooltip text="This is the text that appears with your Facebook post." /></div>
                                    <HashtagTextarea value={fbConfig.postText || ''} onChange={val => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, facebook: { ...fbConfig, postText: val } } }))} placeholder="What's on your mind?" rows={3} />
                                </div>
                                <div style={styles.field}>
                                    <div style={{ ...styles.fieldLabel, display: 'flex', alignItems: 'center', gap: 4 }}>Link <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(Optional)</span><FieldTooltip text={"Attach a link to share a webpage with a preview.\nFacebook will automatically generate a title, image, and description."} /></div>
                                    <input style={styles.fieldInput} value={fbConfig.link || ''} onChange={e => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, facebook: { ...fbConfig, link: e.target.value } } }))} placeholder="https://" />
                                </div>
                            </>
                        )}
                        {platform === 'youtube' && (
                            <>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Title</div>
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
                                <div style={styles.field}>
                                    <div style={{ ...styles.fieldLabel, display: 'flex', alignItems: 'center', gap: 4 }}>Category <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(optional)</span><FieldTooltip text={"Category influences where your video appears on YouTube.\nIt helps YouTube recommend your video to viewers interested in this type of content."} /></div>
                                    <select style={styles.fieldInput} value={ytConfig.category || ''} onChange={e => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, category: e.target.value } } }))}>
                                        <option value="" disabled>Select Category</option>
                                        <option value="22">People &amp; Blogs</option>
                                        <option value="23">Comedy</option>
                                        <option value="24">Entertainment</option>
                                        <option value="28">Science &amp; Technology</option>
                                        <option value="27">Education</option>
                                    </select>
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Tags <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(optional)</span></div>
                                    <input style={styles.fieldInput} value={ytConfig.tags.join(', ')} onChange={e => setFormData(prev => ({ ...prev, platforms: { ...prev.platforms, youtube: { ...ytConfig, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } } }))} placeholder="Add tags (comma separated)" />
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

    const handleSaveDraft = async () => {
        if (!formData.contentId) {
            setValidationErrors({ content: 'Please add content to your post' });
            return;
        }
        setValidationErrors({});
        try {
            setIsSubmitting(true);
            const selectedContent = getSelectedContent();
            const mediaType = selectedContent?.mediaType === 'video' || selectedContent?.type === 'video' ? 'video' : 'image';
            const description = formData.platforms.instagram?.enabled ? formData.platforms.instagram.caption :
                formData.platforms.facebook?.enabled ? formData.platforms.facebook.postText :
                    formData.platforms.tiktok?.enabled ? formData.platforms.tiktok.caption :
                        formData.platforms.youtube?.enabled ? formData.platforms.youtube.description : undefined;
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

                const activePlatforms = getEnabledPlatforms(formData);
                const origPlatforms = (initialData as any)?.platforms || [];
                if (activePlatforms.length !== origPlatforms.length || !activePlatforms.every(p => origPlatforms.includes(p as any))) {
                    updates.platforms = activePlatforms;
                }

                if (mediaType !== (initialData as any)?.media) updates.media = mediaType;

                const newTitle = formData.title || formData.contentTitle || 'Untitled Draft';
                if (newTitle !== initialData?.title) updates.title = newTitle;
                if ((description || '') !== ((initialData as any)?.description || '')) updates.description = description || '';

                const newRruleText = formData.repeat.rruleText || null;
                const origRruleText = initialData?.repeat?.rruleText || null;
                if (newRruleText !== origRruleText && !(newRruleText === null && origRruleText === 'POLICY')) {
                    updates.rruleText = newRruleText;
                }

                if (endDateStr) updates.endDate = endDateStr;

                await updateSchedule(formData.calendarItemId, updates);
            } else {
                await createSchedule({ date: formData.date, time: formData.time, timezone: formData.timezone || 'America/New_York', platforms: getEnabledPlatforms(formData), media: mediaType, title: formData.title || formData.contentTitle || 'Untitled Draft', description, contentUuids: formData.contentId ? [formData.contentId] : undefined, rruleText: formData.repeat.rruleText, endDate: formData.repeat.endDate || undefined, status: 'Draft' });
            }
            if (onSaveDraft) onSaveDraft(formData);
            onClose();
        } catch (error) {
            console.error('Failed to save draft:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!formData.scheduleUuid && !formData.calendarItemId) return;
        if (formData.repeat.frequency !== 'none') {
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

    const handleOverlayClick = () => {
        if (isPicking) cancelPicking();
        else onClose();
    };

    const handleSchedule = async () => {
        const errors: { title?: string; platform?: string; date?: string; content?: string } = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        const activePlatforms = getEnabledPlatforms(formData);
        if (activePlatforms.length === 0) errors.platform = 'Please select at least one platform';
        const now = new Date();
        const { hours, minutes } = parseTimeString(formData.time);
        const scheduledDate = new Date(formData.date);
        scheduledDate.setHours(hours, minutes, 0, 0);
        if (scheduledDate < now) errors.date = 'Cannot schedule a post in the past';
        if (!formData.contentId) errors.content = 'Please add content to your post';
        if (Object.keys(errors).length > 0) { setValidationErrors(errors); return; }
        setValidationErrors({});
        if (formData.calendarItemId && formData.repeat.frequency !== 'none' && !isReadOnly) {
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
            const description = formData.platforms.instagram?.enabled ? formData.platforms.instagram.caption :
                formData.platforms.facebook?.enabled ? formData.platforms.facebook.postText :
                    formData.platforms.tiktok?.enabled ? formData.platforms.tiktok.caption :
                        formData.platforms.youtube?.enabled ? formData.platforms.youtube.description : undefined;
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
                if (activePlatforms.length !== origPlatforms.length || !activePlatforms.every(p => origPlatforms.includes(p as any))) {
                    updates.platforms = activePlatforms;
                }

                if (mediaType !== (initialData as any)?.media) updates.media = mediaType;

                const newTitle = formData.title || formData.contentTitle || 'Untitled Post';
                if (newTitle !== initialData?.title) updates.title = newTitle;
                if ((description || '') !== ((initialData as any)?.description || '')) updates.description = description || '';

                const newRruleText = formData.repeat.rruleText || null;
                const origRruleText = initialData?.repeat?.rruleText || null;
                if (newRruleText !== origRruleText && !(newRruleText === null && origRruleText === 'POLICY')) {
                    updates.rruleText = newRruleText;
                }

                if (endDateStr) updates.endDate = endDateStr;

                await updateSchedule(formData.calendarItemId, updates, occurrenceOnly);
            } else {
                await createSchedule({ date: formData.date, time: formData.time, timezone: formData.timezone || 'America/New_York', platforms: activePlatforms, media: mediaType, title: formData.title || formData.contentTitle || 'Untitled Post', description, contentUuids: formData.contentId ? [formData.contentId] : undefined, rruleText: formData.repeat.rruleText, endDate: formData.repeat.endDate || undefined, status: 'Pending' });
            }
            if (onScheduleProp) onScheduleProp(formData);
            if (!isReadOnly) onClose();
        } catch (error) {
            console.error('Failed to schedule/update post:', error);
            alert('Failed to process request. Please try again.');
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
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <input
                            type="text"
                            placeholder={formData.calendarItemId ? (isReadOnly ? "View post" : "Edit post") : "New post"}
                            style={{ ...styles.titleInput, ...(validationErrors.title ? { borderBottomColor: '#EF4444' } : {}) }}
                            value={formData.title}
                            readOnly={isReadOnly}
                            onChange={e => {
                                if (isReadOnly) return;
                                setFormData(prev => ({ ...prev, title: e.target.value }));
                                if (validationErrors.title) setValidationErrors(prev => ({ ...prev, title: undefined }));
                            }}
                        />
                        {validationErrors.title && (
                            <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginLeft: '28px', marginTop: '4px' }}>{validationErrors.title}</span>
                        )}
                    </div>
                }
                rightColumn={
                    <div style={{ position: 'relative', height: '100%' }}>
                        <ContentPreview
                            id="npmContentPreview"
                            content={getSelectedContent()}
                            isDragOver={isDragOver}
                            onRemove={handleRemoveContent}
                            onOpenDrawer={() => {
                                startPicking();
                                onOpenDrawer(true);
                            }}
                            onDrop={handleManualDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDragEnter={handleDragEnter}
                            placeholderText="Click to add content"
                        />
                        {validationErrors.content && (
                            <div style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, textAlign: 'center', marginTop: '8px' }}>{validationErrors.content}</div>
                        )}
                    </div>
                }
                footer={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <button onClick={handleSaveDraft} disabled={isSubmitting || isReadOnly || !formData.contentId} onMouseEnter={() => setIsDraftHovered(true)} onMouseLeave={() => setIsDraftHovered(false)}
                            style={{ ...styles.draftBtn, opacity: (isSubmitting || isReadOnly || !formData.contentId) ? 0.5 : 1, cursor: (isSubmitting || isReadOnly || !formData.contentId) ? 'not-allowed' : 'pointer', ...((isDraftHovered && !isSubmitting && !isReadOnly && formData.contentId) ? { background: 'rgba(155, 93, 229, 0.1)', color: '#9b5de5', boxShadow: '0 2px 8px rgba(155, 93, 229, 0.2)' } : {}) }}>
                            Save as Draft
                        </button>
                        <button onClick={handleSchedule} disabled={isSubmitting || isReadOnly || !isFormValid}
                            style={{ ...styles.scheduleBtn, opacity: (isSubmitting || isReadOnly || !isFormValid) ? 0.7 : 1, cursor: (isSubmitting || isReadOnly || !isFormValid) ? 'not-allowed' : 'pointer' }}>
                            {isSubmitting ? 'Processing...' : (isReadOnly ? 'View Only' : (formData.calendarItemId ? 'Update' : 'Schedule'))}
                        </button>
                    </div>
                }
            >
                <SectionContainer icon="🕐">
                    <div style={styles.chipRow}>
                        <div style={{ position: 'relative' }}>
                            <ChipButton minWidth="200px" onClick={() => { closeAllPickers(); setShowDatePicker(true); }}>
                                <span>{formData.date ? formData.date.toLocaleDateString() : 'Select Date'}</span>
                                <ChipArrow />
                            </ChipButton>
                            <DatePicker selectedDate={formData.date} onChange={handleDateChange} minDate={new Date()} show={showDatePicker} onClose={() => setShowDatePicker(false)} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <ChipButton minWidth="120px" onClick={() => { closeAllPickers(); setShowTimePicker(true); }}>
                                <span>{formData.time}</span>
                                <ChipArrow />
                            </ChipButton>
                            <TimePicker selectedTime={formData.time} onChange={handleTimeChange} show={showTimePicker} onClose={() => setShowTimePicker(false)} />
                        </div>
                        <div style={{ position: 'relative' }}>
                            <ChipButton style={{ position: 'relative' }} minWidth="120px" onClick={() => { closeAllPickers(); setShowTimezoneSelector(true); }}>
                                <span>{formData.timezone ? getTimezoneLabel(formData.timezone) : 'Timezone'}</span>
                                <ChipArrow />
                            </ChipButton>
                            <TimezoneSelector selectedTimezone={formData.timezone || 'America/New_York'} onChange={(tz) => { setFormData(prev => ({ ...prev, timezone: tz })); setShowTimezoneSelector(false); }} show={showTimezoneSelector} onClose={() => setShowTimezoneSelector(false)} />
                        </div>
                    </div>
                    <div style={styles.chipRow}>
                        <div style={{ position: 'relative' }}>
                            <ChipButton minWidth="260px" maxWidth="260px" style={{ position: 'relative' }} onClick={() => { closeAllPickers(); setShowRepeatSelector(true); }}>
                                <span>{formData.repeat.label}</span>
                                <ChipArrow />
                            </ChipButton>
                            <RepeatSelector selectedRepeat={formData.repeat} onChange={(repeat) => { setFormData({ ...formData, repeat }); setShowRepeatSelector(false); }} baseDate={formData.date} show={showRepeatSelector} onClose={() => setShowRepeatSelector(false)} />
                        </div>
                    </div>
                </SectionContainer>

                <SectionContainer icon="📲">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {platforms.filter(p => p.isConnected).length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', color: theme.colors.muted, fontSize: '13px' }}>No connected platforms. Please connect a platform to create posts.</div>
                        )}
                        {platforms.map(p => p.isConnected && renderPlatformSection(p.platform))}
                        {validationErrors.platform && (
                            <span style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginTop: '-4px' }}>{validationErrors.platform}</span>
                        )}
                    </div>
                </SectionContainer>
                {validationErrors.date && (
                    <div style={{ color: '#EF4444', fontSize: '12px', fontWeight: 500, marginLeft: '42px', marginTop: '-16px' }}>{validationErrors.date}</div>
                )}
            </ScheduleModalLayout>

            <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Post" message="Are you sure you want to delete this post? This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />
            <RecurringActionDialog isOpen={showRecurringDialog} mode={recurringDialogMode} onConfirm={handleRecurringConfirm} onCancel={() => setShowRecurringDialog(false)} />
        </div>
    );
};

export default NewPostModal;