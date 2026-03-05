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
// Invisible 1×1 canvas to suppress the native browser drag ghost.
// Created once at module level — always in the DOM so setDragImage works sync.
// ---------------------------------------------------------------------------
const ghostCanvas = document.createElement('canvas');
ghostCanvas.width = 1;
ghostCanvas.height = 1;
ghostCanvas.style.cssText = 'position:fixed;top:-2px;left:-2px;width:1px;height:1px;opacity:0;pointer-events:none;';
const ctx = ghostCanvas.getContext('2d');
if (ctx) ctx.clearRect(0, 0, 1, 1);
document.body.appendChild(ghostCanvas);

// ---------------------------------------------------------------------------
// Global drag-dimmer styles (injected once)
// ---------------------------------------------------------------------------
const DIMMER_STYLE_ID = 'drag-dimmer-styles';
if (!document.getElementById(DIMMER_STYLE_ID)) {
  const s = document.createElement('style');
  s.id = DIMMER_STYLE_ID;
  s.textContent = `
    /* Dark overlay shown globally when a content card is being dragged */
    #drag-dimmer {
      position: fixed;
      inset: 0;
      background: rgba(17, 24, 39, 0.55);
      z-index: 1200;          /* above calendar, below drawer (z-index 900 is drawer; we need above modals too) */
      pointer-events: none;
      animation: dimmerFadeIn 0.2s ease forwards;
    }
    @keyframes dimmerFadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    /* The drawer sits above the dimmer while dragging */
    body.content-dragging .content-drawer {
      z-index: 1300 !important;
    }
    /* Content preview clone (#pickClone) and pick-glow already sit at 1660 — above everything */
    /* Make the modal above the dimmer too (for pick mode) */
    body.content-dragging .new-story-modal,
    body.content-dragging .new-post-modal {
      z-index: 1300 !important;
    }
  `;
  document.head.appendChild(s);
}

// ---------------------------------------------------------------------------
// Floating drag-card preview (rendered via portal to document.body)
// ---------------------------------------------------------------------------
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
        // No transition here — we want 1:1 mouse tracking without lag
      }}
    >
      {thumbnailSrc ? (
        <img
          src={thumbnailSrc}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', background: 'rgba(155, 93, 229, 0.05)',
        }}>
          {content.type === 'video' ? '🎬' : '🖼️'}
        </div>
      )}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '14px 10px 8px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
        color: 'white',
        fontSize: '12px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
        zIndex: 2,
      }}>
        {content.title}
      </div>
    </div>,
    document.body,
  );
};

// ---------------------------------------------------------------------------
// Dimmer div rendered via portal while dragging
// ---------------------------------------------------------------------------
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

    // Kill the native browser ghost — use our DragCard portal instead
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

  // Track pointer position while dragging — only attached while isDragging
  // This listener is scoped to this card, not to SchedulerPage, so no re-renders there.
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

      {/* Custom drag preview — rendered to body via portal, no SchedulerPage re-render */}
      {isDragging && <DragCard content={content} pos={pointerPos} />}

      {/* Full-page dimmer — renders above calendar/modals, below drawer */}
      {isDragging && <DragDimmer />}
    </>
  );
};

export default ContentCard;