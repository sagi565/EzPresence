import React, { useState, useEffect } from 'react';
import HashtagTextarea from '../HashtagTextarea/HashtagTextarea';
import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import TimezoneSelector from '../TimezoneSelector/TimezoneSelector';
import RepeatSelector from '../RepeatSelector/RepeatSelector';
import ContentPreview from '../ContentPreview/ContentPreview';
import ChipButton from '../ChipButton/ChipButton';
import ChipArrow from '../ChipArrow/ChipArrow';
import ToggleRow from '../ToggleRow/ToggleRow';
import ContentDetailModal from '../../../Content/ContentDetailModal/ContentDetailModal';
import {
    Platform,
    MediaType,
} from '@/models/Post';
import { getPlatformIconPath, SocialPlatform } from '@/models/Platform';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@/hooks/useSchedules';
import * as S from './styles';
import { theme } from '@/theme/theme';
import ScheduleModalLayout from '../ScheduleModalLayout/ScheduleModalLayout';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import RecurringActionDialog from '../RecurringActionDialog/RecurringActionDialog';
import { RepeatOption, ScheduleFormData, DEFAULT_REPEAT_OPTION } from '@/models/ScheduleFormData';

interface NewPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Partial<ScheduleFormData>;
    onOpenDrawer: (open: boolean) => void;
    selectedContent?: any;
    onSave?: (data: ScheduleFormData) => Promise<void>;
}

