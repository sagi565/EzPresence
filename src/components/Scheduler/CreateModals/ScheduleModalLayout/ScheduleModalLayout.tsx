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
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                if (onOverlayClick) onOverlayClick();
                else onClose();
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
            {/*
             * THE FIX — two things must both be true for drag to work:
             *
             * 1. The overlay must call e.preventDefault() on dragover so the
             *    browser keeps the drag operation alive and keeps firing
             *    dragover events (which ContentCard uses to track DragCard
             *    position). Without this, the drag "dies" silently and the
             *    DragCard freezes in place.
             *
             * 2. The overlay must NOT sit in front of ContentPreview. We solve
             *    this by giving the modal a higher z-index than the overlay,
             *    and ContentPreview lives inside the modal. So the overlay only
             *    covers the area OUTSIDE the modal — it never intercepts events
             *    that are over the modal/ContentPreview.
             *
             * The z-index relationship (defined in styles.ts) must be:
             *   overlay z-index < modal z-index
             * This is already the standard pattern — overlay dims the page
             * behind the modal.
             */}
            <div
                style={styles.overlay}
                onClick={onOverlayClick || onClose}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => e.preventDefault()}
            />
            <div
                className="schedule-modal-layout"
                style={{
                    ...styles.modal,
                    width,
                    ...(height ? { height, maxHeight: '92vh' } : {}),
                    ...(scrollableBody ? { overflow: 'hidden' } : {})
                }}
            >
                <div style={styles.header}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {icon && <span style={styles.typeLabel}>{icon}</span>}
                        {headerContent || <span style={styles.title}>{title}</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {onDelete && (
                            <TrashButton onClick={onDelete} disabled={isDeleting} title="Delete" />
                        )}
                        <button style={styles.closeBtn} className="modal-close-btn" onClick={onClose}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {scrollableBody ? (
                    <div style={styles.scrollableBody}>
                        {beforeBody}
                        <div style={styles.body}>
                            <div style={styles.leftColumn}>{children}</div>
                            <div style={styles.rightColumn}>{rightColumn}</div>
                        </div>
                    </div>
                ) : (
                    <>
                        {beforeBody}
                        <div style={styles.body}>
                            <div style={styles.leftColumn}>{children}</div>
                            <div style={styles.rightColumn}>{rightColumn}</div>
                        </div>
                    </>
                )}

                {footer && <div style={styles.footer}>{footer}</div>}
            </div>
        </>,
        document.body
    );
};

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