import React from 'react';
import { ContentItem } from '@/models/ContentList';
import { theme } from '@/theme/theme';

interface ContentPreviewProps {
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
    content,
    isDragOver,
    onRemove,
    onOpenDrawer,
    onDrop,
    onDragOver,
    onDragLeave,
    placeholderText = "Drop Content Here"
}) => {
    return (
        <div
            style={{
                ...styles.contentPreview,
                ...(content ? { borderStyle: 'solid', borderColor: theme.colors.primary } : {}),
                ...(isDragOver ? { borderColor: theme.colors.primary, borderStyle: 'solid', background: `${theme.colors.primary}05` } : {})
            }}
            onClick={onOpenDrawer}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
        >
            {content ? (
                <>
                    <div
                        style={{
                            ...styles.contentFilled,
                            backgroundImage: content.thumbnail ? `url(${content.thumbnail})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        {!content.thumbnail && (
                            <div style={styles.contentTitle}>{content.title}</div>
                        )}
                        {/* Overlay when dragging over filled content */}
                        {isDragOver && (
                            <div style={styles.dropOverlay}>
                                <div style={styles.dropIcon}>🔄</div>
                                <span style={styles.dropText}>Replace Content</span>
                            </div>
                        )}
                    </div>
                    <button
                        style={styles.removeBtn}
                        onClick={onRemove}
                        title="Remove content"
                    >
                        ✕
                    </button>
                    {content.type && (
                        <div style={styles.typeBadge}>
                            {content.type === 'video' ? '🎥' : '📷'}
                        </div>
                    )}
                </>
            ) : (
                <div style={styles.contentPlaceholder}>
                    <div style={{
                        ...styles.placeholderIcon,
                        ...(isDragOver ? { transform: 'scale(1.1)', color: theme.colors.primary } : {})
                    }}>
                        {isDragOver ? '📥' : '＋'}
                    </div>
                    <span style={{
                        ...styles.placeholderText,
                        ...(isDragOver ? { color: theme.colors.primary, fontWeight: 600 } : {})
                    }}>
                        {isDragOver ? 'Drop to Attach' : placeholderText}
                    </span>
                    {/* Overlay for empty state */}
                    {isDragOver && <div style={styles.dropOverlayBackground} />}
                </div>
            )}
        </div>
    );
};

const styles = {
    contentPreview: {
        width: '180px', // Match demo width exactly
        aspectRatio: '9/16',
        borderRadius: '14px',
        border: '2px dashed rgba(0, 0, 0, .1)',
        background: '#f8f9fb',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all .2s',
        overflow: 'hidden',
        position: 'relative' as const,
    },
    contentFilled: {
        position: 'absolute' as const,
        inset: 0,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    contentPlaceholder: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '12px',
        zIndex: 2,
    },
    placeholderIcon: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        color: theme.colors.muted,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all .2s',
    },
    placeholderText: {
        fontSize: '13px',
        fontWeight: 500,
        color: theme.colors.muted,
        textAlign: 'center' as const,
        transition: 'all .2s',
    },
    removeBtn: {
        position: 'absolute' as const,
        top: '8px',
        right: '8px',
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '12px',
        zIndex: 10,
        transition: 'background .2s',
    },
    contentTitle: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#fff',
        textAlign: 'center' as const,
        padding: '10px',
        background: 'rgba(0,0,0,0.5)',
        width: '100%',
    },
    typeBadge: {
        position: 'absolute' as const,
        bottom: '8px',
        left: '8px',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        padding: '4px 8px',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    dropOverlay: {
        position: 'absolute' as const,
        inset: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        zIndex: 5,
        animation: 'fadeIn 0.2s ease',
    },
    dropOverlayBackground: { // Subtle background helpful for empty state
        position: 'absolute' as const,
        inset: 0,
        background: `${theme.colors.primary}08`, // Very light tint
        zIndex: -1,
    },
    dropIcon: {
        fontSize: '28px',
        color: theme.colors.primary,
        marginBottom: '4px',
    },
    dropText: {
        fontSize: '14px',
        fontWeight: 600,
        color: theme.colors.primary,
    }
};

export default ContentPreview;
