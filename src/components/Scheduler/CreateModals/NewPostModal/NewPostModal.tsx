import React, { useState, useEffect, useRef } from 'react';
import { useContentPicking } from '../shared/useContentPicking';
import {
    getDefaultPostFormData,
    PostFormData,
    DEFAULT_INSTAGRAM_CONFIG,
    DEFAULT_FACEBOOK_CONFIG,
    DEFAULT_YOUTUBE_CONFIG,
    DEFAULT_TIKTOK_CONFIG
} from '@/models/ScheduleFormData';
import DatePicker from '../shared/DatePicker';
import TimePicker from '../shared/TimePicker';
import TimezoneSelector, { TIMEZONES, TimezoneOption } from '../shared/TimezoneSelector';
import { ContentItem } from '@/models/ContentList';
import HashtagTextarea from '../shared/HashtagTextarea';
import RadioGroup from '../shared/RadioGroup';
import ToggleRow from '../shared/ToggleRow';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { getPlatformIconPath, SocialPlatform } from '@/models/Platform';
import { styles } from './styles';
import { theme } from '@/theme/theme';
import ScheduleModalLayout from '../shared/ScheduleModalLayout';
import ContentPreview from '../shared/ContentPreview';
import ChipButton from '../shared/ChipButton';
import ChipArrow from '../shared/ChipArrow';
import SectionContainer from '../shared/SectionContainer';

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
}

