import React, { useState } from 'react';
import { ContentItem } from '@models/ContentList'; // Use shared model
import { styles } from './styles';

interface ContentCardProps {
  content: ContentItem;
  brandId: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);

  // --- BASE64 DECODING ---
  const getThumbnailSrc = (thumb: string | undefined) => {
    if (!thumb) return null;
    if (thumb.startsWith('http') || thumb.startsWith('data:')) {
      return thumb;
    }
    // Assume valid base64 if longer than 20 chars
    if (thumb.length > 20) {
      return `data:image/jpeg;base64,${thumb.replace(/[\n\r\s]/g, '')}`;
    }
    return null;
  };

  const thumbnailSrc = getThumbnailSrc(content.thumbnail);
  // Check if it's an emoji (short string, no image)
  const isEmoji = !thumbnailSrc && content.thumbnail && content.thumbnail.length < 10;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('contentId', content.id);
  };

  return (
    <div
      style={{
        ...styles.contentCard,
        ...(isHovered ? styles.contentCardHover : {})
      }}
      draggable
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={content.title}
    >
      <div style={styles.contentThumbnail}>
        {thumbnailSrc ? (
          <img 
            src={thumbnailSrc} 
            alt={content.title} 
            style={styles.thumbnailImage as React.CSSProperties} 
          />
        ) : (
          <span style={{ fontSize: '24px' }}>
            {isEmoji ? content.thumbnail : (content.type === 'video' ? '🎬' : '🖼️')}
          </span>
        )}
        
        {/* Title Overlay - Bottom Left with Gradient */}
        <div style={styles.contentTitle}>
          {content.title}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;