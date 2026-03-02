import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  DndContext as DndKitContext,
  DragOverlay,
  pointerWithin,
  rectIntersection,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  UniqueIdentifier,
  CollisionDetection,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { ContentList } from '@models/ContentList';

// Types for drag and drop operations
export type DragType = 'LIST' | 'ITEM';

export interface DragData {
  type: DragType;
  id: string;
  listId?: string;
  icon?: string;
  title?: string;
  thumbnail?: string;
  mediaType?: 'video' | 'image';
}

interface DndContextValue {
  activeId: UniqueIdentifier | null;
  activeData: DragData | null;
  overId: UniqueIdentifier | null;
  isDragging: boolean;
}

const DndContextState = createContext<DndContextValue>({
  activeId: null,
  activeData: null,
  overId: null,
  isDragging: false,
});

export const useDndState = () => useContext(DndContextState);

interface DndProviderProps {
  children: ReactNode;
  onListReorder: (fromIndex: number, toIndex: number) => void;
  onItemMove: (itemId: string, sourceListId: string, targetListId: string) => void;
  lists: ContentList[];
  dragOverlay?: React.ReactNode;
}

// Custom collision detection that prioritizes nav drops for items
const customCollisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args);

  // Prioritize nav-drop targets when dragging items
  const navDropCollision = pointerCollisions.find(
    collision => collision.id.toString().startsWith('nav-drop-')
  );

  if (navDropCollision) {
    return [navDropCollision];
  }

  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  return rectIntersection(args);
};

// Drop animation config
const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export const DndProvider: React.FC<DndProviderProps> = ({
  children,
  onListReorder,
  onItemMove,
  lists,
  dragOverlay,
}) => {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeData, setActiveData] = useState<DragData | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
    setActiveData(active.data.current as DragData);
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    setOverId(over?.id ?? null);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    const activeDataCurrent = active.data.current as DragData;

    // Reset state
    setActiveId(null);
    setActiveData(null);
    setOverId(null);

    if (!over) return;

    const overDataCurrent = over.data.current as DragData | undefined;
    const overIdStr = over.id.toString();

    // Handle list reordering
    if (activeDataCurrent.type === 'LIST') {
      let overListId = overIdStr;
      if (overIdStr.startsWith('nav-drop-')) {
        overListId = overIdStr.replace('nav-drop-', '');
      }

      const activeIndex = lists.findIndex(l => l.id === active.id);
      const overIndex = lists.findIndex(l => l.id === overListId);

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        onListReorder(activeIndex, overIndex);
      }
      return;
    }

    // Handle item movement to different list
    if (activeDataCurrent.type === 'ITEM') {
      const sourceListId = activeDataCurrent.listId;
      let targetListId: string | null = null;

      if (overIdStr.startsWith('nav-drop-')) {
        targetListId = overIdStr.replace('nav-drop-', '');
      } else if (overIdStr.startsWith('list-drop-')) {
        targetListId = overIdStr.replace('list-drop-', '');
      } else if (overDataCurrent?.type === 'LIST') {
        targetListId = overDataCurrent.id;
      } else {
        for (const list of lists) {
          if (list.items.some(item => item.id === overIdStr)) {
            targetListId = list.id;
            break;
          }
        }
      }

      if (sourceListId && targetListId && sourceListId !== targetListId) {
        // Validation for System Lists
        const targetList = lists.find(l => l.id === targetListId);

        // Use activeData.mediaType for strict validation
        const draggedItemMediaType = activeDataCurrent.mediaType;

        if (targetList && targetList.isSystem && draggedItemMediaType) {
          const targetTitle = (targetList.title || '').toLowerCase();
          const isTargetVideo = targetTitle.includes('video') && targetTitle.includes('upload');
          const isTargetImage = targetTitle.includes('image') && targetTitle.includes('upload');

          // Prevent Video -> Image List
          if (isTargetImage && draggedItemMediaType === 'video') {
            return;
          }

          // Prevent Image -> Video List
          if (isTargetVideo && draggedItemMediaType === 'image') {
            return;
          }
        }

        // Call onItemMove if validation passes
        onItemMove(active.id as string, sourceListId, targetListId);
      }
    }
  }, [lists, onListReorder, onItemMove]);

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveData(null);
    setOverId(null);
  }, []);

  const contextValue: DndContextValue = {
    activeId,
    activeData,
    overId,
    isDragging: activeId !== null,
  };

  return (
    <DndContextState.Provider value={contextValue}>
      <DndKitContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        accessibility={{
          restoreFocus: false,
        }}
      >
        {children}
        <DragOverlay dropAnimation={dropAnimation} modifiers={[snapCenterToCursor]}>
          {dragOverlay}
        </DragOverlay>
      </DndKitContext>
    </DndContextState.Provider>
  );
};

export { arrayMove };