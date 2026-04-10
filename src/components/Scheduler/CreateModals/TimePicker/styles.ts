import { CSSProperties } from 'react';

const edgeFade = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.45) 18%, black 34%, black 66%, rgba(0,0,0,0.45) 82%, transparent 100%)';

export const styles: Record<string, CSSProperties> = {
    container: {
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        background: 'var(--color-surface)',
        borderRadius: '14px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, .14)',
        border: '1px solid rgba(0, 0, 0, .06)',
        padding: '8px 6px',
        zIndex: 50,
        width: '270px',
    },

    header: {
        display: 'flex',
        padding: '0 6px 4px',
    },

    headerLabel: {
        flex: 1,
        textAlign: 'center' as const,
        fontSize: '9px',
        fontWeight: 700,
        color: 'var(--color-muted)',
        textTransform: 'uppercase' as const,
        letterSpacing: '.6px',
    },

    wheel: {
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative' as const,
        height: '180px',
    },

    wheelCol: {
        flex: 1,
        overflowY: 'scroll' as const,
        scrollSnapType: 'y mandatory',
        scrollbarWidth: 'none' as const,
        position: 'relative' as const,
        zIndex: 1,
        maskImage: edgeFade,
        WebkitMaskImage: edgeFade,
    },

    spacer: {
        height: '72px',
        flexShrink: 0,
        scrollSnapAlign: 'none' as const,
    },

    wheelItem: {
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
        fontWeight: 500,
        color: 'rgba(0, 0, 0, .3)',
        cursor: 'pointer',
        scrollSnapAlign: 'center' as const,
        flexShrink: 0,
        userSelect: 'none' as const,
        border: 'none',
        background: 'transparent',
        width: '100%',
        fontFamily: 'inherit',
        padding: 0,
        transformOrigin: 'center center',
        transition: 'color .12s',
    },

    separator: {
        width: '14px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--color-muted)',
        zIndex: 1,
    },
};

if (typeof document !== 'undefined') {
    const styleId = 'time-picker-global-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      .ntp-wheel-item.in-view {
        color: var(--color-text) !important;
        font-weight: 600 !important;
      }
      .ntp-wheel-col::-webkit-scrollbar {
        display: none;
      }
      .ntp-wheel::before {
        content: '';
        position: absolute;
        left: 6px;
        right: 6px;
        top: 50%;
        transform: translateY(-50%);
        height: 36px;
        background: rgba(155, 93, 229, .08);
        border-radius: 8px;
        pointer-events: none;
        z-index: 0;
      }
    `;
        document.head.appendChild(style);
    }
}
