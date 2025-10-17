import React, { useState } from 'react';
import { ContentItem as ContentItemType } from '@models/ContentList';
import { styles } from './styles';

interface ContentItemProps {
  item: ContentItemType;
  listType: 'video' | 'image';
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onClick: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  listType,
  onDragStart,
  onDragEnd,
  onClick,
  onDelete,
  onToggleFavorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const [isWizardHovered, setIsWizardHovered] = useState(false);
  const [isFavoriteHovered, setIsFavoriteHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  const itemStyle = {
    ...styles.contentItem,
    ...(listType === 'video' ? styles.contentItemVideo : styles.contentItemImage),
    ...(isHovered ? styles.contentItemHover : {}),
    ...(isDragging ? styles.contentItemDragging : {}),
  };

  const actionsStyle = {
    ...styles.contentActions,
    ...(isHovered || item.favorite ? styles.contentActionsVisible : {}),
  };

  const overlayStyle = {
    ...styles.contentItemOverlay,
    ...(isHovered ? styles.contentItemOverlayVisible : {}),
  };

  const titleStyle = {
    ...styles.contentTitle,
    ...(isHovered ? styles.contentTitleVisible : {}),
  };

  const dateStyle = {
    ...styles.contentDate,
    ...(isHovered ? styles.contentDateVisible : {}),
  };

  return (
    <div
      style={itemStyle}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.contentThumbnail}>
        {item.thumbnail}
      </div>

      {/* Bottom gradient overlay */}
      <div style={overlayStyle} />

      {/* Delete button (top-left) - Perfectly centered × */}
      <button
        style={{
          ...styles.deleteItemBtn,
          ...(isHovered ? styles.deleteItemBtnVisible : {}),
          ...(isDeleteHovered ? styles.deleteItemBtnHover : {}),
        }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setIsDeleteHovered(true);
        }}
        onMouseLeave={(e) => {
          e.stopPropagation();
          setIsDeleteHovered(false);
        }}
      >
        ×
      </button>

      {/* Action buttons (top-right) */}
      <div style={actionsStyle}>
        {listType === 'video' && (
          <button
            style={{
              ...styles.actionBtnWizard,
              ...(isWizardHovered ? styles.actionBtnWizardHover : {}),
              // Only show wizard button on hover, not when favorited
              ...(!isHovered ? { opacity: 0, visibility: 'hidden' as const } : {}),
            }}
            onClick={(e) => {
              e.stopPropagation();
              alert('Wizard Me feature coming soon!');
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setIsWizardHovered(true);
            }}
            onMouseLeave={(e) => {
              e.stopPropagation();
              setIsWizardHovered(false);
            }}
          >
            ✨
          </button>
        )}
        <button
          style={{
            ...styles.actionBtn,
            ...(item.favorite ? styles.actionBtnFavoriteActive : {}),
            ...(isFavoriteHovered && item.favorite ? styles.actionBtnFavoriteActiveHover : {}),
            ...(isFavoriteHovered && !item.favorite ? styles.actionBtnHover : {}),
          }}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setIsFavoriteHovered(true);
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            setIsFavoriteHovered(false);
          }}
        >
          {item.favorite ? '❤️' : '🤍'}
        </button>
      </div>

      {/* Title and Date (bottom overlay) */}
      {item.title && (
        <div style={titleStyle}>{item.title}</div>
      )}
      {item.date && (
        <div style={dateStyle}>{item.date}</div>
      )}
    </div>
  );
};

export default ContentItem;