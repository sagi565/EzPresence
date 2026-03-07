import React, { useEffect, useRef } from 'react';
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

/**
 * All drag handling is done via native addEventListener (not React synthetic
 * events). React's synthetic drag events go through event delegation on the
 * root — when the modal is opened by clicking this element, the browser's
 * focus/active tracking interferes with React's delegation and events stop
 * being delivered reliably. Native listeners on the actual DOM node always
 * fire regardless of that.
 *
 * dragLeave uses relatedTarget to filter out child-crossing noise — only
 * fires the parent callback when the pointer truly leaves this element.
 */
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
    const isVideo = content?.type === 'video';
    const { url: videoUrl, fetchUrl } = useContentUrl();
    const divRef = useRef<HTMLDivElement>(null);

    // Keep callbacks in refs so the native listeners never go stale
    const onDragEnterRef = useRef(onDragEnter);
    const onDragOverRef = useRef(onDragOver);
    const onDragLeaveRef = useRef(onDragLeave);
    const onDropRef = useRef(onDrop);
    useEffect(() => { onDragEnterRef.current = onDragEnter; }, [onDragEnter]);
    useEffect(() => { onDragOverRef.current = onDragOver; }, [onDragOver]);
    useEffect(() => { onDragLeaveRef.current = onDragLeave; }, [onDragLeave]);
    useEffect(() => { onDropRef.current = onDrop; }, [onDrop]);

    useEffect(() => {
        if (content?.id && isVideo) fetchUrl(content.id);
    }, [content?.id, isVideo, fetchUrl]);

    useEffect(() => {
        const el = divRef.current;
        if (!el) return;

        const handleDragEnter = (e: DragEvent) => {
            e.preventDefault();
            onDragEnterRef.current?.(e as unknown as React.DragEvent);
        };

        const handleDragOver = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
            onDragOverRef.current?.(e as unknown as React.DragEvent);
        };

        const handleDragLeave = (e: DragEvent) => {
            // relatedTarget is where the pointer went TO — if it's still
            // inside this element (a child), ignore it entirely.
            if (el.contains(e.relatedTarget as Node)) return;
            onDragLeaveRef.current?.(e as unknown as React.DragEvent);
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            onDropRef.current?.(e as unknown as React.DragEvent);
        };

        el.addEventListener('dragenter', handleDragEnter);
        el.addEventListener('dragover', handleDragOver);
        el.addEventListener('dragleave', handleDragLeave);
        el.addEventListener('drop', handleDrop);
        return () => {
            el.removeEventListener('dragenter', handleDragEnter);
            el.removeEventListener('dragover', handleDragOver);
            el.removeEventListener('dragleave', handleDragLeave);
            el.removeEventListener('drop', handleDrop);
        };
    }, []); // attach once — callbacks read from refs

    const getThumbnailSrc = (thumb?: string) => {
        if (!thumb) return null;
        if (thumb.startsWith('http') || thumb.startsWith('data:')) return thumb;
        if (thumb.length > 20) return `data:image/jpeg;base64,${thumb.replace(/[\n\r\s]/g, '')}`;
        return null;
    };

    const thumbSrc = content ? getThumbnailSrc(content.thumbnail) : null;
    const hasValidContent = Boolean(content?.id && content.id.trim() !== '');
    const hasMedia = isVideo ? !!videoUrl : !!thumbSrc;

    const classNames = [
        'nsm-content-preview',
        hasValidContent ? 'has-content' : '',
        isDragOver ? 'drop-hover' : '',
    ].filter(Boolean).join(' ');

    return (
        <div
            ref={divRef}
            id={id}
            className={classNames}
            onClick={(e) => {
                e.stopPropagation();
                onOpenDrawer();
            }}
        >
            <div
                className="nsm-content-placeholder"
                style={{ display: hasValidContent ? 'none' : 'flex', pointerEvents: 'none' }}
            >
                <span className="placeholder-icon">🎞️</span>
                <span className="placeholder-text">{placeholderText}</span>
            </div>

            <div
                className="nsm-content-filled"
                style={{
                    display: hasValidContent ? 'flex' : 'none',
                    backgroundImage: (!isVideo && thumbSrc) ? `url(${thumbSrc})` : 'none',
                    backgroundColor: hasValidContent && !thumbSrc ? 'rgba(155, 93, 229, 0.1)' : 'transparent',
                    pointerEvents: 'none',
                }}
            >
                {isVideo && videoUrl && (
                    <video
                        src={videoUrl}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1, pointerEvents: 'none' }}
                        autoPlay muted loop playsInline
                    />
                )}
                {!hasMedia && content && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', zIndex: 1, opacity: 0.5, pointerEvents: 'none' }}>
                        {isVideo ? '🎬' : '🖼️'}
                    </div>
                )}
                <div className="filled-title" style={{ pointerEvents: 'none' }}>{content?.title}</div>
            </div>

            <button
                className="nsm-remove-content"
                style={{ display: hasValidContent ? 'flex' : 'none' }}
                onClick={(e) => { e.stopPropagation(); onRemove(e); }}
                title="Remove content"
            >
                ✕
            </button>
        </div>
    );
};

export default ContentPreview;