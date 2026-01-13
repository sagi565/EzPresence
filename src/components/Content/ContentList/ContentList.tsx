import React, { useRef, useState, useEffect } from 'react';
import { ContentList as ContentListType } from '@models/ContentList';
import ContentListHeader from './ContentListHeader';
import ContentItem from '../ContentItem/ContentItem';
import UploadButton from '../UploadButton/UploadButton';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { styles } from './styles';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface ContentListProps {
  list: ContentListType;
  isNewList: boolean;
  onDelete: () => void;
  onTitleChange: (newTitle: string) => void;
  onIconClick: (element: HTMLElement) => void;
  onItemMove: (itemId: string) => void;
  onItemDelete: (itemId: string) => void;
  onItemRename: (itemId: string, newName: string) => void;
  onToggleFavorite: (itemId: string) => void;
  onUpload: (file: File) => void;
  onItemClick: (itemId: string) => void;
  onSaveChanges?: () => void;
  // Legacy props removed or optional if needed during transition
}

const ContentList: React.FC<ContentListProps> = ({
  list,
  isNewList,
  onDelete,
  onTitleChange,
  onIconClick,
  onItemDelete,
  onItemRename,
  onToggleFavorite,
  onUpload,
  onItemClick,
  onSaveChanges,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLeftArrowHovered, setIsLeftArrowHovered] = useState(false);
  const [isRightArrowHovered, setIsRightArrowHovered] = useState(false);

  // Dialog State
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [deleteListConfirm, setDeleteListConfirm] = useState(false);

  const updateArrows = () => {
    const container = scrollRef.current;
    if (!container) return;

    // const itemCount = list.items.length + 1; // +1 for upload button
    const scrollLeft = container.scrollLeft;

    // Basic check for scroll possibility
    if (container.scrollWidth <= container.clientWidth) {
      setShowLeftArrow(false);
      setShowRightArrow(false);
      return;
    }

    if (scrollLeft < 10) {
      setShowLeftArrow(false);
      setShowRightArrow(true);
    } else if (Math.ceil(scrollLeft + container.clientWidth) >= container.scrollWidth - 10) {
      setShowLeftArrow(true);
      setShowRightArrow(false);
    } else {
      setShowLeftArrow(true);
      setShowRightArrow(true);
    }
  };

  useEffect(() => {
    updateArrows();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', updateArrows);
      // Also update on resize
      window.addEventListener('resize', updateArrows);
      return () => {
        container.removeEventListener('scroll', updateArrows);
        window.removeEventListener('resize', updateArrows);
      };
    }
  }, [list.items.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    // All items now use vertical format (280px width)
    const itemWidth = 280;
    const scrollAmount = itemWidth * 3 + 20 * 2;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const confirmDeleteItem = () => {
    if (itemToDelete) {
      onItemDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  const handleDeleteList = () => {
    setDeleteListConfirm(true);
  };

  const confirmDeleteList = () => {
    setDeleteListConfirm(false);
    onDelete();
  };

  // All lists now have the same min-height for vertical items
  const containerStyle = {
    ...styles.listContainer,
    minHeight: '540px',
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
    <>
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
          isNewList={isNewList}
          onTitleChange={onTitleChange}
          onIconClick={onIconClick}
          onDelete={handleDeleteList}
          onSave={onSaveChanges}
          listId={list.id}
        />

        <Droppable
          droppableId={list.id}
          type="ITEM"
          direction="horizontal"
          renderClone={(provided, snapshot, rubric) => {
            const item = list.items[rubric.source.index];
            return (
              <MouseTracker provided={provided} style={{}}>
                <ContentItem
                  item={item}
                  listType="video"
                  isDragging={true}
                  // Visual clone doesn't need interactivity
                  onClick={() => { }}
                  onDelete={() => { }}
                  onRename={() => { }}
                  onToggleFavorite={() => { }}
                />
              </MouseTracker>
            );
          }}
        >
          {(droppableProvided, droppableSnapshot) => (
            <div
              ref={(el) => {
                (scrollRef as any).current = el;
                droppableProvided.innerRef(el);
              }}
              style={{
                ...styles.listScrollWrapper,
                backgroundColor: 'transparent',
                transition: 'background-color 0.2s ease',
                minHeight: '420px', // Ensure height for drop target
              }}
              {...droppableProvided.droppableProps}
            >
              <UploadButton listType="video" onUpload={onUpload} />

              {list.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
                    <ContentItem
                      item={item}
                      listType="video"
                      provided={draggableProvided}
                      isDragging={draggableSnapshot.isDragging}
                      onClick={() => onItemClick(item.id)}
                      onDelete={() => setItemToDelete(item.id)}
                      onRename={(newName) => onItemRename(item.id, newName)}
                      onToggleFavorite={() => onToggleFavorite(item.id)}
                    />
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </div>
          )}
        </Droppable>

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

      {/* Delete Item Confirmation */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        title="Delete Content?"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteItem}
        onCancel={() => setItemToDelete(null)}
      />

      {/* Delete List Confirmation */}
      <ConfirmDialog
        isOpen={deleteListConfirm}
        title="Delete List?"
        message="Are you sure you want to delete this list and all its contents? This action cannot be undone."
        confirmText="Delete List"
        cancelText="Cancel"
        onConfirm={confirmDeleteList}
        onCancel={() => setDeleteListConfirm(false)}
      />
    </>
  );
};

const MouseTracker = ({ provided, style, children }: any) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = (e: MouseEvent) => {
      if (ref.current) {
        // Enforce fixed position on the mouse coordinates
        ref.current.style.setProperty('position', 'fixed', 'important');
        ref.current.style.setProperty('top', `${e.clientY}px`, 'important');
        ref.current.style.setProperty('left', `${e.clientX}px`, 'important');

        // Strict transform: center on cursor (-50%) and scale down (0.2)
        // Strict transform: center on cursor (-50%) and scale down (0.2)
        ref.current.style.setProperty('transform', 'translate3d(-50%, -50%, 0) scale(0.2)', 'important');
        ref.current.style.setProperty('transform-origin', 'center center', 'important');

        ref.current.style.setProperty('z-index', '99999', 'important');
        ref.current.style.setProperty('pointer-events', 'none', 'important');
        ref.current.style.setProperty('margin', '0', 'important');

        // Ensure width/height don't collapse (though scale handles the visual size)
        ref.current.style.setProperty('width', '280px', 'important');
        ref.current.style.setProperty('height', 'auto', 'important');
      }
    };

    window.addEventListener('mousemove', update, { capture: true });
    // Initial position if event is not yet fired
    // window.dispatchEvent(new Event('mousemove')); 

    return () => {
      window.removeEventListener('mousemove', update, { capture: true });
    };
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
        // Do NOT spread provided.draggableProps.style here to avoid conflicting transforms
        ...style,
        position: 'fixed',
        zIndex: 99999,
        pointerEvents: 'none',
        width: '280px', // Match original item width
      }}
    >
      {children}
    </div>
  );
};

export default ContentList;