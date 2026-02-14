import React, { useState, useEffect } from 'react';
import { styles } from './styles';

interface DatePickerProps {
    selectedDate: Date;
    onChange: (date: Date) => void;
    minDate?: Date;
    show: boolean;
    onClose: () => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
    selectedDate,
    onChange,
    minDate,
    show,
    onClose,
}) => {
    const [viewMonth, setViewMonth] = useState(selectedDate.getMonth());
    const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

    useEffect(() => {
        if (show) {
            setViewMonth(selectedDate.getMonth());
            setViewYear(selectedDate.getFullYear());
        }
    }, [show, selectedDate]);

    if (!show) return null;

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

    const handleDayClick = (day: number) => {
        const newDate = new Date(viewYear, viewMonth, day);

        // Check if date is in the past
        if (minDate && newDate < minDate) {
            return;
        }

        onChange(newDate);
        onClose();
    };

    const renderCalendar = () => {
        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedDateNormalized = new Date(selectedDate);
        selectedDateNormalized.setHours(0, 0, 0, 0);

        const days: JSX.Element[] = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            days.push(
                <button
                    key={`prev-${day}`}
                    style={styles.dayOtherMonth}
                    disabled
                >
                    {day}
                </button>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(viewYear, viewMonth, day);
            date.setHours(0, 0, 0, 0);

            const isToday = date.getTime() === today.getTime();
            const isSelected = date.getTime() === selectedDateNormalized.getTime();
            const isPast = minDate && date < minDate;

            const dayStyle = {
                ...styles.day,
                ...(isToday ? styles.dayToday : {}),
                ...(isSelected ? styles.daySelected : {}),
                ...(isPast ? styles.dayDisabled : {}),
            };

            days.push(
                <button
                    key={`current-${day}`}
                    style={dayStyle}
                    onClick={() => handleDayClick(day)}
                    disabled={isPast}
                >
                    {day}
                </button>
            );
        }

        return days;
    };

    return (
        <div style={styles.container} className="date-picker" onClick={(e) => e.stopPropagation()}>
            <div style={styles.header}>
                <button style={styles.arrow} onClick={() => navigate(-1)}>
                    ‹
                </button>
                <span style={styles.title}>
                    {monthNames[viewMonth]} {viewYear}
                </span>
                <button style={styles.arrow} onClick={() => navigate(1)}>
                    ›
                </button>
            </div>

            <div style={styles.grid}>
                {dayNames.map((name) => (
                    <div key={name} style={styles.dayHeader}>
                        {name}
                    </div>
                ))}
                {renderCalendar()}
            </div>
        </div>
    );
};

export default DatePicker;
