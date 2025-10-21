import React, { useState, useEffect } from 'react';
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

  const totalItems = lists.length;
  const showPagination = totalItems > MAX_VISIBLE_DOTS;

  // Calculate the window of visible dots
  const getVisibleRange = () => {
    if (!showPagination) {
      return { start: 0, end: totalItems };
    }

    // Apply manual offset for arrow navigation
    let start = Math.max(0, Math.min(totalItems - MAX_VISIBLE_DOTS, windowOffset));
    let end = Math.min(totalItems, start + MAX_VISIBLE_DOTS);
    
    // Adjust if we're near the end
    if (end === totalItems && totalItems > MAX_VISIBLE_DOTS) {
      start = Math.max(0, end - MAX_VISIBLE_DOTS);
    }
    
    return { start, end };
  };

  // Auto-adjust window when currentIndex changes to keep it visible
  useEffect(() => {
    if (!showPagination) return;
    
    const { start, end } = getVisibleRange();
    
    // If currentIndex is outside visible range, adjust window
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
      // Move the window up by 1
      setWindowOffset(Math.max(0, windowOffset - 1));
    }
  };

  const handlePageDown = () => {
    if (canScrollDown) {
      // Move the window down by 1
      setWindowOffset(Math.min(totalItems - MAX_VISIBLE_DOTS, windowOffset + 1));
    }
  };

  // Calculate which items to show
  const visibleItems = [];
  
  for (let i = startIndex; i < endIndex; i++) {
    visibleItems.push({ list: lists[i], index: i });
  }
  const [hoveredArrow, setHoveredArrow] = useState<'up' | 'down' | null>(null);

  const upArrowStyle = {
    ...styles.paginationArrow,
    ...styles.paginationArrowUp,
    ...(!canScrollUp ? styles.paginationArrowDisabled : {}),
    ...(hoveredArrow === 'up' && canScrollUp ? styles.paginationArrowHover : {}),
  };

  const downArrowStyle = {
    ...styles.paginationArrow,
    ...styles.paginationArrowDown,
    ...(!canScrollDown ? styles.paginationArrowDisabled : {}),
    ...(hoveredArrow === 'down' && canScrollDown ? styles.paginationArrowHover : {}),
  };

  // FIXED: Check if list can accept drops (not system list)
  const handleDragOver = (e: React.DragEvent, index: number, list: ContentList) => {
    if (isDragging) {
      // Prevent drop on system lists
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
    // Prevent drop on system lists
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
        {showPagination && (
          <button
            style={upArrowStyle}
            onClick={handlePageUp}
            disabled={!canScrollUp}
            onMouseEnter={() => setHoveredArrow('up')}
            onMouseLeave={() => setHoveredArrow(null)}
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
            // FIXED: Check if this is a system list and dragging is happening
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
                      // FIXED: Add disabled style for system lists during drag
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
                        // FIXED: Reduce opacity of icon for system lists during drag
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

        {showPagination && (
          <button
            style={downArrowStyle}
            onClick={handlePageDown}
            disabled={!canScrollDown}
            onMouseEnter={() => setHoveredArrow('down')}
            onMouseLeave={() => setHoveredArrow(null)}
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