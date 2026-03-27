// import { theme } from '@/theme/theme'; // Removed direct theme import to use CSS variables instead
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
        padding: '10px 14px',
        fontSize: '13.5px',
        fontFamily: 'inherit',
        lineHeight: 1.5,
        color: 'var(--color-text)',
        whiteSpace: 'pre-wrap' as const,
        wordWrap: 'break-word' as const,
        overflow: 'hidden',
        pointerEvents: 'none' as const,
        border: '1.5px solid transparent',
        borderRadius: '10px',
        background: 'rgba(var(--color-text-rgb, 255,255,255), 0.02)',
    },

    textarea: {
        width: '100%',
        padding: '10px 14px',
        border: '1.5px solid rgba(var(--color-text-rgb, 255,255,255), 0.1)',
        borderRadius: '10px',
        fontSize: '13.5px',
        fontFamily: 'inherit',
        color: 'transparent',
        caretColor: 'var(--color-text)',
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
        color: var(--color-primary);
      }
      .npm-field-textarea::selection {
        background: rgba(var(--color-primary-rgb, 155, 93, 229), .2);
        color: transparent;
      }
      .npm-field-textarea:focus {
        border-color: var(--color-primary) !important;
        box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb, 155, 93, 229), .1) !important;
      }
      .npm-field-textarea::placeholder {
        color: rgba(var(--color-text-rgb, 255, 255, 255), 0.35) !important;
      }
      body.dark-mode .npm-hashtag-backdrop {
        background: rgba(255, 255, 255, 0.04) !important;
      }
      body.dark-mode .npm-field-textarea {
        border-color: rgba(255, 255, 255, 0.15) !important;
        background: transparent !important;
      }
      body.dark-mode .npm-field-textarea:focus {
        border-color: var(--color-primary) !important;
        background: rgba(255, 255, 255, 0.02) !important;
      }
    `;
        document.head.appendChild(style);
    }
}
