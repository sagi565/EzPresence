// import { theme } from '@/theme/theme'; // Removed direct theme import to use CSS variables instead
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dialog: {
        background: 'var(--color-surface)',
        borderRadius: '24px',
        padding: '32px',
        width: '420px',
        maxWidth: '90vw',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        animation: 'dialogAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
    },
    title: {
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--color-text)',
        margin: 0,
    },
    optionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    optionItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        borderRadius: '12px',
        background: 'var(--color-bg)',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: 500,
        color: 'var(--color-text)',
        userSelect: 'none',
        transition: 'all 0.2s',
        border: '1px solid var(--color-bg)',
    },
    radioInput: {
        width: '18px',
        height: '18px',
        accentColor: 'var(--color-primary)',
        cursor: 'pointer',
        marginRight: '12px',
    },
    optionLabel: {
        flex: 1,
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end', // Align buttons to the right for English LTR
        gap: '16px',
        marginTop: '8px',
    },
    btn: {
        padding: '10px 24px',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
    },
    confirmBtn: {
        background: 'linear-gradient(135deg, #9b5de5 0%, #fbbf24 100%)',
        color: '#fff',
        boxShadow: '0 4px 12px rgba(155, 93, 229, 0.25)',
    },
    cancelBtn: {
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-bg)',
    },
};

// Add keyframes
if (typeof document !== 'undefined') {
    const styleId = 'recurring-dialog-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes dialogAppear {
                from { opacity: 0; transform: scale(0.9) translateY(20px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
}
