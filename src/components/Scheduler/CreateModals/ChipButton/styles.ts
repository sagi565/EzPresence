import { CSSProperties } from 'react';
// import { theme } from '@/theme/theme'; // Removed direct theme import to use CSS variables instead

export const styles: Record<string, CSSProperties> = {
    chip: {
        padding: '7px 14px',
        border: '1.5px solid var(--color-bg)',
        borderRadius: '8px',
        background: 'var(--color-surface)',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--color-text)',
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
        color: 'var(--color-muted)',
    },
};

// Hover style: apply via :hover in parent or use state
export const chipHoverStyle: CSSProperties = {
    borderColor: 'var(--color-primary)',
    background: 'rgba(var(--color-primary-rgb, 155, 93, 229), .08)',
};
