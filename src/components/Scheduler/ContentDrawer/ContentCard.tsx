import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ContentItem } from '@models/ContentList';
import { styles } from './styles';
import { setDragItem } from '@/utils/dragState';

interface ContentCardProps {
  content: ContentItem;
  brandId: string;
  onDragStart?: () => void;
  onSelect?: (content: ContentItem) => void;
  onClickDetail?: (content: ContentItem) => void;
}

// ---------------------------------------------------------------------------
// Create a single reusable ghost canvas at module level — created once,
// stays attached to the DOM permanently (hidden), so the browser can ALWAYS
// find it synchronously when setDragImage is called.
// ---------------------------------------------------------------------------
const ghostCanvas = document.createElement('canvas');
ghostCanvas.width = 1;
ghostCanvas.height = 1;
ghostCanvas.style.cssText = 'position:fixed;top:-2px;left:-2px;width:1px;height:1px;opacity:0;pointer-events:none;';
// Explicitly clear to fully transparent so no pixel is ever rendered
const ctx = ghostCanvas.getContext('2d');
if (ctx) {
  ctx.clearRect(0, 0, 1, 1);
}
document.body.appendChild(ghostCanvas);

const ContentCard: React.FC<ContentCardProps> = ({ content, onDragStart: onDragStartProp, onSelect, onClickDetail }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });

  const getThumbnailSrc = (thumb: string | undefined) => {
    if (!thumb) return null;
    if (thumb.startsWith('http') || thumb.startsWith('data:')) return thumb;
    if (thumb.length > 20) return `data:image/jpeg;base64,${thumb.replace(/[\n\r\s]/g, '')}`;
    return null;
  };

  const thumbnailSrc = getThumbnailSrc(content.thumbnail);
  const isEmoji = !thumbnailSrc && content.thumbnail && content.thumbnail.length < 10;

  const handleDragStart = (e: React.DragEvent) => {
    // ── Payload for calendar / scheduler drop zones ──────────────────────────
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('contentId', content.id);
    e.dataTransfer.setData('item', JSON.stringify(content));
    setDragItem(content);

    // ── Kill the native ghost ─────────────────────────────────────────────────
    // ghostCanvas is permanently in the DOM so the browser finds it immediately.
    // Offset (-2,-2) puts the hot-spot off the 1×1 canvas → nothing visible.
    e.dataTransfer.setDragImage(ghostCanvas, -2, -2);

    // ── Start our custom preview ──────────────────────────────────────────────
    setPointerPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    onDragStartProp?.();
  };

  const handleDragEnd = () => {
    setDragItem(null);
    setIsDragging(false);
    setIsHovered(false);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onDragOver = (e: DragEvent) => {
      setPointerPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('dragover', onDragOver);
    return () => window.removeEventListener('dragover', onDragOver);
  }, [isDragging]);

  return (
    <>
      <div
        style={{
          ...styles.contentCard,
          ...(isHovered && !isDragging ? styles.contentCardHover : {}),
          cursor: isDragging ? 'grabbing' : 'grab',
          // Source card invisible while dragging — DragPreview is the live card
          opacity: isDragging ? 0 : 1,
          userSelect: 'none',
          transition: isDragging
            ? 'none'
            : (styles.contentCard as React.CSSProperties).transition,
        }}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={(e) => { e.stopPropagation(); if (!isDragging) onClickDetail?.(content); }}
        onDoubleClick={(e) => { e.stopPropagation(); onSelect?.(content); }}
        onMouseEnter={() => !isDragging && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={content.title}
      >
        <div style={styles.contentThumbnail}>
          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={content.title}
              draggable={false}
              style={styles.thumbnailImage as React.CSSProperties}
            />
          ) : (
            <span style={{ fontSize: '24px' }}>
              {isEmoji ? content.thumbnail : content.type === 'video' ? '🎬' : '🖼️'}
            </span>
          )}
          <div style={styles.contentTitle}>{content.title}</div>
        </div>
      </div>
    </>
  );
};

export default ContentCard;