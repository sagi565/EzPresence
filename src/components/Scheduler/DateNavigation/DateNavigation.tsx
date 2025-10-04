import React, { useState, useRef, useEffect } from 'react';
import CreateButton from './CreateButton';
import MiniCalendar from './MiniCalendar';
import { styles } from './styles';
import { theme } from '@theme/theme';

interface DateNavigationProps {
  currentMonth: number;
  currentYear: number;
  currentDay?: number;
  viewMode: 'month' | 'list';
  onMonthChange: (direction: number) => void;
  onDayChange?: (direction: number) => void;
  onDateSelect: (date: Date) => void;
  onViewChange: (view: 'month' | 'list') => void;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DateNavigation: React.FC<DateNavigationProps> = ({
  currentMonth,
  currentYear,
  currentDay,
  viewMode,
  onMonthChange,
  onDayChange,
  onDateSelect,
  onViewChange,
}) => {
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [currentView, setCurrentView] = useState<'month' | 'list'>(viewMode);
  const [hoveredArrow, setHoveredArrow] = useState<'prev' | 'next' | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState(false);
  const [hoveredView, setHoveredView] = useState<'month' | 'list' | null>(null);
  const monthDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentView(viewMode);
  }, [viewMode]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (monthDisplayRef.current && !monthDisplayRef.current.contains(e.target as Node)) {
        setShowMiniCalendar(false);
      }
    };

    if (showMiniCalendar) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showMiniCalendar]);

  const handleViewChange = (view: 'month' | 'list') => {
    setCurrentView(view);
    onViewChange(view);
  };

  const toggleMiniCalendar = () => {
    setShowMiniCalendar(!showMiniCalendar);
  };

  const handleNavigation = (direction: number) => {
    if (currentView === 'list' && onDayChange) {
      onDayChange(direction * 4);
    } else {
      onMonthChange(direction);
    }
  };

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    setShowMiniCalendar(false);
  };

  const arrowStyle = (direction: 'prev' | 'next') => ({
    ...styles.navArrow,
    ...(hoveredArrow === direction ? {
      background: 'rgba(155, 93, 229, 0.05)',
    } : {}),
  });

  const monthStyle = {
    ...styles.monthYearDisplay,
    ...(hoveredMonth ? {
      background: 'rgba(155, 93, 229, 0.05)',
    } : {}),
  };

  const getListViewDateRange = () => {
    if (!currentDay) return '';
    
    const startDate = new Date(currentYear, currentMonth, currentDay);
    const endDate = new Date(currentYear, currentMonth, currentDay + 3);
    
    const formatDate = (date: Date) => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[date.getMonth()]} ${date.getDate()}`;
    };

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${formatDate(startDate)} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
    } else {
      return `${formatDate(startDate)} - ${formatDate(endDate)}, ${endDate.getFullYear()}`;
    }
  };

  const displayText = currentView === 'list' 
    ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
    : `${MONTH_NAMES[currentMonth]} ${currentYear}`;

  const getPrevTooltip = () => {
    return currentView === 'list' ? 'Previous 4 days' : 'Previous month';
  };

  const getNextTooltip = () => {
    return currentView === 'list' ? 'Next 4 days' : 'Next month';
  };

  return (
    <div style={styles.dateNav}>
      <div style={styles.dateLeft}>
        <CreateButton />
      </div>

      <div style={styles.dateControls}>
        <button
          style={{ ...arrowStyle('prev'), position: 'relative' }}
          onClick={() => handleNavigation(-1)}
          onMouseEnter={() => setHoveredArrow('prev')}
          onMouseLeave={() => setHoveredArrow(null)}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
            <path
              d="M7 1L1 7L7 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          {hoveredArrow === 'prev' && (
            <div style={styles.tooltip}>{getPrevTooltip()}</div>
          )}
        </button>

        <div
          ref={monthDisplayRef}
          style={monthStyle}
          onClick={toggleMiniCalendar}
          onMouseEnter={() => setHoveredMonth(true)}
          onMouseLeave={() => setHoveredMonth(false)}
        >
          <span>{displayText}</span>
          <span style={{ fontSize: '12px' }}>▼</span>
          {showMiniCalendar && (
            <MiniCalendar
              currentMonth={currentMonth}
              currentYear={currentYear}
              onClose={() => setShowMiniCalendar(false)}
              onDateSelect={handleDateSelect}
            />
          )}
        </div>

        <button
          style={{ ...arrowStyle('next'), position: 'relative' }}
          onClick={() => handleNavigation(1)}
          onMouseEnter={() => setHoveredArrow('next')}
          onMouseLeave={() => setHoveredArrow(null)}
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="currentColor">
            <path
              d="M1 1L7 7L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          {hoveredArrow === 'next' && (
            <div style={styles.tooltip}>{getNextTooltip()}</div>
          )}
        </button>
      </div>

      <div style={styles.viewToggle}>
        <button
          style={{
            ...styles.viewBtn,
            ...(currentView === 'month' ? styles.viewBtnActive : {}),
          }}
          onClick={() => handleViewChange('month')}
          onMouseEnter={() => setHoveredView('month')}
          onMouseLeave={() => setHoveredView(null)}
        >
          📅
          {hoveredView === 'month' && (
            <div style={styles.tooltip}>Switch to calendar</div>
          )}
        </button>
        <button
          style={{
            ...styles.viewBtn,
            ...(currentView === 'list' ? styles.viewBtnActive : {}),
          }}
          onClick={() => handleViewChange('list')}
          onMouseEnter={() => setHoveredView('list')}
          onMouseLeave={() => setHoveredView(null)}
        >
          📋
          {hoveredView === 'list' && (
            <div style={styles.tooltip}>Switch to list</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default DateNavigation;