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
import { 
  Container, 
  ContentArea, 
  ListSection, 
  ListWrapper, 
  AddListButtonWrapper, 
  AddListButton,
  PoofContainer,
  Particle,
  ItemPreview,
  EmptyPreview,
  PreviewTitle,
  ListPreview
} from './styles';
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
      const originX = 5 + Math.random() * 90;
      const originY = 10 + Math.random() * 80;
      const angle = -60 + Math.random() * 300;
      const distance = 80 + Math.random() * 140;
      const rad = (angle * Math.PI) / 180;
      const dx = Math.cos(rad) * distance;
      const dy = Math.sin(rad) * distance;
      const size = 5 + Math.random() * 7;
      const color = POOF_COLORS[Math.floor(Math.random() * POOF_COLORS.length)];
      const delay = Math.random() * 120;
      const duration = 650 + Math.random() * 450;
      return { originX, originY, dx, dy, size, color, delay, duration };
    });
  }, []);

  return (
    <PoofContainer>
      {particles.map((p, i) => (
        <Particle
          key={i}
          $top={`${p.originY}%`}
          $left={`${p.originX}%`}
          $size={p.size}
          $color={p.color}
          $duration={p.duration}
          $delay={p.delay}
          style={{
            ['--pdx' as any]: `${p.dx}px`,
            ['--pdy' as any]: `${p.dy}px`,
          }}
        />
      ))}
    </PoofContainer>
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
    <ItemPreview>
      {thumbnailSrc ? (
        <img src={thumbnailSrc} alt={item.title} />
      ) : (
        <EmptyPreview>
          {item.type === 'video' ? '🎬' : '🖼️'}
        </EmptyPreview>
      )}
      <PreviewTitle>{item.title}</PreviewTitle>
    </ItemPreview>
  );
};

// Drag overlay for list icons - just the icon, no label
const ListDragPreview: React.FC<{ list: any }> = ({ list }) => {
  if (!list) return null;

  return (
    <ListPreview $isSystem={list.isSystem}>
      {list.icon}
    </ListPreview>
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
  const { isDragging, activeData } = useDndState();
  const wasDragging = useRef(false);
  const activeDragTypeRef = useRef<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listsRef = useRef<HTMLDivElement[]>([]);
  const updateIndexTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentIndexRef = useRef(0);
  const [deletingListIds, setDeletingListIds] = useState<Set<string>>(new Set());
  const [isReorderScrolling, setIsReorderScrolling] = useState(false);

  useEffect(() => {
    if (isDragging) {
      wasDragging.current = true;
      activeDragTypeRef.current = activeData?.type || null;
    } else if (wasDragging.current) {
      wasDragging.current = false;
      activeDragTypeRef.current = null;

      setIsReorderScrolling(true);
      const timeout = setTimeout(() => {
        setIsReorderScrolling(false);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [isDragging, activeData?.type]);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

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

  const handleDeleteListWithAnimation = (listId: string) => {
    setDeletingListIds(prev => new Set(prev).add(listId));
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
  }, [lists.length]);

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

  return (
    <Container>
      <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />

      <ContentArea 
        ref={containerRef} 
        $isDraggingList={isDragging && activeData?.type === 'LIST'}
        $isReorderScrolling={isReorderScrolling}
        key={currentBrand?.id || 'no-brand'}
      >
        {lists.map((list, index) => {
          const isDeleting = deletingListIds.has(list.id);
          return (
            <ListSection
              key={list.id}
              ref={(el) => { if (el) listsRef.current[index] = el; }}
              $isDeleting={isDeleting}
            >
              {isDeleting && <PoofParticles />}
              <ListWrapper>
                <ContentList
                  list={list}
                  isNewList={newlyCreatedListId === list.id}
                  onTitleChange={(newTitle) => updateListTitle(list.id, newTitle)}
                  onIconClick={(element: HTMLElement) => handleIconClick(list.id, element)}
                  onItemMove={() => {}}
                  onItemDelete={(itemId) => deleteItem(itemId, list.id)}
                  onItemRename={(itemId, newName) => renameItem(itemId, list.id, newName)}
                  onToggleFavorite={(itemId) => toggleFavorite(itemId, list.id)}
                  onUpload={(file) => uploadContent(list.id, file)}
                  onItemClick={(itemId) => handleItemClick(itemId, list.id)}
                  onSaveChanges={() => clearNewListFlag()}
                />
              </ListWrapper>
            </ListSection>
          );
        })}
      </ContentArea>

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

      <AddListButtonWrapper>
        <AddListButton onClick={addNewList}>
          <span>➕</span>
          <span>Add new list</span>
        </AddListButton>
      </AddListButtonWrapper>
    </Container>
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