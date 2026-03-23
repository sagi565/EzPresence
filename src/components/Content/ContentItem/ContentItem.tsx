import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ContentItem as ContentItemType } from '@models/ContentList';
import { 
  ItemContainer, 
  MediaContainer, 
  MediaCover, 
  VideoCover, 
  GradientOverlay, 
  ActionsContainer, 
  ActionButton, 
  MoreOptionsButton, 
  MenuDropdown, 
  MenuItem, 
  ContentTitle, 
  ContentDate, 
  RenameContainer, 
  RenameInput, 
  LoadingOverlay, 
  Spinner 
} from './styles';
import { useContentUrl } from '@/hooks/contents/useContentUrl';
import { DraggableProvided } from '@hello-pangea/dnd';
import { useIsMobile } from '@/hooks/useIsMobile';

interface ContentItemProps {
  item: ContentItemType;
  listType: 'video' | 'image';
  provided?: DraggableProvided;
  isDragging?: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
  onToggleFavorite: () => void;
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  provided,
  isDragging = false,
  onClick,
  onDoubleClick,
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
  const isMobile = useIsMobile();

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
    setIsHovered(true);
    if (isVideo && !isUploading && item.id && !item.id.startsWith('temp-')) {
      if (!fetchedUrl) {
        fetchUrl(item.id);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setShowPreview(true);
      }, PREVIEW_DELAY);
    }
  }, [isVideo, isUploading, item.id, fetchedUrl, fetchUrl]);

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

  return (
      <ItemContainer
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        {...provided?.dragHandleProps}
        $isDragging={isDragging}
        $isHovered={isHovered}
        $isUploading={isUploading}
        $isMobile={isMobile}
        $showMenu={showMenu}
        onClick={onClick}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (onDoubleClick) onDoubleClick();
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={provided?.draggableProps.style}
      >
        <MediaContainer $isMobile={isMobile}>
          {isUploading ? (
            <>
              {thumbnailSrc && <MediaCover src={thumbnailSrc} alt="Uploading..." />}
              <LoadingOverlay>
                <Spinner />
                <span style={{ fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>Uploading...</span>
              </LoadingOverlay>
            </>
          ) : isVideo ? (
            <>
              {fetchedUrl && (
                <VideoCover
                  ref={videoRef}
                  src={fetchedUrl}
                  loop
                  muted
                  playsInline
                  $isVisible={showPreview && !!fetchedUrl}
                />
              )}
              {thumbnailSrc && (
                <MediaCover
                  src={thumbnailSrc}
                  alt={item.title}
                  $isVisible={!(showPreview && fetchedUrl)}
                />
              )}
            </>
          ) : (
            (fetchedUrl || thumbnailSrc) && (
              <MediaCover src={(fetchedUrl || thumbnailSrc) as string} alt={item.title} />
            )
          )}
          {!isUploading && (
            <GradientOverlay $isVisible={isHovered} />
          )}
        </MediaContainer>

        {!isUploading && (
          <>
            <ActionsContainer $isVisible={isHovered || item.favorite || showMenu}>
            <ActionButton
              $active={item.favorite}
              $isHovered={hoveredBtn === 'fav'}
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              onMouseEnter={() => setHoveredBtn('fav')}
              onMouseLeave={() => setHoveredBtn(null)}
              title="Toggle Favorite"
            >
              {item.favorite ? '❤️' : '🤍'}
            </ActionButton>
          </ActionsContainer>

          <MoreOptionsButton
            $isVisible={isHovered || showMenu}
            $isHovered={hoveredBtn === 'more' || showMenu}
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            onMouseEnter={() => setHoveredBtn('more')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            ⋯
          </MoreOptionsButton>

          {showMenu && (
            <MenuDropdown ref={menuRef} onClick={(e) => e.stopPropagation()}>
              <MenuItem
                $isHovered={hoveredBtn === 'download'}
                onClick={handleDownload}
                onMouseEnter={() => setHoveredBtn('download')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <span>⬇️</span> Download
              </MenuItem>
              <MenuItem
                $isHovered={hoveredBtn === 'rename'}
                onClick={handleRenameClick}
                onMouseEnter={() => setHoveredBtn('rename')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <span>✏️</span> Rename
              </MenuItem>
              <MenuItem
                $variant="delete"
                $isHovered={hoveredBtn === 'delete'}
                onClick={handleDelete}
                onMouseEnter={() => setHoveredBtn('delete')}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                <span>🗑️</span> Delete
              </MenuItem>
            </MenuDropdown>
          )}

          {isRenaming ? (
            <RenameContainer onClick={(e) => e.stopPropagation()}>
              <RenameInput
                ref={renameInputRef}
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={handleRenameKeyDown}
                onBlur={handleRenameSubmit}
                placeholder="Enter name..."
              />
            </RenameContainer>
          ) : (
            <>
              <ContentTitle $isVisible={isHovered} $isMobile={isMobile}>
                {item.title}
              </ContentTitle>
              <ContentDate $isVisible={isHovered} $isMobile={isMobile}>
                {formatDate(item.createdAt)}
              </ContentDate>
            </>
          )}
        </>
      )}
    </ItemContainer>
  );
};

export default ContentItem;