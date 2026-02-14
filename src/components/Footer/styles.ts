import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    footer: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '20px 0',
        backgroundColor: 'transparent',
        zIndex: 99999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'auto' as const,
    },
    footerContent: {
        maxWidth: '440px',
        width: '100%',
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        gap: '8px',
        justifyContent: 'center',
    },
    footerLinks: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'nowrap' as const,
        justifyContent: 'center',
    },
    footerLink: {
        color: '#6b7280',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        transition: 'all 0.2s',
        cursor: 'pointer',
        position: 'relative' as const,
        zIndex: 100000,
        pointerEvents: 'auto' as const,
    },
    separator: {
        color: '#9ca3af',
        fontSize: '13px',
        userSelect: 'none' as const,
    },
    copyright: {
        color: '#9ca3af',
        fontSize: '13px',
        margin: 0,
    },
};
