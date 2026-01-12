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
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const MAX_VISIBLE_DOTS = 7;

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  lists,
  currentIndex,
  isDragging,
  onNavigate,
  onDelete,
  onDropToList,
  onReorder,
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
  
  // Reorder drag state
  const [reorderDragIndex, setReorderDragIndex] = useState<number | null>(null);
  const [reorderTargetIndex, setReorderTargetIndex] = useState<number | null>(null);
  
  const autoScrollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);

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

  // Keep current item visible
  useEffect(() => {
    if (!showPagination) return;
    
    const { start, end } = getVisibleRange();
    
    if (currentIndex < start) {
      setWindowOffset(currentIndex);
    } else if (currentIndex >= end) {
      setWindowOffset(Math.max(0, currentIndex - MAX_VISIBLE_DOTS + 1));
    }
  }, [currentIndex, showPagination, totalItems]);

  const { start: startIndex, end: endIndex } = getVisibleRange();
  const canScrollUp = startIndex > 0;
  const canScrollDown = endIndex < totalItems;

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const handleContextMenu = (e: React.MouseEvent, list: ContentList) => {
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

  // Smooth scroll functions
  const handlePageUp = () => {
    if (canScrollUp) {
      setWindowOffset(prev => Math.max(0, prev - 1));
    }
  };

  const handlePageDown = () => {
    if (canScrollDown) {
      setWindowOffset(prev => Math.min(totalItems - MAX_VISIBLE_DOTS, prev + 1));
    }
  };

  const startAutoScroll = (direction: 'up' | 'down') => {
    if (autoScrollIntervalRef.current) return;

    autoScrollIntervalRef.current = setInterval(() => {
      if (direction === 'up') {
        setWindowOffset(prev => Math.max(0, prev - 1));
      } else {
        setWindowOffset(prev => Math.min(totalItems - MAX_VISIBLE_DOTS, prev + 1));
      }
    }, 400);
  };

  const stopAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  // Cleanup
  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  useEffect(() => {
    if (!isDragging && reorderDragIndex === null) {
      stopAutoScroll();
    }
  }, [isDragging, reorderDragIndex]);

  // --- Reorder Drag Handlers ---
  const handleReorderDragStart = (e: React.DragEvent, index: number, list: ContentList) => {
    if (list.isSystem) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('reorder', String(index));
    setReorderDragIndex(index);
    
    // Create custom drag image
    const dragImage = document.createElement('div');
    dragImage.style.cssText = `
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #9b5de5 0%, #14b8a6 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      position: absolute;
      top: -1000px;
    `;
    dragImage.textContent = list.icon;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 20, 20);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleReorderDragOver = (e: React.DragEvent, index: number, list: ContentList) => {
    e.preventDefault();
    
    // Don't allow dropping on system lists
    if (list.isSystem) {
      e.dataTransfer.dropEffect = 'none';
      return;
    }
    
    e.dataTransfer.dropEffect = 'move';
    
    if (reorderDragIndex !== null && index !== reorderDragIndex) {
      setReorderTargetIndex(index);
    }
  };

  const handleReorderDragLeave = () => {
    // Don't clear immediately to prevent flickering
  };

  const handleReorderDrop = (e: React.DragEvent, toIndex: number, list: ContentList) => {
    e.preventDefault();
    
    if (list.isSystem) return;
    
    const fromIndexStr = e.dataTransfer.getData('reorder');
    if (fromIndexStr) {
      const fromIndex = parseInt(fromIndexStr, 10);
      if (fromIndex !== toIndex && !isNaN(fromIndex)) {
        onReorder(fromIndex, toIndex);
      }
    }
    
    setReorderDragIndex(null);
    setReorderTargetIndex(null);
  };

  const handleReorderDragEnd = () => {
    setReorderDragIndex(null);
    setReorderTargetIndex(null);
  };

  // Content item drag handlers
  const handleContentDragOver = (e: React.DragEvent, list: ContentList) => {
    if (isDragging && !list.isSystem) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleContentDrop = (e: React.DragEvent, listId: string, list: ContentList) => {
    if (list.isSystem) return;
    e.preventDefault();
    onDropToList(listId);
    setDragOverIndex(null);
  };

  // Build visible items
  const visibleItems = [];
  for (let i = startIndex; i < endIndex; i++) {
    visibleItems.push({ list: lists[i], index: i });
  }

  return (
    <>
      <nav style={styles.scrollNav}>
        {/* UP Arrow */}
        {showPagination && (
          <button
            style={{
              ...styles.paginationArrow,
              ...styles.paginationArrowUp,
              ...(canScrollUp ? {} : styles.paginationArrowHidden),
              ...(hoveredArrow === 'up' && canScrollUp ? styles.paginationArrowHover : {}),
            }}
            onClick={handlePageUp}
            onMouseEnter={() => {
              setHoveredArrow('up');
              if (reorderDragIndex !== null) startAutoScroll('up');
            }}
            onMouseLeave={() => {
              setHoveredArrow(null);
              stopAutoScroll();
            }}
            onDragOver={(e) => {
              if (reorderDragIndex !== null) {
                e.preventDefault();
                startAutoScroll('up');
              }
            }}
            onDragLeave={stopAutoScroll}
            disabled={!canScrollUp}
          >
            ▲
          </button>
        )}

        <div 
          ref={dotsContainerRef}
          style={styles.dotsContainer}
        >
          {visibleItems.map((item, idx) => {
            const { list, index } = item;
            const isActive = currentIndex === index;
            const isHovered = hoveredIndex === index;
            const isDragOver = dragOverIndex === index || reorderTargetIndex === index;
            const showAsHovered = isDragging || isHovered || reorderDragIndex !== null;
            const isSystemAndDragging = list.isSystem && (isDragging || reorderDragIndex !== null);
            const isBeingDragged = reorderDragIndex === index;

            return (
              <div 
                key={list.id} 
                style={{
                  ...styles.scrollItem,
                  ...(isBeingDragged ? styles.scrollItemDragging : {}),
                }}
              >
                {/* Label tooltip */}
                {(showAsHovered || isDragOver) && !isSystemAndDragging && !isBeingDragged && (
                  <div style={styles.scrollLabel}>{list.title}</div>
                )}

                <div 
                  style={styles.scrollDotContainer}
                  draggable={!list.isSystem}
                  onDragStart={(e) => handleReorderDragStart(e, index, list)}
                  onDragOver={(e) => {
                    handleReorderDragOver(e, index, list);
                    handleContentDragOver(e, list);
                    if (isDragging && !list.isSystem) {
                      setDragOverIndex(index);
                    }
                  }}
                  onDragLeave={() => {
                    handleReorderDragLeave();
                    setDragOverIndex(null);
                  }}
                  onDrop={(e) => {
                    if (reorderDragIndex !== null) {
                      handleReorderDrop(e, index, list);
                    } else if (isDragging) {
                      handleContentDrop(e, list.id, list);
                    }
                  }}
                  onDragEnd={handleReorderDragEnd}
                >
                  <div
                    style={{
                      ...styles.scrollDot,
                      ...(isActive
                        ? list.isSystem
                          ? styles.scrollDotActiveSystem
                          : styles.scrollDotActiveCustom
                        : {}),
                      ...(showAsHovered && !isActive && !isSystemAndDragging && !isBeingDragged ? styles.scrollDotHover : {}),
                      ...(isDragOver && !list.isSystem ? styles.scrollDotDragOver : {}),
                      ...(isSystemAndDragging ? styles.scrollDotDisabled : {}),
                      ...(!list.isSystem ? styles.scrollDotDraggable : {}),
                      ...(isBeingDragged ? styles.scrollDotBeingDragged : {}),
                    }}
                    onClick={() => onNavigate(index)}
                    onContextMenu={(e) => handleContextMenu(e, list)}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <span
                      style={{
                        ...styles.scrollIcon,
                        ...(showAsHovered || isActive || isDragOver ? styles.scrollIconVisible : {}),
                        ...(isSystemAndDragging || isBeingDragged ? { opacity: 0.3 } : {}),
                      }}
                    >
                      {list.icon}
                    </span>
                  </div>
                </div>

                {/* Connecting line */}
                {idx < visibleItems.length - 1 && <div style={styles.scrollLine} />}
              </div>
            );
          })}
        </div>

        {/* DOWN Arrow */}
        {showPagination && (
          <button
            style={{
              ...styles.paginationArrow,
              ...styles.paginationArrowDown,
              ...(canScrollDown ? {} : styles.paginationArrowHidden),
              ...(hoveredArrow === 'down' && canScrollDown ? styles.paginationArrowHover : {}),
            }}
            onClick={handlePageDown}
            onMouseEnter={() => {
              setHoveredArrow('down');
              if (reorderDragIndex !== null) startAutoScroll('down');
            }}
            onMouseLeave={() => {
              setHoveredArrow(null);
              stopAutoScroll();
            }}
            onDragOver={(e) => {
              if (reorderDragIndex !== null) {
                e.preventDefault();
                startAutoScroll('down');
              }
            }}
            onDragLeave={stopAutoScroll}
            disabled={!canScrollDown}
          >
            ▼
          </button>
        )}
      </nav>

      {/* Context Menu */}
      {contextMenu && (
        <div
          style={{
            ...styles.contextMenu,
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            style={styles.contextMenuItem} 
            onClick={handleDelete}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span>🗑️</span>
            <span>Delete</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollNavigation;