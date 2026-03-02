import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { ContentItem } from '@/models/ContentList';
import ContentCard from './ContentCard';
import { styles } from './styles';
import { useContentLists } from '@/hooks/contents/useContentLists';
import ContentDetailModal from '@/components/Content/ContentDetailModal/ContentDetailModal';

// Additional drawer styles
if (typeof document !== 'undefined') {
  const sid = 'content-drawer-picking-css';
  if (!document.getElementById(sid)) {
    const s = document.createElement('style');
    s.id = sid;
    s.textContent = `
      .content-drawer.nsm-picking {
        z-index: 1700 !important;
      }
      .content-drawer.nsm-picking .content-drawer-handle {
        cursor: default;
        pointer-events: none;
      }
    `;
    document.head.appendChild(s);
  }
}

interface ContentDrawerProps {
  brandId: string;
  isOpen: boolean;
  onClose?: () => void;
  onToggle: () => void;
  isPicking?: boolean;
  onContentDragStart?: () => void;
  onSelect?: (content: ContentItem) => void;
}

const ContentDrawer: React.FC<ContentDrawerProps> = ({
  brandId,
  isOpen,
  onToggle,
  isPicking,
  onContentDragStart,
  onSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>('all');
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    item: ContentItem | null;
    listId: string;
  }>({ isOpen: false, item: null, listId: '' });

  const { lists, renameItem, deleteItem, toggleFavorite } = useContentLists(brandId);

  const allContent = useMemo(() => lists.flatMap(list => list.items), [lists]);

  const filteredContent = useMemo(() => {
    let itemsToFilter: ContentItem[] = [];
    if (selectedListId === 'all') {
      itemsToFilter = allContent;
    } else {
      const targetList = lists.find(l => l.id === selectedListId);
      itemsToFilter = targetList ? targetList.items : [];
    }
    if (searchQuery) {
      return itemsToFilter.filter(item =>
        (item.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return itemsToFilter;
  }, [selectedListId, allContent, lists, searchQuery]);

  const portal = (
    <>
      <div
        id="contentDrawer"
        className={`content-drawer ${isPicking ? 'nsm-picking' : ''}`}
        style={{ ...styles.drawer, ...(isOpen ? styles.drawerOpen : {}) }}
      >
        <div className="content-drawer-handle" style={styles.drawerHandle} onClick={onToggle}>
          <span style={{ ...styles.drawerArrow, ...(isOpen ? styles.drawerArrowOpen : {}) }}>▲</span>
          <span style={styles.drawerTitle}>My Content</span>
        </div>

        <div style={styles.drawerContent}>
          <div style={styles.drawerInner}>
            <div style={styles.drawerControls}>
              <input
                type="text"
                style={styles.searchBar}
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div style={styles.contentList}>
                {filteredContent.length === 0 ? (
                  <div style={{ padding: '20px', fontSize: '13px', color: '#6b7280' }}>
                    No content found.
                  </div>
                ) : (
                  filteredContent.map((item) => (
                    <ContentCard
                      key={item.id}
                      content={item}
                      onDragStart={() => {
                        onContentDragStart?.();
                      }}
                      onSelect={onSelect}
                      onClickDetail={(content) => {
                        const parentList = lists.find(l => l.items.some(i => i.id === content.id));
                        if (parentList) {
                          setDetailModal({ isOpen: true, item: content, listId: parentList.id });
                        }
                      }}
                      brandId={brandId}
                    />
                  ))
                )}
              </div>
            </div>

            <div style={styles.listsContainer}>
              <button
                style={{
                  ...styles.listPill,
                  ...(selectedListId === 'all' ? styles.listPillAllActive : {})
                }}
                onClick={() => setSelectedListId('all')}
              >
                <span style={styles.listPillIcon}>✨</span><span>All Content</span>
              </button>
              {lists.length > 0 && <div style={{ height: '1px', background: '#e5e7eb', margin: '4px 0' }} />}
              {lists.map(list => (
                <button
                  key={list.id}
                  style={{ ...styles.listPill, ...(selectedListId === list.id ? styles.listPillActive : {}) }}
                  onClick={() => setSelectedListId(list.id)}
                >
                  <span style={styles.listPillIcon}>{list.icon || '📁'}</span>
                  <span>{list.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ContentDetailModal
        isOpen={detailModal.isOpen}
        item={detailModal.item}
        onClose={() => setDetailModal({ isOpen: false, item: null, listId: '' })}
        onRename={(newName) => {
          if (detailModal.item && detailModal.listId) {
            renameItem(detailModal.item.id, detailModal.listId, newName);
            setDetailModal(prev => ({
              ...prev,
              item: prev.item ? { ...prev.item, title: newName } : null,
            }));
          }
        }}
        onDelete={() => {
          if (detailModal.item && detailModal.listId) {
            deleteItem(detailModal.item.id, detailModal.listId);
            setDetailModal({ isOpen: false, item: null, listId: '' });
          }
        }}
        onToggleFavorite={() => {
          if (detailModal.item && detailModal.listId) {
            toggleFavorite(detailModal.item.id, detailModal.listId);
            setDetailModal(prev => ({
              ...prev,
              item: prev.item ? { ...prev.item, favorite: !prev.item.favorite } : null,
            }));
          }
        }}
      />
    </>
  );

  return ReactDOM.createPortal(portal, document.body);
};

export default ContentDrawer;