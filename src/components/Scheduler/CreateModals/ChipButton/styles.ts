import { CSSProperties } from 'react';
import { theme } from '@/theme/theme';

export const styles: Record<string, CSSProperties> = {
    chip: {
        padding: '7px 14px',
        border: '1.5px solid rgba(0, 0, 0, .1)',
        borderRadius: '8px',
        background: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        color: theme.colors.text,
        cursor: 'pointer',
        transition: 'all .18s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        userSelect: 'none',
    },
    chipSmall: {
        padding: '5px 10px',
        fontSize: '12px',
        color: theme.colors.muted,
    },
};

// Hover style: apply via :hover in parent or use state
export const chipHoverStyle: CSSProperties = {
    borderColor: theme.colors.primary,
    background: `${theme.colors.primary}08`,
};