const NewPostModal: React.FC<NewPostModalProps> = ({
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
    const [formData, setFormData] = useState<PostFormData>(getDefaultPostFormData());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);
    const [expandedPlatform, setExpandedPlatform] = useState<SocialPlatform | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const { platforms } = useConnectedPlatforms(brandId);
    const { profile } = useUserProfile();

    // Content Picking Hook
    const contentPreviewRef = useRef<HTMLDivElement>(null);

    const handleContentPick = (item: any) => {
        // Map Item to ContentItem if needed, or just use as is if it matches
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

    // Reset or initialize data
    useEffect(() => {
        if (isOpen) {
            setFormData({
                ...getDefaultPostFormData(),
                ...initialData
            });
            setExpandedPlatform(null);
        } else {
            // Ensure picking is cancelled if modal closes externally
            if (onCancelPicking) onCancelPicking();
        }
    }, [isOpen, initialData]);

    // Auto-detect timezone
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
            const isInsidePicker = target.closest('.date-picker, .time-picker, .timezone-selector');
            const isInsideChip = target.closest('[role="button"]') || target.closest('button');

            // If clicked outside all pickers and chips, close all pickers
            if (!isInsidePicker && !isInsideChip) {
                closeAllPickers();
            }
        };

        if (isOpen && (showDatePicker || showTimePicker || showTimezoneSelector)) {
            // Delay adding listener to avoid closing immediately after opening
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 100);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, showDatePicker, showTimePicker, showTimezoneSelector]);

    // Helper to close all pickers
    const closeAllPickers = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
        setShowTimezoneSelector(false);
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
        // If we selected content via the drawer (not drag & drop), ensure picking mode ends
        if (onCancelPicking) onCancelPicking();
    };

    // Manual drop for standard drag-and-drop (not picking mode)
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

    const togglePlatform = (e: React.MouseEvent, platform: SocialPlatform) => {
        e.stopPropagation();
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
                        ...(isSelected ? { background: `${platformColor}08` } : {})
                    }}
                    onClick={() => toggleExpand(platform)}
                >
                    <div style={styles.platformHeaderContent}>
                        <div
                            style={{
                                ...styles.platformToggle,
                                ...(isSelected ? { ...styles.platformToggleSelected, background: platformColor, borderColor: platformColor } : {})
                            }}
                            onClick={(e) => togglePlatform(e, platform)}
                        >
                            {isSelected && <span>✓</span>}
                        </div>

                        <div style={{ ...styles.platformIcon, background: platformColor }}>
                            <img src={getPlatformIconPath(platform)} alt="" style={{ width: '14px', height: '14px', filter: 'brightness(0) invert(1)' }} />
                        </div>

                        <div style={styles.platformInfo}>
                            <span style={styles.platformName}>
                                {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </span>
                            {account && (
                                <span style={styles.platformUsername}>@{account.username}</span>
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

                {isExpanded && (
                    <div style={styles.platformBody}>
                        {platform === 'instagram' && (
                            <>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Caption</div>
                                    <HashtagTextarea
                                        value={igConfig.caption || ''}
                                        onChange={val => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, instagram: { ...igConfig, caption: val } }
                                        }))}
                                        placeholder="Write a caption..."
                                        rows={3}
                                    />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Location <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(Optional)</span></div>
                                    <input
                                        style={styles.fieldInput}
                                        value={igConfig.location || ''}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, instagram: { ...igConfig, location: e.target.value } }
                                        }))}
                                        placeholder="Add Location"
                                    />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Alt Text <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(Optional)</span></div>
                                    <input
                                        style={styles.fieldInput}
                                        value={igConfig.altText || ''}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, instagram: { ...igConfig, altText: e.target.value } }
                                        }))}
                                        placeholder="Write alt text..."
                                    />
                                </div>
                                <ToggleRow
                                    label="Share to Feed"
                                    checked={igConfig.shareToFeed}
                                    onChange={val => setFormData(prev => ({
                                        ...prev,
                                        platforms: { ...prev.platforms, instagram: { ...igConfig, shareToFeed: val } }
                                    }))}
                                />
                            </>
                        )}

                        {platform === 'facebook' && (
                            <>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Post Text</div>
                                    <HashtagTextarea
                                        value={fbConfig.postText || ''}
                                        onChange={val => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, facebook: { ...fbConfig, postText: val } }
                                        }))}
                                        placeholder="What's on your mind?"
                                        rows={3}
                                    />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Link <span style={{ fontWeight: 400, fontSize: '10px', color: '#999' }}>(Optional)</span></div>
                                    <input
                                        style={styles.fieldInput}
                                        value={fbConfig.link || ''}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, facebook: { ...fbConfig, link: e.target.value } }
                                        }))}
                                        placeholder="https://"
                                    />
                                </div>
                            </>
                        )}

                        {platform === 'youtube' && (
                            <>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Title</div>
                                    <input
                                        style={styles.fieldInput}
                                        value={ytConfig.title || ''}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, youtube: { ...ytConfig, title: e.target.value } }
                                        }))}
                                        placeholder="Video Title"
                                    />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Description</div>
                                    <HashtagTextarea
                                        value={ytConfig.description || ''}
                                        onChange={val => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, youtube: { ...ytConfig, description: val } }
                                        }))}
                                        placeholder="Tell viewers about your video"
                                        rows={4}
                                    />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Privacy</div>
                                    <RadioGroup
                                        options={[
                                            { label: 'Public', value: 'public' },
                                            { label: 'Unlisted', value: 'unlisted' },
                                            { label: 'Private', value: 'private' }
                                        ]}
                                        value={ytConfig.privacyStatus}
                                        onChange={val => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, youtube: { ...ytConfig, privacyStatus: val as any } }
                                        }))}
                                    />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Category</div>
                                    <select
                                        style={styles.fieldInput}
                                        value={ytConfig.category || ''}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, youtube: { ...ytConfig, category: e.target.value } }
                                        }))}
                                    >
                                        <option value="" disabled>Select Category</option>
                                        <option value="22">People & Blogs</option>
                                        <option value="23">Comedy</option>
                                        <option value="24">Entertainment</option>
                                        <option value="28">Science & Technology</option>
                                        <option value="27">Education</option>
                                    </select>
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Tags</div>
                                    <input
                                        style={styles.fieldInput}
                                        value={ytConfig.tags.join(', ')}
                                        onChange={e => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, youtube: { ...ytConfig, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } }
                                        }))}
                                        placeholder="Add tags (comma separated)"
                                    />
                                </div>
                                <ToggleRow
                                    label="Made for Kids"
                                    checked={ytConfig.madeForKids}
                                    onChange={val => setFormData(prev => ({
                                        ...prev,
                                        platforms: { ...prev.platforms, youtube: { ...ytConfig, madeForKids: val } }
                                    }))}
                                />
                                <ToggleRow
                                    label="Synthetic Media"
                                    checked={ytConfig.syntheticMedia}
                                    onChange={val => setFormData(prev => ({
                                        ...prev,
                                        platforms: { ...prev.platforms, youtube: { ...ytConfig, syntheticMedia: val } }
                                    }))}
                                />
                            </>
                        )}

                        {platform === 'tiktok' && (
                            <>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Description</div>
                                    <HashtagTextarea
                                        value={ttConfig.caption || ''}
                                        onChange={val => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, tiktok: { ...ttConfig, caption: val } }
                                        }))}
                                        placeholder="TikTok caption..."
                                        rows={3}
                                    />
                                </div>
                                <div style={styles.field}>
                                    <div style={styles.fieldLabel}>Privacy</div>
                                    <RadioGroup
                                        options={[
                                            { label: 'Public', value: 'public' },
                                            { label: 'Friends', value: 'friends' },
                                            { label: 'Private', value: 'private' }
                                        ]}
                                        value={ttConfig.privacyLevel}
                                        onChange={val => setFormData(prev => ({
                                            ...prev,
                                            platforms: { ...prev.platforms, tiktok: { ...ttConfig, privacyLevel: val as any } }
                                        }))}
                                    />
                                </div>
                                <ToggleRow
                                    label="Disable Comments"
                                    checked={ttConfig.disableComments}
                                    onChange={val => setFormData(prev => ({
                                        ...prev,
                                        platforms: { ...prev.platforms, tiktok: { ...ttConfig, disableComments: val } }
                                    }))}
                                />
                                <ToggleRow
                                    label="Disable Duet"
                                    checked={ttConfig.disableDuet}
                                    onChange={val => setFormData(prev => ({
                                        ...prev,
                                        platforms: { ...prev.platforms, tiktok: { ...ttConfig, disableDuet: val } }
                                    }))}
                                />
                                <ToggleRow
                                    label="Disable Stitch"
                                    checked={ttConfig.disableStitch}
                                    onChange={val => setFormData(prev => ({
                                        ...prev,
                                        platforms: { ...prev.platforms, tiktok: { ...ttConfig, disableStitch: val } }
                                    }))}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const handleSaveDraft = () => {
        onSaveDraft(formData);
    };

    const handleSchedule = () => {
        // Basic validation
        if (!formData.contentId) {
            alert('Please select content to schedule');
            return;
        }

        const hasEnabledPlatform =
            formData.platforms.instagram?.enabled ||
            formData.platforms.facebook?.enabled ||
            formData.platforms.youtube?.enabled ||
            formData.platforms.tiktok?.enabled;

        if (!hasEnabledPlatform) {
            alert('Please select at least one platform');
            return;
        }

        onSchedule(formData);
    };

    const getSelectedContent = () => {
        if (!formData.contentId) return null;
        const found = content.find(c => c.id === formData.contentId);
        if (found) return found;
        return {
            id: formData.contentId,
            title: formData.contentTitle || '',
            thumbnail: formData.contentThumbnail || '',
            type: 'image' as const
        };
    };

    if (!isOpen) return null;

    return (
        <ScheduleModalLayout
            isOpen={isOpen}
            onClose={onClose}
            title="New Post"
            icon="📝"
            height="680px"
            scrollableBody={true}
            beforeBody={
                <input
                    type="text"
                    placeholder="Post Title"
                    style={styles.titleInput}
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                    <button style={styles.draftBtn} onClick={handleSaveDraft}>Save as Draft</button>
                    <button style={styles.scheduleBtn} onClick={handleSchedule}>Schedule Post</button>
                </>
            }
        >
            {/* Date/Time Section */}
            <SectionContainer icon="🕐">
                <div style={styles.chipRow}>
                    <ChipButton
                        minWidth="200px"
                        onClick={() => {
                            closeAllPickers();
                            setShowDatePicker(true);
                        }}
                    >
                        <span>{formData.date ? formData.date.toLocaleDateString() : 'Select Date'}</span>
                        <ChipArrow />
                        <DatePicker
                            selectedDate={formData.date}
                            onChange={date => {
                                setFormData(prev => ({ ...prev, date }));
                                setShowDatePicker(false);
                            }}
                            minDate={new Date()}
                            show={showDatePicker}
                            onClose={() => setShowDatePicker(false)}
                        />
                    </ChipButton>

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
                            onChange={time => setFormData(prev => ({ ...prev, time }))}
                            show={showTimePicker}
                            onClose={() => setShowTimePicker(false)}
                        />
                    </ChipButton>

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
                                setFormData(prev => ({ ...prev, timezone: tz }));
                                setShowTimezoneSelector(false);
                            }}
                            show={showTimezoneSelector}
                            onClose={() => setShowTimezoneSelector(false)}
                        />
                    </ChipButton>
                </div>
            </SectionContainer>

            {/* Platform Selection */}
            <div style={styles.section}>
                <div style={styles.sectionIcon}>📲</div>
                <div style={styles.sectionContent}>
                    {platforms.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {platforms.map(p => p.isConnected && renderPlatformSection(p.platform))}
                        </div>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666', background: '#f5f5f5', borderRadius: '8px' }}>
                            <p>No platforms connected. Please connect a platform in Settings.</p>
                        </div>
                    )}
                </div>
            </div >
        </ScheduleModalLayout >
    );
};

export default NewPostModal;
