import React, { useState, useMemo } from 'react';
import ContentCard from './ContentCard';
import { styles } from './styles';
import { useContentLists } from '@/hooks/contents/useContentLists'; // Ensure correct import path

interface ContentDrawerProps {
  brandId: string;
}

const ContentDrawer: React.FC<ContentDrawerProps> = ({ brandId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListId, setSelectedListId] = useState<string>('videos'); 

  // Pass brandId to hook (Argument 1, which caused the error previously)
  const { lists } = useContentLists(brandId);

  const allContent = useMemo(() => {
    return lists.flatMap(list => list.items);
  }, [lists]);

  const filteredContent = useMemo(() => {
    let itemsToFilter = [];

    if (selectedListId === 'videos') {
      itemsToFilter = allContent.filter(item => item.type === 'video');
    } else if (selectedListId === 'images') {
      itemsToFilter = allContent.filter(item => item.type === 'image');
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

  return (
    <div style={{ ...styles.drawer, ...(isOpen ? styles.drawerOpen : {}) }}>
      {/* Handle */}
      <div style={styles.drawerHandle} onClick={() => setIsOpen(!isOpen)}>
        <span style={{ ...styles.drawerArrow, ...(isOpen ? styles.drawerArrowOpen : {}) }}>
          ▲
        </span>
        <span style={styles.drawerTitle}>
          My Content {isOpen ? '' : `(${allContent.length})`}
        </span>
      </div>

      <div style={styles.drawerContent}>
        <div style={styles.drawerInner}>
          
          {/* Controls & Grid */}
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
                    brandId={brandId} 
                  />
                ))
              )}
            </div>
          </div>

          {/* List Sidebar */}
          <div style={styles.listsContainer}>
            <button 
              style={{ ...styles.listPill, ...(selectedListId === 'videos' ? styles.listPillActive : {}) }}
              onClick={() => setSelectedListId('videos')}
            >
              <span style={styles.listPillIcon}>🎥</span>
              <span>My Videos</span>
            </button>
            
            <button 
              style={{ ...styles.listPill, ...(selectedListId === 'images' ? styles.listPillActive : {}) }}
              onClick={() => setSelectedListId('images')}
            >
              <span style={styles.listPillIcon}>🖼️</span>
              <span>My Images</span>
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
  );
};

export default ContentDrawer;