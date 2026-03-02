import { CSSProperties } from 'react';
import { theme } from '@/theme/theme';

export const styles: Record<string, CSSProperties> = {
    chipArrow: {
        fontSize: '14px',
        color: theme.colors.muted,
        marginLeft: '10px',
        flexShrink: 0,
    },
};
