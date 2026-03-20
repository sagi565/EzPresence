import React, { useState, useEffect } from 'react';
import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import TimezoneSelector from '../TimezoneSelector/TimezoneSelector';
import RepeatSelector from '../RepeatSelector/RepeatSelector';
import ContentPreview from '../ContentPreview/ContentPreview';
import ChipButton from '../ChipButton/ChipButton';
import ChipArrow from '../ChipArrow/ChipArrow';
import ContentDetailModal from '../../../Content/ContentDetailModal/ContentDetailModal';
import {
    Platform,
    MediaType,
} from '@/models/Post';
import { getPlatformIconPath } from '@/models/Platform';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@/hooks/useSchedules';
import * as S from './styles';
import ScheduleModalLayout from '../ScheduleModalLayout/ScheduleModalLayout';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import RecurringActionDialog from '../RecurringActionDialog/RecurringActionDialog';
import { ScheduleFormData, RepeatOption, DEFAULT_REPEAT_OPTION } from '@/models/ScheduleFormData';

interface NewStoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Partial<ScheduleFormData>;
    onOpenDrawer: (open: boolean) => void;
    selectedContent?: any;
    onSave?: (data: ScheduleFormData) => Promise<void>;
}

const NewStoryModal: React.FC<NewStoryModalProps> = ({
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
        type: 'story',
        date: new Date(),
        time: '12:00 PM',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        repeat: DEFAULT_REPEAT_OPTION,
        platforms: {
            instagram: { enabled: true, caption: '', shareToFeed: true },
            facebook: { enabled: false, postText: '' },
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

    const togglePlatform = (platform: 'instagram' | 'facebook') => {
        if (isReadOnly) return;
        setFormData(prev => {
            const newPlatforms = { ...prev.platforms };
            const config = newPlatforms[platform];
            if (config) {
                config.enabled = !config.enabled;
            }
            return { ...prev, platforms: newPlatforms };
        });
        if (validationErrors.platform) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.platform;
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.contentId) errors.content = 'Media is required';

        const hasEnabledPlatform = formData.platforms.instagram?.enabled || formData.platforms.facebook?.enabled;
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
                media: 'video' as MediaType,
                status: 'draft',
                contentUuids: [formData.contentId || ''],
                type: 'Story' as const,
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
                media: 'video' as MediaType,
                status: 'scheduled',
                contentUuids: [formData.contentId || ''],
                type: 'Story' as const,
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
            console.error('Failed to schedule story:', error);
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
            type: 'video' as const,
            mediaType: 'video' as const
        };
    };

    const isFormValid = formData.title.trim() && formData.contentId && (formData.platforms.instagram?.enabled || formData.platforms.facebook?.enabled);

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
                icon="📸"
                height="620px"
                scrollableBody={true}
                beforeBody={
                    <S.TitleContainer>
                        <S.TitleInput
                            className="nsm-title-input"
                            type="text"
                            placeholder={formData.calendarItemId ? (isReadOnly ? "View story" : "Edit story") : "New story"}
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
                            id="nsmContentPreview"
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
                            <S.PlatformRow>
                                <S.PlatformBtn
                                    $isSelected={!!formData.platforms.instagram?.enabled}
                                    $color="#E1306C"
                                    onClick={() => togglePlatform('instagram')}
                                >
                                    <S.PlatformIcon $color="#E1306C">
                                        <img src={getPlatformIconPath('instagram')} alt="" style={{ width: 14, height: 14 }} />
                                    </S.PlatformIcon>
                                    Instagram
                                </S.PlatformBtn>
                                <S.PlatformBtn
                                    $isSelected={!!formData.platforms.facebook?.enabled}
                                    $color="#1877F2"
                                    onClick={() => togglePlatform('facebook')}
                                >
                                    <S.PlatformIcon $color="#1877F2">
                                        <img src={getPlatformIconPath('facebook')} alt="" style={{ width: 14, height: 14 }} />
                                    </S.PlatformIcon>
                                    Facebook
                                </S.PlatformBtn>
                            </S.PlatformRow>
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
                                    <TimezoneSelector selectedTimezone={formData.timezone || 'America/New_York'} onSelect={(tz: string) => {
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

            <ConfirmDialog isOpen={showDeleteConfirm} title="Delete Story" message="Are you sure you want to delete this story? This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setShowDeleteConfirm(false)} />
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

export default NewStoryModal;