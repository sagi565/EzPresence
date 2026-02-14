import React, { useState, useEffect, useRef } from 'react';
import { getDefaultStoryFormData } from '@/models/ScheduleFormData';
import { StoryFormData } from '@/models/StorySchedule';
import DatePicker from '../shared/DatePicker';
import TimePicker from '../shared/TimePicker';
import RepeatSelector from '../shared/RepeatSelector';
import TimezoneSelector, { TIMEZONES, TimezoneOption } from '../shared/TimezoneSelector';
import { ContentItem } from '@/models/ContentList';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { theme } from '@/theme/theme';
import { useContentPicking } from '../shared/useContentPicking';

import ScheduleModalLayout from '../shared/ScheduleModalLayout';
import ContentPreview from '../shared/ContentPreview';
import ChipButton from '../shared/ChipButton';
import ChipArrow from '../shared/ChipArrow';
import SectionContainer from '../shared/SectionContainer';

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
}

const NewStoryModal: React.FC<NewStoryModalProps> = ({
    isOpen,
    onClose,
    onSchedule,
    onSaveDraft,
    brandId,
    initialData,
    content,
    onOpenDrawer,
    onCancelPicking
}) => {
    const [formData, setFormData] = useState<StoryFormData>(getDefaultStoryFormData() as StoryFormData);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showRepeatSelector, setShowRepeatSelector] = useState(false);
    const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [expandedPlatform, setExpandedPlatform] = useState<'instagram' | 'facebook' | null>(null);

    // Fetch connected platforms
    const { platforms } = useConnectedPlatforms(brandId);

    // Fetch user profile for auto-timezone
    const { profile } = useUserProfile();

    // Content Picking Hook
    const contentPreviewRef = useRef<HTMLDivElement>(null);

    const handleContentPick = (item: any) => {
        const contentItem = content.find(c => c.id === item.id) || item;
        handleContentSelect(contentItem);
    };

    const { startPicking } = useContentPicking({
        contentPreviewRef,
        onCancel: () => {
            if (onCancelPicking) onCancelPicking();
        },
        onPick: handleContentPick
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
            setFormData({
                ...defaultData,
                ...initialData,
            });
        }
    }, [isOpen, initialData]);

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    // Handle click outside pickers to close them
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check if click is inside any picker or chip button
            const isInsidePicker = target.closest('.date-picker, .time-picker, .timezone-selector, .repeat-selector');
            const isInsideChip = target.closest('[role="button"]') || target.closest('button');

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

    if (!isOpen) return null;

    // Helper to close all pickers
    const closeAllPickers = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
        setShowTimezoneSelector(false);
        setShowRepeatSelector(false);
    };

    const handleDateChange = (date: Date) => {
        setFormData({ ...formData, date });
        setShowDatePicker(false);
    };

    const handleTimeChange = (time: string) => {
        setFormData({ ...formData, time });
    };

    const handlePlatformToggle = (platform: 'instagram' | 'facebook') => {
        setFormData({
            ...formData,
            platforms: {
                ...formData.platforms,
                [platform]: {
                    ...formData.platforms[platform],
                    enabled: !formData.platforms[platform]?.enabled,
                },
            },
        });
    };

    const toggleExpand = (platform: 'instagram' | 'facebook') => {
        setExpandedPlatform(expandedPlatform === platform ? null : platform);
    };

    const togglePlatform = (e: React.MouseEvent, platform: 'instagram' | 'facebook') => {
        e.stopPropagation();
        handlePlatformToggle(platform);
    };

    const getPlatformColor = (platform: 'instagram' | 'facebook'): string => {
        switch (platform) {
            case 'instagram': return '#E4405F';
            case 'facebook': return '#1877F2';
            default: return theme.colors.primary;
        }
    };

    const handleSchedule = () => {
        // Validate
        const hasInstagram = formData.platforms.instagram?.enabled;
        const hasFacebook = formData.platforms.facebook?.enabled;

        if (!hasInstagram && !hasFacebook) {
            alert('Please select at least one platform');
            return;
        }

        if (!formData.contentId) {
            alert('Please select content first');
            return;
        }

        onSchedule(formData);
        onClose();
    };

    const handleSaveDraft = () => {
        onSaveDraft(formData);
        alert('Story draft saved!');
    };

    const getPlatformIconPath = (platform: 'instagram' | 'facebook'): string => {
        switch (platform) {
            case 'instagram': return '/icons/instagram.svg';
            case 'facebook': return '/icons/facebook.svg';
            default: return '';
        }
    };

    // Render platform section with accordion
    const renderPlatformSection = (platform: 'instagram' | 'facebook') => {
        const isExpanded = expandedPlatform === platform;
        const account = platforms.find(p => p.platform === platform);
        const platformColor = getPlatformColor(platform);
        const isSelected = formData.platforms[platform]?.enabled || false;

        const DEFAULT_INSTAGRAM_CONFIG = { enabled: false, caption: '', shareToFeed: true };
        const DEFAULT_FACEBOOK_CONFIG = { enabled: false, postText: '' };

        const igConfig = formData.platforms.instagram || DEFAULT_INSTAGRAM_CONFIG;
        const fbConfig = formData.platforms.facebook || DEFAULT_FACEBOOK_CONFIG;

        return (
            <div
                key={platform}
                style={{
                    ...platformSectionStyle,
                    borderLeftColor: isSelected ? platformColor : 'rgba(0,0,0,0.1)',
                    ...(isExpanded ? { boxShadow: '0 4px 12px rgba(0,0,0,0.05)' } : {})
                }}
            >
                <div
                    style={{
                        ...platformHeaderStyle,
                        ...(isSelected ? { background: `${platformColor}08` } : {})
                    }}
                    onClick={() => toggleExpand(platform)}
                >
                    <div style={platformHeaderContentStyle}>
                        <div
                            style={{
                                ...platformToggleStyle,
                                ...(isSelected ? { ...platformToggleSelectedStyle, background: platformColor, borderColor: platformColor } : {})
                            }}
                            onClick={(e) => togglePlatform(e, platform)}
                        >
                            {isSelected && <span>✓</span>}
                        </div>

                        <div style={{ ...platformIconSmallStyle, background: platformColor }}>
                            <img src={getPlatformIconPath(platform)} alt="" style={{ width: '14px', height: '14px', filter: 'brightness(0) invert(1)' }} />
                        </div>

                        <div style={platformInfoStyle}>
                            <span style={platformNameStyle}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                            {account && (
                                <span style={platformUsernameStyle}>@{account.username}</span>
                            )}
                        </div>
                    </div>

                    <div style={{
                        transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s',
                        color: theme.colors.muted,
                        fontSize: '12px'
                    }}>▼</div>
                </div>

                {isExpanded && isSelected && (
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {platform === 'instagram' && (
                            <>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.muted, marginBottom: '5px' }}>Caption</div>
                                    <textarea
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1.5px solid rgba(0, 0, 0, .1)',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontFamily: 'inherit',
                                            color: theme.colors.text,
                                            background: '#fff',
                                            resize: 'vertical',
                                            minHeight: '60px'
                                        }}
                                        value={igConfig.caption || ''}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, instagram: { ...igConfig, caption: e.target.value } }
                                        }))}
                                        placeholder="Write a caption..."
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}

                        {platform === 'facebook' && (
                            <>
                                <div>
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: theme.colors.muted, marginBottom: '5px' }}>Post Text</div>
                                    <textarea
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1.5px solid rgba(0, 0, 0, .1)',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontFamily: 'inherit',
                                            color: theme.colors.text,
                                            background: '#fff',
                                            resize: 'vertical',
                                            minHeight: '60px'
                                        }}
                                        value={fbConfig.postText || ''}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, facebook: { ...fbConfig, postText: e.target.value } }
                                        }))}
                                        placeholder="What's on your mind?"
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };
    const handleContentSelect = (selectedContent: ContentItem) => {
        setFormData({
            ...formData,
            contentId: selectedContent.id,
            contentTitle: selectedContent.title || 'Untitled',
            contentThumbnail: selectedContent.thumbnail || ''
        });
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
        if (found) return found;
        // Fallback to formData details
        return {
            id: formData.contentId,
            title: formData.contentTitle || '',
            thumbnail: formData.contentThumbnail || '',
            type: 'image' as const // Default fallback
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

    const platformToggleStyle: React.CSSProperties = {
        width: '18px',
        height: '18px',
        borderRadius: '5px',
        border: '1.5px solid rgba(0,0,0,.15)',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .18s',
    };

    const platformToggleSelectedStyle: React.CSSProperties = {
        background: theme.colors.primary,
        borderColor: theme.colors.primary,
        color: '#fff',
    };

    const platformIconSmallStyle: React.CSSProperties = {
        width: '22px',
        height: '22px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 900,
        color: '#fff',
    };

    const platformInfoStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        gap: '1px',
    };

    const platformNameStyle: React.CSSProperties = {
        fontSize: '13.5px',
        fontWeight: 600,
        color: theme.colors.text,
    };

    const platformUsernameStyle: React.CSSProperties = {
        fontSize: '11px',
        fontWeight: 600,
        color: theme.colors.muted,
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
        cursor: 'pointer',
        transition: 'all .2s',
        boxShadow: '0 3px 12px rgba(155, 93, 229, .25)',
    };

    return (
        <ScheduleModalLayout
            isOpen={isOpen}
            onClose={onClose}
            title="New Story"
            icon="📖"
            beforeBody={
                <input
                    type="text"
                    style={titleInputStyle}
                    placeholder="New story"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    maxLength={80}
                />
            }
            rightColumn={
                <div ref={contentPreviewRef} style={{ position: 'relative' }}>
                    <ContentPreview
                        content={getSelectedContent()}
                        isDragOver={isDragOver}
                        onRemove={handleRemoveContent}
                        onOpenDrawer={() => {
                            startPicking();
                            onOpenDrawer(true);
                        }}
                        onDrop={handleManualDrop}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                        placeholderText="Drop Content Here"
                    />
                </div>
            }
            footer={
                <>
                    <button style={draftBtnStyle} onClick={handleSaveDraft}>Save as Draft</button>
                    <button style={scheduleBtnStyle} onClick={handleSchedule}>Schedule Story</button>
                </>
            }
        >
            {/* Time Section */}
            <SectionContainer icon="🕐">
                <div style={chipRowStyle}>
                    {/* Date Chip */}
                    <ChipButton
                        minWidth="200px"
                        onClick={() => {
                            closeAllPickers();
                            setShowDatePicker(true);
                        }}
                    >
                        <span>{formatDateLabel(formData.date)}</span>
                        <ChipArrow />
                        <DatePicker
                            selectedDate={formData.date}
                            onChange={handleDateChange}
                            minDate={new Date()}
                            show={showDatePicker}
                            onClose={() => setShowDatePicker(false)}
                        />
                    </ChipButton>

                    {/* Time Chip */}
                    <ChipButton
                        minWidth="120px"
                        onClick={() => {
                            closeAllPickers();
                            setShowTimePicker(true);
                        }}
                    >
                        <span>{formData.time}</span>
                        <ChipArrow />
                        <TimePicker
                            selectedTime={formData.time}
                            onChange={handleTimeChange}
                            show={showTimePicker}
                            onClose={() => setShowTimePicker(false)}
                        />
                    </ChipButton>

                    {/* Timezone Chip */}
                    <ChipButton
                        small
                        style={{ position: 'relative' }}
                        onClick={() => {
                            closeAllPickers();
                            setShowTimezoneSelector(true);
                        }}
                    >
                        <span>{formData.timezone || 'Timezone'}</span>
                        <ChipArrow />
                        <TimezoneSelector
                            selectedTimezone={formData.timezone || 'America/New_York'}
                            onChange={(tz) => {
                                setFormData({ ...formData, timezone: tz });
                                setShowTimezoneSelector(false);
                            }}
                            show={showTimezoneSelector}
                            onClose={() => setShowTimezoneSelector(false)}
                        />
                    </ChipButton>
                </div>

                {/* Repeat Chip */}
                <div style={chipRowStyle}>
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
                    </ChipButton>
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
                </div>
            </SectionContainer>
        </ScheduleModalLayout>
    );
};

export default NewStoryModal;
