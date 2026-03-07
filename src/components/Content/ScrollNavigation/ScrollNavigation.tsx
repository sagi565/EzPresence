import React, { useState, useEffect, useRef } from 'react';
import { ContentList } from '@models/ContentList';
import { formatSystemListTitle } from '@models/ContentList';
import { 
  ScrollNavContainer, 
  DotsContainer, 
  InnerContainer, 
  ScrollItem, 
  ScrollLabel, 
  ScrollDot, 
  ScrollIcon, 
  ScrollLine, 
  ScrollArrow, 
  ContextMenu, 
  ContextMenuItem 
} from './styles';
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
  const { activeData, isDragging: isDndKitDragging, lastDropTimeRef } = useDndState();
  const prevIsOver = useRef(false);

  const isActive = currentIndex === index;
  const isItemBeingDragged = isDndKitDragging && activeData?.type === 'ITEM';
  const isDraggingFromOtherList = isItemBeingDragged && activeData?.listId !== list.id;

  const isInvalidDropTarget = (() => {
    if (!isItemBeingDragged || !list.isSystem) return false;
    const targetTitle = (list.title || '').toLowerCase();
    const isTargetVideo = targetTitle.includes('video') && targetTitle.includes('upload');
    const isTargetImage = targetTitle.includes('image') && targetTitle.includes('upload');
    const actualType = activeData?.mediaType;

    if (isTargetImage && actualType === 'video') return true;
    if (isTargetVideo && actualType === 'image') return true;
    return false;
  })();

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `nav-drop-${list.id}`,
    data: {
      type: 'LIST',
      id: list.id,
    },
    disabled: isInvalidDropTarget,
  });

  const isDropTarget = isOver && isDraggingFromOtherList && !isInvalidDropTarget;

  useEffect(() => {
    if (prevIsOver.current && !isOver && !isDndKitDragging) {
      setIsCelebrating(true);
      const timer = setTimeout(() => setIsCelebrating(false), 600);
      return () => clearTimeout(timer);
    }
    prevIsOver.current = isOver;
  }, [isOver, isDndKitDragging]);

  const shouldShowLabel = isHovered || showAllLabels || isDropTarget;

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <ScrollItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style}
        >
          {(() => {
            const gradientParts = formatSystemListTitle(list.title);
            return (
              <ScrollLabel $visible={shouldShowLabel}>
                {gradientParts ? (
                  <>
                    <span>{gradientParts.prefix}</span>
                    <span className="nav-grad-text">{gradientParts.gradient}</span>
                  </>
                ) : (
                  list.title
                )}
              </ScrollLabel>
            );
          })()}

          <ScrollDot
            ref={setDroppableRef}
            $isSystem={list.isSystem}
            $isActive={isActive}
            $isHovered={isHovered}
            $isDropTarget={isDropTarget}
            $isInvalidDropTarget={isInvalidDropTarget}
            $isItemDragging={isItemBeingDragged}
            $isCelebrating={isCelebrating}
            $isDragging={snapshot.isDragging}
            onClick={(e) => {
              const timeSinceDrop = Date.now() - lastDropTimeRef.current;
              if (!snapshot.isDragging && !isCelebrating && !isDndKitDragging && timeSinceDrop > 1000) {
                e.stopPropagation();
                onNavigate(index);
              }
            }}
            onContextMenu={(e) => onContextMenu(e, list)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            {...provided.dragHandleProps}
          >
            <ScrollIcon>{list.icon}</ScrollIcon>
          </ScrollDot>

          {index < totalLists - 1 && (
            <ScrollLine $hidden={snapshot.isDragging || hideLines} />
          )}
        </ScrollItem>
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

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showTopArrow, setShowTopArrow] = useState(false);
  const [showBottomArrow, setShowBottomArrow] = useState(false);
  const [hoveredArrow, setHoveredArrow] = useState<'up' | 'down' | null>(null);

  const MAX_VISIBLE = 7;
  const ITEM_HEIGHT = 108;

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (lists.length <= MAX_VISIBLE) {
      setShowTopArrow(false);
      setShowBottomArrow(false);
      return;
    }

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

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const el = scrollContainerRef.current;
    const itemHeightWithSpacing = ITEM_HEIGHT;
    const itemTop = currentIndex * itemHeightWithSpacing;
    const itemBottom = itemTop + itemHeightWithSpacing;
    const scrollTop = el.scrollTop;
    const clientHeight = el.clientHeight;

    if (itemTop < scrollTop) {
      el.scrollTo({ top: itemTop, behavior: 'smooth' });
    } else if (itemBottom > scrollTop + clientHeight) {
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
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (destIndex === sourceIndex) return;
    onReorder(sourceIndex, destIndex);
  };

  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const startScrolling = (direction: 'up' | 'down') => {
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

  return (
    <>
      <ScrollNavContainer>
        <ScrollArrow
          $visible={showTopArrow}
          $isHovered={hoveredArrow === 'up'}
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
        </ScrollArrow>

        <DotsContainer 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          $scrollable={lists.length > MAX_VISIBLE}
          $height={`${Math.min(lists.length, MAX_VISIBLE) * ITEM_HEIGHT}px`}
        >
          <InnerContainer>
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
          </InnerContainer>
        </DotsContainer>

        <ScrollArrow
          $visible={showBottomArrow}
          $isHovered={hoveredArrow === 'down'}
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
        </ScrollArrow>
      </ScrollNavContainer>

      {contextMenu && (
        <ContextMenu $top={contextMenu.y} $left={contextMenu.x} onClick={(e) => e.stopPropagation()}>
          <button
            style={{ border: 'none', background: 'transparent', width: '100%', padding: 0 }}
            onClick={handleDelete}
          >
            <ContextMenuItem 
              $isHovered={hoveredMenuItem}
              onMouseEnter={() => setHoveredMenuItem(true)}
              onMouseLeave={() => setHoveredMenuItem(false)}
            >
              <span>🗑️</span>
              <span>Delete</span>
            </ContextMenuItem>
          </button>
        </ContextMenu>
      )}
    </>
  );
};

export default ScrollNavigation;