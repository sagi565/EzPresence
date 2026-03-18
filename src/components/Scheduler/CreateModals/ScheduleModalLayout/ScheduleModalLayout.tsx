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
    width = '1020px',
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
                <div className="schedule-modal-layout-header" style={styles.header}>
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
                    <div className="schedule-modal-scrollable-body" style={styles.scrollableBody}>
                        {beforeBody && <div className="schedule-modal-before-body">{beforeBody}</div>}
                        <div className="schedule-modal-layout-body" style={styles.body}>
                            <div className="schedule-modal-layout-left" style={styles.leftColumn}>{children}</div>
                            <div className="schedule-modal-layout-right" style={styles.rightColumn}>{rightColumn}</div>
                        </div>
                    </div>
                ) : (
                    <div className="schedule-modal-scrollable-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                        {beforeBody && <div className="schedule-modal-before-body">{beforeBody}</div>}
                        <div className="schedule-modal-layout-body" style={styles.body}>
                            <div className="schedule-modal-layout-left" style={styles.leftColumn}>{children}</div>
                            <div className="schedule-modal-layout-right" style={styles.rightColumn}>{rightColumn}</div>
                        </div>
                    </div>
                )}

                {footer && <div className="schedule-modal-layout-footer" style={styles.footer}>{footer}</div>}
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
            @media (max-width: 768px) {
                .schedule-modal-layout {
                    width: calc(100vw - 24px) !important;
                    height: max-content !important;
                    max-width: calc(100vw - 24px) !important;
                    max-height: 94dvh !important;
                    border-radius: 20px !important;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    margin: 0 !important;
                    overflow-x: hidden !important;
                    box-sizing: border-box !important;
                }
                .schedule-modal-layout-header {
                    padding: 14px 16px !important;
                    border-radius: 20px 20px 0 0 !important;
                }
                /* Single scrollable container using grid */
                .schedule-modal-scrollable-body {
                    display: grid !important;
                    grid-template-columns: 1fr 38% !important;
                    grid-template-areas:
                        "title  preview"
                        "dates  preview"
                        "platform preview" !important;
                    padding: 3vw 4vw 4vw 4vw !important;
                    gap: 2vw !important;
                    overflow-y: auto !important;
                    overflow-x: visible !important;
                    box-sizing: border-box !important;
                    width: 100% !important;
                    align-items: start !important;
                }
                .schedule-modal-layout-body {
                    display: contents !important;
                }
                .schedule-modal-layout-left {
                    display: contents !important;
                }
                /* Hide ALL section icons on mobile */
                .section-icon {
                    display: none !important;
                }
                /* Title — scales with viewport */
                .schedule-modal-before-body {
                    grid-area: title !important;
                    display: flex !important;
                    align-items: center !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                    overflow: hidden !important;
                    min-height: 40px !important;
                }
                .schedule-modal-before-body > div {
                    width: 100% !important;
                    overflow: hidden !important;
                }
                .npm-title-input, .nsm-title-input {
                    width: 100% !important;
                    margin-left: 0 !important;
                    padding: 1vw 0 2vw 0 !important;
                    font-size: clamp(16px, 5vw, 20px) !important;
                    font-weight: 700 !important;
                    line-height: 1.2 !important;
                    background: transparent !important;
                    text-align: left !important;
                    box-sizing: border-box !important;
                    border-bottom: 2px solid rgba(155, 93, 229, 0.1) !important;
                    color: ${theme.colors.text} !important;
                }
                /* Date section */
                .npm-date-section, .nsm-date-section {
                    grid-area: dates !important;
                    overflow: visible !important;
                    box-sizing: border-box !important;
                    margin-top: -1vw !important;
                }
                /* Platform section */
                .npm-platform-section, .nsm-platform-section {
                    grid-area: platform !important;
                    overflow: visible !important;
                    box-sizing: border-box !important;
                    align-self: start !important;
                }
                .npm-platform-section > div > div, .nsm-platform-section > div > div {
                    background: #fff !important;
                    border-radius: 12px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
                    border: 1px solid rgba(0,0,0,0.06) !important;
                    margin-bottom: 2vw !important;
                    padding: 2vw !important;
                }
                /* Preview — grows/shrinks with the 38% column */
                .schedule-modal-layout-right {
                    grid-area: preview !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    height: auto !important;
                    align-self: start !important;
                    overflow: visible !important;
                    box-sizing: border-box !important;
                    margin-top: 1vw !important;
                }
                .schedule-modal-layout-right .nsm-content-preview,
                .schedule-modal-layout-right > div,
                #npmContentPreview, #nsmContentPreview {
                    width: 100% !important;
                    max-width: 100% !important;
                    aspect-ratio: 16 / 9 !important;
                    height: auto !important;
                    min-height: 0 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important;
                    border: 1.5px solid rgba(0,0,0,0.05) !important;
                    background: #fdfdfd !important;
                }
                .schedule-modal-layout-footer {
                    padding: 3vw 4vw !important;
                    border-radius: 0 0 20px 20px !important;
                }
                .schedule-modal-layout-footer button {
                   height: 48px !important;
                   border-radius: 12px !important;
                   font-size: clamp(14px, 4vw, 16px) !important;
                }
                /* Chip buttons */
                .chip-row-container {
                    gap: 2vw !important;
                    display: flex !important;
                    flex-wrap: nowrap !important;
                    width: 100% !important;
                    overflow-x: auto !important;
                    padding: 1vw 0 !important;
                }
                .chip-row-container > div {
                    flex: 0 0 auto !important;
                }
                .chip-button {
                    padding: 2vw 3vw !important;
                    font-size: clamp(10px, 3.5vw, 12px) !important;
                    border-radius: 10px !important;
                }
                .date-picker, .time-picker, .timezone-selector, .repeat-selector {
                    left: 50% !important;
                    transform: translateX(-50%) !important;
                    width: 90vw !important;
                    max-width: 320px !important;
                    position: fixed !important;
                    top: 50% !important;
                    z-index: 2000 !important;
                }
                .chip-button span {
                    white-space: nowrap !important;
                }
                @media (max-width: 360px) {
                    .schedule-modal-scrollable-body {
                        grid-template-columns: 1fr 42% !important;
                    }
                    .npm-title-input, .nsm-title-input {
                        font-size: 16px !important;
                    }
                }
            }
        `;
        document.head.appendChild(style);
    }
}

export default ScheduleModalLayout;