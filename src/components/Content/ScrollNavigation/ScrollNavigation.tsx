import React, { useState, useEffect } from 'react';
import { ContentList } from '@models/ContentList';
import { styles } from './styles';

interface ScrollNavigationProps {
  lists: ContentList[];
  onNavigate: (listId: string) => void;
  onDelete: (listId: string) => void;
}

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  lists,
  onNavigate,
  onDelete,
}) => {
  const [activeListId, setActiveListId] = useState(lists[0]?.id || '');
  const [hoveredListId, setHoveredListId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    listId: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      
      for (const list of lists) {
        const element = document.querySelector(`[data-list-id="${list.id}"]`);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = rect.top + window.scrollY;
          const elementBottom = elementTop + rect.height;
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveListId(list.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lists]);

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

  return (
    <>
      <nav style={styles.scrollNav}>
        {lists.map((list, index) => {
          const isActive = activeListId === list.id;
          const isHovered = hoveredListId === list.id;

          return (
            <div key={list.id} style={styles.scrollItem}>
              {isHovered && (
                <div style={styles.scrollLabel}>{list.title}</div>
              )}

              <div style={styles.scrollDotContainer}>
                <div
                  style={{
                    ...styles.scrollDot,
                    ...(isActive
                      ? list.isSystem
                        ? styles.scrollDotActiveSystem
                        : styles.scrollDotActiveCustom
                      : {}),
                    ...(isHovered && !isActive ? styles.scrollDotHover : {}),
                  }}
                  onClick={() => onNavigate(list.id)}
                  onContextMenu={(e) => handleContextMenu(e, list)}
                  onMouseEnter={() => setHoveredListId(list.id)}
                  onMouseLeave={() => setHoveredListId(null)}
                >
                  <span
                    style={{
                      ...styles.scrollIcon,
                      ...(isHovered || isActive ? styles.scrollIconVisible : {}),
                    }}
                  >
                    {list.icon}
                  </span>
                </div>
              </div>

              {index < lists.length - 1 && <div style={styles.scrollLine} />}
            </div>
          );
        })}
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