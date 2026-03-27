import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CustomRepeatConfig } from '@/models/ScheduleFormData';
import { theme } from '@/theme/theme';
import { styles } from './CustomRepeatStyles';
import DatePicker from '../DatePicker/DatePicker';
import ChipButton from '../ChipButton/ChipButton';
import ChipArrow from '../ChipArrow/ChipArrow';

interface CustomRepeatDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: CustomRepeatConfig, label: string) => void;
    baseDate: Date;
}

const CustomRepeatDialog: React.FC<CustomRepeatDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    baseDate
}) => {
    const [mounted, setMounted] = useState(false);

    const [interval, setIntervalVal] = useState<number>(1);
    const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly' | 'annually'>('weekly');
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([baseDate.getDay()]);
    
    const [endType, setEndType] = useState<'never' | 'on_date' | 'after_occurrences'>('never');
    const [endDate, setEndDate] = useState<Date>(new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000));
    const [endOccurrences, setEndOccurrences] = useState<number>(13);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showFreqDropdown, setShowFreqDropdown] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            setDaysOfWeek([baseDate.getDay()]);
        }
    }, [isOpen, baseDate]);

    if (!isOpen || !mounted) return null;

    const toggleDay = (dayIndex: number) => {
        setDaysOfWeek(prev => {
            if (prev.includes(dayIndex) && prev.length > 1) {
                return prev.filter(d => d !== dayIndex);
            } else if (!prev.includes(dayIndex)) {
                return [...prev, dayIndex].sort();
            }
            return prev;
        });
    };

    const handleSave = () => {
        // Generate a human-readable label
        let label = `Every ${interval > 1 ? interval + ' ' : ''}`;
        if (frequency === 'daily') label += interval > 1 ? 'days' : 'day';
        if (frequency === 'weekly') {
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            label += (interval > 1 ? 'weeks' : 'week') + ` on ${daysOfWeek.map(d => dayNames[d]).join(', ')}`;
        }
        if (frequency === 'monthly') label += interval > 1 ? 'months' : 'month';
        if (frequency === 'annually') label += interval > 1 ? 'years' : 'year';

        if (endType === 'on_date') {
            label += `, until ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else if (endType === 'after_occurrences') {
            label += `, ${endOccurrences} times`;
        }

        const config: CustomRepeatConfig = {
            interval,
            frequency,
            daysOfWeek: frequency === 'weekly' ? daysOfWeek : undefined,
            endType,
            endDate: endType === 'on_date' ? endDate : undefined,
            endOccurrences: endType === 'after_occurrences' ? endOccurrences : undefined
        };

        onSave(config, label);
        onClose();
    };

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return createPortal(
        <div style={styles.overlay} onClick={onClose}>
            <style>
                {`
                    .nsm-btn-cancel:hover { background: rgba(0,0,0,0.05) !important; color: #111 !important; }
                    .nsm-btn-done:hover { filter: contrast(1.15) brightness(1.05); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(155, 93, 229, 0.35) !important; }
                    
                    /* Custom Radio Buttons */
                    .nsm-radio-input { display: none; }
                    .nsm-radio-circle {
                        width: 18px;
                        height: 18px;
                        min-width: 18px;
                        min-height: 18px;
                        box-sizing: border-box;
                        border-radius: 50%;
                        border: 2px solid rgba(var(--color-text-rgb), 0.2);
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        transition: border-color 0.2s;
                        margin-right: 8px;
                        margin-top: 2px;
                    }
                    .nsm-radio-circle::after {
                        content: '';
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background: var(--color-primary, #9b5de5);
                        transform: scale(0);
                        transition: transform 0.2s ease;
                    }
                    .nsm-radio-input:checked + .nsm-radio-circle {
                        border-color: var(--color-primary, #9b5de5);
                    }
                    .nsm-radio-input:checked + .nsm-radio-circle::after {
                        transform: scale(1);
                    }

                    /* Custom Dropdown popup */
                    .nsm-freq-popup {
                        position: absolute;
                        top: calc(100% + 4px);
                        left: 0;
                        right: 0;
                        background: var(--color-surface);
                        border-radius: 8px;
                        box-shadow: 0 4px 16px rgba(0,0,0,0.25);
                        border: 1px solid rgba(var(--color-text-rgb), 0.1);
                        z-index: 100;
                        overflow: hidden;
                    }
                    .nsm-freq-option {
                        padding: 10px 14px;
                        font-size: 14px;
                        color: var(--color-text);
                        cursor: pointer;
                        transition: background 0.15s;
                    }
                    .nsm-freq-option:hover {
                        background: rgba(var(--color-text-rgb), 0.05);
                    }
                    .nsm-freq-option.active {
                        background: rgba(155, 93, 229, 0.08);
                        color: var(--color-primary, #9b5de5);
                        font-weight: 600;
                    }
                `}
            </style>
            <div style={styles.dialog} onClick={e => { e.stopPropagation(); setShowFreqDropdown(false); }}>
                <h3 style={styles.title}>Custom recurrence</h3>

                <div style={styles.row}>
                    <span style={styles.label}>Repeat every</span>
                    <input 
                        type="number" 
                        min="1" 
                        max="99" 
                        value={interval} 
                        onChange={e => setIntervalVal(Math.max(1, parseInt(e.target.value) || 1))}
                        style={styles.inputNumber}
                    />
                    
                    {/* Custom Dropdown Trigger */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        <button 
                            style={styles.select} 
                            onClick={(e) => { e.stopPropagation(); setShowFreqDropdown(p => !p); }}
                        >
                            <span style={{flex: 1, textAlign: 'left'}}>
                                {frequency === 'daily' ? (interval > 1 ? 'days' : 'day') : ''}
                                {frequency === 'weekly' ? (interval > 1 ? 'weeks' : 'week') : ''}
                                {frequency === 'monthly' ? (interval > 1 ? 'months' : 'month') : ''}
                                {frequency === 'annually' ? (interval > 1 ? 'years' : 'year') : ''}
                            </span>
                        </button>
                        
                        {/* Custom Dropdown Popup list */}
                        {showFreqDropdown && (
                            <div className="nsm-freq-popup">
                                {(['daily', 'weekly', 'monthly', 'annually'] as const).map(f => (
                                    <div 
                                        key={f} 
                                        className={`nsm-freq-option ${frequency === f ? 'active' : ''}`}
                                        onClick={() => { setFrequency(f); setShowFreqDropdown(false); }}
                                    >
                                        {f === 'daily' && (interval > 1 ? 'days' : 'day')}
                                        {f === 'weekly' && (interval > 1 ? 'weeks' : 'week')}
                                        {f === 'monthly' && (interval > 1 ? 'months' : 'month')}
                                        {f === 'annually' && (interval > 1 ? 'years' : 'year')}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {frequency === 'weekly' && (
                    <div style={{ ...styles.row, alignItems: 'flex-start' }}>
                        <span style={{ ...styles.label, marginTop: '12px' }}>Repeat on</span>
                        <div style={styles.dayBubbles}>
                            {days.map((day, idx) => {
                                const isSelected = daysOfWeek.includes(idx);
                                return (
                                    <button
                                        key={idx}
                                        style={{
                                            ...styles.dayBubble,
                                            background: isSelected ? theme.colors.primary : 'rgba(var(--color-text-rgb), 0.05)',
                                            color: isSelected ? '#fff' : 'var(--color-text)'
                                        }}
                                        onClick={() => toggleDay(idx)}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div style={styles.endsSection}>
                    <span style={styles.endsLabel}>Ends</span>
                    
                    <div style={styles.radioRow}>
                        <label className="nsm-radio-label" style={{...styles.radioLabel, gap: 0}}>
                            <input 
                                type="radio" 
                                className="nsm-radio-input"
                                checked={endType === 'never'} 
                                onChange={() => setEndType('never')} 
                            />
                            <div className="nsm-radio-circle"></div>
                            Never
                        </label>
                    </div>

                    <div style={styles.radioRow}>
                        <label className="nsm-radio-label" style={{...styles.radioLabel, gap: 0}}>
                            <input 
                                type="radio" 
                                className="nsm-radio-input"
                                checked={endType === 'on_date'} 
                                onChange={() => setEndType('on_date')} 
                            />
                            <div className="nsm-radio-circle"></div>
                            On
                        </label>
                        {endType === 'on_date' && (
                            <div style={{ position: 'relative' }}>
                                <ChipButton small onClick={() => setShowDatePicker(true)}>
                                    <span>{endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <ChipArrow />
                                </ChipButton>
                                <DatePicker 
                                    selectedDate={endDate} 
                                    onChange={d => { setEndDate(d); setShowDatePicker(false); }} 
                                    minDate={baseDate} 
                                    show={showDatePicker} 
                                    onClose={() => setShowDatePicker(false)} 
                                />
                            </div>
                        )}
                    </div>

                    <div style={styles.radioRow}>
                        <label className="nsm-radio-label" style={{...styles.radioLabel, gap: 0}}>
                            <input 
                                type="radio" 
                                className="nsm-radio-input"
                                checked={endType === 'after_occurrences'} 
                                onChange={() => setEndType('after_occurrences')} 
                            />
                            <div className="nsm-radio-circle"></div>
                            After
                        </label>
                        {endType === 'after_occurrences' && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input 
                                    type="number" 
                                    min="1" 
                                    max="999" 
                                    value={endOccurrences} 
                                    onChange={e => setEndOccurrences(Math.max(1, parseInt(e.target.value) || 1))}
                                    style={styles.inputNumber}
                                />
                                <span style={{ fontSize: '14px', color: 'var(--color-muted)' }}>occurrences</span>
                            </div>
                        )}
                    </div>
                </div>

                <div style={styles.actions}>
                    <button className="nsm-btn-cancel" style={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    <button className="nsm-btn-done" style={styles.doneBtn} onClick={handleSave}>Done</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CustomRepeatDialog;
