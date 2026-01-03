import React, { useState, useEffect, useRef } from 'react';
import { ContentList } from '@models/ContentList';
import { styles } from './styles';

interface ScrollNavigationProps {
  lists: ContentList[];
  currentIndex: number;
  isDragging: boolean;
  onNavigate: (index: number) => void;
  onDelete: (listId: string) => void;
  onDropToList: (listId: string) => void;
}

const MAX_VISIBLE_DOTS = 7;

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  lists,
  currentIndex,
  isDragging,
  onNavigate,
  onDelete,
  onDropToList,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    listId: string;
    x: number;
    y: number;
  } | null>(null);
  const [windowOffset, setWindowOffset] = useState(0);
  const [hoveredArrow, setHoveredArrow] = useState<'up' | 'down' | null>(null);
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalItems = lists.length;
  const showPagination = totalItems > MAX_VISIBLE_DOTS;

  const getVisibleRange = () => {
    if (!showPagination) {
      return { start: 0, end: totalItems };
    }

    let start = Math.max(0, Math.min(totalItems - MAX_VISIBLE_DOTS, windowOffset));
    let end = Math.min(totalItems, start + MAX_VISIBLE_DOTS);
    
    if (end === totalItems && totalItems > MAX_VISIBLE_DOTS) {
      start = Math.max(0, end - MAX_VISIBLE_DOTS);
    }
    
    return { start, end };
  };

  useEffect(() => {
    if (!showPagination) return;
    
    const { start, end } = getVisibleRange();
    
    if (currentIndex < start) {
      setWindowOffset(currentIndex);
    } else if (currentIndex >= end) {
      setWindowOffset(Math.max(0, currentIndex - MAX_VISIBLE_DOTS + 1));
    }
  }, [currentIndex, showPagination]);

  const { start: startIndex, end: endIndex } = getVisibleRange();
  const canScrollUp = startIndex > 0;
  const canScrollDown = endIndex < totalItems;

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent, list: ContentList, index: number) => {
    if (list.isSystem) return;
    
    e.preventDefault();
    setContextMenu({
      listId: list.id,
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleDelete = () => {
    if (contextMenu) {
      onDelete(contextMenu.listId);
      setContextMenu(null);
    }
  };

  const handlePageUp = () => {
    if (canScrollUp) {
      setWindowOffset(Math.max(0, windowOffset - 1));
    }
  };

  const handlePageDown = () => {
    if (canScrollDown) {
      setWindowOffset(Math.min(totalItems - MAX_VISIBLE_DOTS, windowOffset + 1));
    }
  };

  const startAutoScroll = (direction: 'up' | 'down') => {
    if (autoScrollIntervalRef.current) return;

    autoScrollIntervalRef.current = setInterval(() => {
      if (direction === 'up' && canScrollUp) {
        setWindowOffset(prev => Math.max(0, prev - 1));
      } else if (direction === 'down' && canScrollDown) {
        setWindowOffset(prev => Math.min(totalItems - MAX_VISIBLE_DOTS, prev + 1));
      }
    }, 300);
  };

  const stopAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopAutoScroll();
    };
  }, []);

  useEffect(() => {
    if (!isDragging) {
      stopAutoScroll();
    }
  }, [isDragging]);

  const visibleItems = [];
  for (let i = startIndex; i < endIndex; i++) {
    visibleItems.push({ list: lists[i], index: i });
  }

  const upArrowStyle = {
    ...styles.paginationArrow,
    ...styles.paginationArrowUp,
    ...(isDragging && showPagination && canScrollUp ? styles.paginationArrowDragging : {}),
    ...(hoveredArrow === 'up' ? styles.paginationArrowHover : {}),
  };

  const downArrowStyle = {
    ...styles.paginationArrow,
    ...styles.paginationArrowDown,
    ...(isDragging && showPagination && canScrollDown ? styles.paginationArrowDragging : {}),
    ...(hoveredArrow === 'down' ? styles.paginationArrowHover : {}),
  };

  const handleDragOver = (e: React.DragEvent, index: number, list: ContentList) => {
    if (isDragging) {
      if (list.isSystem) {
        e.dataTransfer.dropEffect = 'none';
        return;
      }
      e.preventDefault();
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, listId: string, list: ContentList) => {
    if (list.isSystem) {
      return;
    }
    e.preventDefault();
    onDropToList(listId);
    setDragOverIndex(null);
  };

  return (
    <>
      <nav style={styles.scrollNav}>
        {/* Only render UP arrow if pagination is needed AND we can scroll up */}
        {showPagination && canScrollUp && (
          <button
            style={upArrowStyle}
            onClick={handlePageUp}
            onMouseEnter={() => {
              setHoveredArrow('up');
              if (isDragging) startAutoScroll('up');
            }}
            onMouseLeave={() => {
              setHoveredArrow(null);
              stopAutoScroll();
            }}
            onDragOver={(e) => {
              if (isDragging) {
                e.preventDefault();
                startAutoScroll('up');
              }
            }}
            onDragLeave={() => stopAutoScroll()}
          >
            ▲
          </button>
        )}

        <div style={styles.dotsContainer}>
          {visibleItems.map((item, idx) => {
            const { list, index } = item;
            const isActive = currentIndex === index;
            const isHovered = hoveredIndex === index;
            const isDragOver = dragOverIndex === index;
            const showAsHovered = isDragging || isHovered;
            const isSystemAndDragging = list.isSystem && isDragging;

            return (
              <div key={list.id} style={styles.scrollItem}>
                {(showAsHovered || isDragOver) && !isSystemAndDragging && (
                  <div style={styles.scrollLabel}>{list.title}</div>
                )}

                <div 
                  style={styles.scrollDotContainer}
                  onDragOver={(e) => handleDragOver(e, index, list)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, list.id, list)}
                >
                  <div
                    style={{
                      ...styles.scrollDot,
                      ...(isActive
                        ? list.isSystem
                          ? styles.scrollDotActiveSystem
                          : styles.scrollDotActiveCustom
                        : {}),
                      ...(showAsHovered && !isActive && !isSystemAndDragging ? styles.scrollDotHover : {}),
                      ...(isDragOver && !list.isSystem ? styles.scrollDotDragOver : {}),
                      ...(isSystemAndDragging ? styles.scrollDotDisabled : {}),
                    }}
                    onClick={() => onNavigate(index)}
                    onContextMenu={(e) => handleContextMenu(e, list, index)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span
                      style={{
                        ...styles.scrollIcon,
                        ...(showAsHovered || isActive || isDragOver ? styles.scrollIconVisible : {}),
                        ...(isSystemAndDragging ? { opacity: 0.3 } : {}),
                      }}
                    >
                      {list.icon}
                    </span>
                  </div>
                </div>

                {idx < visibleItems.length - 1 && <div style={styles.scrollLine} />}
              </div>
            );
          })}
        </div>

        {/* Only render DOWN arrow if pagination is needed AND we can scroll down */}
        {showPagination && canScrollDown && (
          <button
            style={downArrowStyle}
            onClick={handlePageDown}
            onMouseEnter={() => {
              setHoveredArrow('down');
              if (isDragging) startAutoScroll('down');
            }}
            onMouseLeave={() => {
              setHoveredArrow(null);
              stopAutoScroll();
            }}
            onDragOver={(e) => {
              if (isDragging) {
                e.preventDefault();
                startAutoScroll('down');
              }
            }}
            onDragLeave={() => stopAutoScroll()}
          >
            ▼
          </button>
        )}
      </nav>

      {contextMenu && (
        <div
          style={{
            ...styles.contextMenu,
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={styles.contextMenuItem} onClick={handleDelete}>
            <span>🗑️</span>
            <span>Delete</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollNavigation;