import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useBrands } from '@/hooks/brands/useBrands';
import { useContentLists } from '@hooks/contents/useContentLists';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import ContentList from '@components/Content/ContentList/ContentList';
import ScrollNavigation from '@components/Content/ScrollNavigation/ScrollNavigation';
import EmojiPicker from '@components/Content/EmojiPicker/EmojiPicker';
import ContentDetailModal from '@components/Content/ContentDetailModal/ContentDetailModal';
import ConfirmDialog from '@components/Content/ConfirmDialog/ConfirmDialog';
import { ContentItem } from '@models/ContentList';
import { styles } from './styles';
import { DndProvider, useDndState } from '@/context/DndContext';

// ---------------------------------------------------------------------------
// Poof particle burst component — particles span entire list width
// ---------------------------------------------------------------------------
const POOF_COLORS = [
  'rgba(168,85,247,0.32)',
  'rgba(232,121,249,0.26)',
  'rgba(129,140,248,0.28)',
  'rgba(255,255,255,0.22)',
  'rgba(96,165,250,0.25)',
];

const PARTICLE_COUNT = 36;

const PoofParticles: React.FC = () => {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_) => {
      // Spawn at a random position across the full list area
      const originX = 5 + Math.random() * 90;  // % along width
      const originY = 10 + Math.random() * 80; // % along height

      // Each particle drifts in a random upward-ish direction
      const angle = -60 + Math.random() * 300; // mostly upward and sideways
      const distance = 80 + Math.random() * 140; // px
      const rad = (angle * Math.PI) / 180;
      const dx = Math.cos(rad) * distance;
      const dy = Math.sin(rad) * distance;

      const size = 5 + Math.random() * 7;       // slightly bigger
      const color = POOF_COLORS[Math.floor(Math.random() * POOF_COLORS.length)];
      const delay = Math.random() * 120;         // ms
      const duration = 650 + Math.random() * 450; // slow drift
      return { originX, originY, dx, dy, size, color, delay, duration };
    });
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 99,
      overflow: 'visible',
    }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: `${p.originY}%`,
            left: `${p.originX}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            marginLeft: `-${p.size / 2}px`,
            marginTop: `-${p.size / 2}px`,
            borderRadius: '50%',
            background: p.color,
            animationName: 'poofParticle',
            animationDuration: `${p.duration}ms`,
            animationDelay: `${p.delay}ms`,
            animationTimingFunction: 'ease-out',
            animationFillMode: 'both',
            ['--pdx' as any]: `${p.dx}px`,
            ['--pdy' as any]: `${p.dy}px`,
            zIndex: 101,
          }}
        />
      ))}
    </div>
  );
};

// Drag overlay for content items
const ItemDragPreview: React.FC<{ item: any }> = ({ item }) => {
  if (!item) return null;

  const thumbnailSrc = item.thumbnail?.startsWith('http') || item.thumbnail?.startsWith('data:')
    ? item.thumbnail
    : item.thumbnail
      ? `data:image/jpeg;base64,${item.thumbnail.replace(/[\n\r\s]/g, '')}`
      : null;

  return (
    <div
      style={{
        width: '140px',
        aspectRatio: '9/16',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(155, 93, 229, 0.4)',
        transform: 'rotate(-2deg) scale(1.05)',
        cursor: 'grabbing',
        background: '#f8f9fb',
        position: 'relative',
        opacity: 0.9,
        border: '2px solid #9b5de5',
      }}
    >
      {thumbnailSrc ? (
        <img
          src={thumbnailSrc}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', background: 'rgba(155, 93, 229, 0.05)'
        }}>
          {item.type === 'video' ? '🎬' : '🖼️'}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '14px 10px 8px 10px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
          color: 'white',
          fontSize: '13px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          zIndex: 2,
        }}
      >
        {item.title}
      </div>
    </div>
  );
};

// Drag overlay for list icons - just the icon, no label
const ListDragPreview: React.FC<{ list: any }> = ({ list }) => {
  if (!list) return null;

  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: list.isSystem
          ? 'rgba(251, 191, 36, 0.1)'
          : 'rgba(155, 93, 229, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        fontSize: '20px',
        cursor: 'grabbing',
        border: list.isSystem
          ? '2px solid rgba(251, 191, 36, 0.4)'
          : '2px solid rgba(155, 93, 229, 0.4)',
      }}
    >
      {list.icon}
    </div>
  );
};

// Component that renders the appropriate drag overlay
const DragOverlayContent: React.FC<{ lists: any[] }> = ({ lists }) => {
  const { activeId, activeData } = useDndState();

  if (!activeId || !activeData) return null;

  if (activeData.type === 'LIST') {
    const list = lists.find((l) => l.id === activeId);
    return <ListDragPreview list={list} />;
  }

  if (activeData.type === 'ITEM') {
    // Find the item in any list
    for (const list of lists) {
      const item = list.items.find((i: any) => i.id === activeId);
      if (item) {
        return <ItemDragPreview item={item} />;
      }
    }
  }

  return null;
};

interface ContentPageInnerProps {
  brands: any[];
  currentBrand: any;
  switchBrand: (brandId: string) => void;
  lists: any[]; // Using any to avoid circular dependency/type issues with ContentList component vs model
  addNewList: () => void;
  clearNewListFlag: () => void;
  deleteList: (listId: string) => void;
  updateListTitle: (listId: string, title: string) => void;
  updateListIcon: (listId: string, icon: string) => void;
  deleteItem: (itemId: string, listId: string) => void;
  renameItem: (itemId: string, listId: string, name: string) => void;
  toggleFavorite: (itemId: string, listId: string) => void;
  uploadContent: (listId: string, file: File) => void;
  newlyCreatedListId: string | null;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const ContentPageInner: React.FC<ContentPageInnerProps> = ({
  brands,
  currentBrand,
  switchBrand,
  lists,
  addNewList,
  clearNewListFlag,
  deleteList,
  updateListTitle,
  updateListIcon,
  deleteItem,
  renameItem,
  toggleFavorite,
  uploadContent,
  newlyCreatedListId,
  onReorder,
}) => {
  // Track if dragging to prevent scroll snap
  const { isDragging, activeData } = useDndState();
  const wasDragging = useRef(false);
  const dragEndCooldown = useRef(false);

  // Track when drag ends and add cooldown period
  // Use a ref to track drag type for the cleanup effect
  const activeDragTypeRef = useRef<string | null>(null);

  useEffect(() => {
    if (isDragging) {
      wasDragging.current = true;
      activeDragTypeRef.current = activeData?.type || null;
      dragEndCooldown.current = false;
    } else if (wasDragging.current) {
      wasDragging.current = false;
      activeDragTypeRef.current = null;

      // Always apply a small cooldown to disable scroll-snap after ANY drag
      // This prevents the browser from "jumping" to a snap point during a state update
      setIsReorderScrolling(true);
      const timeout = setTimeout(() => {
        setIsReorderScrolling(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [isDragging, activeData?.type]);


  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement[]>([]);
  const updateIndexTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(0);
  const [deletingListIds, setDeletingListIds] = useState<Set<string>>(new Set());
  const [isReorderScrolling, setIsReorderScrolling] = useState(false);


  // Keep ref in sync with state for use in the scroll listener without triggering re-attachments
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);


  // Force scroll to top on mount to prevent unwanted auto-scroll/restoration
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);



  const [emojiPicker, setEmojiPicker] = useState<{
    isOpen: boolean;
    listId: string;
    anchorElement: HTMLElement | null;
  }>({
    isOpen: false,
    listId: '',
    anchorElement: null,
  });

  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    item: ContentItem | null;
    listId: string;
  }>({
    isOpen: false,
    item: null,
    listId: '',
  });

  const [deleteFromModal, setDeleteFromModal] = useState(false);
  const [hoveredAddButton, setHoveredAddButton] = useState(false);


  const handleDeleteListWithAnimation = (listId: string) => {
    // Mark list as deleting to trigger CSS animation
    setDeletingListIds(prev => new Set(prev).add(listId));
    // After animation completes, actually remove the list
    setTimeout(() => {
      deleteList(listId);
      setDeletingListIds(prev => {
        const next = new Set(prev);
        next.delete(listId);
        return next;
      });
    }, 750);
  };

  const handleIconClick = (listId: string, element: HTMLElement) => {
    setEmojiPicker({
      isOpen: true,
      listId,
      anchorElement: element,
    });
  };

  // Scroll to new list only when explicitly created
  useEffect(() => {
    if (newlyCreatedListId) {
      const index = lists.findIndex(l => l.id === newlyCreatedListId);
      if (index !== -1) {
        setTimeout(() => {
          scrollToList(index);
        }, 100);
      }
    }
  }, [newlyCreatedListId]);



  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (updateIndexTimeoutRef.current) {
        clearTimeout(updateIndexTimeoutRef.current);
      }

      updateIndexTimeoutRef.current = setTimeout(() => {
        // CRITICAL: Don't update the active list highlight while dragging a content item
        // This keeps the user anchored to their current list context
        if (isDragging && activeData?.type === 'ITEM') {
          return;
        }

        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const scrollCenter = scrollTop + containerHeight / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        listsRef.current.forEach((list, index) => {
          if (!list) return;
          const listTop = list.offsetTop;
          const listHeight = list.offsetHeight;
          const listCenter = listTop + listHeight / 2;
          const distance = Math.abs(scrollCenter - listCenter);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        });

        if (closestIndex !== currentIndexRef.current) {
          setCurrentIndex(closestIndex);
        }
      }, 50);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (updateIndexTimeoutRef.current) clearTimeout(updateIndexTimeoutRef.current);
    };
  }, [lists.length]); // Dependency on lists.length to re-attach if lists change, but not on currentIndex state





  const scrollToList = (index: number) => {
    const targetList = listsRef.current[index];
    const container = containerRef.current;

    if (targetList && container) {
      const containerHeight = container.clientHeight;
      const listTop = targetList.offsetTop;
      const listHeight = targetList.offsetHeight;
      const scrollPosition = listTop - (containerHeight - listHeight) / 2;

      container.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });

      setCurrentIndex(index);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (emojiPicker.listId) {
      updateListIcon(emojiPicker.listId, emoji);
    }
  };

  const handleItemClick = (itemId: string, listId: string) => {
    const list = lists.find(l => l.id === listId);
    const item = list?.items.find((i: ContentItem) => i.id === itemId);
    if (item) {
      setDetailModal({ isOpen: true, item, listId });
    }
  };

  const handleModalRename = (newName: string) => {
    if (detailModal.item && detailModal.listId) {
      renameItem(detailModal.item.id, detailModal.listId, newName);
      setDetailModal(prev => ({
        ...prev,
        item: prev.item ? { ...prev.item, title: newName } : null,
      }));
    }
  };

  const handleModalToggleFavorite = () => {
    if (detailModal.item && detailModal.listId) {
      toggleFavorite(detailModal.item.id, detailModal.listId);
      setDetailModal(prev => ({
        ...prev,
        item: prev.item ? { ...prev.item, favorite: !prev.item.favorite } : null,
      }));
    }
  };

  const handleModalDelete = () => {
    setDeleteFromModal(true);
  };

  const confirmModalDelete = () => {
    if (detailModal.item && detailModal.listId) {
      deleteItem(detailModal.item.id, detailModal.listId);
      setDetailModal({ isOpen: false, item: null, listId: '' });
    }
    setDeleteFromModal(false);
  };

  const addButtonStyle = {
    ...styles.addListButton,
    ...(hoveredAddButton ? styles.addListButtonHover : {}),
  };

  const dynamicContentAreaStyle: React.CSSProperties = {
    ...styles.contentArea,
    // Only disable snap during LIST reordering or its cooldown.
    // Keeping snap enabled during ITEM dragging ensures the view stays stable.
    scrollSnapType: (isDragging && activeData?.type === 'LIST' || isReorderScrolling) ? 'none' : 'y mandatory',
    overscrollBehavior: 'none',
    WebkitOverflowScrolling: 'touch',
  };

  return (
    <div style={styles.container}>
      <style>{`
        /* ---- DISSOLVE: list gently fades out ---- */
        @keyframes poofImplode {
          0%   { opacity: 1;   transform: scale(1);    filter: blur(0px);  max-height: 100vh; }
          40%  { opacity: 0.6; transform: scale(0.97); filter: blur(1px);  max-height: 100vh; }
          75%  { opacity: 0.1; transform: scale(0.93); filter: blur(3px);  max-height: 100vh; }
          90%  { opacity: 0;   transform: scale(0.90); filter: blur(4px);  max-height: 100vh; }
          100% { opacity: 0;   transform: scale(0.90); filter: blur(4px);  max-height: 0; padding-top: 0; padding-bottom: 0; }
        }
        .list-section-deleting {
          animation: poofImplode 0.85s ease-in-out forwards;
          overflow: visible;
          pointer-events: none;
          position: relative;
          transform-origin: center center;
        }
        /* ---- POOF: particles drift out slowly ---- */
        @keyframes poofParticle {
          0%   { transform: translate(0, 0) scale(1);                                              opacity: 0; }
          10%  { opacity: 1; }
          80%  { transform: translate(var(--pdx), var(--pdy)) scale(0.5);                          opacity: 0.3; }
          100% { transform: translate(calc(var(--pdx)*1.05), calc(var(--pdy)*1.05)) scale(0);      opacity: 0; }
        }
      `}</style>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />

      <div ref={containerRef} style={dynamicContentAreaStyle} key={currentBrand?.id || 'no-brand'}>
        {lists.map((list, index) => {
          const isDeleting = deletingListIds.has(list.id);
          return (
            <div
              key={list.id}
              ref={(el) => { if (el) listsRef.current[index] = el; }}
              style={{ ...styles.listSection, position: 'relative' }}
              className={isDeleting ? 'list-section-deleting' : undefined}
            >
              {/* Poof particles rendered on top during deletion */}
              {isDeleting && <PoofParticles />}
              <div style={styles.listWrapper}>
                <ContentList
                  list={list}
                  isNewList={newlyCreatedListId === list.id}
                  onDelete={() => handleDeleteListWithAnimation(list.id)}
                  onTitleChange={(newTitle) => updateListTitle(list.id, newTitle)}
                  onIconClick={(element: HTMLElement) => handleIconClick(list.id, element)}
                  onItemMove={(_itemId) => {
                    /* 
                       Note: DnD kit handles dropping between lists at the Provider level 
                       via the `onItemMove` passed to DndProvider. 
                       This specific prop might be for a dedicated move button. 
                    */
                  }}
                  onItemDelete={(itemId) => deleteItem(itemId, list.id)}
                  onItemRename={(itemId, newName) => renameItem(itemId, list.id, newName)}
                  onToggleFavorite={(itemId) => toggleFavorite(itemId, list.id)}
                  onUpload={(file) => uploadContent(list.id, file)}
                  onItemClick={(itemId) => handleItemClick(itemId, list.id)}
                  onSaveChanges={() => clearNewListFlag()}
                  onAddNavigate={undefined}
                />
              </div>
            </div>
          );
        })}
      </div>

      <ScrollNavigation
        lists={lists}
        currentIndex={currentIndex}
        onNavigate={scrollToList}
        onDelete={(listId) => handleDeleteListWithAnimation(listId)}
        onReorder={onReorder}
      />

      <EmojiPicker
        isOpen={emojiPicker.isOpen}
        onClose={() => setEmojiPicker({ isOpen: false, listId: '', anchorElement: null })}
        onSelect={handleEmojiSelect}
        anchorElement={emojiPicker.anchorElement}
      />

      <ContentDetailModal
        isOpen={detailModal.isOpen}
        item={detailModal.item}
        onClose={() => setDetailModal({ isOpen: false, item: null, listId: '' })}
        onRename={handleModalRename}
        onDelete={handleModalDelete}
        onToggleFavorite={handleModalToggleFavorite}
      />

      <ConfirmDialog
        isOpen={deleteFromModal}
        title="Delete Content?"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmModalDelete}
        onCancel={() => setDeleteFromModal(false)}
      />

      <div style={styles.addListButtonWrapper}>
        <button
          style={addButtonStyle}
          onClick={addNewList}
          onMouseEnter={() => setHoveredAddButton(true)}
          onMouseLeave={() => setHoveredAddButton(false)}
        >
          <span style={{ fontSize: '24px' }}>➕</span>
          <span>Add new list</span>
        </button>
      </div>
    </div>
  );
};

// Wrapper that provides the drag overlay content
const ContentPageWithOverlay: React.FC = () => {
  const { brands, currentBrand, switchBrand } = useBrands();
  const {
    lists,
    addNewList,
    clearNewListFlag,
    deleteList,
    updateListTitle,
    updateListIcon,
    deleteItem,
    renameItem,
    toggleFavorite,
    uploadContent,
    newlyCreatedListId,
    reorderLists,
    moveItem,
  } = useContentLists(currentBrand?.id);

  return (
    <DndProvider
      lists={lists}
      onListReorder={reorderLists}
      onItemMove={moveItem}
      dragOverlay={<DragOverlayContent lists={lists} />}
    >
      <ContentPageInner
        brands={brands}
        currentBrand={currentBrand}
        switchBrand={switchBrand}
        lists={lists}
        addNewList={addNewList}
        clearNewListFlag={clearNewListFlag}
        deleteList={deleteList}
        updateListTitle={updateListTitle}
        updateListIcon={updateListIcon}
        deleteItem={deleteItem}
        renameItem={renameItem}
        toggleFavorite={toggleFavorite}
        uploadContent={uploadContent}
        newlyCreatedListId={newlyCreatedListId}
        onReorder={reorderLists}
      />
    </DndProvider>
  );
};

export default ContentPageWithOverlay;