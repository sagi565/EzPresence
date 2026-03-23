import { CSSProperties } from 'react';
// import { theme } from '@/theme/theme'; // Removed direct theme import to use CSS variables instead

export const styles: Record<string, CSSProperties> = {
    chipArrow: {
        fontSize: '14px',
        color: 'var(--color-muted)',
        marginLeft: '10px',
        flexShrink: 0,
    },
};
