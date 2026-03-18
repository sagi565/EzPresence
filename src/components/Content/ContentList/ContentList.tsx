import React, { useRef, useState, useEffect } from 'react';
import { ContentList as ContentListType } from '@models/ContentList';
import ContentListHeader from './ContentListHeader';
import ContentItem from '../ContentItem/ContentItem';
import UploadButton from '../UploadButton/UploadButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { 
  ListContainer, 
  ListScrollWrapper, 
  ScrollArrow,
  DraggableItemWrapper,
  MobileUploadContainer
} from './styles';
import { useDraggable } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDndState, DragData } from '@/context/DndContext';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ContentListProps {
  list: ContentListType;
  isNewList: boolean;
  onDelete: () => void;
  onTitleChange: (newTitle: string) => void;
  onIconClick: (element: HTMLElement) => void;
  onItemMove: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onItemRename: (itemId: string, newName: string) => void;
  onToggleFavorite: (itemId: string) => void;
  onUpload: (file: File) => void;
  onItemClick: (itemId: string) => void;
  onItemDoubleClick?: (itemId: string) => void;
  onSaveChanges?: () => void;
  /** When provided, the '+' button navigates instead of opening a file dialog */
  onAddNavigate?: () => void;
}

// Draggable wrapper for content items
const DraggableItem: React.FC<{
  item: any;
  listId: string;
  onItemClick: (itemId: string) => void;
  onItemDoubleClick?: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onItemRename: (itemId: string, newName: string) => void;
  onToggleFavorite: (itemId: string) => void;
  listType: 'video' | 'image';
}> = ({ item, listId, onItemClick, onItemDoubleClick, onItemDelete, onItemRename, onToggleFavorite, listType }) => {
  const { activeId } = useDndState();

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: item.id,
    data: {
      type: 'ITEM',
      id: item.id,
      listId: listId,
      title: item.title,
      thumbnail: item.thumbnail,
      mediaType: item.type,
    } as DragData,
  });

  const isBeingDragged = activeId === item.id;

  return (
    <DraggableItemWrapper
      ref={setNodeRef}
      $isBeingDragged={isBeingDragged}
      $isDragging={isDragging}
      {...listeners}
      {...attributes}
    >
      <ContentItem
        item={item}
        listType={listType}
        isDragging={isBeingDragged}
        onClick={() => !isDragging && onItemClick(item.id)}
        onDoubleClick={() => !isDragging && onItemDoubleClick?.(item.id)}
        onDelete={() => onItemDelete(item.id)}
        onRename={(newName) => onItemRename(item.id, newName)}
        onToggleFavorite={() => onToggleFavorite(item.id)}
      />
    </DraggableItemWrapper>
  );
};

