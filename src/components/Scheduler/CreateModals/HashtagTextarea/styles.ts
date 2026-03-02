import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '5px',
    },

    wrapper: {
        position: 'relative' as const,
    },

    backdrop: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: '8px 12px',
        fontSize: '13px',
        fontFamily: 'inherit',
        lineHeight: 1.5,
        color: theme.colors.text,
        whiteSpace: 'pre-wrap' as const,
        wordWrap: 'break-word' as const,
        overflow: 'hidden',
        pointerEvents: 'none' as const,
        border: '1.5px solid transparent',
        borderRadius: '8px',
        background: '#fff',
    },

    textarea: {
        width: '100%',
        padding: '8px 12px',
        border: '1.5px solid rgba(0, 0, 0, .1)',
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: 'inherit',
        color: 'transparent',
        caretColor: theme.colors.text,
        background: 'transparent',
        transition: 'border-color .18s, box-shadow .18s',
        outline: 'none',
        resize: 'vertical' as const,
        minHeight: '60px',
        lineHeight: 1.5,
        position: 'relative' as const,
        zIndex: 1,
    },

    charCount: {
        fontSize: '10px',
        color: '#b0b3b8',
        textAlign: 'right' as const,
        marginTop: '-2px',
    },
};

// Add global styles for hashtag highlighting
if (typeof document !== 'undefined') {
    const styleId = 'hashtag-textarea-global-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      .npm-hashtag-backdrop .hashtag {
        font-weight: 700;
        color: ${theme.colors.primary};
      }
      .npm-field-textarea::selection {
        background: rgba(155, 93, 229, .2);
        color: transparent;
      }
      .npm-field-textarea:focus {
        border-color: ${theme.colors.primary} !important;
        box-shadow: 0 0 0 3px rgba(155, 93, 229, .08) !important;
      }
    `;
        document.head.appendChild(style);
    }
}
