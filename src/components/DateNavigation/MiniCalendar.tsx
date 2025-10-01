import React, { useState } from 'react';
import { styles } from './styles';
import { theme } from '@theme/theme';

interface MiniCalendarProps {
  currentMonth: number;
  currentYear: number;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  currentMonth: initialMonth,
  currentYear: initialYear,
  onClose,
  onDateSelect,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [viewYear, setViewYear] = useState(initialYear);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days = [];

  const handleMonthChange = (e: React.MouseEvent, direction: number) => {
    e.stopPropagation(); // Prevent closing the calendar
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

  const handleDayClick = (e: React.MouseEvent, day: number) => {
    e.stopPropagation(); // Prevent closing when clicking day
    const selectedDate = new Date(viewYear, viewMonth, day);
    onDateSelect(selectedDate);
    onClose();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewMonth === today.getMonth() &&
      viewYear === today.getFullYear()
    );
  };

  // Leading blanks
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }

  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    const isTodayDay = isToday(day);
    const isHovered = hoveredDay === day;
    
    const dayStyle = {
      ...styles.miniCalDay,
      ...(isTodayDay ? styles.miniCalDayToday : {}),
      ...(isHovered && !isTodayDay ? {
        background: theme.colors.blue,
        color: 'white',
      } : {}),
    };

    days.push(
      <div
        key={day}
        style={dayStyle}
        onClick={(e) => handleDayClick(e, day)}
        onMouseEnter={() => setHoveredDay(day)}
        onMouseLeave={() => setHoveredDay(null)}
      >
        {day}
      </div>
    );
  }

  return (
    <div style={styles.miniCalendar} onClick={(e) => e.stopPropagation()}>
      <div style={styles.miniCalHeader}>
        <button
          style={styles.miniCalNavBtn}
          onClick={(e) => handleMonthChange(e, -1)}
        >
          ‹
        </button>
        <div style={styles.miniCalMonthYear}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button
          style={styles.miniCalNavBtn}
          onClick={(e) => handleMonthChange(e, 1)}
        >
          ›
        </button>
      </div>
      <div style={styles.miniCalGrid}>
        {dayHeaders.map((header, idx) => (
          <div key={idx} style={styles.miniCalDayHeader}>
            {header}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

export default MiniCalendar;