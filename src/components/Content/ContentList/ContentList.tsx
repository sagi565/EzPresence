import React, { useRef, useState, useEffect } from 'react';
import { ContentList as ContentListType } from '@models/ContentList';
import ContentListHeader from './ContentListHeader';
import ContentItem from '../ContentItem/ContentItem';
import UploadButton from '../UploadButton/UploadButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { styles } from './styles';
import { useDraggable } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import { useDndState, DragData } from '@/context/DndContext';

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
  onSaveChanges?: () => void;
}

// Draggable wrapper for content items
const DraggableItem: React.FC<{
  item: any;
  listId: string;
  onItemClick: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onItemRename: (itemId: string, newName: string) => void;
  onToggleFavorite: (itemId: string) => void;
}> = ({ item, listId, onItemClick, onItemDelete, onItemRename, onToggleFavorite }) => {
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
    } as DragData,
  });

  // Hide the item when it's being dragged (the overlay shows the preview)
  const isBeingDragged = activeId === item.id;

  return (
    <div
      ref={setNodeRef}
      style={{
        opacity: isBeingDragged ? 0.3 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'opacity 0.2s ease',
      }}
      {...listeners}
      {...attributes}
    >
      <ContentItem
        item={item}
        listType="video"
        isDragging={isBeingDragged}
        onClick={() => !isDragging && onItemClick(item.id)}
        onDelete={() => onItemDelete(item.id)}
        onRename={(newName) => onItemRename(item.id, newName)}
        onToggleFavorite={() => onToggleFavorite(item.id)}
      />
    </div>
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
  onSaveChanges,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLeftArrowHovered, setIsLeftArrowHovered] = useState(false);
  const [isRightArrowHovered, setIsRightArrowHovered] = useState(false);

  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteListConfirm, setDeleteListConfirm] = useState(false);

  const { isDragging, activeData } = useDndState();
  const isItemDragging = isDragging && activeData?.type === 'ITEM';
  const isDraggingFromOtherList = isItemDragging && activeData?.listId !== list.id;

  // Droppable for accepting items from other lists
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `list-drop-${list.id}`,
    data: {
      type: 'LIST',
      id: list.id,
    } as DragData,
  });

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

  const containerStyle = {
    ...styles.listContainer,
    minHeight: '540px',
  };

  const leftArrowStyle = {
    ...styles.scrollArrow,
    ...styles.scrollArrowLeft,
    ...(showLeftArrow && isHovered ? styles.scrollArrowVisible : {}),
    ...(isLeftArrowHovered ? styles.scrollArrowHover : {}),
  };

  const rightArrowStyle = {
    ...styles.scrollArrow,
    ...styles.scrollArrowRight,
    ...(showRightArrow && isHovered ? styles.scrollArrowVisible : {}),
    ...(isRightArrowHovered ? styles.scrollArrowHover : {}),
  };

  // Combined refs
  const setRefs = (el: HTMLDivElement | null) => {
    (scrollRef as any).current = el;
    setDroppableRef(el);
  };

  return (
    <>
      <div
        data-list-id={list.id}
        style={containerStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
        />

        <div
          ref={setRefs}
          style={{
            ...styles.listScrollWrapper,
            ...(isOver && isDraggingFromOtherList ? styles.listScrollWrapperDragOver : {}),
          }}
        >
          <UploadButton listType="video" onUpload={onUpload} />

          {list.items.map((item) => (
            <DraggableItem
              key={item.id}
              item={item}
              listId={list.id}
              onItemClick={onItemClick}
              onItemDelete={setItemToDelete}
              onItemRename={onItemRename}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>

        <button
          style={leftArrowStyle}
          onClick={() => handleScroll('left')}
          onMouseEnter={() => setIsLeftArrowHovered(true)}
          onMouseLeave={() => setIsLeftArrowHovered(false)}
        >
          ‹
        </button>
        <button
          style={rightArrowStyle}
          onClick={() => handleScroll('right')}
          onMouseEnter={() => setIsRightArrowHovered(true)}
          onMouseLeave={() => setIsRightArrowHovered(false)}
        >
          ›
        </button>
      </div>

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