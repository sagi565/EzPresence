import { CSSProperties } from 'react';
import { theme } from '@/theme/theme';

export const styles: Record<string, CSSProperties> = {
    radioGroup: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    radioPill: {
        padding: '6px 14px',
        border: '1.5px solid rgba(0, 0, 0, .1)',
        borderRadius: '20px',
        background: '#fff',
        fontSize: '12px',
        fontWeight: 500,
        color: theme.colors.muted,
        cursor: 'pointer',
        transition: 'all .18s',
    },
    radioPillActive: {
        borderColor: theme.colors.primary,
        background: 'rgba(155, 93, 229, .1)',
        color: theme.colors.primary,
        fontWeight: 600,
    },
};
