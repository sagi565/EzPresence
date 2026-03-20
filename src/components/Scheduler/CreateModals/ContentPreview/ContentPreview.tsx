import React, { useEffect, useRef, useState } from 'react';
import { ContentItem } from '@/models/ContentList';
import { useContentUrl } from '@/hooks/contents/useContentUrl';
import * as S from './styles';

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

    const showShimmer = hasValidContent && isLoading;
    const showFilled  = hasValidContent && !isLoading;

    return (
        <S.PreviewShell
            ref={divRef}
            id={id}
            $hasContent={hasValidContent}
            $dropHover={isDragOver}
            onClick={handleClick}
        >
            {/* ── Empty placeholder ──────────────────────────────────────────── */}
            {!hasValidContent && (
                <S.Placeholder>
                    <S.PlaceholderIcon>🎞️</S.PlaceholderIcon>
                    <S.PlaceholderText>{placeholderText}</S.PlaceholderText>
                </S.Placeholder>
            )}

            {/* ── Loading shimmer — shown until media fires onLoad / canplay ─── */}
            {showShimmer && (
                <S.LoadingContainer>
                    <S.ShimmerBar
                        style={{ width: '55%', height: '11px', borderRadius: '6px', marginBottom: '8px' }}
                    />
                    <S.ShimmerBar
                        style={{ width: '38%', height: '9px', borderRadius: '6px' }}
                    />
                    <S.LoadingDots>
                        <S.LoadingDot $delay="0ms" />
                        <S.LoadingDot $delay="150ms" />
                        <S.LoadingDot $delay="300ms" />
                    </S.LoadingDots>
                </S.LoadingContainer>
            )}

            {/* ── Filled content ─────────────────────────────────────────────── */}
            <S.FilledContent
                $ready={mediaReady && showFilled}
                $bgImage={(!isVideo && thumbSrc) ? thumbSrc : undefined}
                $isEmptyFallback={Boolean(showFilled && !thumbSrc && !isVideo)}
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
                    <S.VideoPlayer
                        key={videoUrl}
                        src={videoUrl}
                        autoPlay muted loop playsInline
                        onCanPlay={handleMediaLoaded}
                    />
                )}

                {/* Emoji fallback when no media src */}
                {!thumbSrc && !videoUrl && content && (
                    <S.EmotionFallback>
                        {isVideo ? '🎬' : '🖼️'}
                    </S.EmotionFallback>
                )}

                <S.FilledTitle>
                    {content?.title}
                </S.FilledTitle>
            </S.FilledContent>

            {/* ── Remove button ──────────────────────────────────────────────── */}
            {showFilled && (
                <S.RemoveButton
                    onClick={(e) => { e.stopPropagation(); onRemove(e); }}
                    title="Remove content"
                >
                    ✕
                </S.RemoveButton>
            )}
        </S.PreviewShell>
    );
};

export default ContentPreview;