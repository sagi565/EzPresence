import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import SectionContainer from '../SectionContainer/SectionContainer';
import ChipButton from '../ChipButton/ChipButton';
import ChipArrow from '../ChipArrow/ChipArrow';
import DatePicker from '../DatePicker/DatePicker';
import TimePicker from '../TimePicker/TimePicker';
import RepeatSelector from '../RepeatSelector/RepeatSelector';
import { TIMEZONES } from '../TimezoneSelector/TimezoneSelector';
import { Brand } from '@/models/Brand';
import { sharedStyles } from './styles';

export interface ScheduleDateTimeSectionProps {
    formData: any;
    setFormData: Dispatch<SetStateAction<any>>;
    showDatePicker: boolean;
    setShowDatePicker: Dispatch<SetStateAction<boolean>>;
    showTimePicker: boolean;
    setShowTimePicker: Dispatch<SetStateAction<boolean>>;
    showTimezoneInfo: boolean;
    setShowTimezoneInfo: Dispatch<SetStateAction<boolean>>;
    showRepeatSelector: boolean;
    setShowRepeatSelector: Dispatch<SetStateAction<boolean>>;
    closeAllPickers: () => void;
    handleDateChange: (date: Date) => void;
    handleTimeChange: (time: string) => void;
    currentBrand: Brand | null;
    isDarkMode: boolean;
    isMobileLayout?: boolean;
}

export const ScheduleDateTimeSection: React.FC<ScheduleDateTimeSectionProps> = ({
    formData,
    setFormData,
    showDatePicker,
    setShowDatePicker,
    showTimePicker,
    setShowTimePicker,
    showTimezoneInfo,
    setShowTimezoneInfo,
    showRepeatSelector,
    setShowRepeatSelector,
    closeAllPickers,
    handleDateChange,
    handleTimeChange,
    currentBrand,
    isDarkMode
}) => {
    return (
        <SectionContainer icon="🕐" className="shared-date-section">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className="chip-row-container" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', alignItems: 'center' }}>
                    <div className="date-wrapper" style={{ position: 'relative', flexShrink: 0 }}>
                        <ChipButton className="chip-button" minWidth="148px" onClick={() => { if (showDatePicker) { closeAllPickers(); } else { closeAllPickers(); setShowDatePicker(true); } }}>
                            <span>{formData.date ? formData.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Date'}</span><ChipArrow />
                        </ChipButton>
                        <DatePicker selectedDate={formData.date} onChange={handleDateChange} minDate={new Date()} show={showDatePicker} onClose={() => setShowDatePicker(false)} />
                    </div>
                    <div className="time-tz-container" style={{ display: 'flex', gap: '8px', flex: 1 }}>
                        <div className="time-wrapper" style={{ position: 'relative', flexShrink: 0 }}>
                            <ChipButton className="chip-button" minWidth="88px" onClick={() => { if (showTimePicker) { closeAllPickers(); } else { closeAllPickers(); setShowTimePicker(true); } }}>
                                <span>{formData.time}</span><ChipArrow />
                            </ChipButton>
                            <TimePicker selectedTime={formData.time} onChange={handleTimeChange} show={showTimePicker} onClose={() => setShowTimePicker(false)} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flex: 1 }}>
                            <span style={{
                                ...sharedStyles.tzLabelStyle,
                                color: isDarkMode ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.45)'
                            }}>
                                {(() => { const tz = TIMEZONES.find(t => t.value === (formData.timezone || 'America/New_York')); return tz ? `${tz.flag} ${tz.label}` : (formData.timezone || 'Timezone'); })()}
                            </span>
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <span 
                                    style={{
                                        ...sharedStyles.tzIconStyle,
                                        background: isDarkMode ? 'rgba(255,255,255,.1)' : 'rgba(155,93,229,.12)',
                                        color: isDarkMode ? 'rgba(255,255,255,0.5)' : '#7c3aed'
                                    }} 
                                    onClick={(e) => { e.stopPropagation(); setShowTimezoneInfo(prev => !prev); }}
                                >
                                    i
                                </span>
                                {showTimezoneInfo && (
                                    <div className="timezone-info" style={{
                                        ...sharedStyles.tzInfoPopupStyle,
                                        background: isDarkMode ? '#2a2a3e' : '#ffffff',
                                        color: isDarkMode ? '#e5e7eb' : '#374151',
                                        boxShadow: isDarkMode ? '0 8px 24px rgba(0,0,0,.5)' : '0 8px 24px rgba(0,0,0,.12)',
                                        border: isDarkMode ? '1px solid rgba(255,255,255,.08)' : '1px solid #e5e7eb'
                                    }}>
                                        <Link
                                            to={`/edit-brand/${currentBrand?.id || ''}`}
                                            style={{ color: isDarkMode ? '#d1d5db' : '#4b5563', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500 }}
                                            onClick={() => setShowTimezoneInfo(false)}
                                        >
                                            Change in Brand Settings
                                            <span style={{ color: '#9b5de5', fontWeight: 600 }}>→</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="chip-row-container repeat-container" style={{ display: 'flex', flexWrap: 'nowrap', gap: '8px', alignItems: 'center' }}>
                    <div className="repeat-wrapper" style={{ position: 'relative', flex: 1, minWidth: 0 }}>
                        <ChipButton className="chip-button" minWidth="100%" style={{ width: '100%', boxSizing: 'border-box' }} onClick={() => { if (showRepeatSelector) { closeAllPickers(); } else { closeAllPickers(); setShowRepeatSelector(true); } }}>
                            <span>{formData.repeat.label}</span><ChipArrow />
                        </ChipButton>
                        <RepeatSelector selectedRepeat={formData.repeat} onChange={(repeat) => { setFormData({ ...formData, repeat }); setShowRepeatSelector(false); }} baseDate={formData.date} show={showRepeatSelector} onClose={() => setShowRepeatSelector(false)} />
                    </div>
                </div>
            </div>
        </SectionContainer>
    );
};
