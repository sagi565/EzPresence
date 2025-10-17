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

    const itemWidth = list.listType === 'video' ? 240 : 320;
    const scrollAmount = itemWidth * 5 + 16 * 4; // 5 items + gaps

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
    ...(list.listType === 'image' ? { minHeight: '220px' } : {}),
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
            }}
            onDragEnd={() => {}}
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