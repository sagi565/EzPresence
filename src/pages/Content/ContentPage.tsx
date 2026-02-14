import React, { useState, useRef, useEffect } from 'react';
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
        width: '120px',
        height: '160px',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        transform: 'rotate(-2deg) scale(1.05)',
        cursor: 'grabbing',
        background: '#2a2a2a',
        position: 'relative',
        opacity: 0.7, // Semi-transparent so user can see icons underneath
      }}
    >
      {thumbnailSrc && (
        <img
          src={thumbnailSrc}
          alt={item.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
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

// Drag overlay for list icons - just the icon, no label
const ListDragPreview: React.FC<{ list: any }> = ({ list }) => {
  if (!list) return null;

  return (
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        fontSize: '20px',
        cursor: 'grabbing',
        border: '2px solid rgba(155, 93, 229, 0.4)',
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
  lists: any[];
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
  const { isDragging } = useDndState();
  const wasDragging = useRef(false);
  const dragEndCooldown = useRef(false);

  // Track when drag ends and add cooldown period
  useEffect(() => {
    if (isDragging) {
      wasDragging.current = true;
      dragEndCooldown.current = false;
    } else if (wasDragging.current) {
      // Drag just ended - start cooldown
      wasDragging.current = false;
      dragEndCooldown.current = true;
      const timeout = setTimeout(() => {
        dragEndCooldown.current = false;
      }, 500); // 500ms cooldown after drag ends
      return () => clearTimeout(timeout);
    }
  }, [isDragging]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement[]>([]);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateIndexTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTop = useRef(0);
  const scrollVelocity = useRef(0);
  const velocityCheckInterval = useRef<ReturnType<typeof setTimeout> | null>(null);




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
  }, [newlyCreatedListId, lists]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    velocityCheckInterval.current = setInterval(() => {
      const currentScrollTop = container.scrollTop;
      const delta = currentScrollTop - lastScrollTop.current;
      scrollVelocity.current = delta;
      lastScrollTop.current = currentScrollTop;
    }, 50);

    return () => {
      if (velocityCheckInterval.current) {
        clearInterval(velocityCheckInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (updateIndexTimeoutRef.current) {
        clearTimeout(updateIndexTimeoutRef.current);
      }

      updateIndexTimeoutRef.current = setTimeout(() => {
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

        if (closestIndex !== currentIndex) {
          setCurrentIndex(closestIndex);
        }
      }, 50);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        // Don't snap during drag, during cooldown, or while scrolling
        if (!isScrolling && !isDragging && !dragEndCooldown.current) {
          const scrollTop = container.scrollTop;
          const scrollHeight = container.scrollHeight;
          const containerHeight = container.clientHeight;

          const absVelocity = Math.abs(scrollVelocity.current);
          const isHardScroll = absVelocity > 100;

          if (isHardScroll && scrollTop < containerHeight * 0.3) {
            scrollToList(0);
            return;
          }

          const distanceFromBottom = scrollHeight - scrollTop - containerHeight;
          if (isHardScroll && distanceFromBottom < containerHeight * 0.3 && scrollVelocity.current > 0) {
            scrollToList(lists.length - 1);
            return;
          }

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

          scrollToList(closestIndex);
        }
      }, 150);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      if (updateIndexTimeoutRef.current) clearTimeout(updateIndexTimeoutRef.current);
    };
  }, [currentIndex, isScrolling, lists.length, isDragging]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let accumulated = 0;
    let scrollTimer: ReturnType<typeof setTimeout> | null = null;
    let direction = 1;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      direction = e.deltaY > 0 ? 1 : -1;
      accumulated += e.deltaY;

      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        const total = Math.abs(accumulated);
        let step = 0;
        if (total > 3500) step = 4;
        else if (total > 2000) step = 3;
        else if (total > 900) step = 2;
        else if (total > 200) step = 1;

        if (step > 0) {
          const nextIndex = Math.max(0, Math.min(lists.length - 1, currentIndex + step * direction));
          scrollToList(nextIndex);
        }
        accumulated = 0;
        scrollTimer = null;
      }, 30);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimer) clearTimeout(scrollTimer);
    };
  }, [currentIndex, isScrolling, lists.length]);

  const scrollToList = (index: number) => {
    const targetList = listsRef.current[index];
    const container = containerRef.current;

    if (targetList && container) {
      setIsScrolling(true);

      const containerHeight = container.clientHeight;
      const listTop = targetList.offsetTop;
      const listHeight = targetList.offsetHeight;
      const scrollPosition = listTop - (containerHeight - listHeight) / 2;

      container.scrollTo({ top: scrollPosition, behavior: 'smooth' });
      setCurrentIndex(index);

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 600);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (emojiPicker.listId) {
      updateListIcon(emojiPicker.listId, emoji);
    }
  };

  const handleItemClick = (itemId: string, listId: string) => {
    const list = lists.find(l => l.id === listId);
    const item = list?.items.find(i => i.id === itemId);
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

  return (
    <div style={styles.container}>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />

      <div ref={containerRef} style={styles.contentArea} key={currentBrand?.id || 'no-brand'}>
        {lists.map((list, index) => (
          <div
            key={list.id}
            ref={(el) => { if (el) listsRef.current[index] = el; }}
            style={styles.listSection}
          >
            <div style={styles.listWrapper}>
              <ContentList
                list={list}
                isNewList={newlyCreatedListId === list.id}
                onDelete={() => deleteList(list.id)}
                onTitleChange={(newTitle) => updateListTitle(list.id, newTitle)}
                onIconClick={(element: HTMLElement) => handleIconClick(list.id, element)}
                onItemMove={() => { }}
                onItemDelete={(itemId) => deleteItem(itemId, list.id)}
                onItemRename={(itemId, newName) => renameItem(itemId, list.id, newName)}
                onToggleFavorite={(itemId) => toggleFavorite(itemId, list.id)}
                onUpload={(file) => uploadContent(list.id, file)}
                onItemClick={(itemId) => handleItemClick(itemId, list.id)}
                onSaveChanges={() => clearNewListFlag()}
              />
            </div>
          </div>
        ))}
      </div>

      <ScrollNavigation
        lists={lists}
        currentIndex={currentIndex}
        onNavigate={scrollToList}
        onDelete={(listId) => deleteList(listId)}
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