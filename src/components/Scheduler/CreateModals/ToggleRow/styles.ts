import { CSSProperties } from 'react';
// import { theme } from '@/theme/theme'; // Removed direct theme import to use CSS variables instead

export const styles: Record<string, CSSProperties> = {
    toggleRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0',
    },
    toggleLabel: {
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    toggleSwitch: {
        position: 'relative',
        width: '38px',
        height: '22px',
        background: 'var(--color-bg)',
        borderRadius: '11px',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0,
    },
    toggleSwitchOn: {
        background: 'var(--color-primary)',
    },
    toggleThumb: {
        position: 'absolute',
        top: '2px',
        left: '2px',
        width: '18px',
        height: '18px',
        background: '#fff', // Switch thumb stays white usually
        borderRadius: '50%',
        transition: 'transform .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
    },
    tooltipIcon: {
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        background: 'rgba(var(--color-primary-rgb, 155, 93, 229), .1)',
        fontSize: '9px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--color-primary)',
        cursor: 'help',
        flexShrink: 0,
        fontStyle: 'italic',
    },
};
