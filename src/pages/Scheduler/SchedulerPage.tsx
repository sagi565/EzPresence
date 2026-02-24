import React, { useState, useEffect, useMemo } from 'react';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@hooks/useSchedules';
import { useMediaContents } from '@/hooks/contents/useMediaContents';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import SchedulerBar from '@components/Scheduler/SchedulerBar/DateNavigation';
import CalendarGrid from '@components/Scheduler/Calendar/GridView/CalendarGrid';
import FourDaysView from '@components/Scheduler/Calendar/FourDaysView/FourDaysView';
import ContentDrawer from '@components/Scheduler/ContentDrawer/ContentDrawer';
import NewStoryModal from '@components/Scheduler/CreateModals/NewStoryModal/NewStoryModal';
import NewPostModal from '@components/Scheduler/CreateModals/NewPostModal/NewPostModal';
import DropActionModal from '@components/Scheduler/DropActionModal/DropActionModal';
import { StoryFormData } from '@/models/StorySchedule';
import { PostFormData } from '@/models/ScheduleFormData';
import { styles } from './styles';
import { getDragItem } from '@/utils/dragState';
import { ContentItem } from '@/models/ContentList';

// --- CUSTOM DRAG PREVIEW COMPONENT ---
const DragPreview: React.FC<{ item: any; position: { x: number; y: number } }> = ({ item, position }) => {
  if (!item) return null;

  const thumbnailSrc = item.thumbnail?.startsWith('http') || item.thumbnail?.startsWith('data:')
    ? item.thumbnail
    : item.thumbnail
      ? `data:image/jpeg;base64,${item.thumbnail.replace(/[\n\r\s]/g, '')}`
      : null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '120px',
        height: '160px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        transform: `translate(${position.x - 60}px, ${position.y - 80}px) rotate(-2deg) scale(1.05)`,
        pointerEvents: 'none',
        zIndex: 10000,
        backgroundColor: '#2a2a2a',
        opacity: 0.7,
        cursor: 'grabbing',
      }}
    >
      {thumbnailSrc && (
        <img
          src={thumbnailSrc}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '8px',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
          color: 'white',
          fontSize: '11px',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.title}
      </div>
    </div>
  );
};

