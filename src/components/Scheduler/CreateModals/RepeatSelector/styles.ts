import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    container: {
        position: 'absolute' as const,
        top: 'calc(100% + 6px)',
        left: 0,
        background: theme.colors.surface,
        borderRadius: '14px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, .14)',
        border: '1px solid rgba(0, 0, 0, .06)',
        padding: '6px',
        minWidth: '280px',
        zIndex: 50,
    },

    option: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
        padding: '10px 14px',
        border: 'none',
        background: 'transparent',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: 500,
        color: theme.colors.text,
        cursor: 'pointer',
        textAlign: 'left' as const,
        transition: 'all .12s',
    },

    optionActive: {
        background: 'rgba(155, 93, 229, .06)',
        color: theme.colors.primary,
        fontWeight: 600,
    },
};

// Add global styles for hover
if (typeof document !== 'undefined') {
    const styleId = 'repeat-selector-global-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      .nsm-repeat-option:hover {
        background: #f0f1f3 !important;
      }
    `;
        document.head.appendChild(style);
    }
}
