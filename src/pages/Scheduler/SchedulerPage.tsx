import React, { useState } from 'react';
import { useBrands } from '@hooks/useBrands';
import { useSchedules } from '@hooks/useSchedules';
import { useMediaContents } from '@hooks/useMediaContents';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import SchedulerBar from '@components/Scheduler/SchedulerBar/DateNavigation';
import CalendarGrid from '@components/Scheduler/Calendar/GridView/CalendarGrid';
import FourDaysView from '@components/Scheduler/Calendar/FourDaysView/FourDaysView';
import ContentDrawer from '@components/Scheduler/ContentDrawer/ContentDrawer';
import { styles } from './styles';

const SchedulerPage: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentDay, setCurrentDay] = useState(today.getDate());
  const [viewMode, setViewMode] = useState<'month' | '4days'>('month');

  const { brands, currentBrand, switchBrand, loading: brandsLoading, error: brandsError } = useBrands();
  
  // Use useSchedules instead of usePosts
  const { 
    posts, 
    loading: schedulesLoading, 
    error: schedulesError 
  } = useSchedules(currentBrand?.id || '');
  
  // Use useMediaContents instead of useContent
  const { 
    content, 
    loading: contentLoading, 
    error: contentError 
  } = useMediaContents(currentBrand?.id || '');

  const handleMonthChange = (direction: number) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleDayChange = (direction: number) => {
    const newDate = new Date(currentYear, currentMonth, currentDay + direction);
    setCurrentDay(newDate.getDate());
    setCurrentMonth(newDate.getMonth());
    setCurrentYear(newDate.getFullYear());
  };

  const handleDateSelect = (date: Date) => {
    setCurrentDay(date.getDate());
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  };

  const handleViewChange = (view: 'month' | '4days') => {
    setViewMode(view);
  };

  const handleDrop = (date: Date, contentId: string) => {
    alert(`Opening New Post modal with content "${contentId}" for ${date.toDateString()}`);
  };

  const handleFourDaysViewDrop = (date: Date, time: string, contentId: string) => {
    alert(`Opening New Post modal with content "${contentId}" for ${date.toDateString()} at ${time}`);
  };

  // Show loading state
  if (brandsLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading your brands...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (brandsError) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Failed to Load</h2>
          <p style={styles.errorText}>{brandsError}</p>
          <button style={styles.retryButton} onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show message if no brand selected
  if (!currentBrand) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>No brand selected</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />
      <div style={styles.schedulerContainer}>
        <SchedulerBar
          currentMonth={currentMonth}
          currentYear={currentYear}
          currentDay={currentDay}
          viewMode={viewMode}
          onMonthChange={handleMonthChange}
          onDayChange={handleDayChange}
          onDateSelect={handleDateSelect}
          onViewChange={handleViewChange}
        />
        
        {schedulesLoading ? (
          <div style={styles.calendarLoadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading schedules...</p>
          </div>
        ) : schedulesError ? (
          <div style={styles.calendarErrorContainer}>
            <p style={styles.errorText}>{schedulesError}</p>
          </div>
        ) : viewMode === 'month' ? (
          <CalendarGrid 
            currentYear={currentYear} 
            currentMonth={currentMonth} 
            posts={posts} 
            today={today} 
            onDrop={handleDrop} 
          />
        ) : (
          <FourDaysView 
            currentYear={currentYear} 
            currentMonth={currentMonth} 
            currentDay={currentDay} 
            posts={posts} 
            onDayChange={handleDayChange} 
            onDrop={handleFourDaysViewDrop} 
          />
        )}
      </div>
      <ContentDrawer content={content} brandId={currentBrand.id} />
    </div>
  );
};

export default SchedulerPage;