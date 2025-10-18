import React, { useRef, useState, useEffect } from 'react';
import { ContentList as ContentListType } from '@models/ContentList';
import ContentListHeader from './ContentListHeader';
import ContentItem from '../ContentItem/ContentItem';
import UploadButton from '../UploadButton/UploadButton';
import { styles } from './styles';

interface ContentListProps {
  list: ContentListType;
  onDelete: () => void;
  onTitleChange: (newTitle: string) => void;
  onIconClick: () => void;
  onItemMove: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onToggleFavorite: (itemId: string) => void;
  onUpload: (file: File) => void;
  onItemClick: (itemId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onItemDragStart?: (itemId: string) => void;
  onItemDragEnd?: () => void;
}

const ContentList: React.FC<ContentListProps> = ({
  list,
  onDelete,
  onTitleChange,
  onIconClick,
  onItemMove,
  onItemDelete,
  onToggleFavorite,
  onUpload,
  onItemClick,
  onDragOver,
  onDrop,
  onItemDragStart,
  onItemDragEnd,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLeftArrowHovered, setIsLeftArrowHovered] = useState(false);
  const [isRightArrowHovered, setIsRightArrowHovered] = useState(false);

  const updateArrows = () => {
    const container = scrollRef.current;
    if (!container) return;

    const itemCount = list.items.length + 1; // +1 for upload button
    const scrollLeft = container.scrollLeft;

    // Show arrows only if more than 5 items
    if (itemCount <= 5) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    // Show ONLY left arrow if scrolled from start (scrollLeft > 10)
    // Show ONLY right arrow if at start (scrollLeft < 10)
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

    // Updated item widths for bigger items
    const itemWidth = list.listType === 'video' ? 280 : 380;
    const scrollAmount = itemWidth * 5 + 20 * 4; // 5 items + gaps (updated gap from 16 to 20)

    if (direction === 'left') {
      container.scrollLeft = Math.max(0, container.scrollLeft - scrollAmount);
    } else {
      const maxScroll = container.scrollWidth - container.clientWidth;
      container.scrollLeft = Math.min(maxScroll, container.scrollLeft + scrollAmount);
    }

    setTimeout(updateArrows, 100);
  };

  const containerStyle = {
    ...styles.listContainer,
    // Updated minHeight for bigger image items
    ...(list.listType === 'image' ? { minHeight: '260px' } : {}),
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
        onTitleChange={onTitleChange}
        onIconClick={onIconClick}
        onDelete={onDelete}
        listId={list.id}
      />

      <div
        ref={scrollRef}
        style={styles.listScrollWrapper}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <UploadButton listType={list.listType} onUpload={onUpload} />
        
        {list.items.map((item) => (
          <ContentItem
            key={item.id}
            item={item}
            listType={list.listType}
            onDragStart={(e) => {
              e.dataTransfer.setData('itemId', item.id);
              e.dataTransfer.setData('listId', list.id);
              // Call the drag start handler to notify parent
              if (onItemDragStart) {
                onItemDragStart(item.id);
              }
            }}
            onDragEnd={() => {
              // Call the drag end handler to notify parent
              if (onItemDragEnd) {
                onItemDragEnd();
              }
            }}
            onClick={() => onItemClick(item.id)}
            onDelete={() => onItemDelete(item.id)}
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
  );
};

export default ContentList;