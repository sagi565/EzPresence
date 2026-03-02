import React, { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { theme } from '@/theme/theme';
import TrashButton from '../TrashButton/TrashButton';
import { styles } from './styles';

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
    onOverlayClick?: () => void;
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
    scrollableBody = false,
    onOverlayClick
}) => {
    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                if (onOverlayClick) {
                    onOverlayClick();
                } else {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose, onOverlayClick]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <>
            <div style={styles.overlay} onClick={onOverlayClick || onClose} />
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
