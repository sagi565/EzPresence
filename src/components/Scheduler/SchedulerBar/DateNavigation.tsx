import React, { useState, useRef, useEffect } from 'react';
import CreatePostButton from './CreatePostButton';
import MiniCalendar from './MiniCalendar';
import {
  DateNavContainer,
  DateLeft,
  DateControls,
  NavArrowBtn,
  MonthYearDisplayContainer,
  ViewToggle,
  ViewBtn,
  TooltipDesc
} from './styles';

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
    <DateNavContainer>
      <DateLeft>
        <CreatePostButton
          onCreateStory={onCreateStory}
          onCreatePost={onCreatePost}
        />
      </DateLeft>

      <DateControls>
        <NavArrowBtn
          $isHovered={hoveredArrow === 'prev'}
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
            <TooltipDesc>{getPrevTooltip()}</TooltipDesc>
          )}
        </NavArrowBtn>

        <MonthYearDisplayContainer
          ref={monthDisplayRef}
          $isHovered={hoveredMonth}
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
        </MonthYearDisplayContainer>

        <NavArrowBtn
          $isHovered={hoveredArrow === 'next'}
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
            <TooltipDesc>{getNextTooltip()}</TooltipDesc>
          )}
        </NavArrowBtn>
      </DateControls>

      <ViewToggle>
        <ViewBtn
          $isActive={currentView === 'month'}
          onClick={() => handleViewChange('month')}
          onMouseEnter={() => setHoveredView('month')}
          onMouseLeave={() => setHoveredView(null)}
        >
          📅
          {hoveredView === 'month' && (
            <TooltipDesc>month view</TooltipDesc>
          )}
        </ViewBtn>
        <ViewBtn
          $isActive={currentView === '4days'}
          onClick={() => handleViewChange('4days')}
          onMouseEnter={() => setHoveredView('4days')}
          onMouseLeave={() => setHoveredView(null)}
        >
          📋
          {hoveredView === '4days' && (
            <TooltipDesc>4-day view</TooltipDesc>
          )}
        </ViewBtn>
      </ViewToggle>
    </DateNavContainer>
  );
};

export default DateNavigation;