const NewPostModal: React.FC<NewPostModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onOpenDrawer,
    selectedContent,
    onSave
}) => {
    const { currentBrand } = useBrands();
    const { createSchedule, updateSchedule, deleteSchedule } = useSchedules(currentBrand?.id || '');

    const [formData, setFormData] = useState<ScheduleFormData>({
        title: '',
        type: 'post',
        date: new Date(),
        time: '12:00 PM',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        repeat: DEFAULT_REPEAT_OPTION,
        platforms: {
            instagram: { enabled: true, caption: '', shareToFeed: true },
            facebook: { enabled: false, postText: '' },
            youtube: { enabled: false, title: '', description: '', privacyStatus: 'public', category: '', tags: [], madeForKids: false, syntheticMedia: false },
            tiktok: { enabled: false, caption: '', privacyLevel: 'public', disableDuet: false, disableStitch: false, disableComments: false },
        },
        contentId: '',
        contentTitle: '',
        contentThumbnail: '',
        ...initialData
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showTimezoneSelector, setShowTimezoneSelector] = useState(false);
    const [showRepeatSelector, setShowRepeatSelector] = useState(false);
    const [expandedPlatform, setExpandedPlatform] = useState<SocialPlatform | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showRecurringDialog, setShowRecurringDialog] = useState(false);
    const [recurringDialogMode, setRecurringDialogMode] = useState<'edit' | 'delete'>('edit');
    const [isShattering, setIsShattering] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [detailModal, setDetailModal] = useState<{ isOpen: boolean; item: any }>({ isOpen: false, item: null });

    const isReadOnly = !!formData.calendarItemId && formData.status === 'success';

    useEffect(() => {
        if (selectedContent) {
            setFormData(prev => ({
                ...prev,
                contentId: selectedContent.id,
                contentTitle: selectedContent.title,
                contentThumbnail: selectedContent.thumbnail
            }));
            if (validationErrors.content) {
                setValidationErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.content;
                    return newErrors;
                });
            }
        }
    }, [selectedContent]);

    const closeAllPickers = () => {
        setShowDatePicker(false);
        setShowTimePicker(false);
        setShowTimezoneSelector(false);
        setShowRepeatSelector(false);
    };

    const handleDateChange = (date: Date) => {
        setFormData(prev => ({ ...prev, date }));
        setShowDatePicker(false);
    };

    const handleTimeChange = (time: string) => {
        setFormData(prev => ({ ...prev, time }));
        setShowTimePicker(false);
    };

    const togglePlatform = (platform: SocialPlatform, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isReadOnly) return;
        setFormData(prev => {
            const newPlatforms = { ...prev.platforms };
            const config = newPlatforms[platform as keyof typeof newPlatforms];
            if (config) {
                config.enabled = !config.enabled;
            }
            return { ...prev, platforms: newPlatforms };
        });
    };

    const updatePlatformConfig = (platform: SocialPlatform, updates: any) => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newPlatforms = { ...prev.platforms };
            const config = newPlatforms[platform as keyof typeof newPlatforms];
            if (config) {
                Object.assign(config, updates);
            }
            return { ...prev, platforms: newPlatforms };
        });
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.contentId) errors.content = 'Media is required';

        const hasEnabledPlatform = Object.values(formData.platforms).some(p => p?.enabled);
        if (!hasEnabledPlatform) errors.platform = 'Select at least one platform';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveDraft = async () => {
        if (isReadOnly) return;
        setIsSubmitting(true);
        try {
            const platformsList = Object.keys(formData.platforms).filter(k => formData.platforms[k as keyof typeof formData.platforms]?.enabled) as Platform[];
            const dataToSave = {
                title: formData.title,
                date: formData.date,
                time: formData.time,
                platforms: platformsList,
                media: 'image' as MediaType,
                status: 'draft',
                contentUuids: [formData.contentId || ''],
                type: 'Post' as const,
                timezone: formData.timezone
            };

            if (onSave) {
                await onSave(formData);
            } else if (formData.calendarItemId) {
                await updateSchedule(formData.calendarItemId, dataToSave);
            } else {
                await createSchedule(dataToSave);
            }
            onClose();
        } catch (error) {
            console.error('Failed to save draft:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSchedule = async () => {
        if (isReadOnly) return;
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const platformsList = Object.keys(formData.platforms).filter(k => formData.platforms[k as keyof typeof formData.platforms]?.enabled) as Platform[];
            const dataToSave = {
                title: formData.title,
                date: formData.date,
                time: formData.time,
                platforms: platformsList,
                media: 'image' as MediaType,
                status: 'scheduled',
                contentUuids: [formData.contentId || ''],
                type: 'Post' as const,
                timezone: formData.timezone,
                rruleText: formData.repeat.frequency !== 'none' ? formData.repeat.rruleText : undefined
            };

            if (onSave) {
                await onSave(formData);
            } else if (formData.calendarItemId) {
                await updateSchedule(formData.calendarItemId, dataToSave);
            } else {
                await createSchedule(dataToSave);
            }
            setIsShattering(true);
            setTimeout(() => {
                onClose();
                setIsShattering(false);
            }, 600);
        } catch (error) {
            console.error('Failed to schedule post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        setRecurringDialogMode('delete');
        if (formData.repeat.frequency !== 'none') {
            setShowRecurringDialog(true);
        } else {
            setShowDeleteConfirm(true);
        }
    };

    const confirmDelete = async () => {
        if (!formData.calendarItemId) return;
        setIsSubmitting(true);
        try {
            await deleteSchedule(formData.calendarItemId, formData.date);
            setShowDeleteConfirm(false);
            onClose();
        } catch (error) {
            console.error('Failed to delete schedule:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRecurringConfirm = (choice: 'all' | 'this' | 'following') => {
        setShowRecurringDialog(false);
        if (recurringDialogMode === 'delete' && formData.calendarItemId) {
            deleteSchedule(formData.calendarItemId, formData.date, choice !== 'all');
            onClose();
        }
    };

    const handleRemoveContent = () => {
        setFormData(prev => ({
            ...prev,
            contentId: '',
            contentTitle: '',
            contentThumbnail: ''
        }));
    };

    const handleOverlayClick = () => {
        onClose();
    };

    const getTimezoneLabel = (tz: string) => {
        try {
            return tz.split('/').pop()?.replace(/_/g, ' ') || tz;
        } catch { return tz; }
    };

    const getSelectedContent = () => {
        if (!formData.contentId) return null;
        return {
            id: formData.contentId,
            title: formData.contentTitle || '',
            thumbnail: formData.contentThumbnail || '',
            type: 'image' as const,
            mediaType: 'image' as const
        };
    };

    const isFormValid = formData.title.trim() && formData.contentId && Object.values(formData.platforms).some(p => p?.enabled);

    const getPlatformColor = (platform: string) => {
        switch(platform) {
            case 'instagram': return '#E1306C';
            case 'facebook': return '#1877F2';
            case 'youtube': return '#FF0000';
            case 'tiktok': return '#000000';
            default: return theme.colors.primary;
        }
    };

    if (!isOpen) return null;

    return (
        <S.ModalWrapper className={isShattering ? 'shatter-animation' : ''} $isShattering={isShattering}>
            <ScheduleModalLayout
                isOpen={isOpen}
                onClose={onClose}
                onOverlayClick={handleOverlayClick}
                onDelete={formData.calendarItemId ? handleDelete : undefined}
                isDeleting={isSubmitting}
                title=""
                icon="📝"
                height="720px"
                scrollableBody={true}
                beforeBody={
                    <S.TitleContainer>
                        <S.TitleInput
                            className="npm-title-input"
                            type="text"
                            placeholder={formData.calendarItemId ? (isReadOnly ? "View post" : "Edit post") : "Post title..."}
                            $hasError={!!validationErrors.title}
                            value={formData.title}
                            readOnly={isReadOnly}
                            onChange={e => {
                                if (isReadOnly) return;
                                setFormData(prev => ({ ...prev, title: e.target.value }));
                                if (validationErrors.title) {
                                    setValidationErrors(prev => {
                                        const newErrors = { ...prev };
                                        delete newErrors.title;
                                        return newErrors;
                                    });
                                }
                            }}
                        />
                        {validationErrors.title && <S.ErrorText>{validationErrors.title}</S.ErrorText>}
                    </S.TitleContainer>
                }
                rightColumn={
                    <S.RightColumnWrapper>
                        <ContentPreview
                            id="npmContentPreview"
                            content={getSelectedContent()}
                            isDragOver={isDragOver}
                            onRemove={handleRemoveContent}
                            onOpenDrawer={() => onOpenDrawer(true)}
                            onClickDetail={(item) => setDetailModal({ isOpen: true, item })}
                            onDrop={() => {}}
                            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        />
                        {validationErrors.content && (
                            <S.ErrorText style={{ textAlign: 'center', display: 'block', marginTop: '8px' }}>
                                {validationErrors.content}
                            </S.ErrorText>
                        )}
                    </S.RightColumnWrapper>
                }
                footerLeft={
                    <S.DraftBtn
                        onClick={handleSaveDraft}
                        disabled={isSubmitting || isReadOnly || !formData.contentId}
                    >
                        Save as Draft
                    </S.DraftBtn>
                }
                footerRight={
                    <S.ScheduleBtn
                        onClick={handleSchedule}
                        disabled={isSubmitting || isReadOnly || !isFormValid}
                    >
                        {isSubmitting ? 'Processing...' : (isReadOnly ? 'View Only' : (formData.calendarItemId ? 'Update' : 'Schedule'))}
                    </S.ScheduleBtn>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {/* Platforms Section */}
                    <S.Section>
                        <S.SectionIcon>📱</S.SectionIcon>
                        <S.SectionContent>
                            <S.Label>Platforms</S.Label>
                            <S.PlatformsList>
                                {(['instagram', 'facebook', 'youtube', 'tiktok'] as SocialPlatform[]).map(platform => {
                                    const config = formData.platforms[platform as keyof typeof formData.platforms];
                                    if (!config) return null;
                                    return (
                                        <S.PlatformSection 
                                            key={platform} 
                                            $isExpanded={expandedPlatform === platform}
                                            $color={getPlatformColor(platform)}
                                            $checked={!!config.enabled}
                                        >
                                            <S.PlatformHeader 
                                                $checked={!!config.enabled}
                                                $color={getPlatformColor(platform)}
                                                onClick={() => setExpandedPlatform(expandedPlatform === platform ? null : platform)}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <S.PlatformCheckbox
                                                        $checked={!!config.enabled}
                                                        $color={getPlatformColor(platform)}
                                                        onClick={(e) => togglePlatform(platform, e)}
                                                    >
                                                        {config.enabled && <span>✓</span>}
                                                    </S.PlatformCheckbox>
                                                    <img src={getPlatformIconPath(platform)} alt={platform} style={{ width: 20, height: 20 }} />
                                                    <S.PlatformName style={{ marginLeft: '12px' }}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</S.PlatformName>
                                                </div>
                                                <S.ExpandIcon $isExpanded={expandedPlatform === platform}>▾</S.ExpandIcon>
                                            </S.PlatformHeader>

                                            {expandedPlatform === platform && (
                                                <S.PlatformBody>
                                                    {platform === 'instagram' && (
                                                        <>
                                                            <S.Field>
                                                                <S.FieldLabel>Caption</S.FieldLabel>
                                                                <HashtagTextarea
                                                                    value={(config as any).caption || ''}
                                                                    onChange={(val) => updatePlatformConfig(platform, { caption: val })}
                                                                    placeholder="Write your Instagram caption..."
                                                                    minHeight="80px"
                                                                />
                                                            </S.Field>
                                                            <S.Field>
                                                                <ToggleRow
                                                                    label="Share to Feed"
                                                                    checked={!!(config as any).shareToFeed}
                                                                    onChange={(val) => updatePlatformConfig(platform, { shareToFeed: val })}
                                                                />
                                                            </S.Field>
                                                        </>
                                                    )}
                                                    {platform === 'facebook' && (
                                                        <S.Field>
                                                            <S.FieldLabel>Post text</S.FieldLabel>
                                                            <HashtagTextarea
                                                                value={(config as any).postText || ''}
                                                                onChange={(val) => updatePlatformConfig(platform, { postText: val })}
                                                                placeholder="Write your Facebook post..."
                                                                minHeight="80px"
                                                            />
                                                        </S.Field>
                                                    )}
                                                    {platform === 'youtube' && (
                                                        <>
                                                            <S.Field>
                                                                <S.FieldLabel>Video Title</S.FieldLabel>
                                                                <S.FieldInput
                                                                    value={(config as any).title || ''}
                                                                    onChange={(e) => updatePlatformConfig(platform, { title: e.target.value })}
                                                                    placeholder="YouTube video title"
                                                                />
                                                            </S.Field>
                                                            <S.Field>
                                                                <S.FieldLabel>Description</S.FieldLabel>
                                                                <HashtagTextarea
                                                                    value={(config as any).description || ''}
                                                                    onChange={(val) => updatePlatformConfig(platform, { description: val })}
                                                                    placeholder="Video description..."
                                                                    minHeight="80px"
                                                                />
                                                            </S.Field>
                                                        </>
                                                    )}
                                                    {platform === 'tiktok' && (
                                                        <S.Field>
                                                            <S.FieldLabel>Caption</S.FieldLabel>
                                                            <HashtagTextarea
                                                                value={(config as any).caption || ''}
                                                                onChange={(val) => updatePlatformConfig(platform, { caption: val })}
                                                                placeholder="Write your TikTok caption..."
                                                                minHeight="80px"
                                                            />
                                                        </S.Field>
                                                    )}
                                                </S.PlatformBody>
                                            )}
                                        </S.PlatformSection>
                                    );
                                })}
                            </S.PlatformsList>
                            {validationErrors.platform && <S.ErrorText>{validationErrors.platform}</S.ErrorText>}
                        </S.SectionContent>
                    </S.Section>

                    {/* Schedule Section */}
                    <S.Section>
                        <S.SectionIcon>📅</S.SectionIcon>
                        <S.SectionContent>
                            <S.Label>Schedule At</S.Label>
                            <div className="chip-row-container" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                <div style={{ position: 'relative' }}>
                                    <ChipButton minWidth="140px" onClick={() => { closeAllPickers(); setShowDatePicker(true); }}>
                                        <span>{formData.date ? formData.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date'}</span><ChipArrow />
                                    </ChipButton>
                                    <DatePicker selectedDate={formData.date} onChange={handleDateChange} minDate={new Date()} show={showDatePicker} onClose={() => setShowDatePicker(false)} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <ChipButton minWidth="80px" onClick={() => { closeAllPickers(); setShowTimePicker(true); }}>
                                        <span>{formData.time}</span><ChipArrow />
                                    </ChipButton>
                                    <TimePicker selectedTime={formData.time} onChange={handleTimeChange} show={showTimePicker} onClose={() => setShowTimePicker(false)} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <ChipButton minWidth="90px" onClick={() => { closeAllPickers(); setShowTimezoneSelector(true); }}>
                                        <span style={{ display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formData.timezone ? getTimezoneLabel(formData.timezone) : 'TZ'}</span><ChipArrow />
                                    </ChipButton>
                                    <TimezoneSelector selectedTimezone={formData.timezone || 'America/New_York'} onSelect={(tz) => {
                                        setFormData(prev => ({ ...prev, timezone: tz }));
                                        setShowTimezoneSelector(false);
                                    }} show={showTimezoneSelector} onClose={() => setShowTimezoneSelector(false)} />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <ChipButton minWidth="100%" maxWidth="100%" onClick={() => { closeAllPickers(); setShowRepeatSelector(true); }}>
                                        <span>{formData.repeat.label}</span><ChipArrow />
                                    </ChipButton>
                                    <RepeatSelector repeat={formData.repeat} onChange={(repeat: RepeatOption) => {
                                        setFormData(prev => ({ ...prev, repeat }));
                                        setShowRepeatSelector(false);
                                    }} baseDate={formData.date} show={showRepeatSelector} onClose={() => setShowRepeatSelector(false)} />
                                </div>
                            </div>
                        </S.SectionContent>
                    </S.Section>
                </div>
            </ScheduleModalLayout>

            <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Post" message="Are you sure you want to delete this post? This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />
            <RecurringActionDialog isOpen={showRecurringDialog} mode={recurringDialogMode} onConfirm={handleRecurringConfirm} onCancel={() => setShowRecurringDialog(false)} />
            <ContentDetailModal
                isOpen={detailModal.isOpen}
                item={detailModal.item}
                onClose={() => setDetailModal({ isOpen: false, item: null })}
                onRename={(newName: string) => {
                    setFormData(prev => ({ ...prev, contentTitle: newName }));
                    setDetailModal(prev => ({ ...prev, item: prev.item ? { ...prev.item, title: newName } : null }));
                }}
                onDelete={() => {
                    setFormData(prev => ({ ...prev, contentId: '', contentTitle: '', contentThumbnail: '' }));
                    setDetailModal({ isOpen: false, item: null });
                }}
                onToggleFavorite={() => {
                    setDetailModal(prev => ({ ...prev, item: prev.item ? { ...prev.item, favorite: !prev.item.favorite } : null }));
                }}
            />
        </S.ModalWrapper>
    );
};

export default NewPostModal;