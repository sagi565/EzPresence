import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    container: {
        position: 'absolute' as const,
        top: 'calc(100% + 4px)',
        left: 0,
        width: '260px', // Reduced width
        maxHeight: '280px', // Reduced max height
        background: '#fff',
        borderRadius: '10px', // Slightly smaller radius
        boxShadow: '0 6px 20px rgba(0, 0, 0, .12), 0 0 0 1px rgba(0, 0, 0, .04)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column' as const,
        overflow: 'hidden',
        fontSize: '13px', // Base font size smaller
    },

    searchBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 10px', // Reduced padding
        borderBottom: '1px solid rgba(0, 0, 0, .06)',
        flexShrink: 0,
    },

    searchIcon: {
        fontSize: '14px',
        opacity: 0.5,
    },

    searchInput: {
        flex: 1,
        border: 'none',
        outline: 'none',
        fontSize: '13px', // Smaller input font
        fontFamily: 'inherit',
        color: theme.colors.text,
        background: 'transparent',
    },

    list: {
        flex: 1,
        overflowY: 'auto' as const,
        padding: '4px', // Reduced padding
    },

    item: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 8px', // Reduced padding
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all .15s',
        position: 'relative' as const,
    },

    itemHovered: {
        background: 'rgba(155, 93, 229, .06)', // Lighter hover background
    },

    itemSelected: {
        background: 'rgba(155, 93, 229, .1)',
    },

    flag: {
        fontSize: '18px', // Smaller flag
        flexShrink: 0,
        width: '24px',
        textAlign: 'center' as const,
    },

    info: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1px',
        minWidth: 0, // Allow text truncation
    },

    labelRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
    },

    label: {
        fontSize: '13px', // Smaller text
        fontWeight: 500,
        color: theme.colors.text,
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },

    offset: {
        fontSize: '11px',
        fontWeight: 500,
        color: theme.colors.muted,
        fontFamily: 'monospace',
        flexShrink: 0,
    },

    country: {
        fontSize: '11px', // Smaller country text
        color: theme.colors.muted,
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },

    checkmark: {
        fontSize: '14px',
        color: theme.colors.primary,
        fontWeight: 700,
        flexShrink: 0,
        marginLeft: '4px',
    },

    noResults: {
        padding: '24px 16px',
        textAlign: 'center' as const,
        fontSize: '13px',
        color: theme.colors.muted,
    },
};
