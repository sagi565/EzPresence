import React, { useState, useEffect, useMemo } from 'react';
import { useBrands } from '@/hooks/brands/useBrands';
import { useSchedules } from '@hooks/useSchedules';
import { useMediaContents } from '@/hooks/contents/useMediaContents';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import SchedulerBar from '@components/Scheduler/SchedulerBar/DateNavigation';
import CalendarGrid from '@components/Scheduler/Calendar/GridView/CalendarGrid';
import FourDaysView from '@components/Scheduler/Calendar/FourDaysView/FourDaysView';
import CalendarSkeleton from '@components/Scheduler/Calendar/CalendarSkeleton/CalendarSkeleton';
import ContentDrawer from '@components/Scheduler/ContentDrawer/ContentDrawer';
import NewStoryModal from '@components/Scheduler/CreateModals/NewStoryModal/NewStoryModal';
import NewPostModal from '@components/Scheduler/CreateModals/NewPostModal/NewPostModal';
import CreateDropdown from '@components/Scheduler/SchedulerBar/CreateDropdown';
import PostContextMenu from '@components/Scheduler/PostContextMenu/PostContextMenu';
import ConfirmDialog from '@components/Scheduler/CreateModals/ConfirmDialog/ConfirmDialog';
import RecurringActionDialog from '@components/Scheduler/CreateModals/RecurringActionDialog/RecurringActionDialog';
import { StoryFormData } from '@/models/StorySchedule';
import { PostFormData, parseRruleFrequency, generateRepeatLabel, parseTimeString } from '@/models/ScheduleFormData';
import { Post } from '@models/Post';
import {
  Container,
  SchedulerContainer,
  LoadingContainer,
  Spinner,
  LoadingText,
  ErrorContainer,
  ErrorIcon,
  ErrorTitle,
  ErrorText,
  RetryButton,
  CalendarErrorContainer
} from './styles';
import { ContentItem } from '@/models/ContentList';

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
  const [dropAnchorPos, setDropAnchorPos] = useState<{ x: number; y: number } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const isPickingRef = React.useRef(isPicking);
  useEffect(() => {
    isPickingRef.current = isPicking;
  }, [isPicking]);
  const [lastPickedContent, setLastPickedContent] = useState<ContentItem | null>(null);


  const { brands, currentBrand, switchBrand, loading: brandsLoading, error: brandsError } = useBrands();

  // Use useSchedules instead of usePosts
  const {
    posts,
    loading: schedulesLoading,
    error: schedulesError,
    refetchSchedules,
    deleteSchedule,
  } = useSchedules(currentBrand?.id || '');

  // --- POST CONTEXT MENU (right-click / long-press delete) ---
  const [contextMenuPost, setContextMenuPost] = useState<Post | null>(null);
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [showPostDeleteConfirm, setShowPostDeleteConfirm] = useState(false);
  const [showPostRecurringDialog, setShowPostRecurringDialog] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);

  // Calculate visible date range based on view mode and current dates
  const visibleRange = useMemo(() => {
    if (viewMode === 'month') {
      // For month view, get the first day of the grid (often in previous month)
      // and last day of the grid (often in next month)
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const startOffset = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
      const startDate = new Date(currentYear, currentMonth, 1 - startOffset);
      startDate.setHours(0, 0, 0, 0);

      // Grid is 6 weeks (42 days)
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 42);
      endDate.setHours(23, 59, 59, 999);

      return { startDate, endDate };
    } else {
      // For 4-day view
      const startDate = new Date(currentYear, currentMonth, currentDay);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 4);
      endDate.setHours(23, 59, 59, 999);

      return { startDate, endDate };
    }
  }, [currentYear, currentMonth, currentDay, viewMode]);

  // Fetch schedules when brand or visible date range changes
  useEffect(() => {
    if (currentBrand?.id) {
      refetchSchedules(visibleRange.startDate, visibleRange.endDate);
    }
  }, [currentBrand?.id, visibleRange, refetchSchedules]);

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

  // --- DRAG END LISTENER (for picking state cleanup only) ---
  useEffect(() => {
    const handleDragEnd = () => {
      // If we were picking and the drag ended outside a valid drop target,
      // reset the picking state cleanly.
      if (isPickingRef.current) {
        setIsPicking(false);
        setIsDrawerOpen(false);
        window.dispatchEvent(new Event('cancel-pick-content'));
      }
    };

    window.addEventListener('dragend', handleDragEnd);
    window.addEventListener('drop', handleDragEnd);

    return () => {
      window.removeEventListener('dragend', handleDragEnd);
      window.removeEventListener('drop', handleDragEnd);
    };
  }, []);

  // --- AUTO-SCROLL DURING DRAG ---
  useEffect(() => {
    let scrollInterval: any = null;
    let scrollDir: number | null = null;

    const performScroll = (direction: number) => {
      const speed = 15; // Reduced speed
      
      // Target EVERYTHING that might be scrollable
      window.scrollBy(0, direction * speed);
      
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop += direction * speed;
      }
      
      document.body.scrollTop += direction * speed;
      document.documentElement.scrollTop += direction * speed;
      
      const root = document.getElementById('root');
      if (root) root.scrollTop += direction * speed;

      const schedArea = document.querySelector('.scheduler-main-container');
      if (schedArea) schedArea.scrollTop += direction * speed;
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      const threshold = 80; // Reduced threshold
      const pointerY = e.clientY;
      const viewportHeight = window.innerHeight;

      const isNearTop = pointerY < threshold;
      const isNearBottom = pointerY > viewportHeight - threshold;

      if (isNearTop || isNearBottom) {
        // e.preventDefault(); // Sometimes helpful to keep the drag active
        const direction = isNearTop ? -1 : 1;
        
        if (scrollDir !== direction) {
          if (scrollInterval) clearInterval(scrollInterval);
          
          scrollInterval = setInterval(() => {
            performScroll(direction);
          }, 16);
          scrollDir = direction;
          console.log(`🚀 [UltimateScroll] Scrolling ${direction > 0 ? 'DOWN' : 'UP'} at Y: ${pointerY}`);
        }
      } else {
        if (scrollInterval) {
          clearInterval(scrollInterval);
          scrollInterval = null;
          scrollDir = null;
          console.log('🛑 [UltimateScroll] Stopped');
        }
      }
    };

    const stopScroll = () => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
        scrollDir = null;
        console.log('🛑 [AutoScroll] Stopped (drag end)');
      }
    };

    // Use capture phase (true) to ensure we catch events even if children stop propagation
    document.addEventListener('dragover', handleGlobalDragOver, true);
    document.addEventListener('dragend', stopScroll, true);
    document.addEventListener('drop', stopScroll, true);

    return () => {
      document.removeEventListener('dragover', handleGlobalDragOver, true);
      document.removeEventListener('dragend', stopScroll, true);
      document.removeEventListener('drop', stopScroll, true);
      if (scrollInterval) clearInterval(scrollInterval);
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
      // Check if click is on the handle
      const isInsideHandle = target.closest('.content-drawer-handle');
      // Check if click is on the "Pick Clone" (Direct DOM manipulation item)
      const isInsidePickClone = target.id === 'pickClone' || target.closest('#pickClone');
      // Check if click is on the overlay (to prevent closing when clicking the picking overlay itself)
      const isInsideOverlay = target.id === 'contentPickOverlay';

      if (isInsideDrawer || isInsideHandle || isInsidePickClone || isInsideOverlay) {
        console.log('✅ [SchedulerPage] Click inside safe area. isInsideDrawer:', !!isInsideDrawer, 'isInsidePickClone:', !!isInsidePickClone);
        return;
      }

      if (isDrawerOpen) {
        console.log('❌ [SchedulerPage] Click outside detected. Closing drawer.');
        setIsDrawerOpen(false);
        setIsPicking(false);
        window.dispatchEvent(new Event('cancel-pick-content'));
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

  const handleDrop = (date: Date, contentId: string, position: { x: number; y: number }) => {
    setDropData({ date, contentId });
    setDropAnchorPos(position);
    setShowDropActionModal(true);
    setIsDrawerOpen(false);
    setIsPicking(false);
  };

  const handleFourDaysViewDrop = (date: Date, time: string, contentId: string, position: { x: number; y: number }) => {
    setDropData({ date, time, contentId });
    setDropAnchorPos(position);
    setShowDropActionModal(true);
    setIsDrawerOpen(false);
    setIsPicking(false);
  };

  const handleContextMenu = (e: React.MouseEvent, date: Date) => {
    e.preventDefault();
    setDropData({ date, contentId: '' });
    setDropAnchorPos({ x: e.clientX, y: e.clientY });
    setShowDropActionModal(true);
    setIsDrawerOpen(false);
    setIsPicking(false);
  };

  const handleFourDaysContextMenu = (e: React.MouseEvent, date: Date, time: string) => {
    e.preventDefault();
    setDropData({ date, time, contentId: '' });
    setDropAnchorPos({ x: e.clientX, y: e.clientY });
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

    // Resolve contentId from contentUuids (the first attached content)
    const resolvedContentId = post.contentUuids?.[0];

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
      status: post.status,
      repeat: (() => {
        if (!post.isRecurring) {
          return { frequency: 'none' as const, label: 'Does not repeat' };
        }
        const frequency = parseRruleFrequency(post.rruleText);
        const rruleText = post.rruleText;
        let label = 'Recurring';
        if (frequency !== 'custom' && frequency !== 'none') {
          try {
            label = generateRepeatLabel(frequency, new Date(post.date));
          } catch (e) { }
        }
        return {
          frequency,
          rruleText,
          label
        };
      })()
    };

    if (post.type === 'Story') {
      setDropData(initialData as any);
      setShowNewStoryModal(true);
    } else {
      setDropData(initialData as any);
      setShowNewPostModal(true);
    }
  };

  const handlePostContextMenu = (post: Post, x: number, y: number) => {
    setContextMenuPost(post);
    setContextMenuPos({ x, y });
  };

  const handlePostContextMenuDelete = () => {
    if (!contextMenuPost) return;
    if (contextMenuPost.isRecurring) {
      setShowPostRecurringDialog(true);
    } else {
      setShowPostDeleteConfirm(true);
    }
  };

  const executePostDelete = async (occurrenceOnly?: boolean) => {
    if (!contextMenuPost) return;
    try {
      setIsDeletingPost(true);
      const { hours, minutes } = parseTimeString(contextMenuPost.time);
      const plannedDate = new Date(contextMenuPost.date);
      plannedDate.setHours(hours, minutes, 0, 0);
      const isPast = plannedDate < new Date();
      await deleteSchedule(
        contextMenuPost.calendarItemId || contextMenuPost.scheduleUuid || '',
        plannedDate,
        occurrenceOnly,
        isPast
      );
      refetchSchedules();
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeletingPost(false);
      setContextMenuPost(null);
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
      <Container>
        <LoadingContainer>
          <Spinner />
          <LoadingText>Loading your brands...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  // Show error state
  if (brandsError) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>Failed to Load</ErrorTitle>
          <ErrorText>{brandsError}</ErrorText>
          <RetryButton onClick={() => window.location.reload()}>
            Retry
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  // Show loading while auto-selecting brand
  if (!currentBrand) {
    return (
      <Container>
        <LoadingContainer>
          <Spinner />
          <LoadingText>Setting up your workspace...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />
      <SchedulerContainer className="scheduler-main-container">
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
          <CalendarSkeleton viewMode={viewMode} />
        ) : schedulesError ? (
          <CalendarErrorContainer>
            <ErrorText>{schedulesError}</ErrorText>
          </CalendarErrorContainer>
        ) : viewMode === 'month' ? (
          <CalendarGrid
            currentYear={currentYear}
            currentMonth={currentMonth}
            posts={enrichedPosts}
            today={today}
            onDrop={handleDrop}
            onPostClick={handlePostClick}
            activeDropDate={showDropActionModal ? dropData?.date : null}
            onContextMenu={handleContextMenu}
            onPostContextMenu={handlePostContextMenu}
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
            onContextMenu={handleFourDaysContextMenu}
            onPostContextMenu={handlePostContextMenu}
          />
        )}
      </SchedulerContainer>

      <div id="contentPickOverlay" className={`content-pick-overlay ${isDrawerOpen && isPicking ? 'active' : ''}`} onClick={() => {
        if (isPicking) {
          setIsPicking(false);
          setIsDrawerOpen(false); // Close drawer on cancel
          window.dispatchEvent(new Event('cancel-pick-content'));
        }
      }} />

      <ContentDrawer
        brandId={currentBrand.id}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setIsPicking(false);
          window.dispatchEvent(new Event('cancel-pick-content'));
        }}
        onToggle={() => {
          console.log('🔃 [SchedulerPage] Drawer toggle clicked. New state:', !isDrawerOpen);
          setIsDrawerOpen(!isDrawerOpen);
          if (isDrawerOpen) {
            setIsPicking(false); // If we are closing, cancel picking
            window.dispatchEvent(new Event('cancel-pick-content'));
          }
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
          window.dispatchEvent(new Event('cancel-pick-content'));
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
          window.dispatchEvent(new Event('cancel-pick-content'));
        }}
        onContentDrop={() => setIsDrawerOpen(false)}
        lastPickedContent={lastPickedContent}

      />

      <CreateDropdown
        isOpen={showDropActionModal}
        onClose={() => {
          setShowDropActionModal(false);
          setDropData(null);
          setDropAnchorPos(null);
        }}
        onSelect={handleDropActionSelect}
        anchorPos={dropAnchorPos || undefined}
      />

      {contextMenuPost && contextMenuPos && !showPostDeleteConfirm && !showPostRecurringDialog && (
        <PostContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onDelete={handlePostContextMenuDelete}
          onClose={() => {
            setContextMenuPost(null);
            setContextMenuPos(null);
          }}
        />
      )}

      <ConfirmDialog
        isOpen={showPostDeleteConfirm}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmLabel={isDeletingPost ? 'Deleting...' : 'Delete'}
        danger
        onConfirm={() => {
          setShowPostDeleteConfirm(false);
          executePostDelete();
        }}
        onCancel={() => {
          setShowPostDeleteConfirm(false);
          setContextMenuPost(null);
        }}
      />

      <RecurringActionDialog
        isOpen={showPostRecurringDialog}
        mode="delete"
        onConfirm={(option) => {
          setShowPostRecurringDialog(false);
          executePostDelete(option === 'this');
        }}
        onCancel={() => {
          setShowPostRecurringDialog(false);
          setContextMenuPost(null);
        }}
      />

    </Container>
  );
};

export default SchedulerPage;
