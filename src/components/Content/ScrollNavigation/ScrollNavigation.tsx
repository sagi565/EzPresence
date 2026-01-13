import React, { useState, useEffect, useRef } from 'react';
import { ContentList } from '@models/ContentList';
import { styles } from './styles';
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useDndState, DragData } from '@/context/DndContext';

interface ScrollNavigationProps {
  lists: ContentList[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onDelete: (listId: string) => void;
}

// Individual nav item
const NavItem: React.FC<{
  list: ContentList;
  index: number;
  totalLists: number;
  currentIndex: number;
  showAllLabels: boolean;
  onNavigate: (index: number) => void;
  onContextMenu: (e: React.MouseEvent, list: ContentList) => void;
}> = ({ list, index, totalLists, currentIndex, showAllLabels, onNavigate, onContextMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { activeId, activeData, isDragging } = useDndState();

  // Sortable for list reordering
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'LIST',
      id: list.id,
      icon: list.icon,
      title: list.title,
    } as DragData,
  });

  // Droppable for accepting content items
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `nav-drop-${list.id}`,
    data: {
      type: 'LIST',
      id: list.id,
    } as DragData,
  });

  const isActive = currentIndex === index;
  const isItemBeingDragged = isDragging && activeData?.type === 'ITEM';
  const isDropTarget = isOver && isItemBeingDragged;
  const isLastItem = index === totalLists - 1;

  // Show label if: hovering OR all labels should be shown (during any drag)
  const shouldShowLabel = isHovered || showAllLabels || isDropTarget;

  // Combine refs
  const setRefs = (el: HTMLElement | null) => {
    setSortableRef(el);
    setDroppableRef(el);
  };

  // Sortable transform style - this creates the "make space" animation
  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setRefs}
      style={{
        ...styles.scrollItem,
        ...sortableStyle,
        opacity: isSortableDragging ? 0 : 1,
        zIndex: isSortableDragging ? 0 : 1,
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
        style={{
          ...styles.scrollDot,
          ...(isActive
            ? list.isSystem
              ? styles.scrollDotActiveSystem
              : styles.scrollDotActiveCustom
            : {}),
          ...(isHovered && !isActive && !isSortableDragging ? styles.scrollDotHover : {}),
          ...(isDropTarget ? styles.scrollDotDropTarget : {}),
        }}
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(index);
        }}
        onContextMenu={(e) => onContextMenu(e, list)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...attributes}
        {...listeners}
      >
        <span style={styles.scrollIcon}>{list.icon}</span>
      </div>

      {/* Connecting line */}
      {!isLastItem && (
        <div
          style={{
            ...styles.scrollLine,
            ...(isDragging ? styles.scrollLineHidden : {}),
          }}
        />
      )}
    </div>
  );
};

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  lists,
  currentIndex,
  onNavigate,
  onDelete,
}) => {
  const { isDragging, activeData } = useDndState();
  const isReordering = isDragging && activeData?.type === 'LIST';
  
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

  // Pagination
  const [scrollOffset, setScrollOffset] = useState(0);
  const MAX_VISIBLE = 6;
  const ITEM_HEIGHT = 68; // 44px dot + 24px padding
  const showArrows = lists.length > MAX_VISIBLE;
  const [hoveredArrow, setHoveredArrow] = useState<'up' | 'down' | null>(null);

  // Keep active item visible
  useEffect(() => {
    if (currentIndex < scrollOffset) {
      setScrollOffset(currentIndex);
    } else if (currentIndex >= scrollOffset + MAX_VISIBLE) {
      setScrollOffset(currentIndex - MAX_VISIBLE + 1);
    }
  }, [currentIndex, lists.length]);

  const handleScrollUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollOffset > 0) setScrollOffset((prev) => prev - 1);
  };

  const handleScrollDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (scrollOffset < lists.length - MAX_VISIBLE) setScrollOffset((prev) => prev + 1);
  };

  // Auto-scroll ONLY during reordering
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoScroll = (direction: 'up' | 'down') => {
    if (!isReordering) return; // Only auto-scroll during reordering
    stopAutoScroll();
    scrollIntervalRef.current = setInterval(() => {
      setScrollOffset((prev) => {
        if (direction === 'up') {
          return prev > 0 ? prev - 1 : prev;
        } else {
          return prev < lists.length - MAX_VISIBLE ? prev + 1 : prev;
        }
      });
    }, 200);
  };

  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopAutoScroll();
  }, []);

  const listIds = lists.map((l) => l.id);

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
              if (isReordering && scrollOffset > 0) startAutoScroll('up');
            }}
            onMouseLeave={() => {
              setHoveredArrow(null);
              stopAutoScroll();
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </div>
        )}

        <div
          style={{
            ...styles.dotsContainer,
            height: `${Math.min(lists.length, MAX_VISIBLE) * ITEM_HEIGHT}px`,
          }}
        >
          <div
            style={{
              ...styles.innerContainer,
              transform: `translateY(-${scrollOffset * ITEM_HEIGHT}px)`,
            }}
          >
            <SortableContext items={listIds} strategy={verticalListSortingStrategy}>
              {lists.map((list, index) => (
                <NavItem
                  key={list.id}
                  list={list}
                  index={index}
                  totalLists={lists.length}
                  currentIndex={currentIndex}
                  showAllLabels={isDragging}
                  onNavigate={onNavigate}
                  onContextMenu={handleContextMenu}
                />
              ))}
            </SortableContext>
          </div>
        </div>

        {/* Down Arrow */}
        {showArrows && (
          <div
            style={{
              ...styles.scrollArrow,
              ...(scrollOffset >= lists.length - MAX_VISIBLE ? styles.scrollArrowDisabled : {}),
              ...(hoveredArrow === 'down' && scrollOffset < lists.length - MAX_VISIBLE
                ? styles.scrollArrowHover
                : {}),
            }}
            onClick={handleScrollDown}
            onMouseEnter={() => {
              setHoveredArrow('down');
              if (isReordering && scrollOffset < lists.length - MAX_VISIBLE) startAutoScroll('down');
            }}
            onMouseLeave={() => {
              setHoveredArrow(null);
              stopAutoScroll();
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
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