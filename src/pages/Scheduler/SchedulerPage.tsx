import React, { useState } from 'react';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@hooks/useSchedules';
import { useMediaContents } from '@/hooks/contents/useMediaContents';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import SchedulerBar from '@components/Scheduler/SchedulerBar/DateNavigation';
import CalendarGrid from '@components/Scheduler/Calendar/GridView/CalendarGrid';
import FourDaysView from '@components/Scheduler/Calendar/FourDaysView/FourDaysView';
import ContentDrawer from '@components/Scheduler/ContentDrawer/ContentDrawer';
import NewStoryModal from '@components/Scheduler/CreateModals/NewStoryModal';
import NewPostModal from '@components/Scheduler/CreateModals/NewPostModal';
import { StoryFormData } from '@/models/StorySchedule';
import { PostFormData } from '@/models/ScheduleFormData';
import { styles } from './styles';

const SchedulerPage: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentDay, setCurrentDay] = useState(today.getDate());
  const [viewMode, setViewMode] = useState<'month' | '4days'>('month');
  const [showNewStoryModal, setShowNewStoryModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPicking, setIsPicking] = useState(false);

  const { brands, currentBrand, switchBrand, loading: brandsLoading, error: brandsError } = useBrands();

  console.log('🏢 [SchedulerPage] Current brand:', currentBrand?.id, currentBrand?.name);



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

  console.log('📦 [SchedulerPage] Content state:', {
    contentCount: content?.length || 0,
    contentLoading,
    contentError,
    content: content,
  });

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

  // Show loading while auto-selecting brand
  if (!currentBrand) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Setting up your workspace...</p>
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
          onCreateStory={() => setShowNewStoryModal(true)}
          onCreatePost={() => setShowNewPostModal(true)}
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

      <div className={`content-pick-overlay ${isDrawerOpen && isPicking ? 'active' : ''}`} onClick={() => {
        if (isPicking) {
          setIsPicking(false);
          setIsDrawerOpen(false); // Close drawer on cancel
        }
      }} />

      <ContentDrawer
        brandId={currentBrand.id}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setIsPicking(false);
        }}
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        isPicking={isPicking}
      />

      <NewStoryModal
        isOpen={showNewStoryModal}
        onClose={() => {
          setShowNewStoryModal(false);
          setIsPicking(false);
        }}
        brandId={currentBrand?.id || ''}
        onSchedule={(formData: StoryFormData) => {
          console.log('📅 Scheduling story:', formData);
          alert('Story scheduled! (Mock implementation)');
          setShowNewStoryModal(false);
        }}
        onSaveDraft={(formData: StoryFormData) => {
          console.log('💾 Saving story draft:', formData);
          alert('Story saved as draft! (Mock implementation)');
          setShowNewStoryModal(false);
        }}
        content={content || []}
        onOpenDrawer={(pickingMode?: boolean) => {
          setIsDrawerOpen(true);
          if (pickingMode) setIsPicking(true);
        }}
        onCancelPicking={() => setIsPicking(false)}
      />

      <NewPostModal
        isOpen={showNewPostModal}
        onClose={() => {
          setShowNewPostModal(false);
          setIsPicking(false);
        }}
        brandId={currentBrand?.id || ''}
        onSchedule={(formData: PostFormData) => {
          console.log('📅 Scheduling post:', formData);
          alert('Post scheduled! (Mock implementation)');
          setShowNewPostModal(false);
        }}
        onSaveDraft={(formData: PostFormData) => {
          console.log('💾 Saving post draft:', formData);
          alert('Post saved as draft! (Mock implementation)');
          setShowNewPostModal(false);
        }}
        content={content || []}
        onOpenDrawer={(pickingMode?: boolean) => {
          setIsDrawerOpen(true);
          if (pickingMode) setIsPicking(true);
        }}
        onCancelPicking={() => setIsPicking(false)}
      />
    </div>
  );
};

export default SchedulerPage;