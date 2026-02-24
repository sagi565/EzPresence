import React, { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { theme } from '@/theme/theme';
import TrashButton from './TrashButton';

interface ScheduleModalLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
    title: string;
    icon?: string;
    headerContent?: ReactNode;
    beforeBody?: ReactNode;
    children: ReactNode;
    rightColumn?: ReactNode;
    footer?: ReactNode;
    width?: string;
    height?: string;
    scrollableBody?: boolean;
}

const ScheduleModalLayout: React.FC<ScheduleModalLayoutProps> = ({
    isOpen,
    onClose,
    onDelete,
    isDeleting,
    title,
    icon,
    headerContent,
    beforeBody,
    children,
    rightColumn,
    footer,
    width = '920px',
    height,
    scrollableBody = false
}) => {
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
            <div
                className="schedule-modal-layout"
                style={{
                    ...styles.modal,
                    width,
                    ...(height ? { height, maxHeight: '92vh' } : {}),
                    ...(scrollableBody ? { overflow: 'hidden' } : {})
                }}
            >
                {/* Header */}
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {icon && <span style={styles.typeLabel}>{icon}</span>}
                        {headerContent || <span style={styles.title}>{title}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {onDelete && (
                            <TrashButton
                                onClick={onDelete}
                                disabled={isDeleting}
                                title="Delete"
                            />
                        )}
                        <button
                            style={styles.closeBtn}
                            className="modal-close-btn"
                            onClick={onClose}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable wrapper for Post modal */}
                {scrollableBody ? (
                    <div style={styles.scrollableBody}>
                        {/* Before Body */}
                        {beforeBody}

                        {/* Body */}
                        <div style={styles.body}>
                            <div style={styles.leftColumn}>
                                {children}
                            </div>
                            <div style={styles.rightColumn}>
                                {rightColumn}
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Before Body */}
                        {beforeBody}

                        {/* Body */}
                        <div style={styles.body}>
                            <div style={styles.leftColumn}>
                                {children}
                            </div>
                            <div style={styles.rightColumn}>
                                {rightColumn}
                            </div>
                        </div>
                    </>
                )}

                {/* Footer */}
                {footer && (
                    <div style={styles.footer}>
                        {footer}
                    </div>
                )}
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
        zIndex: 1500,
    },
    modal: {
        position: 'fixed' as const,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1600,
        background: theme.colors.surface,
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, .15), 0 0 0 1px rgba(0, 0, 0, .04)',
        maxWidth: '94vw',
        maxHeight: '88vh',
        minHeight: '520px',
        overflowY: 'auto' as const,
        display: 'flex',
        flexDirection: 'column' as const,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 28px',
        background: '#f8f9fb',
        borderRadius: '16px 16px 0 0',
        borderBottom: '1px solid rgba(0, 0, 0, .05)',
        flexShrink: 0,
    },
    typeLabel: {
        fontSize: '28px',
        lineHeight: 1,
    },
    title: {
        fontSize: '22px',
        fontWeight: 700,
        color: theme.colors.text,
    },
    closeBtn: {
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, .06)',
        color: theme.colors.muted,
        fontSize: '18px',
        cursor: 'pointer',
        transition: 'all .2s',
    },
    body: {
        display: 'flex',
        gap: '24px',
        padding: '24px 28px',
        flex: 1,
        overflowY: 'auto' as const,
    },
    leftColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '28px',
    },
    rightColumn: {
        flexShrink: 0,
        width: '200px',
        display: 'flex',
        flexDirection: 'column' as const,
        height: '100%',
    },
    footer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 28px',
        background: '#f8f9fb',
        borderTop: '1px solid rgba(0, 0, 0, .05)',
        borderRadius: '0 0 16px 16px',
        flexShrink: 0,
    },
    scrollableBody: {
        flex: 1,
        overflowY: 'auto' as const,
        overflowX: 'hidden' as const,
        scrollbarGutter: 'stable' as const,
    }
};

// Add global hover styles for close button rotation
if (typeof document !== 'undefined') {
    const styleId = 'modal-close-btn-animation';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .modal-close-btn {
                transition: all .2s ease;
            }
            .modal-close-btn:hover {
                background: rgba(0, 0, 0, .12) !important;
                color: ${theme.colors.text} !important;
                transform: rotate(90deg);
            }
        `;
        document.head.appendChild(style);
    }
}

export default ScheduleModalLayout;
