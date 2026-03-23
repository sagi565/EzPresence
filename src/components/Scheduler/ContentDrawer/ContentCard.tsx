import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ContentItem } from '@/models/ContentList';
import * as S from './ContentDrawer.styles';
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
if (typeof document !== 'undefined') {
  document.body.appendChild(ghostCanvas);
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
    <S.DragPreview $x={pos.x} $y={pos.y}>
      {thumbnailSrc ? (
        <img src={thumbnailSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <S.DragFallback>
          {content.type === 'video' ? '🎬' : '🖼️'}
        </S.DragFallback>
      )}
      <S.DragTitle>
        {content.title}
      </S.DragTitle>
    </S.DragPreview>,
    document.body,
  );
};

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

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      setPointerPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('dragover', onDragOver);
    return () => window.removeEventListener('dragover', onDragOver);
  }, [isDragging]);

  return (
    <>
      <S.CardContainer
        className="content-card"
        $isHovered={isHovered}
        $isDragging={isDragging}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={(e) => { e.stopPropagation(); if (!isDragging) onClickDetail?.(content); }}
        onDoubleClick={(e) => { e.stopPropagation(); onSelect?.(content); }}
        onMouseEnter={() => !isDragging && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={content.title}
      >
        <S.ThumbnailContainer>
          {thumbnailSrc ? (
            <S.ThumbnailImage src={thumbnailSrc} alt={content.title} draggable={false} />
          ) : (
            <S.FallbackIcon>
              {isEmoji ? content.thumbnail : content.type === 'video' ? '🎬' : '🖼️'}
            </S.FallbackIcon>
          )}
          <S.CardTitle className="content-card-title">{content.title}</S.CardTitle>
        </S.ThumbnailContainer>
      </S.CardContainer>

      {isDragging && <DragCard content={content} pos={pointerPos} />}
    </>
  );
};

export default ContentCard;