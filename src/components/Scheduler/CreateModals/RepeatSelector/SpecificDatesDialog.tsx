import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { styles as modalStyles } from './CustomRepeatStyles';

interface SpecificDatesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dates: Date[], label: string) => void;
    baseDate: Date;
}

const styles: Record<string, React.CSSProperties> = {
    ...modalStyles,
    // Calendar specific styles
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 10px 16px',
        borderBottom: '1px solid rgba(var(--color-text-rgb), 0.08)',
        marginBottom: '16px',
    },
    titleText: {
        fontSize: '15px',
        fontWeight: 600,
        color: 'var(--color-text)',
    },
    arrow: {
        background: 'transparent',
        border: 'none',
        fontSize: '20px',
        color: 'var(--color-muted)',
        cursor: 'pointer',
        padding: '0 8px',
        lineHeight: 1,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '4px',
        textAlign: 'center',
    },
    dayHeader: {
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--color-muted)',
        padding: '4px 0',
    },
    day: {
        width: '34px',
        height: '34px',
        margin: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--color-text)',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all .12s',
        padding: 0,
    },
    daySelected: {
        background: 'var(--color-primary)',
        color: '#fff',
        fontWeight: 700,
        boxShadow: '0 2px 8px rgba(155, 93, 229, .25)',
    },
    dayOtherMonth: {
        color: 'var(--color-muted)',
        opacity: 0.4,
        cursor: 'default',
    },
    dayDisabled: {
        color: 'var(--color-muted)',
        opacity: 0.25,
        cursor: 'not-allowed',
        background: 'transparent',
    },
    selectionCount: {
        fontSize: '13px',
        color: 'var(--color-primary)',
        fontWeight: 600,
        marginBottom: '16px',
        textAlign: 'center',
    }
};

const SpecificDatesDialog: React.FC<SpecificDatesDialogProps> = ({
    isOpen,
    onClose,
    onSave,
    baseDate
}) => {
    const [mounted, setMounted] = useState(false);
    
    // Store selected dates as start-of-day timestamps to easily toggle them
    const [selectedTimestamps, setSelectedTimestamps] = useState<number[]>([]);
    
    const [viewMonth, setViewMonth] = useState(baseDate.getMonth());
    const [viewYear, setViewYear] = useState(baseDate.getFullYear());

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen) {
            // Always ensure baseDate is selected when opened fresh
            const baseTime = new Date(baseDate);
            baseTime.setHours(0, 0, 0, 0);
            setSelectedTimestamps([baseTime.getTime()]);
            
            setViewMonth(baseDate.getMonth());
            setViewYear(baseDate.getFullYear());
        }
    }, [isOpen, baseDate]);

    if (!isOpen || !mounted) return null;

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    const navigate = (direction: number) => {
        let newMonth = viewMonth + direction;
        let newYear = viewYear;

        if (newMonth > 11) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 11;
            newYear--;
        }

        setViewMonth(newMonth);
        setViewYear(newYear);
    };

    const toggleDate = (day: number) => {
        const date = new Date(viewYear, viewMonth, day);
        date.setHours(0, 0, 0, 0);
        const timestamp = date.getTime();
        
        setSelectedTimestamps(prev => {
            if (prev.includes(timestamp)) {
                // Don't allow unselecting the very last date, must always have at least 1
                if (prev.length === 1) return prev;
                return prev.filter(t => t !== timestamp);
            } else {
                return [...prev, timestamp].sort();
            }
        });
    };

    const handleSave = () => {
        const dates = selectedTimestamps.map(t => new Date(t));
        
        // Generate label
        let label = '';
        if (dates.length === 1) {
            label = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (dates.length === 2 || dates.length === 3) {
            label = dates.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ');
        } else {
            label = `${dates.length} specific dates`;
        }

        onSave(dates, label);
        onClose();
    };

    const renderCalendar = () => {
        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const minDateStart = new Date();
        minDateStart.setHours(0, 0, 0, 0);

        const days: JSX.Element[] = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            days.push(
                <button key={`prev-${day}`} style={{ ...styles.day, ...styles.dayOtherMonth }} disabled>
                    {day}
                </button>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(viewYear, viewMonth, day);
            date.setHours(0, 0, 0, 0);
            const timestamp = date.getTime();

            const isPast = date < minDateStart;
            const isSelected = selectedTimestamps.includes(timestamp);

            const dayStyle = {
                ...styles.day,
                ...(isSelected ? styles.daySelected : {}),
                ...(isPast ? styles.dayDisabled : {}),
            };

            const dayClass = `nsm-dp-day ${isSelected ? 'selected' : ''}`;

            days.push(
                <button
                    key={`current-${day}`}
                    className={dayClass}
                    style={dayStyle}
                    type="button"
                    onClick={() => {
                        if (!isPast) toggleDate(day);
                    }}
                    disabled={!!isPast}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return createPortal(
        <div style={styles.overlay} onClick={onClose}>
            <style>
                {`
                    .nsm-dp-day:hover:not(:disabled) {
                        background-color: rgba(155, 93, 229, 0.1) !important;
                        font-weight: 600;
                    }
                    .nsm-dp-day.selected:hover {
                        background-color: var(--color-primary, #9b5de5) !important;
                        color: #fff !important;
                    }
                    .nsm-btn-cancel:hover { background: rgba(155, 93, 229, 0.08) !important; color: var(--color-text) !important; }
                    .nsm-btn-done:hover { filter: contrast(1.15) brightness(1.1); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(155, 93, 229, 0.4) !important; }
                `}
            </style>
            <div style={styles.dialog} onClick={e => e.stopPropagation()}>
                <div style={styles.header}>
                    <button style={styles.arrow} onClick={() => navigate(-1)}>‹</button>
                    <span style={styles.titleText}>{monthNames[viewMonth]} {viewYear}</span>
                    <button style={styles.arrow} onClick={() => navigate(1)}>›</button>
                </div>
                
                {selectedTimestamps.length > 0 && (
                    <div style={styles.selectionCount}>
                        {selectedTimestamps.length} date{selectedTimestamps.length > 1 ? 's' : ''} selected
                    </div>
                )}

                <div style={styles.grid}>
                    {dayNames.map(name => (
                        <div key={name} style={styles.dayHeader}>{name}</div>
                    ))}
                    {renderCalendar()}
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

export default SpecificDatesDialog;
