import { CSSProperties } from 'react';
// import { theme } from '@/theme/theme'; // Removed direct theme import to use CSS variables instead

export const styles: Record<string, CSSProperties> = {
    radioGroup: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    radioPill: {
        padding: '6px 14px',
        border: '1.5px solid var(--color-bg)',
        borderRadius: '20px',
        background: 'var(--color-surface)',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--color-muted)',
        cursor: 'pointer',
        transition: 'all .18s',
    },
    radioPillActive: {
        borderColor: 'var(--color-primary)',
        background: 'var(--color-bg)',
        color: 'var(--color-primary)',
        fontWeight: 600,
    },
};