const SchedulerPage: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentDay, setCurrentDay] = useState(today.getDate());
  const [viewMode, setViewMode] = useState<'month' | '4days'>('month');
  const [showNewStoryModal, setShowNewStoryModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showDropActionModal, setShowDropActionModal] = useState(false);
  const [dropData, setDropData] = useState<{ date: Date; time?: string; contentId: string } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const [lastPickedContent, setLastPickedContent] = useState<ContentItem | null>(null);

  // --- DRAG PREVIEW STATE ---
  const [dragProgress, setDragProgress] = useState<{ x: number, y: number } | null>(null);
  const [dragItem, setDragItemState] = useState<any>(null);

  const { brands, currentBrand, switchBrand, loading: brandsLoading, error: brandsError } = useBrands();

  // Use useSchedules instead of usePosts
  const {
    posts,
    loading: schedulesLoading,
    error: schedulesError,
    refetchSchedules
  } = useSchedules(currentBrand?.id || '');

  // Use useMediaContents instead of useContent
  const {
    content
  } = useMediaContents(currentBrand?.id || '');

  const contentItems: ContentItem[] = useMemo(() => (content || []).map(c => ({
    id: c.id,
    title: c.title,
    thumbnail: c.thumbnail,
    type: c.mediaType || 'video',
    favorite: c.favorite,
    filePath: c.filePath,
    sizeBytes: c.sizeBytes,
    durationSec: c.durationSec,
    createdAt: c.createdAt,
    mediaType: c.mediaType
  })), [content]);

  // Enrich posts with correct media type from contentItems if it's missing or likely wrong (e.g. 'POST' for a video)
  const enrichedPosts = useMemo(() => {
    return posts.map(post => {
      // Find the associated content item
      const contentId = post.contentUuids?.[0];
      if (contentId) {
        const contentItem = contentItems.find(c => c.id === contentId);
        if (contentItem) {
          return {
            ...post,
            media: (contentItem.mediaType === 'video' || contentItem.type === 'video' ? 'video' : 'image') as any // Post.ts has 'image' | 'video'
          };
        }
      }
      return post;
    });
  }, [posts, contentItems]);

  // --- DRAG EVENT LISTENERS ---
  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      const item = getDragItem();
      if (item) {
        setDragItemState(item);
        setDragProgress({ x: e.clientX, y: e.clientY });
      }
    };

    const handleDragEnd = () => {
      setDragProgress(null);
      setDragItemState(null);
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragend', handleDragEnd);
    window.addEventListener('drop', handleDragEnd);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragend', handleDragEnd);
      window.removeEventListener('drop', handleDragEnd);
    };
  }, []);

  // --- OUTSIDE CLICK LISTENER TO CLOSE DRAWER ---
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      console.log('🕵️ [SchedulerPage] MouseDown detected on:', target.tagName, target.className);

      // Check if click is inside the drawer
      const isInsideDrawer = target.closest('.content-drawer');
      // Check if click is inside a modal
      const isInsideModal = target.closest('.schedule-modal-layout');
      // Check if click is on the handle
      const isInsideHandle = target.closest('.content-drawer-handle');
      // Check if click is on the "Pick Clone" (Direct DOM manipulation item)
      const isInsidePickClone = target.id === 'pickClone' || target.closest('#pickClone');
      // Check if click is on the overlay (to prevent closing when clicking the picking overlay itself)
      const isInsideOverlay = target.id === 'contentPickOverlay';

      if (isInsideDrawer || isInsideModal || isInsideHandle || isInsidePickClone || isInsideOverlay) {
        console.log('✅ [SchedulerPage] Click inside safe area. isInsideDrawer:', !!isInsideDrawer, 'isInsideModal:', !!isInsideModal, 'isInsidePickClone:', !!isInsidePickClone);
        return;
      }

      if (isDrawerOpen) {
        console.log('❌ [SchedulerPage] Click outside detected. Closing drawer.');
        setIsDrawerOpen(false);
        setIsPicking(false);
      }
    };

    if (isDrawerOpen) {
      console.log('👂 [SchedulerPage] Added mousedown listener');
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        console.log('👂 [SchedulerPage] Removed mousedown listener');
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDrawerOpen]);

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
    setDropData({ date, contentId });
    setShowDropActionModal(true);
    setIsDrawerOpen(false);
    setIsPicking(false);
  };

  const handleFourDaysViewDrop = (date: Date, time: string, contentId: string) => {
    setDropData({ date, time, contentId });
    setShowDropActionModal(true);
    setIsDrawerOpen(false);
    setIsPicking(false);
  };

  const handleDropActionSelect = (type: 'post' | 'story' | 'ai') => {
    setShowDropActionModal(false);

    if (type === 'post') {
      setShowNewPostModal(true);
    } else if (type === 'story') {
      setShowNewStoryModal(true);
    } else if (type === 'ai') {
      alert("AI Series creation coming soon!");
    }
  };

  const handlePostClick = (post: any) => {
    console.log('🔍 [handlePostClick] Full post:', post);

    // Resolve contentId: first from contentUuids, then by decoding calendarItemId
    let resolvedContentId = post.contentUuids?.[0];

    if (!resolvedContentId && post.calendarItemId) {
      try {
        // calendarItemId is base64-encoded as "contentId | date"
        const decoded = atob(post.calendarItemId);
        console.log('🔍 [handlePostClick] Decoded calendarItemId:', decoded);
        const parts = decoded.split('|').map((p: string) => p.trim());
        if (parts.length >= 1 && parts[0]) {
          resolvedContentId = parts[0];
        }
      } catch (err) {
        console.warn('Could not decode calendarItemId:', err);
      }
    }

    console.log('🔍 [handlePostClick] resolvedContentId:', resolvedContentId);

    const initialData = {
      date: post.date,
      time: post.time,
      platforms: post.platforms,
      media: post.media,
      title: post.title,
      description: post.description,
      contentId: resolvedContentId,
      scheduleUuid: post.scheduleUuid,
      calendarItemId: post.calendarItemId,
      id: post.id,
      status: post.status
    };

    if (post.type === 'Story') {
      setDropData(initialData as any);
      setShowNewStoryModal(true);
    } else {
      setDropData(initialData as any);
      setShowNewPostModal(true);
    }
  };

  // --- DOUBLE CLICK / SELECTION HANDLER ---
  const handleContentSelect = (selectedContent: ContentItem) => {
    console.log('✅ [SchedulerPage] Content selection received:', selectedContent.title);
    // If a modal is active, we pick the content for it
    if (showNewPostModal || showNewStoryModal) {
      setLastPickedContent(selectedContent);

      setIsPicking(false);
      setIsDrawerOpen(false);
    }
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
            posts={enrichedPosts}
            today={today}
            onDrop={handleDrop}
            onPostClick={handlePostClick}
          />
        ) : (
          <FourDaysView
            currentYear={currentYear}
            currentMonth={currentMonth}
            currentDay={currentDay}
            posts={enrichedPosts}
            onDayChange={handleDayChange}
            onDrop={handleFourDaysViewDrop}
            onPostClick={handlePostClick}
          />
        )}
      </div>

      <div id="contentPickOverlay" className={`content-pick-overlay ${isDrawerOpen && isPicking ? 'active' : ''}`} onClick={() => {
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
        onToggle={() => {
          console.log('🔃 [SchedulerPage] Drawer toggle clicked. New state:', !isDrawerOpen);
          setIsDrawerOpen(!isDrawerOpen);
        }}
        isPicking={isPicking}
        onContentDragStart={() => setIsDrawerOpen(false)}
        onSelect={handleContentSelect}
      />

      <NewStoryModal
        isOpen={showNewStoryModal}
        onClose={() => {
          setShowNewStoryModal(false);
          setIsPicking(false);
          setDropData(null); // Clear drop data on close
        }}
        brandId={currentBrand?.id || ''}
        initialData={dropData || undefined}
        onSchedule={(formData: StoryFormData) => {
          console.log('📅 Story scheduled:', formData);
          setShowNewStoryModal(false);
          setDropData(null);
          refetchSchedules();
        }}
        onSaveDraft={(formData: StoryFormData) => {
          console.log('💾 Saving story draft:', formData);
          refetchSchedules();
        }}
        content={contentItems}
        onOpenDrawer={(pickingMode?: boolean) => {
          console.log('🔓 [SchedulerPage] Opening drawer (Story), pickingMode:', pickingMode);
          setIsDrawerOpen(true);
          if (pickingMode) setIsPicking(true);
          setLastPickedContent(null);
        }}
        onCancelPicking={() => {
          setIsPicking(false);
          setIsDrawerOpen(false);
          setLastPickedContent(null);
        }}
        onContentDrop={() => setIsDrawerOpen(false)}
        lastPickedContent={lastPickedContent}
        status={(dropData as any)?.status}
      />

      <NewPostModal
        isOpen={showNewPostModal}
        onClose={() => {
          setShowNewPostModal(false);
          setIsPicking(false);
          setDropData(null);
        }}
        brandId={currentBrand?.id || ''}
        initialData={dropData || undefined}
        onSchedule={(formData: PostFormData) => {
          console.log('📅 Post scheduled:', formData);
          setShowNewPostModal(false);
          setDropData(null);
          refetchSchedules();
        }}
        onSaveDraft={(formData: PostFormData) => {
          console.log('💾 Saving post draft:', formData);
          refetchSchedules();
        }}
        content={contentItems}
        onOpenDrawer={(pickingMode?: boolean) => {
          console.log('🔓 [SchedulerPage] Opening drawer, pickingMode:', pickingMode);
          setIsDrawerOpen(true);
          if (pickingMode) setIsPicking(true);
          setLastPickedContent(null);
        }}
        onCancelPicking={() => {
          setIsPicking(false);
          setIsDrawerOpen(false);
          setLastPickedContent(null);
        }}
        onContentDrop={() => setIsDrawerOpen(false)}
        lastPickedContent={lastPickedContent}
      />

      <DropActionModal
        isOpen={showDropActionModal}
        onClose={() => {
          setShowDropActionModal(false);
          setDropData(null);
        }}
        onSelect={handleDropActionSelect}
      />

      {dragProgress && (
        <DragPreview item={dragItem} position={dragProgress} />
      )}
    </div>
  );
};

export default SchedulerPage;
