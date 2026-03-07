import { CSSProperties } from 'react';
import { theme } from '@/theme/theme';

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
        color: theme.colors.text,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    toggleSwitch: {
        position: 'relative',
        width: '38px',
        height: '22px',
        background: '#d1d5db',
        borderRadius: '11px',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0,
    },
    toggleSwitchOn: {
        background: theme.colors.primary,
    },
    toggleThumb: {
        position: 'absolute',
        top: '2px',
        left: '2px',
        width: '18px',
        height: '18px',
        background: '#fff',
        borderRadius: '50%',
        transition: 'transform .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
    },
    tooltipIcon: {
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        background: 'rgba(155, 93, 229, .1)',
        fontSize: '9px',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.primary,
        cursor: 'help',
        flexShrink: 0,
        fontStyle: 'italic',
    },
};
