import React, { useRef, useState, useEffect } from 'react';
import { ContentList as ContentListType } from '@models/ContentList';
import ContentListHeader from './ContentListHeader';
import ContentItem from '../ContentItem/ContentItem';
import UploadButton from '../UploadButton/UploadButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { styles } from './styles';

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
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onItemDragStart?: (itemId: string) => void;
  onItemDragEnd?: () => void;
  onSaveChanges?: () => void;
}

const ContentList: React.FC<ContentListProps> = ({
  list,
  isNewList,
  onDelete,
  onTitleChange,
  onIconClick,
  onItemMove,
  onItemDelete,
  onItemRename,
  onToggleFavorite,
  onUpload,
  onItemClick,
  onDragOver,
  onDrop,
  onItemDragStart,
  onItemDragEnd,
  onSaveChanges,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLeftArrowHovered, setIsLeftArrowHovered] = useState(false);
  const [isRightArrowHovered, setIsRightArrowHovered] = useState(false);

  // Dialog State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteListConfirm, setDeleteListConfirm] = useState(false);

  const updateArrows = () => {
    const container = scrollRef.current;
    if (!container) return;

    const itemCount = list.items.length + 1;
    const scrollLeft = container.scrollLeft;

    if (itemCount <= 3) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    if (scrollLeft < 10) {
      setShowLeftArrow(false);
      setShowRightArrow(true);
    } else {
      setShowLeftArrow(true);
      setShowRightArrow(false);
    }
  };

  useEffect(() => {
    updateArrows();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateArrows);
      return () => container.removeEventListener('scroll', updateArrows);
    }
  }, [list.items.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    // All items now use vertical format (280px width)
    const itemWidth = 280;
    const scrollAmount = itemWidth * 3 + 20 * 2;

    if (direction === 'left') {
      container.scrollLeft = Math.max(0, container.scrollLeft - scrollAmount);
    } else {
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = Math.min(maxScroll, container.scrollLeft + scrollAmount);
    }

    setTimeout(updateArrows, 100);
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

  // All lists now have the same min-height for vertical items
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
          ref={scrollRef}
          style={styles.listScrollWrapper}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <UploadButton listType="video" onUpload={onUpload} />
          
          {list.items.map((item) => (
            <ContentItem
              key={item.id}
              item={item}
              listType="video"
              onDragStart={(e) => {
                e.dataTransfer.setData('itemId', item.id);
                e.dataTransfer.setData('listId', list.id);
                if (onItemDragStart) {
                  onItemDragStart(item.id);
                }
              }}
              onDragEnd={() => {
                if (onItemDragEnd) {
                  onItemDragEnd();
                }
              }}
              onClick={() => onItemClick(item.id)}
              onDelete={() => setItemToDelete(item.id)}
              onRename={(newName) => onItemRename(item.id, newName)}
              onToggleFavorite={() => onToggleFavorite(item.id)}
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

      {/* Delete Item Confirmation */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="Delete Content?"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteItem}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Delete List Confirmation */}
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