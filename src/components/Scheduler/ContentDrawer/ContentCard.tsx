import React, { useState } from 'react';
import { ContentItem } from '@models/ContentList'; // Use shared model
import { styles } from './styles';
import { setDragItem } from '@/utils/dragState';

interface ContentCardProps {
  content: ContentItem;
  brandId: string;
  onDragStart?: () => void;
  onSelect?: (content: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onDragStart: onDragStartProp, onSelect }) => {
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
    e.dataTransfer.setData('item', JSON.stringify(content)); // Required for useContentPicking
    setDragItem(content);

    // Set a blank drag image so we can use our custom preview
    // We create a tiny 1x1 image and ensure it's "set" on the dataTransfer
    const img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    // Position it way off-screen just to be safe
    e.dataTransfer.setDragImage(img, 0, 0);

    onDragStartProp?.();
  };

  const handleDragEnd = () => {
    setDragItem(null);
    setIsHovered(false); // Reset hover state
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(content);
    }
  };

  return (
    <div
      style={{
        ...styles.contentCard,
        ...(isHovered ? styles.contentCardHover : {}),
        cursor: 'grab', // Default cursor
      }}
      draggable
      onDragStart={(e) => {
        handleDragStart(e);
        (e.target as HTMLDivElement).style.cursor = 'grabbing';
      }}
      onDragEnd={handleDragEnd}
      onDoubleClick={(e) => handleDoubleClick(e)}
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