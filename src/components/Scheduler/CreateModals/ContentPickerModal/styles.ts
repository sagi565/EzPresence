import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    overlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        animation: 'slideUp 0.3s ease-out',
        border: '1px solid rgba(0, 0, 0, 0.05)',
    },

    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        backgroundColor: '#fff',
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
        color: theme.colors.text,
    },

    closeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '24px',
        color: theme.colors.muted,
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
        backgroundColor: '#f9fafb',
    },

    sidebar: {
        width: '240px',
        borderRight: '1px solid rgba(0, 0, 0, 0.06)',
        backgroundColor: '#fff',
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
        color: theme.colors.text,
        fontWeight: 500,
        borderLeft: '3px solid transparent',
    },

    sidebarItemActive: {
        backgroundColor: 'rgba(155, 93, 229, 0.08)',
        color: theme.colors.primary,
        borderLeftColor: theme.colors.primary,
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
        backgroundColor: '#fff',
        borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
    },

    searchBox: {
        display: 'flex',
        alignItems: 'center',
        background: '#f3f4f6',
        borderRadius: '8px',
        padding: '8px 12px',
        width: '300px',
        gap: '8px',
        transition: 'all 0.2s',
    },

    searchIcon: {
        color: theme.colors.muted,
        fontSize: '16px',
    },

    searchInput: {
        border: 'none',
        background: 'transparent',
        fontSize: '14px',
        color: theme.colors.text,
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
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid rgba(0, 0, 0, 0.06)',
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
        borderColor: theme.colors.primary,
    },

    thumbnailContainer: {
        flex: 1,
        position: 'relative' as const,
        backgroundColor: '#f0f0f0',
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
        borderTop: '1px solid rgba(0, 0, 0, 0.04)',
    },

    cardTitle: {
        fontSize: '13px',
        fontWeight: 500,
        color: theme.colors.text,
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        marginBottom: '4px',
    },

    cardMeta: {
        fontSize: '11px',
        color: theme.colors.muted,
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
        color: theme.colors.muted,
        gap: '12px',
    },

    emptyIcon: {
        fontSize: '48px',
        opacity: 0.5,
    },
};
