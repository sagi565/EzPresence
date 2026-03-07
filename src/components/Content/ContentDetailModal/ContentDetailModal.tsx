import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ContentItem } from '@models/ContentList';
import { useContentUrl } from '@/hooks/contents/useContentUrl';
import { 
  Overlay, 
  Modal, 
  CloseButton, 
  ContentWrapper, 
  MediaSection, 
  Media, 
  MediaPlaceholder, 
  InfoSection, 
  TitleSection, 
  Title, 
  RenameInput, 
  IconButton, 
  MetadataContainer, 
  MetaItem, 
  MetaLabel, 
  MetaValue, 
  ActionContainer, 
  ActionButton 
} from './styles';
import TrashButton from '@/components/Scheduler/CreateModals/TrashButton/TrashButton';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const { url: fetchedUrl, fetchUrl } = useContentUrl();

  const isVideo = item?.type === 'video';

  useEffect(() => {
    if (isOpen && item && !fetchedUrl && !item.id.startsWith('temp-')) {
      fetchUrl(item.id);
    }
  }, [isOpen, item, fetchedUrl, fetchUrl]);

  useEffect(() => {
    if (!isOpen) {
      setIsRenaming(false);
      setRenameValue('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isRenaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [isRenaming]);

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
  const displaySrc = isVideo ? mediaSrc : (getThumbnailSrc() || fetchedUrl);

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

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CloseButton className="modal-close-btn" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </CloseButton>

        <ContentWrapper>
          <MediaSection>
            {isVideo && displaySrc ? (
              <Media $isVideo={true}>
                <video
                  ref={videoRef}
                  src={displaySrc}
                  controls
                  autoPlay
                  loop
                />
              </Media>
            ) : !isVideo && displaySrc ? (
              <Media $isVideo={false}>
                <img src={displaySrc} alt={item.title} />
              </Media>
            ) : (
              <MediaPlaceholder>
                <span style={{ fontSize: '64px' }}>{isVideo ? '🎬' : '🖼️'}</span>
              </MediaPlaceholder>
            )}
          </MediaSection>

          <InfoSection>
            <TitleSection>
              {isRenaming ? (
                <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                  <RenameInput
                    ref={renameInputRef}
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={handleRenameKeyDown}
                    placeholder="Enter name..."
                  />
                  <IconButton
                    $type="save"
                    onClick={handleRenameSubmit}
                    title="Save"
                  >
                    ✓
                  </IconButton>
                  <IconButton
                    $type="cancel"
                    onClick={handleEditCancel}
                    title="Cancel"
                  >
                    ×
                  </IconButton>
                </div>
              ) : (
                <>
                  <Title>{item.title || 'Untitled'}</Title>
                  <IconButton
                    $type="edit"
                    onClick={() => {
                      setRenameValue(item.title || '');
                      setIsRenaming(true);
                    }}
                    title="Rename"
                  >
                    ✏️
                  </IconButton>
                  <IconButton
                    $type="favorite"
                    $active={item.favorite}
                    onClick={onToggleFavorite}
                    title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    {item.favorite ? '❤️' : '🤍'}
                  </IconButton>
                </>
              )}
            </TitleSection>

            <MetadataContainer>
              <MetaItem>
                <MetaLabel>Type</MetaLabel>
                <MetaValue>{isVideo ? 'Video' : 'Image'}</MetaValue>
              </MetaItem>
              {item.sizeBytes && (
                <MetaItem>
                  <MetaLabel>Size</MetaLabel>
                  <MetaValue>{formatFileSize(item.sizeBytes)}</MetaValue>
                </MetaItem>
              )}
              {isVideo && item.durationSec && (
                <MetaItem>
                  <MetaLabel>Duration</MetaLabel>
                  <MetaValue>{formatDuration(item.durationSec)}</MetaValue>
                </MetaItem>
              )}
              <MetaItem>
                <MetaLabel>Created</MetaLabel>
                <MetaValue>{formatDate(item.createdAt)}</MetaValue>
              </MetaItem>
            </MetadataContainer>

            <ActionContainer>
              <ActionButton
                $variant="download"
                onClick={handleDownload}
              >
                ⬇️ Download
              </ActionButton>
              <TrashButton
                onClick={onDelete}
                title="Delete"
                style={{
                  padding: '14px 20px',
                  height: 'auto',
                  borderRadius: '12px',
                  fontSize: '15px',
                  width: '100%',
                }}
              >
                Delete
              </TrashButton>
            </ActionContainer>
          </InfoSection>
        </ContentWrapper>
      </Modal>
    </Overlay>,
    document.body
  );
};

export default ContentDetailModal;