import { CSSProperties } from 'react';

export const sharedStyles: Record<string, CSSProperties> = {
    // Shared Tooltip
    fieldTooltipIcon: {
        width: 15, height: 15, borderRadius: '50%',
        fontSize: '9px', fontWeight: 700, display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center',
        cursor: 'help', fontStyle: 'italic', flexShrink: 0,
        position: 'relative' as const, marginLeft: '4px', zIndex: 2000
    },
    fieldTooltipPopup: {
        display: 'block', position: 'absolute' as const,
        bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
        color: '#fff', fontSize: '11px', fontWeight: 400,
        lineHeight: 1.4, padding: '8px 12px', borderRadius: '8px',
        whiteSpace: 'pre-line' as const, width: '220px', zIndex: 1800,
        boxShadow: '0 4px 16px rgba(0,0,0,.25)', pointerEvents: 'none' as const
    },

    // Shared Title Input
    titleInput: {
        width: 'calc(70% - 28px)',
        border: 'none',
        outline: 'none',
        fontSize: '22px',
        fontWeight: 700,
        padding: '16px 0 6px',
        marginLeft: '28px',
        background: 'transparent',
        fontFamily: 'inherit',
        transition: 'border-color .2s ease, border-bottom-width .15s ease',
    },

    // Shared Date Section
    tzIconStyle: {
        width: 16, height: 16, borderRadius: '50%',
        fontSize: '9px', fontWeight: 700, fontStyle: 'italic',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, userSelect: 'none' as const
    },
    tzInfoPopupStyle: {
        position: 'absolute' as const, top: 'calc(100% + 8px)', right: 0,
        fontSize: '12px', lineHeight: 1.6, padding: '8px 12px',
        borderRadius: '8px', width: 'max-content', zIndex: 99999
    },
    tzLabelStyle: {
        fontSize: '13px',
        whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis'
    },

    // Shared Footer
    draftBtnStyle: {
        padding: '10px 22px', border: 'none', borderRadius: '10px',
        background: 'var(--color-surface)', fontSize: '14px', fontWeight: 600,
        color: 'var(--color-muted)',
        transition: 'all .18s', boxShadow: '0 1px 4px rgba(0, 0, 0, .08)',
    },
    scheduleBtnStyle: {
        padding: '10px 28px', border: 'none', borderRadius: '10px',
        background: 'linear-gradient(135deg, #9b5de5 0%, #fbbf24 100%)', color: '#fff',
        fontSize: '14px', fontWeight: 700,
        transition: 'all .2s', boxShadow: '0 3px 12px rgba(155, 93, 229, .25)'
    },

    // Common utility styles
    flexColumn: {
        display: 'flex',
        flexDirection: 'column' as const,
    },
    errorText: {
        color: '#EF4444',
        fontSize: '12px',
        fontWeight: 500,
    }
};
