import React, { useState, useEffect, useRef } from 'react';
import { ContentList } from '@models/ContentList';
import { styles } from './styles';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface ScrollNavigationProps {
  lists: ContentList[];
  currentIndex: number;
  isDragging: boolean;
  onNavigate: (index: number) => void;
  onDelete: (listId: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  lists,
  currentIndex,
  isDragging,
  onNavigate,
  onDelete,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    listId: string;
    x: number;
    y: number;
  } | null>(null);

  const dotsContainerRef = useRef<HTMLDivElement>(null);

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

  // State for pagination
  const [scrollOffset, setScrollOffset] = useState(0);
  const MAX_VISIBLE = 7;
  const ITEM_HEIGHT = 120; // (40px dot + 60px line + 20px margin)
  const showArrows = lists.length > MAX_VISIBLE;

  const [hoveredArrow, setHoveredArrow] = useState<'up' | 'down' | null>(null); // State for arrow hover

  // Ensure active item is visible when index changes (e.g. valid drop or external nav)
  useEffect(() => {
    if (currentIndex < scrollOffset) {
      setScrollOffset(currentIndex);
    } else if (currentIndex >= scrollOffset + MAX_VISIBLE) {
      setScrollOffset(currentIndex - MAX_VISIBLE + 1);
    }
  }, [currentIndex, lists.length]);

  const handleScrollUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollOffset > 0) setScrollOffset(prev => prev - 1);
  };

  const handleScrollDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollOffset < lists.length - MAX_VISIBLE) setScrollOffset(prev => prev + 1);
  };

  // Auto-scroll logic
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = (direction: 'up' | 'down') => {
    stopAutoScroll();
    scrollIntervalRef.current = setInterval(() => {
      setScrollOffset(prev => {
        if (direction === 'up') {
          return prev > 0 ? prev - 1 : prev;
        } else {
          return prev < lists.length - MAX_VISIBLE ? prev + 1 : prev;
        }
      });
    }, 150); // Scroll every 150ms
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  return (
    <>



      <nav style={styles.scrollNav}>
        {/* Up Arrow */}
        {showArrows && (
          <div
            style={{
              ...styles.scrollArrow,
              ...(scrollOffset <= 0 ? styles.scrollArrowDisabled : {}),
              ...(hoveredArrow === 'up' && scrollOffset > 0 ? styles.scrollArrowHover : {}),
            }}
            onClick={handleScrollUp}
            onMouseEnter={() => {
              setHoveredArrow('up');
              startAutoScroll('up');
            }}
            onMouseLeave={() => {
              setHoveredArrow(null);
              stopAutoScroll();
            }}
          >
            {/* SVG Arrow Up */}
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        )}

        <div style={{
          ...styles.dotsContainer,
          height: `${MAX_VISIBLE * ITEM_HEIGHT}px`, // Fixed viewport height
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Center items
            width: '100%', // Fill the masked container
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transform: `translateY(-${scrollOffset * ITEM_HEIGHT}px)`,
          }}>
            <Droppable
              droppableId="list-navigation"
              type="LIST"
              direction="vertical"
              renderClone={(provided, snapshot, rubric) => {
                const list = lists[rubric.source.index];
                return (

                  <MouseTracker provided={provided} style={{}}>
                    <div
                      style={{
                        ...styles.scrollItem,
                        opacity: 1,
                        zIndex: 9999,
                        height: 'auto', // Changed to auto to fit MouseTracker
                        marginBottom: '0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={styles.scrollDotContainer}>
                        <div
                          style={{
                            ...styles.scrollDot,
                            ...(!list.isSystem ? styles.scrollDotDraggable : {}),
                            ...styles.scrollDotActiveCustom,
                            transform: 'scale(1.1)',
                            boxShadow: '0 0 30px rgba(155, 93, 229, 0.6)',
                          }}
                        >
                          <span style={{ ...styles.scrollIcon, opacity: 1, zIndex: 10 }}>
                            {list.icon}
                          </span>
                        </div>
                      </div>
                    </div>
                  </MouseTracker>
                );
              }}
            >
              {(provided) => (
                <div
                  ref={(el) => {
                    (dotsContainerRef as any).current = el;
                    provided.innerRef(el);
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Center items
                    width: '100%',
                  }}
                  {...provided.droppableProps}
                >
                  {lists.map((list, index) => (
                    <Draggable
                      key={list.id}
                      draggableId={list.id}
                      index={index}
                    // isDragDisabled={list.isSystem}
                    >
                      {(provided, snapshot) => {
                        const isActive = currentIndex === index;
                        const isHovered = hoveredIndex === index;
                        // Force Hover state if dragging this item
                        const showAsHovered = isDragging || isHovered || snapshot.isDragging;

                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...styles.scrollItem,
                              ...provided.draggableProps.style,
                              // Ensure layout stability during drag
                              opacity: snapshot.isDragging ? 1 : 1, // Full opacity when dragging
                              zIndex: snapshot.isDragging ? 9999 : 1, // High z-index
                              height: '120px', // Exact item height
                              marginBottom: '0', // Remove margin, using line to fill gap
                            }}
                          >
                            {/* Label tooltip - Hide when dragging */}
                            {(showAsHovered || snapshot.isDragging) && !snapshot.isDragging && (
                              <div style={styles.scrollLabel}>{list.title}</div>
                            )}

                            <div style={styles.scrollDotContainer}>
                              {/* isDropDisabled was removed to allow content items (Type: ITEM) to drop here always. 
                                   The type mismatch (LIST vs ITEM) will handle list drops. */}
                              <Droppable droppableId={`nav-drop-${list.id}`} type="ITEM">
                                {(dropProvided, dropSnapshot) => (
                                  <div
                                    ref={dropProvided.innerRef}
                                    {...dropProvided.droppableProps}
                                    style={{
                                      ...styles.scrollDot,
                                      ...(isActive
                                        ? list.isSystem
                                          ? styles.scrollDotActiveSystem
                                          : styles.scrollDotActiveCustom
                                        : {}),
                                      ...(showAsHovered && !isActive && !snapshot.isDragging ? styles.scrollDotHover : {}),
                                      // Show icon if: Hovered OR Active OR Being Dragged OR Dragging Over
                                      ...((snapshot.isDragging || snapshot.draggingOver) && !list.isSystem ? styles.scrollDotDragOver : {}),
                                      // Applying celebration animation when an item is dragged over this specific dot
                                      ...(dropSnapshot.isDraggingOver ? styles.scrollDotDropTarget : {}),
                                      ...(!list.isSystem ? styles.scrollDotDraggable : {}),
                                    }}
                                    onClick={() => onNavigate(index)}
                                    // ... rest of events
                                    onContextMenu={(e) => handleContextMenu(e, list)}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                  >
                                    <span
                                      style={{
                                        ...styles.scrollIcon,
                                        // Ensure high z-index and opacity during drag
                                        opacity: 1,
                                        zIndex: snapshot.isDragging ? 10 : 1,
                                      }}
                                    >
                                      {list.icon}
                                    </span>
                                    {/* Hidden placeholder for droppable logic */}
                                    <div style={{ display: 'none' }}>{dropProvided.placeholder}</div>
                                  </div>
                                )}
                              </Droppable>
                            </div>

                            {/* Connecting line - Hide when dragging so we only see the icon */}
                            {index < lists.length - 1 && !snapshot.isDragging && (
                              <div
                                style={{
                                  ...styles.scrollLine,
                                  ...(isDragging || snapshot.isDragging ? styles.scrollLineHidden : {}),
                                }}
                              />
                            )}
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        {/* Down Arrow */}
        {showArrows && (
          <div
            style={{
              ...styles.scrollArrow,
              ...(scrollOffset >= lists.length - MAX_VISIBLE ? styles.scrollArrowDisabled : {}),
              ...(hoveredArrow === 'down' && scrollOffset < lists.length - MAX_VISIBLE ? styles.scrollArrowHover : {}),
            }}
            onClick={handleScrollDown}
            onMouseEnter={() => {
              setHoveredArrow('down');
              startAutoScroll('down');
            }}
            onMouseLeave={() => {
              setHoveredArrow(null);
              stopAutoScroll();
            }}
          >
            {/* SVG Arrow Down */}
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </nav >

      {/* Context Menu */}
      {
        contextMenu && (
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
        )
      }
    </>
  );
};

// MouseTracker for forcing centered drag
const MouseTracker = ({ provided, style, children }: any) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.setProperty('position', 'fixed', 'important');
        ref.current.style.setProperty('top', `${e.clientY}px`, 'important');
        ref.current.style.setProperty('left', `${e.clientX}px`, 'important');

        // Center on cursor. For icons we keep scale 1 or close to it.
        // Center on cursor. For icons we keep scale 1 or close to it.
        ref.current.style.setProperty('transform', 'translate3d(-50%, -50%, 0)', 'important');

        ref.current.style.setProperty('z-index', '99999', 'important');
        ref.current.style.setProperty('pointer-events', 'none', 'important');
        ref.current.style.setProperty('margin', '0', 'important');
      }
    };
    window.addEventListener('mousemove', update, { capture: true });
    return () => window.removeEventListener('mousemove', update, { capture: true });
  }, []);

  return (
    <div
      ref={(el) => {
        provided.innerRef(el);
        (ref as any).current = el;
      }}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{
        ...style, // Do NOT spread draggableProps.style
        position: 'fixed',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollNavigation;