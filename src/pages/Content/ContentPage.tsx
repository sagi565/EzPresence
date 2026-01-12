import React, { useState, useRef, useCallback, useEffect } from 'react';
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

const ContentPage: React.FC = () => {
  const { brands, currentBrand, switchBrand } = useBrands();
  
  const {
    lists,
    addNewList,
    clearNewListFlag,
    deleteList,
    updateListTitle,
    updateListIcon,
    reorderLists,
    moveItem,
    deleteItem,
    renameItem,
    toggleFavorite,
    uploadContent,
    newlyCreatedListId,
  } = useContentLists(currentBrand?.id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement[]>([]);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateIndexTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTop = useRef(0);
  const scrollVelocity = useRef(0);
  const velocityCheckInterval = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isDraggingItem, setIsDraggingItem] = useState(false);
  
  const prevListsLength = useRef(lists.length);

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

  useEffect(() => {
    if (lists.length > prevListsLength.current) {
      const newListIndex = lists.length - 1;
      if (newListIndex >= 0) {
        setTimeout(() => {
          scrollToList(newListIndex);
        }, 100);
      }
    }
    prevListsLength.current = lists.length;
  }, [lists.length]);

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
        if (!isScrolling) {
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
  }, [currentIndex, isScrolling, lists.length]);

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

  const handleDragOver = (e: React.DragEvent, listId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, targetListId: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const sourceListId = e.dataTransfer.getData('listId');
    if (itemId && sourceListId && sourceListId !== targetListId) {
      moveItem(itemId, sourceListId, targetListId);
    }
  };

  const handleDropToList = (listId: string) => {
    const draggedItemId = sessionStorage.getItem('draggedItemId');
    const draggedFromListId = sessionStorage.getItem('draggedFromListId');
    if (draggedItemId && draggedFromListId && draggedFromListId !== listId) {
      moveItem(draggedItemId, draggedFromListId, listId);
    }
    sessionStorage.removeItem('draggedItemId');
    sessionStorage.removeItem('draggedFromListId');
    setIsDraggingItem(false);
  };

  const handleItemDragStart = (itemId: string, listId: string) => {
    sessionStorage.setItem('draggedItemId', itemId);
    sessionStorage.setItem('draggedFromListId', listId);
    setIsDraggingItem(true);
  };

  const handleItemDragEnd = () => {
    setTimeout(() => {
      sessionStorage.removeItem('draggedItemId');
      sessionStorage.removeItem('draggedFromListId');
      setIsDraggingItem(false);
    }, 100);
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

  const handleReorderLists = (fromIndex: number, toIndex: number) => {
    reorderLists(fromIndex, toIndex);
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
                onItemMove={() => {}}
                onItemDelete={(itemId) => deleteItem(itemId, list.id)}
                onItemRename={(itemId, newName) => renameItem(itemId, list.id, newName)}
                onToggleFavorite={(itemId) => toggleFavorite(itemId, list.id)}
                onUpload={(file) => uploadContent(list.id, file)}
                onItemClick={(itemId) => handleItemClick(itemId, list.id)}
                onDragOver={(e) => handleDragOver(e, list.id)}
                onDrop={(e) => handleDrop(e, list.id)}
                onItemDragStart={(itemId) => handleItemDragStart(itemId, list.id)}
                onItemDragEnd={handleItemDragEnd}
                onSaveChanges={() => clearNewListFlag()}
              />
            </div>
          </div>
        ))}
      </div>

      <ScrollNavigation
        lists={lists}
        currentIndex={currentIndex}
        isDragging={isDraggingItem}
        onNavigate={scrollToList}
        onDelete={(listId) => deleteList(listId)}
        onDropToList={handleDropToList}
        onReorder={handleReorderLists}
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
          <span>➕</span>
          <span>Add new list</span>
        </button>
      </div>
    </div>
  );
};

export default ContentPage;