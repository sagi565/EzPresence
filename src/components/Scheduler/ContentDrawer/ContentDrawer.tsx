import React, { useState } from 'react';
import { Content } from '@models/Content';
import ContentCard from './ContentCard';
import { styles } from './styles';

interface ContentDrawerProps {
  content: Content[];
  brandId: string;
}

const ContentDrawer: React.FC<ContentDrawerProps> = ({ content, brandId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPresence, setShowPresence] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const filteredContent = content.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPresence = !showPresence || item.origin === 'presence';
    const matchesFavorites = !showFavorites || item.favorite;
    return matchesSearch && matchesPresence && matchesFavorites;
  });

  return (
    <div style={{ ...styles.drawer, ...(isOpen ? styles.drawerOpen : {}) }}>
      <div style={styles.drawerHandle} onClick={() => setIsOpen(!isOpen)}>
        <span style={{ ...styles.drawerArrow, ...(isOpen ? styles.drawerArrowOpen : {}) }}>
          ▲
        </span>
        <span style={styles.drawerTitle}>My Content</span>
      </div>

      <div style={{ ...styles.drawerContent, ...(isOpen ? styles.drawerContentOpen : {}) }}>
        <div style={styles.drawerInner}>
          <div style={styles.drawerControls}>
            <input
              type="text"
              style={styles.searchBar}
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              style={{
                ...styles.filterBtn,
                ...(showPresence ? styles.filterBtnActive : {}),
              }}
              onClick={() => setShowPresence(!showPresence)}
            >
              <span>🏠</span>
              <span>Presence</span>
            </button>
            <button
              style={{
                ...styles.filterBtn,
                ...(showFavorites ? styles.filterBtnActive : {}),
              }}
              onClick={() => setShowFavorites(!showFavorites)}
            >
              <span>❤️</span>
              <span>Favorites</span>
            </button>
          </div>

          <div style={styles.contentList}>
            {filteredContent.map((item) => (
              <ContentCard key={item.id} content={item} brandId={brandId} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDrawer;