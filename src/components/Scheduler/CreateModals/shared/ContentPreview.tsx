import React, { useState, useRef, useEffect } from 'react';
import { ContentItem } from '@/models/ContentList';
import { getDragItem } from '@/utils/dragState';
import { theme } from '@/theme/theme';
import { useContentUrl } from '@/hooks/contents/useContentUrl';

interface ContentPreviewProps {
    id: string;
    content: ContentItem | null;
    isDragOver: boolean;
    onRemove: (e: React.MouseEvent) => void;
    onOpenDrawer: () => void;
    onDrop: (e: React.DragEvent) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: (e: React.DragEvent) => void;
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
    placeholderText = "Click to add content"
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [videoVisible, setVideoVisible] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isVideo = content?.type === 'video';

    // ── Fetch the signed download URL for the video ─────────────────────────
    const { url: videoUrl, fetchUrl } = useContentUrl();

    useEffect(() => {
        if (content?.id && isVideo) {
            fetchUrl(content.id);
        } else {
            setVideoVisible(false);
        }
    }, [content?.id, isVideo, fetchUrl]);

    // Reset visibility if content changes (e.g. from one video to another or to image)
    useEffect(() => {
        setVideoVisible(false);
        setIsHovered(false);
    }, [content?.id]);

    // ── Hover → play video (with a short delay like Netflix) ────────────────
    useEffect(() => {
        if (!isVideo || !videoUrl) return;

        if (isHovered) {
            hoverTimerRef.current = setTimeout(() => {
                setVideoVisible(true);
                videoRef.current?.play().catch(() => { });
            }, 600);
        } else {
            if (hoverTimerRef.current) {
                clearTimeout(hoverTimerRef.current);
                hoverTimerRef.current = null;
            }
            setVideoVisible(false);
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        }

        return () => {
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        };
    }, [isHovered, isVideo, videoUrl]);

    // ── Thumbnail helper ─────────────────────────────────────────────────────
    const getThumbnailSrc = (thumb: string | undefined) => {
        if (!thumb) return null;
        if (thumb.startsWith('http') || thumb.startsWith('data:')) return thumb;
        if (thumb.length > 20) return `data:image/jpeg;base64,${thumb.replace(/[\n\r\s]/g, '')}`;
        return null;
    };

    const thumbnailSrc = content ? getThumbnailSrc(content.thumbnail) : null;
    const hasThumbnail = !!thumbnailSrc;
    const hasVideo = isVideo && !!videoUrl;

    const PREVIEW_RADIUS = '32px';

    return (
        <div
            id={id}
            style={{
                ...styles.contentPreview,
                borderRadius: PREVIEW_RADIUS,
                ...(content ? { border: 'none', background: 'transparent' } : {}),
                cursor: 'pointer',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                console.log('👆 [ContentPreview] Container clicked, id:', id);
                e.stopPropagation();
                if (onOpenDrawer) {
                    console.log('🚀 [ContentPreview] Triggering onOpenDrawer');
                    onOpenDrawer();
                } else {
                    console.log('⚠️ [ContentPreview] onOpenDrawer prop missing');
                }
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
        >
            {content ? (
                <>
                    <div
                        style={{
                            ...styles.contentFilled,
                            borderRadius: PREVIEW_RADIUS,
                        }}
                    >
                        {/* ── Video layer (fetched from API) ───────── */}
                        {hasVideo && (
                            <video
                                ref={videoRef}
                                src={videoUrl!}
                                style={{
                                    ...styles.mediaLayer,
                                    opacity: videoVisible ? 1 : 0,
                                    transform: videoVisible ? 'scale(1.04)' : 'scale(1)',
                                    transition: 'opacity 0.4s ease, transform 0.4s ease',
                                    zIndex: 2,
                                    pointerEvents: 'none' as const,
                                }}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                            />
                        )}

                        {/* ── Thumbnail layer ──────────────────────── */}
                        {hasThumbnail ? (
                            <img
                                src={thumbnailSrc!}
                                alt={content.title}
                                style={{
                                    ...styles.mediaLayer,
                                    opacity: (hasVideo && videoVisible) ? 0 : 1,
                                    transition: 'opacity 0.4s ease',
                                    zIndex: 1,
                                    pointerEvents: 'none' as const,
                                }}
                            />
                        ) : (
                            // ── Dark placeholder when no thumbnail ───
                            <div style={{
                                ...styles.mediaLayer,
                                background: 'linear-gradient(135deg, #1e1b2e 0%, #2d2545 60%, #1a1730 100%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                zIndex: 1,
                                pointerEvents: 'none' as const,
                            }}>
                                {/* Loading spinner while fetching URL */}
                                {isVideo && !videoUrl ? (
                                    <>
                                        <div style={styles.fetchSpinner} />
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>
                                            Loading preview…
                                        </span>
                                    </>
                                ) : (
                                    <span style={{ fontSize: '40px', opacity: 0.4 }}>
                                        {isVideo ? '🎬' : '🖼️'}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* ── Gradient overlay + title ─────────────── */}
                        <div style={styles.gradientOverlay} />
                        <div style={styles.contentTitle}>{content.title}</div>

                        {/* ── Drag-over replace overlay ────────────── */}
                        {isDragOver && (
                            <div style={styles.dropOverlay}>
                                <div style={styles.dropIcon}>🔄</div>
                                <span style={styles.dropText}>Replace Content</span>
                            </div>
                        )}
                    </div>

                    <button
                        style={styles.removeBtn}
                        onClick={(e) => {
                            console.log('🗑️ [ContentPreview] Remove button clicked');
                            e.stopPropagation();
                            onRemove(e);
                        }}
                        title="Remove content"
                    >
                        ✕
                    </button>
                </>
            ) : (
                <div style={styles.contentPlaceholder}>
                    {isDragOver && getDragItem() ? (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: getDragItem().thumbnail
                                ? `url(${getThumbnailSrc(getDragItem().thumbnail)})`
                                : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: 0.7,
                            borderRadius: '14px',
                            zIndex: 1,
                            pointerEvents: 'none' as const,
                        }} />
                    ) : null}

                    <div style={{
                        ...styles.placeholderIcon,
                        ...(isDragOver ? { transform: 'scale(1.1)', color: theme.colors.primary, zIndex: 2 } : {}),
                        pointerEvents: 'none' as const,
                    }}>
                        {isDragOver ? '📥' : '＋'}
                    </div>
                    <span style={{
                        ...styles.placeholderText,
                        ...(isDragOver ? { color: theme.colors.primary, fontWeight: 600, zIndex: 2 } : {}),
                        pointerEvents: 'none' as const,
                    }}>
                        {isDragOver ? 'Drop to add content' : placeholderText}
                    </span>
                    {isDragOver && <div style={{ ...styles.dropOverlayBackground, pointerEvents: 'none' as const }} />}
                </div>
            )}
        </div>
    );
};

// ── Inject keyframes once ────────────────────────────────────────────────────
if (typeof document !== 'undefined') {
    const styleId = 'content-preview-keyframes';
    if (!document.getElementById(styleId)) {
        const tag = document.createElement('style');
        tag.id = styleId;
        tag.textContent = `
            @keyframes cpSpin {
                to { transform: rotate(360deg); }
            }
            @keyframes cpPulse {
                0% { transform: scale(1); box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15); }
                50% { transform: scale(1.05); box-shadow: 0 8px 24px rgba(251, 191, 36, 0.25); }
                100% { transform: scale(1); box-shadow: 0 4px 12px rgba(251, 191, 36, 0.15); }
            }
        `;
        document.head.appendChild(tag);
    }
}

const styles = {
    contentPreview: {
        width: '100%',
        height: '100%',
        minHeight: '400px',
        borderRadius: '32px',
        background: '#FAF9FF', // Subtle blue-lavender background
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative' as const,
        boxShadow: 'inset 0 0 1px rgba(155, 93, 229, 0.1)',
    },
    contentFilled: {
        position: 'absolute' as const,
        inset: 0,
        borderRadius: '32px', // Default, will be overridden by PREVIEW_RADIUS constant in render
        overflow: 'hidden',
        background: '#000',
    },
    // Shared style for both video and image layers
    mediaLayer: {
        position: 'absolute' as const,
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
        borderRadius: 'inherit', // Match the parent (contentFilled)
    },
    gradientOverlay: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        height: '100px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
        zIndex: 3,
        pointerEvents: 'none' as const,
    },
    contentTitle: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#fff',
        padding: '16px 20px',
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 4,
        textShadow: '0 1px 4px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        pointerEvents: 'none' as const,
    },
    fetchSpinner: {
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        border: '3px solid rgba(155, 93, 229, 0.2)',
        borderTopColor: theme.colors.primary,
        animation: 'cpSpin 0.8s linear infinite',
    },
    contentPlaceholder: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        zIndex: 5,
        border: '2.5px dashed #E1DFFF',
        borderRadius: '32px',
        pointerEvents: 'none' as const,
        transition: 'all 0.3s ease',
        background: 'rgba(255, 255, 255, 0.3)', // Slight glass effect
        padding: '20px',
    },
    placeholderIcon: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: '#FFFDF5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        color: '#FFBA08',
        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.15)',
        transition: 'all .3s cubic-bezier(0.4, 0, 0.2, 1)',
        animation: 'cpPulse 3s infinite ease-in-out',
    },
    placeholderText: {
        fontSize: '17px',
        fontWeight: 600,
        color: '#7C7F9C',
        textAlign: 'center' as const,
        transition: 'all .2s',
        letterSpacing: '-0.01em',
    },
    removeBtn: {
        position: 'absolute' as const,
        top: '12px',
        right: '12px',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        color: '#fff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: 50,
        transition: 'all .2s',
    },
    dropOverlay: {
        position: 'absolute' as const,
        inset: 0,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        zIndex: 20,
    },
    dropOverlayBackground: {
        position: 'absolute' as const,
        inset: 0,
        background: `rgba(155, 93, 229, 0.05)`,
        zIndex: -1,
    },
    dropIcon: {
        fontSize: '32px',
        color: theme.colors.primary,
        marginBottom: '4px',
    },
    dropText: {
        fontSize: '15px',
        fontWeight: 600,
        color: theme.colors.primary,
    },
};

export default ContentPreview;
