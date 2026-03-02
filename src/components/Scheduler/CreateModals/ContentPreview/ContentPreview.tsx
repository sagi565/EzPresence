import React, { useRef, useEffect } from 'react';
import { ContentItem } from '@/models/ContentList';
import { useContentUrl } from '@/hooks/contents/useContentUrl';
import './styles';

export interface ContentPreviewProps {
    id: string;
    content: ContentItem | null;
    isDragOver: boolean;
    onRemove: (e: React.MouseEvent) => void;
    onOpenDrawer: () => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
    onDragEnter?: (e: React.DragEvent) => void;
    placeholderText?: string;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
    id,
    content,
    isDragOver,
    onRemove,
    onOpenDrawer,
    onDrop,
    onDragOver,
    onDragLeave,
    onDragEnter,
    placeholderText = 'Click to add content',
}) => {
    // We only use state for the video playback url
    const isVideo = content?.type === 'video';
    const { url: videoUrl, fetchUrl } = useContentUrl();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (content?.id && isVideo) {
            fetchUrl(content.id);
        }
    }, [content?.id, isVideo, fetchUrl]);

    // Format thumbnail if it exists
    const getThumbnailSrc = (thumb?: string) => {
        if (!thumb) return null;
        if (thumb.startsWith('http') || thumb.startsWith('data:')) return thumb;
        if (thumb.length > 20) return `data:image/jpeg;base64,${thumb.replace(/[\n\r\s]/g, '')}`;
        return null;
    };

    const thumbSrc = content ? getThumbnailSrc(content.thumbnail) : null;
    const hasValidContent = Boolean(content?.id && content.id.trim() !== '');
    const hasMedia = isVideo ? !!videoUrl : !!thumbSrc;

    return (
        <div
            id={id}
            className={`nsm-content-preview ${hasValidContent ? 'has-content' : ''} ${isDragOver ? 'drop-hover' : ''}`}
            onClick={(e) => {
                e.stopPropagation();
                if (!hasValidContent) onOpenDrawer();
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDragEnter={onDragEnter}
        >
            {/* 1. Placeholder (shown when empty) */}
            <div
                className="nsm-content-placeholder"
                style={{ display: hasValidContent ? 'none' : 'flex' }}
            >
                <span className="placeholder-icon">🎞️</span>
                <span className="placeholder-text">{placeholderText}</span>
            </div>

            {/* 2. Filled Content (shown when has content) */}
            <div
                className="nsm-content-filled"
                style={{
                    display: hasValidContent ? 'flex' : 'none',
                    backgroundImage: (!isVideo && thumbSrc) ? `url(${thumbSrc})` : 'none',
                    backgroundColor: hasValidContent && !thumbSrc ? 'rgba(155, 93, 229, 0.1)' : 'transparent'
                }}
            >
                {isVideo && videoUrl && (
                    <video
                        ref={videoRef}
                        src={videoUrl}
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover', zIndex: 1, pointerEvents: 'none'
                        }}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                )}
                {!hasMedia && content && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '32px', zIndex: 1, opacity: 0.5
                    }}>
                        {isVideo ? '🎬' : '🖼️'}
                    </div>
                )}
                <div className="filled-title">{content?.title}</div>
            </div>

            {/* 3. Remove Button */}
            <button
                className="nsm-remove-content"
                style={{ display: hasValidContent ? 'flex' : 'none' }}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove(e);
                }}
                title="Remove content"
            >
                ✕
            </button>
        </div>
    );
};

export default ContentPreview;