const ContentList: React.FC<ContentListProps> = ({
  list,
  isNewList,
  onDelete,
  onTitleChange,
  onIconClick,
  onItemDelete,
  onItemRename,
  onToggleFavorite,
  onUpload,
  onItemClick,
  onItemDoubleClick,
  onSaveChanges,
  onAddNavigate,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLeftArrowHovered, setIsLeftArrowHovered] = useState(false);
  const [isRightArrowHovered, setIsRightArrowHovered] = useState(false);
  const isMobile = useIsMobile();

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteListConfirm, setDeleteListConfirm] = useState(false);

  const { isDragging, activeData } = useDndState();
  const isItemDragging = isDragging && activeData?.type === 'ITEM';
  const isDraggingFromOtherList = isItemDragging && activeData?.listId !== list.id;

  const isInvalidDropTarget = (() => {
    if (!isItemDragging || !list.isSystem) return false;
    const targetTitle = (list.title || '').toLowerCase();
    const isTargetVideo = targetTitle.includes('video') && targetTitle.includes('upload');
    const isTargetImage = targetTitle.includes('image') && targetTitle.includes('upload');

    const actualType = activeData?.mediaType;

    if (isTargetImage && actualType === 'video') return true;
    if (isTargetVideo && actualType === 'image') return true;
    return false;
  })();

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `list-drop-${list.id}`,
    data: {
      type: 'LIST',
      id: list.id,
    } as DragData,
    disabled: isInvalidDropTarget,
  });

  const isDropTarget = isOver && isDraggingFromOtherList && !isInvalidDropTarget;

  const updateArrows = () => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;

    if (container.scrollWidth <= container.clientWidth) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    if (scrollLeft < 10) {
      setShowLeftArrow(false);
      setShowRightArrow(true);
    } else if (Math.ceil(scrollLeft + container.clientWidth) >= container.scrollWidth - 10) {
      setShowLeftArrow(true);
      setShowRightArrow(false);
    } else {
      setShowLeftArrow(true);
      setShowRightArrow(true);
    }
  };

  useEffect(() => {
    updateArrows();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateArrows);
      window.addEventListener('resize', updateArrows);
      return () => {
        container.removeEventListener('scroll', updateArrows);
        window.removeEventListener('resize', updateArrows);
      };
    }
  }, [list.items.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const itemWidth = 280;
    const scrollAmount = itemWidth * 3 + 20 * 2;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      onItemDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleDeleteList = () => {
    setDeleteListConfirm(true);
  };

  const confirmDeleteList = () => {
    setDeleteListConfirm(false);
    onDelete();
  };

  const setRefs = (el: HTMLDivElement | null) => {
    (scrollRef as any).current = el;
    setDroppableRef(el);
  };

  return (
    <>
      <ListContainer
        data-list-id={list.id}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        $isMobile={isMobile}
      >
        <ContentListHeader
          icon={list.icon}
          title={list.title}
          subtitle={list.subtitle}
          isSystem={list.isSystem}
          isEditable={!list.isSystem}
          isNewList={isNewList}
          onTitleChange={onTitleChange}
          onIconClick={onIconClick}
          onDelete={handleDeleteList}
          onSave={onSaveChanges}
          listId={list.id}
          isMobile={isMobile}
        />

        <ListScrollWrapper
          ref={setRefs}
          $isDropTarget={isDropTarget}
          $isInvalidDropTarget={isInvalidDropTarget}
        >
          {/* Always show the upload button inline on desktop */}
          {!isMobile && (
            <UploadButton listType={list.listType} onUpload={onUpload} onNavigate={onAddNavigate} />
          )}

          {list.items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              listId={list.id}
              listType={list.listType}
              onItemClick={onItemClick}
              onItemDoubleClick={onItemDoubleClick}
              onItemDelete={setItemToDelete}
              onItemRename={onItemRename}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
          
          {/* Add a spacer on mobile at the start to simulate where the upload button would go, or just spacing */}
        </ListScrollWrapper>

        {isMobile && (
          <MobileUploadContainer $isEmpty={list.items.length === 0}>
            <UploadButton listType={list.listType} onUpload={onUpload} onNavigate={onAddNavigate} />
          </MobileUploadContainer>
        )}

        <ScrollArrow
          $side="left"
          $visible={showLeftArrow && isHovered}
          $isHovered={isLeftArrowHovered}
          onClick={() => handleScroll('left')}
          onMouseEnter={() => setIsLeftArrowHovered(true)}
          onMouseLeave={() => setIsLeftArrowHovered(false)}
        >
          ‹
        </ScrollArrow>
        <ScrollArrow
          $side="right"
          $visible={showRightArrow && isHovered}
          $isHovered={isRightArrowHovered}
          onClick={() => handleScroll('right')}
          onMouseEnter={() => setIsRightArrowHovered(true)}
          onMouseLeave={() => setIsRightArrowHovered(false)}
        >
          ›
        </ScrollArrow>
      </ListContainer>

      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="Delete Content?"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteItem}
        onCancel={() => setItemToDelete(null)}
      />

      <ConfirmDialog
        isOpen={deleteListConfirm}
        title="Delete List?"
        message="Are you sure you want to delete this list and all its contents? This action cannot be undone."
        confirmText="Delete List"
        cancelText="Cancel"
        onConfirm={confirmDeleteList}
        onCancel={() => setDeleteListConfirm(false)}
      />
    </>
  );
};

export default ContentList;