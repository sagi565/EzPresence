// import { theme } from '@/theme/theme'; // Removed direct theme import to use CSS variables instead
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 2100, // Higher than NewPostModal (1600)
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    modal: {
        width: '900px',
        maxWidth: '95vw',
        height: '85vh',
        backgroundColor: 'var(--color-surface)',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, .3), 0 0 0 1px var(--color-bg)',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out',
        border: '1px solid var(--color-bg)',
    },

    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid var(--color-bg)',
        backgroundColor: 'var(--color-surface)',
    },

    titleRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },

    titleIcon: {
        fontSize: '24px',
    },

    title: {
        fontSize: '20px',
        fontWeight: 600,
        color: 'var(--color-text)',
    },

    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        color: 'var(--color-muted)',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        transition: 'all 0.2s',
    },

    body: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
    },

    sidebar: {
        width: '240px',
        borderRight: '1px solid var(--color-bg)',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column' as const,
        padding: '16px 0',
        overflowY: 'auto' as const,
    },

    sidebarItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 24px',
        cursor: 'pointer',
        transition: 'all 0.15s',
        fontSize: '14px',
        color: 'var(--color-text)',
        fontWeight: 500,
        borderLeft: '3px solid transparent',
    },

    sidebarItemActive: {
        backgroundColor: 'rgba(155, 93, 229, 0.08)',
        color: 'var(--color-primary)',
        borderLeftColor: 'var(--color-primary)',
    },

    sidebarIcon: {
        fontSize: '18px',
        width: '24px',
        textAlign: 'center' as const,
    },

    contentArea: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
    },

    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-bg)',
    },

    searchBox: {
        display: 'flex',
        alignItems: 'center',
        background: 'var(--color-bg)',
        borderRadius: '8px',
        padding: '8px 12px',
        width: '300px',
        gap: '8px',
        transition: 'all 0.2s',
    },

    searchIcon: {
        color: 'var(--color-muted)',
        fontSize: '16px',
    },

    searchInput: {
        border: 'none',
        background: 'transparent',
        fontSize: '14px',
        color: 'var(--color-text)',
        outline: 'none',
        width: '100%',
    },

    grid: {
        flex: 1,
        padding: '24px',
        overflowY: 'auto' as const,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '20px',
        alignContent: 'start',
    },

    card: {
        backgroundColor: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-bg)',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        aspectRatio: '1 / 1.1', // Slightly taller than square
    },

    cardHover: {
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        borderColor: 'var(--color-primary)',
    },

    thumbnailContainer: {
        flex: 1,
        position: 'relative' as const,
        backgroundColor: 'var(--color-bg)',
        overflow: 'hidden',
    },

    thumbnail: {
        width: '100%',
        height: '100%',
        objectFit: 'cover' as const,
    },

    typeIcon: {
        position: 'absolute' as const,
        top: '8px',
        right: '8px',
        width: '24px',
        height: '24px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '12px',
    },

    duration: {
        position: 'absolute' as const,
        bottom: '8px',
        right: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        fontSize: '10px',
        padding: '2px 6px',
        borderRadius: '4px',
        fontWeight: 500,
    },

    cardInfo: {
        padding: '12px',
        borderTop: '1px solid var(--color-bg)',
    },

    cardTitle: {
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--color-text)',
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginBottom: '4px',
    },

    cardMeta: {
        fontSize: '11px',
        color: 'var(--color-muted)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    emptyState: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--color-muted)',
        gap: '12px',
    },

    emptyIcon: {
        fontSize: '48px',
        opacity: 0.5,
    },
};
