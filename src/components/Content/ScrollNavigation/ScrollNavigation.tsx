import React, { useState, useEffect, useRef } from 'react';
import { ContentList } from '@models/ContentList';
import { styles } from './styles';
import { useDroppable } from '@dnd-kit/core';

import { useDndState } from '@/context/DndContext';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided, DraggableStateSnapshot } from '@hello-pangea/dnd';

interface ScrollNavigationProps {
  lists: ContentList[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onDelete: (listId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

// Individual nav item
const NavItem: React.FC<{
  list: ContentList;
  index: number;
  totalLists: number;
  currentIndex: number;
  showAllLabels: boolean;
  hideLines: boolean;
  onNavigate: (index: number) => void;
  onContextMenu: (e: React.MouseEvent, list: ContentList) => void;
}> = ({ list, index, totalLists, currentIndex, showAllLabels, hideLines, onNavigate, onContextMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const { activeData, isDragging: isDndKitDragging } = useDndState();
  const prevIsOver = useRef(false);

  // Dnd-kit droppable for accepting content items
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `nav-drop-${list.id}`,
    data: {
      type: 'LIST',
      id: list.id,
    },
  });

  const isActive = currentIndex === index;
  const isItemBeingDragged = isDndKitDragging && activeData?.type === 'ITEM';
  const isDropTarget = isOver && isItemBeingDragged;

  // Detect when drop happens - when isOver goes from true to false while dragging
  useEffect(() => {
    if (prevIsOver.current && !isOver && !isDndKitDragging) {
      // A drop just happened on this item
      setIsCelebrating(true);
      const timer = setTimeout(() => setIsCelebrating(false), 600);
      return () => clearTimeout(timer);
    }
    prevIsOver.current = isOver;
  }, [isOver, isDndKitDragging]);

  const shouldShowLabel = isHovered || showAllLabels || isDropTarget;

  // Dot styles helper
  const getDotStyles = (snapshot: DraggableStateSnapshot): React.CSSProperties => {
    const baseStyles = { ...styles.scrollDot };

    // Default color based on list type
    if (list.isSystem) {
      Object.assign(baseStyles, styles.scrollDotSystem);
    } else {
      Object.assign(baseStyles, styles.scrollDotCustom);
    }

    // Semi-transparent when content item is being dragged (but not this icon)
    if (isItemBeingDragged && !isDropTarget) {
      Object.assign(baseStyles, styles.scrollDotItemDragging);
    }

    // Hover state (when not active and not being dragged)
    if (isHovered && !isActive && !snapshot.isDragging) {
      if (list.isSystem) {
        Object.assign(baseStyles, styles.scrollDotHoverSystem);
      } else {
        Object.assign(baseStyles, styles.scrollDotHoverCustom);
      }
    }

    // Active/Selected state - GREEN (overrides default colors)
    if (isActive) {
      Object.assign(baseStyles, styles.scrollDotActive);
    }

    // Drop target state (when content item is hovering over)
    if (isDropTarget) {
      Object.assign(baseStyles, styles.scrollDotDropTarget);
    }

    // Celebration animation after drop
    if (isCelebrating) {
      Object.assign(baseStyles, styles.scrollDotCelebrating);
    }

    if (snapshot.isDragging) {
      Object.assign(baseStyles, {
        zIndex: 9999,
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
        transform: 'scale(1.1)',
      });
    }

    return baseStyles;
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...styles.scrollItem,
            ...provided.draggableProps.style,
          }}
        >
          {/* Label on the LEFT of the icon */}
          <span
            style={{
              ...styles.scrollLabel,
              ...(shouldShowLabel ? styles.scrollLabelVisible : {}),
            }}
          >
            {list.title}
          </span>

          {/* Icon dot - drag handle is HERE */}
          <div
            ref={setDroppableRef} // Dnd-kit ref
            style={getDotStyles(snapshot)}
            onClick={(e) => {
              if (!snapshot.isDragging) {
                e.stopPropagation();
                onNavigate(index);
              }
            }}
            onContextMenu={(e) => onContextMenu(e, list)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...provided.dragHandleProps}
          >
            <span style={styles.scrollIcon}>{list.icon}</span>
          </div>

          {!snapshot.isDragging && !hideLines && index < totalLists - 1 && (
            <div style={styles.scrollLine} />
          )}
        </div>
      )}
    </Draggable>
  );
};

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  lists,
  currentIndex,
  onNavigate,
  onDelete,
  onReorder,
}) => {
  const { isDragging: isDndKitDragging } = useDndState();
  const [isListDragging, setIsListDragging] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    listId: string;
    x: number;
    y: number;
  } | null>(null);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(false);

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

  // Scroll logic
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const [hoveredArrow, setHoveredArrow] = useState<'up' | 'down' | null>(null);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Allow a small tolerance (1px) for floating point rendering differences
    const isAtTop = el.scrollTop <= 1;
    const isAtBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1;

    setShowTopArrow(!isAtTop);
    setShowBottomArrow(!isAtBottom);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [lists.length]);

  // Check scroll when currentIndex changes to ensure active item is visible
  // Check scroll when currentIndex changes to ensure active item is visible
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const el = scrollContainerRef.current;

    // Calculate the position of the current item (center alignment logic preferred)
    const itemHeightWithSpacing = ITEM_HEIGHT; // Using the constant
    const itemTop = currentIndex * itemHeightWithSpacing;
    const itemBottom = itemTop + itemHeightWithSpacing;

    const scrollTop = el.scrollTop;
    const clientHeight = el.clientHeight;

    // Check if out of view
    // Top boundary
    if (itemTop < scrollTop) {
      el.scrollTo({ top: itemTop, behavior: 'smooth' });
    }
    // Bottom boundary
    else if (itemBottom > scrollTop + clientHeight) {
      el.scrollTo({ top: itemBottom - clientHeight, behavior: 'smooth' });
    }
  }, [currentIndex]);

  const handleScrollUp = () => {
    scrollContainerRef.current?.scrollBy({ top: -100, behavior: 'smooth' });
  };

  const handleScrollDown = () => {
    scrollContainerRef.current?.scrollBy({ top: 100, behavior: 'smooth' });
  };

  const onDragStart = () => {
    setIsListDragging(true);
  };

  const onDragEnd = (result: DropResult) => {
    setIsListDragging(false);

    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    onReorder(result.source.index, result.destination.index);
  };

  // Auto-scroll on hover arrows
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const startScrolling = (direction: 'up' | 'down') => {
    // Only auto-scroll on hover if dragging content or lists
    if (!isListDragging && !isDndKitDragging) return;

    stopScrolling();
    scrollInterval.current = setInterval(() => {
      scrollContainerRef.current?.scrollBy({ top: direction === 'up' ? -10 : 10, behavior: 'auto' });
    }, 16);
  };
  const stopScrolling = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const MAX_VISIBLE = 7;
  const ITEM_HEIGHT = 92;

  return (
    <>
      <nav style={styles.scrollNav}>
        {/* Up Arrow */}
        <div
          style={{
            ...styles.scrollArrow,
            opacity: showTopArrow ? 1 : 0,
            pointerEvents: showTopArrow ? 'auto' : 'none',
            ...(hoveredArrow === 'up' ? styles.scrollArrowHover : {}),
          }}
          onClick={handleScrollUp}
          onMouseEnter={() => {
            setHoveredArrow('up');
            startScrolling('up');
          }}
          onMouseLeave={() => {
            setHoveredArrow(null);
            stopScrolling();
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="hide-scrollbar"
          style={{
            ...styles.dotsContainer,
            height: `${Math.min(lists.length, MAX_VISIBLE) * ITEM_HEIGHT}px`,
            overflowY: 'auto',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          {/* Hide scrollbar for Webkit */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}</style>

          <div style={{ ...styles.innerContainer, transform: 'none' }}>
            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <Droppable droppableId="scroll-nav-list">
                {(provided: DroppableProvided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}
                  >
                    {lists.map((list, index) => (
                      <NavItem
                        key={list.id}
                        list={list}
                        index={index}
                        totalLists={lists.length}
                        currentIndex={currentIndex}
                        showAllLabels={isDndKitDragging || isListDragging}
                        hideLines={isListDragging || isDndKitDragging}
                        onNavigate={onNavigate}
                        onContextMenu={handleContextMenu}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>

        {/* Down Arrow */}
        <div
          style={{
            ...styles.scrollArrow,
            opacity: showBottomArrow ? 1 : 0,
            pointerEvents: showBottomArrow ? 'auto' : 'none',
            ...(hoveredArrow === 'down' ? styles.scrollArrowHover : {}),
          }}
          onClick={handleScrollDown}
          onMouseEnter={() => {
            setHoveredArrow('down');
            startScrolling('down');
          }}
          onMouseLeave={() => {
            setHoveredArrow(null);
            stopScrolling();
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
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
          <button
            style={{
              ...styles.contextMenuItem,
              ...(hoveredMenuItem ? styles.contextMenuItemHover : {}),
            }}
            onClick={handleDelete}
            onMouseEnter={() => setHoveredMenuItem(true)}
            onMouseLeave={() => setHoveredMenuItem(false)}
          >
            <span>🗑️</span>
            <span>Delete</span>
          </button>
        </div>
      )}
    </>
  );
};

export default ScrollNavigation;