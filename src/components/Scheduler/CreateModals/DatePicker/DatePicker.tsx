import React, { useState, useEffect } from 'react';
import * as S from './styles';

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

        // Normalize minDate to start of day for fair comparison
        if (minDate) {
            const minDateStart = new Date(minDate);
            minDateStart.setHours(0, 0, 0, 0);
            if (newDate < minDateStart) return;
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

        // Normalize minDate for rendering disabled state
        const minDateStart = minDate ? new Date(minDate) : null;
        if (minDateStart) minDateStart.setHours(0, 0, 0, 0);

        const days: JSX.Element[] = [];

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            days.push(
                <S.Day
                    key={`prev-${day}`}
                    $isOtherMonth
                    disabled
                >
                    {day}
                </S.Day>
            );
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(viewYear, viewMonth, day);
            date.setHours(0, 0, 0, 0);

            const isToday = date.getTime() === today.getTime();
            const isSelected = date.getTime() === selectedDateNormalized.getTime();
            const isPast = minDateStart && date < minDateStart;

            days.push(
                <S.Day
                    key={`current-${day}`}
                    $isToday={isToday}
                    $isSelected={isSelected}
                    type="button"
                    onMouseDown={(e: React.MouseEvent) => {
                        e.preventDefault(); // Prevent focus loss/blur
                        handleDayClick(day);
                    }}
                    disabled={!!isPast}
                >
                    {day}
                </S.Day>
            );
        }

        return days;
    };

    return (
        <S.Container onClick={(e) => e.stopPropagation()}>
            <S.Header>
                <S.Arrow onClick={() => navigate(-1)}>
                    ‹
                </S.Arrow>
                <S.Title>
                    {monthNames[viewMonth]} {viewYear}
                </S.Title>
                <S.Arrow onClick={() => navigate(1)}>
                    ›
                </S.Arrow>
            </S.Header>

            <S.Grid>
                {dayNames.map((name) => (
                    <S.DayHeader key={name}>
                        {name}
                    </S.DayHeader>
                ))}
                {renderCalendar()}
            </S.Grid>
        </S.Container>
    );
};

export default DatePicker;
