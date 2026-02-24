import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { theme } from '@/theme/theme';

interface DropActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: 'post' | 'story' | 'ai') => void;
}

const DropActionModal: React.FC<DropActionModalProps> = ({ isOpen, onClose, onSelect }) => {
    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div style={styles.overlay} onClick={onClose} />
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h3 style={styles.title}>Create...</h3>
                    <button style={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div style={styles.grid}>
                    <button
                        style={styles.optionBtn}
                        onClick={() => onSelect('post')}
                    >
                        <span style={styles.icon}>📝</span>
                        <span style={styles.label}>Post</span>
                    </button>

                    <button
                        style={styles.optionBtn}
                        onClick={() => onSelect('story')}
                    >
                        <span style={styles.icon}>📖</span>
                        <span style={styles.label}>Story</span>
                    </button>

                    <button
                        style={{ ...styles.optionBtn, ...styles.disabledBtn }}
                        onClick={() => onSelect('ai')}
                    // disabled - visual indication only for now as per request "open the panel... ai series (soon)"
                    // but usually "soon" implies disabled or showing a toast. 
                    // The user said "decide to create ... ai series (soon)". 
                    // I will make it clickable but it will likely just alert "Coming Soon" in the parent.
                    >
                        <span style={styles.icon}>✨</span>
                        <span style={styles.label}>AI Series <span style={styles.soonBadge}>Soon</span></span>
                    </button>
                </div>
            </div>
        </>,
        document.body
    );
};

const styles = {
    overlay: {
        position: 'fixed' as const,
        inset: 0,
        background: 'rgba(17, 24, 39, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1700, // Higher than modals
    },
    modal: {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1750,
        background: theme.colors.surface || '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, .15), 0 0 0 1px rgba(0, 0, 0, .04)',
        width: '400px',
        maxWidth: '90vw',
        overflow: 'hidden',
        animation: 'focusAppear 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    header: {
        padding: '16px 20px',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#f9fafb',
    },
    title: {
        fontSize: '18px',
        fontWeight: 600,
        color: theme.colors.text || '#111827',
        margin: 0,
    },
    closeBtn: {
        background: 'transparent',
        border: 'none',
        fontSize: '16px',
        color: theme.colors.muted || '#6b7280',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr', // Stacked for now or '1fr 1fr' ? Let's do stacked for clarity or nice cards
        gap: '12px',
        padding: '20px',
    },
    optionBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px',
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left' as const,
        position: 'relative' as const,
    },
    icon: {
        fontSize: '24px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f3f4f6',
        borderRadius: '10px',
    },
    label: {
        fontSize: '16px',
        fontWeight: 500,
        color: '#374151',
    },
    disabledBtn: {
        opacity: 0.7,
        background: '#fafafa',
    },
    soonBadge: {
        fontSize: '10px',
        fontWeight: 700,
        background: '#f3f4f6',
        color: '#6b7280',
        padding: '2px 6px',
        borderRadius: '99px',
        marginLeft: '8px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
    }
};

// Add hover effect via style tag injection for simplicity if not using CSS modules/styled-components
const styleId = 'drop-action-modal-styles';
if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .drop-action-btn:hover {
            border-color: ${theme.colors.primary};
            background: ${theme.colors.primary}08;
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
    `;
    document.head.appendChild(style);
}

export default DropActionModal;
