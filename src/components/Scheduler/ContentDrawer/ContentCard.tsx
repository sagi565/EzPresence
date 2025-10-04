import React, { useState } from 'react';
import { Content } from '@models/Content';
import { styles } from './styles';

interface ContentCardProps {
  content: Content;
  brandId: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, brandId }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('content', content.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      style={{
        ...styles.contentCard,
        ...(isDragging ? styles.contentCardDragging : {}),
      }}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        style={{
          ...styles.contentThumbnail,
          ...(brandId === 'burger'
            ? styles.contentThumbnailBurger
            : styles.contentThumbnailSteakhouse),
        }}
      >
        {content.thumbnail}
      </div>
      <div style={styles.contentTitle}>{content.title}</div>
      {content.favorite && <span style={styles.favoriteBadge}>❤️</span>}
      {content.origin === 'presence' && <span style={styles.presenceBadge}>🏠</span>}
    </div>
  );
};

export default ContentCard;