import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ContentItem as ContentItemType } from '@models/ContentList';
import { styles } from './styles';
import { useContentUrl } from '@/hooks/contents/useContentUrl';

interface ContentItemProps {
  item: ContentItemType;
  listType: 'video' | 'image';
  isDragging?: boolean;
  onClick: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onToggleFavorite: () => void;
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  isDragging = false,
  onClick,
  onDelete,
  onRename,
  onToggleFavorite,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(item.title || '');

  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { url: fetchedUrl, fetchUrl } = useContentUrl();
  const isUploading = item.status === 'uploading';

  const isVideo = item.type === 'video';
  const PREVIEW_DELAY = 1000;

  const getThumbnailSrc = () => {
    if (!item.thumbnail) return null;
    if (item.thumbnail.startsWith('http') || item.thumbnail.startsWith('data:')) {
      return item.thumbnail;
    }
    if (item.thumbnail.length < 20) return null;

    const cleanBase64 = item.thumbnail.replace(/[\n\r\s]/g, '');
    return `data:image/jpeg;base64,${cleanBase64}`;
  };

  const thumbnailSrc = getThumbnailSrc();

  const handleMouseEnter = useCallback(() => {
    if (isDragging) return;
    setIsHovered(true);

    if (isVideo && !isUploading && item.id && !item.id.startsWith('temp-')) {
      if (!fetchedUrl) {
        fetchUrl(item.id);
      }

      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, PREVIEW_DELAY);
    }
  }, [isVideo, isUploading, item.id, fetchedUrl, fetchUrl, isDragging]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setShowPreview(false);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (showPreview && fetchedUrl) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideo, showPreview, fetchedUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = fetchedUrl || thumbnailSrc;
    if (url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        const ext = isVideo ? 'mp4' : 'jpg';
        a.download = `${item.title || 'download'}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      } catch (err) {
        window.open(url, '_blank');
      }
    }
    setShowMenu(false);
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setIsRenaming(true);
    setRenameValue(item.title || '');
  };

  const handleRenameSubmit = () => {
    const newName = renameValue.trim();
    if (newName && newName !== item.title) {
      onRename(newName);
    }
    setIsRenaming(false);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSubmit();
    } else if (e.key === 'Escape') {
      setIsRenaming(false);
      setRenameValue(item.title || '');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'numeric', year: 'numeric'
    });
  };

  const renderMedia = () => {
    if (isUploading) {
      return (
        <div style={styles.mediaContainer}>
          {thumbnailSrc && <img src={thumbnailSrc} alt="Uploading..." style={styles.mediaCover} />}
          <div style={styles.loadingOverlay}>
            <div style={styles.spinner} />
            <span style={{ fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>Uploading...</span>
          </div>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div style={styles.mediaContainer}>
          {fetchedUrl && (
            <video
              ref={videoRef}
              src={fetchedUrl}
              loop
              muted
              playsInline
              style={{
                ...styles.mediaCover,
                opacity: showPreview && fetchedUrl ? 1 : 0
              }}
            />
          )}

          {thumbnailSrc && (
            <img
              src={thumbnailSrc}
              alt={item.title}
              style={{
                ...styles.mediaCover,
                opacity: showPreview && fetchedUrl ? 0 : 1
              }}
            />
          )}
        </div>
      );
    }

    const displaySrc = fetchedUrl || thumbnailSrc;
    return (
      <div style={styles.mediaContainer}>
        {displaySrc && (
          <img src={displaySrc} alt={item.title} style={styles.mediaCover} />
        )}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...styles.contentItem,
        ...styles.contentItemVideo,
        ...(isHovered && !isUploading && !isDragging ? styles.contentItemHover : {}),
        ...(isDragging ? styles.contentItemDragging : {}),
      }}
    >
      {renderMedia()}

      {!isUploading && (
        <>
          <div style={{
            ...styles.gradientOverlay,
            ...(isHovered ? styles.gradientOverlayVisible : {}),
          }} />

          <div style={{
            ...styles.contentActions,
            ...(isHovered || item.favorite || showMenu ? styles.contentActionsVisible : {}),
          }}>
            <button
              style={{
                ...styles.actionBtn,
                ...(item.favorite ? styles.actionBtnFavoriteActive : {}),
                ...(hoveredBtn === 'fav' && !item.favorite ? styles.actionBtnHover : {}),
              }}
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              onMouseEnter={() => setHoveredBtn('fav')}
              onMouseLeave={() => setHoveredBtn(null)}
              title="Toggle Favorite"
            >
              {item.favorite ? '❤️' : '🤍'}
            </button>
          </div>

          <button
            style={{
              ...styles.moreOptionsBtn,
              ...(isHovered || showMenu ? styles.moreOptionsBtnVisible : {}),
              ...(hoveredBtn === 'more' || showMenu ? styles.moreOptionsBtnHover : {}),
            }}
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            onMouseEnter={() => setHoveredBtn('more')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            ⋯
          </button>

          {showMenu && (
            <div ref={menuRef} style={styles.menuDropdown} onClick={(e) => e.stopPropagation()}>
              <button
                style={{ ...styles.menuItem, ...(hoveredBtn === 'download' ? styles.menuItemHover : {}) }}
                onClick={handleDownload}
                onMouseEnter={() => setHoveredBtn('download')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <span>⬇️</span> Download
              </button>
              <button
                style={{ ...styles.menuItem, ...(hoveredBtn === 'rename' ? styles.menuItemHover : {}) }}
                onClick={handleRenameClick}
                onMouseEnter={() => setHoveredBtn('rename')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <span>✏️</span> Rename
              </button>
              <button
                style={{ ...styles.menuItem, ...(hoveredBtn === 'delete' ? styles.menuItemDeleteHover : {}) }}
                onClick={handleDelete}
                onMouseEnter={() => setHoveredBtn('delete')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <span>🗑️</span> Delete
              </button>
            </div>
          )}

          {isRenaming ? (
            <div style={styles.renameContainer} onClick={(e) => e.stopPropagation()}>
              <input
                ref={renameInputRef}
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                onBlur={handleRenameSubmit}
                style={styles.renameInput}
                placeholder="Enter name..."
              />
            </div>
          ) : (
            <>
              <div style={{
                ...styles.contentTitle,
                ...(isHovered ? styles.textVisible : {}),
              }}>
                {item.title}
              </div>

              <div style={{
                ...styles.contentDate,
                ...(isHovered ? styles.textVisible : {}),
              }}>
                {formatDate(item.createdAt)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ContentItem;