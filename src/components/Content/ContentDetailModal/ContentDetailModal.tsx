import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ContentItem } from '@models/ContentList';
import { useContentUrl } from '@/hooks/contents/useContentUrl';
import { styles } from './styles';

interface ContentDetailModalProps {
  isOpen: boolean;
  item: ContentItem | null;
  onClose: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  isOpen,
  item,
  onClose,
  onRename,
  onDelete,
  onToggleFavorite,
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const { url: fetchedUrl, fetchUrl } = useContentUrl();

  const isVideo = item?.type === 'video';

  // Fetch URL when modal opens
  useEffect(() => {
    if (isOpen && item && !fetchedUrl && !item.id.startsWith('temp-')) {
      fetchUrl(item.id);
    }
  }, [isOpen, item, fetchedUrl, fetchUrl]);

  // Reset rename state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsRenaming(false);
      setRenameValue('');
    }
  }, [isOpen]);

  // Focus rename input
  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isRenaming) {
          setIsRenaming(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isRenaming, onClose]);

  if (!isOpen || !item) return null;

  const getThumbnailSrc = () => {
    if (!item.thumbnail) return null;
    if (item.thumbnail.startsWith('http') || item.thumbnail.startsWith('data:')) {
      return item.thumbnail;
    }
    if (item.thumbnail.length < 20) return null;
    const cleanBase64 = item.thumbnail.replace(/[\n\r\s]/g, '');
    return `data:image/jpeg;base64,${cleanBase64}`;
  };

  const mediaSrc = fetchedUrl || getThumbnailSrc();

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
    }
  };

  const handleDownload = async () => {
    if (!mediaSrc) return;

    try {
      const response = await fetch(mediaSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      const ext = isVideo ? 'mp4' : 'jpg';
      a.download = `${item.title || 'download'}.${ext}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error("Download failed, opening in new tab", e);
      window.open(mediaSrc, '_blank');
    }
  };

  const handleEditCancel = () => {
    setIsRenaming(false);
    setRenameValue(item.title || '');
  };


  const favoriteBtnStyle = {
    ...styles.favoriteBtn,
    ...(item.favorite ? styles.favoriteBtnActive : {}),
    ...(hoveredBtn === 'favorite' ? styles.favoriteBtnHover : {}),
  };

  return ReactDOM.createPortal(
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          style={{
            ...styles.closeBtn,
            ...(hoveredBtn === 'close' ? styles.closeBtnHover : {}),
          }}
          onClick={onClose}
          onMouseEnter={() => setHoveredBtn('close')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          ×
        </button>

        <div style={styles.content}>
          {/* Media Section */}
          <div style={styles.mediaSection}>
            {isVideo && mediaSrc ? (
              <video
                ref={videoRef}
                src={mediaSrc}
                controls
                autoPlay
                loop
                style={styles.media}
              />
            ) : mediaSrc ? (
              <img src={mediaSrc} alt={item.title} style={styles.media} />
            ) : (
              <div style={styles.mediaPlaceholder}>
                <span style={{ fontSize: '64px' }}>{isVideo ? '🎬' : '🖼️'}</span>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div style={styles.infoSection}>
            {/* Title with Edit and Favorite */}
            <div style={styles.titleSection}>
              {isRenaming ? (
                <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                  <input
                    ref={renameInputRef}
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={handleRenameKeyDown}
                    style={styles.renameInput}
                    placeholder="Enter name..."
                  />
                  <button
                    onClick={handleRenameSubmit}
                    style={{ ...styles.editBtn, background: '#22c55e', color: 'white' }}
                    title="Save"
                  >
                    ✓
                  </button>
                  <button
                    onClick={handleEditCancel}
                    style={{ ...styles.editBtn, background: '#ef4444', color: 'white' }}
                    title="Cancel"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={styles.title}>{item.title || 'Untitled'}</h2>
                  <button
                    style={{
                      ...styles.editBtn,
                      ...(hoveredBtn === 'edit' ? styles.editBtnHover : {}),
                    }}
                    onClick={() => {
                      setRenameValue(item.title || '');
                      setIsRenaming(true);
                    }}
                    onMouseEnter={() => setHoveredBtn('edit')}
                    onMouseLeave={() => setHoveredBtn(null)}
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button
                    style={favoriteBtnStyle}
                    onClick={onToggleFavorite}
                    onMouseEnter={() => setHoveredBtn('favorite')}
                    onMouseLeave={() => setHoveredBtn(null)}
                    title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {item.favorite ? '❤️' : '🤍'}
                  </button>
                </>
              )}
            </div>

            {/* Metadata */}
            <div style={styles.metadata}>
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Type</span>
                <span style={styles.metaValue}>{isVideo ? 'Video' : 'Image'}</span>
              </div>
              {item.sizeBytes && (
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Size</span>
                  <span style={styles.metaValue}>{formatFileSize(item.sizeBytes)}</span>
                </div>
              )}
              {isVideo && item.durationSec && (
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Duration</span>
                  <span style={styles.metaValue}>{formatDuration(item.durationSec)}</span>
                </div>
              )}
              <div style={styles.metaItem}>
                <span style={styles.metaLabel}>Created</span>
                <span style={styles.metaValue}>{formatDate(item.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              <button
                style={{
                  ...styles.actionBtn,
                  ...styles.downloadBtn,
                  ...(hoveredBtn === 'download' ? styles.downloadBtnHover : {}),
                }}
                onClick={handleDownload}
                onMouseEnter={() => setHoveredBtn('download')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                ⬇️ Download
              </button>
              <button
                style={{
                  ...styles.actionBtn,
                  ...styles.deleteBtn,
                  ...(hoveredBtn === 'delete' ? styles.deleteBtnHover : {}),
                }}
                onClick={onDelete}
                onMouseEnter={() => setHoveredBtn('delete')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ContentDetailModal;