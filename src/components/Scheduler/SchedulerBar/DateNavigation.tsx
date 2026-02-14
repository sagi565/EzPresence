import React, { useState, useRef, useEffect } from 'react';
import CreatePostButton from './CreatePostButton';
import MiniCalendar from './MiniCalendar';
import { styles } from './styles';

interface DateNavigationProps {
  currentMonth: number;
  currentYear: number;
  currentDay?: number;
  viewMode: 'month' | '4days';
  onMonthChange: (direction: number) => void;
  onDayChange?: (direction: number) => void;
  onDateSelect: (date: Date) => void;
  onViewChange: (view: 'month' | '4days') => void;
  onCreateStory?: () => void;
  onCreatePost?: () => void;
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
  onCreateStory,
  onCreatePost,
}) => {
  const [showMiniCalendar, setShowMiniCalendar] = useState(false);
  const [currentView, setCurrentView] = useState<'month' | '4days'>(viewMode);
  const [hoveredArrow, setHoveredArrow] = useState<'prev' | 'next' | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState(false);
  const [hoveredView, setHoveredView] = useState<'month' | '4days' | null>(null);
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

  const handleViewChange = (view: 'month' | '4days') => {
    setCurrentView(view);
    onViewChange(view);
  };

  const toggleMiniCalendar = () => {
    setShowMiniCalendar(!showMiniCalendar);
  };

  const handleNavigation = (direction: number) => {
    if (currentView === '4days' && onDayChange) {
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


  const displayText = currentView === '4days'
    ? `${MONTH_NAMES[currentMonth]} ${currentYear}`
    : `${MONTH_NAMES[currentMonth]} ${currentYear}`;

  const getPrevTooltip = () => {
    return currentView === '4days' ? 'Previous 4 days' : 'Previous month';
  };

  const getNextTooltip = () => {
    return currentView === '4days' ? 'Next 4 days' : 'Next month';
  };

  return (
    <div style={styles.dateNav}>
      <div style={styles.dateLeft}>
        <CreatePostButton
          onCreateStory={onCreateStory}
          onCreatePost={onCreatePost}
        />
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
            <div style={styles.tooltip}>month view</div>
          )}
        </button>
        <button
          style={{
            ...styles.viewBtn,
            ...(currentView === '4days' ? styles.viewBtnActive : {}),
          }}
          onClick={() => handleViewChange('4days')}
          onMouseEnter={() => setHoveredView('4days')}
          onMouseLeave={() => setHoveredView(null)}
        >
          📋
          {hoveredView === '4days' && (
            <div style={styles.tooltip}>4-day view</div>
          )}
        </button>
      </div>
    </div>
  );
};

export default DateNavigation;