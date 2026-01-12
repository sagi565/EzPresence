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

  // Auto-scroll the dots container to keep the current index in view
  useEffect(() => {
    if (dotsContainerRef.current) {
      const activeElement = dotsContainerRef.current.children[currentIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentIndex]);


  return (
    <>
      <nav style={styles.scrollNav}>
        <Droppable droppableId="list-navigation" type="LIST" direction="vertical">
          {(provided) => (
            <div
              ref={(el) => {
                (dotsContainerRef as any).current = el;
                provided.innerRef(el);
              }}
              style={{
                ...styles.dotsContainer,
                // Ensure drag over style if needed
              }}
              {...provided.droppableProps}
            >
              {lists.map((list, index) => (
                <Draggable
                  key={list.id}
                  draggableId={list.id}
                  index={index}
                  isDragDisabled={list.isSystem}
                >
                  {(provided, snapshot) => {
                    const isActive = currentIndex === index;
                    const isHovered = hoveredIndex === index;
                    const showAsHovered = isDragging || isHovered || snapshot.isDragging;

                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...styles.scrollItem,
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.5 : 1,
                        }}
                      >
                        {/* Label tooltip - Hide when dragging */}
                        {(showAsHovered || snapshot.isDragging) && !snapshot.isDragging && (
                          <div style={styles.scrollLabel}>{list.title}</div>
                        )}

                        <div
                          style={styles.scrollDotContainer}
                        >
                          <div
                            style={{
                              ...styles.scrollDot,
                              ...(isActive
                                ? list.isSystem
                                  ? styles.scrollDotActiveSystem
                                  : styles.scrollDotActiveCustom
                                : {}),
                              ...(showAsHovered && !isActive && !snapshot.isDragging ? styles.scrollDotHover : {}),
                              ...((snapshot.isDragging || snapshot.draggingOver) && !list.isSystem ? styles.scrollDotDragOver : {}),
                              ...(!list.isSystem ? styles.scrollDotDraggable : {}),
                            }}
                            onClick={() => onNavigate(index)}
                            onContextMenu={(e) => handleContextMenu(e, list)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          >
                            <span
                              style={{
                                ...styles.scrollIcon,
                                ...(showAsHovered || isActive || snapshot.isDragging ? styles.scrollIconVisible : {}),
                              }}
                            >
                              {list.icon}
                            </span>
                          </div>
                        </div>

                        {/* Connecting line - Hide when dragging so we only see the icon */}
                        {index < lists.length - 1 && !snapshot.isDragging && <div style={styles.scrollLine} />}
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
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