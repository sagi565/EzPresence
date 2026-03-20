import React, { useEffect, useRef, useState } from 'react';
import { ContentItem } from '@/models/ContentList';
import { useContentUrl } from '@/hooks/contents/useContentUrl';
import './styles';

export interface ContentPreviewProps {
    id: string;
    content: ContentItem | null;
    isDragOver: boolean;
    onRemove: (e: React.MouseEvent) => void;
    onOpenDrawer: () => void;
    /** Called when clicking the preview while content is already loaded — opens detail view */
    onClickDetail?: (content: ContentItem) => void;
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
    onClickDetail,
    onDrop,
    onDragOver,
    onDragLeave,
    onDragEnter,
    placeholderText = 'Click to add content',
}) => {
    const isVideo = content?.type === 'video';
    const { url: videoUrl, fetchUrl } = useContentUrl();
    const divRef = useRef<HTMLDivElement>(null);

    // True while the thumbnail/video hasn't finished loading yet
    const [isLoading, setIsLoading] = useState(false);
    const [mediaReady, setMediaReady] = useState(false);
    const prevContentId = useRef<string | undefined>(undefined);

    // When a new content item arrives, enter loading state until media fires onLoad
    useEffect(() => {
        const newId = content?.id;
        if (newId && newId !== prevContentId.current) {
            setIsLoading(true);
            setMediaReady(false);
            prevContentId.current = newId;
        }
        if (!newId) {
            prevContentId.current = undefined;
            setIsLoading(false);
            setMediaReady(false);
        }
    }, [content?.id]);

    // Keep callbacks in refs so native listeners never go stale
    const onDragEnterRef = useRef(onDragEnter);
    const onDragOverRef  = useRef(onDragOver);
    const onDragLeaveRef = useRef(onDragLeave);
    const onDropRef      = useRef(onDrop);
    useEffect(() => { onDragEnterRef.current = onDragEnter; }, [onDragEnter]);
    useEffect(() => { onDragOverRef.current  = onDragOver;  }, [onDragOver]);
    useEffect(() => { onDragLeaveRef.current = onDragLeave; }, [onDragLeave]);
    useEffect(() => { onDropRef.current      = onDrop;      }, [onDrop]);

    useEffect(() => {
        if (content?.id && isVideo) fetchUrl(content.id);
    }, [content?.id, isVideo, fetchUrl]);

    // If there's no actual media URL to wait for (emoji fallback), resolve immediately
    useEffect(() => {
        if (hasValidContent && !thumbSrc && !isVideo) {
            setIsLoading(false);
            setMediaReady(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content?.id]);

    // Attach native drag listeners (avoids React synthetic event delegation issues)
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
            if (el.contains(e.relatedTarget as Node)) return;
            onDragLeaveRef.current?.(e as unknown as React.DragEvent);
        };
        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            onDropRef.current?.(e as unknown as React.DragEvent);
        };

        el.addEventListener('dragenter', handleDragEnter);
        el.addEventListener('dragover',  handleDragOver);
        el.addEventListener('dragleave', handleDragLeave);
        el.addEventListener('drop',      handleDrop);
        return () => {
            el.removeEventListener('dragenter', handleDragEnter);
            el.removeEventListener('dragover',  handleDragOver);
            el.removeEventListener('dragleave', handleDragLeave);
            el.removeEventListener('drop',      handleDrop);
        };
    }, []);

    const getThumbnailSrc = (thumb?: string) => {
        if (!thumb) return null;
        if (thumb.startsWith('http') || thumb.startsWith('data:')) return thumb;
        if (thumb.length > 20) return `data:image/jpeg;base64,${thumb.replace(/[\n\r\s]/g, '')}`;
        return null;
    };

    const thumbSrc        = content ? getThumbnailSrc(content.thumbnail) : null;
    const hasValidContent = Boolean(content?.id && content.id.trim() !== '');

    // Called by both img.onLoad and video.onCanPlay
    const handleMediaLoaded = () => {
        setIsLoading(false);
        setMediaReady(true);
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasValidContent && content) {
            // Content present — open detail view, never re-open the drawer
            onClickDetail?.(content);
        } else {
            // Empty — open drawer to pick content
            onOpenDrawer();
        }
    };

    const classNames = [
        'nsm-content-preview',
        hasValidContent ? 'has-content'  : '',
        isDragOver      ? 'drop-hover'   : '',
    ].filter(Boolean).join(' ');

    const showShimmer = hasValidContent && isLoading;
    const showFilled  = hasValidContent && !isLoading;

    return (
        <div
            ref={divRef}
            id={id}
            className={classNames}
            onClick={handleClick}
        >
            {/* ── Empty placeholder ──────────────────────────────────────────── */}
            <div
                className="nsm-content-placeholder"
                style={{ display: hasValidContent ? 'none' : 'flex', pointerEvents: 'none' }}
            >
                <span className="placeholder-icon">🎞️</span>
                <span className="placeholder-text">{placeholderText}</span>
            </div>

            {/* ── Loading shimmer — shown until media fires onLoad / canplay ─── */}
            {showShimmer && (
                <div className="nsm-content-loading" style={{ pointerEvents: 'none' }}>
                    <div
                        className="nsm-shimmer-bar"
                        style={{ width: '55%', height: '11px', borderRadius: '6px', marginBottom: '8px' }}
                    />
                    <div
                        className="nsm-shimmer-bar"
                        style={{ width: '38%', height: '9px', borderRadius: '6px' }}
                    />
                    <div className="nsm-loading-dots">
                        <div className="nsm-loading-dot" style={{ animationDelay: '0ms' }} />
                        <div className="nsm-loading-dot" style={{ animationDelay: '150ms' }} />
                        <div className="nsm-loading-dot" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}

            {/* ── Filled content ─────────────────────────────────────────────── */}
            <div
                className="nsm-content-filled"
                style={{
                    display: showFilled ? 'flex' : 'none',
                    backgroundImage: (!isVideo && thumbSrc) ? `url(${thumbSrc})` : 'none',
                    backgroundColor:
                        showFilled && !thumbSrc && !isVideo
                            ? 'rgba(155, 93, 229, 0.08)'
                            : 'transparent',
                    pointerEvents: 'none',
                    animation: mediaReady
                        ? 'contentFadeIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards'
                        : 'none',
                }}
            >
                {/* Hidden img fires onLoad so we know when the thumbnail is painted */}
                {!isVideo && thumbSrc && (
                    <img
                        key={thumbSrc}
                        src={thumbSrc}
                        alt=""
                        onLoad={handleMediaLoaded}
                        onError={handleMediaLoaded}
                        style={{ display: 'none' }}
                    />
                )}

                {isVideo && videoUrl && (
                    <video
                        key={videoUrl}
                        src={videoUrl}
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover', zIndex: 1,
                            pointerEvents: 'none',
                        }}
                        autoPlay muted loop playsInline
                        onCanPlay={handleMediaLoaded}
                    />
                )}

                {/* Emoji fallback when no media src */}
                {!thumbSrc && !videoUrl && content && (
                    <div
                        style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '32px', zIndex: 1, opacity: 0.5, pointerEvents: 'none',
                        }}
                    >
                        {isVideo ? '🎬' : '🖼️'}
                    </div>
                )}

                <div className="filled-title" style={{ pointerEvents: 'none' }}>
                    {content?.title}
                </div>
            </div>

            {/* ── Remove button ──────────────────────────────────────────────── */}
            <button
                className="nsm-remove-content"
                style={{ display: showFilled ? 'flex' : 'none' }}
                onClick={(e) => { e.stopPropagation(); onRemove(e); }}
                title="Remove content"
            >
                ✕
            </button>
        </div>
    );
};

export default ContentPreview;