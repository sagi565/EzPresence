import React, { useState, useRef, useEffect } from 'react';
import { ContentItem as ContentItemType } from '@models/ContentList';
import { styles } from './styles';
import { useContentUrl } from '@/hooks/contents/useContentUrl';

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
  const [showMenu, setShowMenu] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { url: fetchedUrl, fetchUrl } = useContentUrl();
  const isUploading = item.status === 'uploading';

  // Determine type based on item property (populated by useContentLists)
  const isVideo = item.type === 'video';

  // --- Helper: Get Thumbnail Source ---
  const getThumbnailSrc = () => {
    if (!item.thumbnail) return null;
    if (item.thumbnail.startsWith('http') || item.thumbnail.startsWith('data:')) {
      return item.thumbnail;
    }
    // Filter out very short invalid strings
    if (item.thumbnail.length < 20) return null;
    
    const cleanBase64 = item.thumbnail.replace(/[\n\r\s]/g, '');
    return `data:image/jpeg;base64,${cleanBase64}`;
  };

  const thumbnailSrc = getThumbnailSrc();

  const handleDragStart = (e: React.DragEvent) => {
    if (isUploading) { e.preventDefault(); return; }
    setIsDragging(true);
    setShowMenu(false);
    onDragStart(e);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd();
  };

  // --- Fetch URL on Hover (Video Only) ---
  useEffect(() => {
    if (isVideo && isHovered && !fetchedUrl && item.id && !isUploading && !item.id.startsWith('temp-')) {
      fetchUrl(item.id);
    }
  }, [isVideo, isHovered, fetchedUrl, item.id, isUploading, fetchUrl]);

  // --- Video Autoplay Logic ---
  useEffect(() => {
    if (isVideo && videoRef.current) {
      if (isHovered && fetchedUrl) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay blocked by browser policy - quiet failure expected
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideo, isHovered, fetchedUrl]);

  // --- Click Outside Menu ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  // --- Action Handlers ---
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

  const handleWizardMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert("Wizard Me feature coming soon!");
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

  // --- Render Media ---
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
              playsInline
              style={{ 
                ...styles.mediaCover, 
                opacity: (isHovered && fetchedUrl) ? 1 : 0 
              }}
            />
          )}
          
          {/* Thumbnail is ALWAYS rendered, only hidden when video plays */}
          {thumbnailSrc && (
            <img 
              src={thumbnailSrc} 
              alt={item.title} 
              style={{ 
                ...styles.mediaCover, 
                opacity: (isHovered && fetchedUrl) ? 0 : 1 
              }}
            />
          )}
        </div>
      );
    }

    // Image Type
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
      style={{
        ...styles.contentItem,
        // Sizing depends on LIST type, but rendering depends on ITEM type
        ...(listType === 'video' ? styles.contentItemVideo : styles.contentItemImage),
        ...(isHovered && !isUploading ? styles.contentItemHover : {}),
        ...(isDragging ? styles.contentItemDragging : {}),
      }}
      draggable={!isUploading}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={!isUploading ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

            <button
              style={{
                ...styles.actionBtn,
                ...styles.actionBtnWizard,
                ...(hoveredBtn === 'wizard' ? styles.actionBtnWizardHover : {}),
              }}
              onClick={handleWizardMe}
              onMouseEnter={() => setHoveredBtn('wizard')}
              onMouseLeave={() => setHoveredBtn(null)}
              title="Wizard Me!"
            >
              ✨
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
                style={{ ...styles.menuItem, ...(hoveredBtn === 'delete' ? styles.menuItemDeleteHover : {}) }}
                onClick={handleDelete}
                onMouseEnter={() => setHoveredBtn('delete')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <span>🗑️</span> Delete
              </button>
            </div>
          )}

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
    </div>
  );
};

export default ContentItem;