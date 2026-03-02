import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    container: {
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        background: theme.colors.surface,
        borderRadius: '12px',
        boxShadow: '0 12px 40px rgba(0,0,0,.18)',
        border: `1px solid rgba(155, 93, 229, .12)`,
        padding: '16px',
        zIndex: 50,
        width: '280px',
    },

    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
    },

    title: {
        fontSize: '14px',
        fontWeight: 700,
        color: theme.colors.text,
    },

    arrow: {
        width: '28px',
        height: '28px',
        border: 'none',
        borderRadius: '6px',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '14px',
        color: theme.colors.muted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background .15s',
    },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '2px',
        textAlign: 'center' as const,
    },

    dayHeader: {
        fontSize: '11px',
        fontWeight: 600,
        color: theme.colors.muted,
        padding: '4px 0',
    },

    day: {
        width: '34px',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: 500,
        color: theme.colors.text,
        transition: 'all .15s',
        border: 'none',
        background: 'transparent',
        margin: 'auto',
    },

    dayToday: {
        fontWeight: 700,
        color: theme.colors.primary,
    },

    daySelected: {
        background: theme.colors.primary,
        color: '#fff',
        fontWeight: 700,
    },

    dayOtherMonth: {
        width: '34px',
        height: '34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        color: '#d1d5db',
        border: 'none',
        background: 'transparent',
        margin: 'auto',
        cursor: 'default',
    },

    dayDisabled: {
        color: '#d1d5db',
        cursor: 'not-allowed',
        opacity: 0.5,
    },
};
