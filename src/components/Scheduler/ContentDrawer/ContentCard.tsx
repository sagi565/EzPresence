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

const ghostCanvas = document.createElement('canvas');
ghostCanvas.width = 1;
ghostCanvas.height = 1;
ghostCanvas.style.cssText = 'position:fixed;top:-2px;left:-2px;width:1px;height:1px;opacity:0;pointer-events:none;';
const ctx = ghostCanvas.getContext('2d');
if (ctx) ctx.clearRect(0, 0, 1, 1);
document.body.appendChild(ghostCanvas);

const DIMMER_STYLE_ID = 'drag-dimmer-styles';
if (!document.getElementById(DIMMER_STYLE_ID)) {
  const s = document.createElement('style');
  s.id = DIMMER_STYLE_ID;
  s.textContent = `
    #drag-dimmer {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.65);
      z-index: 1200;
      pointer-events: none;
      animation: dimmerFadeIn 0.2s ease forwards;
    }
    @keyframes dimmerFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    body.content-dragging .content-drawer {
      z-index: 2000 !important;
    }
    body.content-dragging .new-story-modal,
    body.content-dragging .new-post-modal {
      z-index: 1300 !important;
    }
  `;
  document.head.appendChild(s);
}

const DragCard: React.FC<{ content: ContentItem; pos: { x: number; y: number } }> = ({ content, pos }) => {
  const thumb = content.thumbnail;
  const thumbnailSrc = thumb
    ? (thumb.startsWith('http') || thumb.startsWith('data:'))
      ? thumb
      : thumb.length > 20
        ? `data:image/jpeg;base64,${thumb.replace(/[\n\r\s]/g, '')}`
        : null
    : null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '130px',
        aspectRatio: '9/16',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '2px solid #9b5de5',
        background: '#f8f9fb',
        boxShadow: '0 25px 50px -12px rgba(155, 93, 229, 0.45)',
        transform: `translate(${pos.x - 65}px, ${pos.y - 185}px) rotate(-2deg) scale(1.04)`,
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0.95,
      }}
    >
      {thumbnailSrc ? (
        <img src={thumbnailSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', background: 'rgba(155, 93, 229, 0.05)' }}>
          {content.type === 'video' ? '🎬' : '🖼️'}
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 10px 8px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        color: 'white', fontSize: '12px', fontWeight: 700,
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        textShadow: '0 1px 3px rgba(0,0,0,0.8)', zIndex: 2,
      }}>
        {content.title}
      </div>
    </div>,
    document.body,
  );
};

const DragDimmer: React.FC = () =>
  ReactDOM.createPortal(<div id="drag-dimmer" />, document.body);

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
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('contentId', content.id);
    e.dataTransfer.setData('item', JSON.stringify(content));
    setDragItem(content);
    e.dataTransfer.setDragImage(ghostCanvas, -2, -2);
    setPointerPos({ x: e.clientX, y: e.clientY });
    setIsDragging(true);
    document.body.classList.add('content-dragging');
    onDragStartProp?.();
  };

  const handleDragEnd = () => {
    setDragItem(null);
    setIsDragging(false);
    setIsHovered(false);
    document.body.classList.remove('content-dragging');
  };

  useEffect(() => {
    if (!isDragging) return;

    // ✅ CRITICAL: must call preventDefault here too.
    // The browser only fires dragover events continuously if at least one
    // element is accepting the drag (calling preventDefault). If the overlay
    // or any element under the cursor stops doing this, the browser halts
    // dragover events and the DragCard stops tracking the cursor.
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
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
          opacity: isDragging ? 0 : 1,
          userSelect: 'none',
          transition: isDragging ? 'none' : (styles.contentCard as React.CSSProperties).transition,
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
            <img src={thumbnailSrc} alt={content.title} draggable={false} style={styles.thumbnailImage as React.CSSProperties} />
          ) : (
            <span style={{ fontSize: '24px' }}>
              {isEmoji ? content.thumbnail : content.type === 'video' ? '🎬' : '🖼️'}
            </span>
          )}
          <div style={styles.contentTitle}>{content.title}</div>
        </div>
      </div>

      {isDragging && <DragCard content={content} pos={pointerPos} />}
      {isDragging && <DragDimmer />}
    </>
  );
};

export default ContentCard;