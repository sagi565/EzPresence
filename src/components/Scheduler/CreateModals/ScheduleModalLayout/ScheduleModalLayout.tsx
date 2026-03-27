import React, { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';
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
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }
    style.textContent = `
            /* Internal dimmer for picking/dragging content */
            body.content-picking .schedule-modal-layout::after,
            body.content-dragging .schedule-modal-layout::after {
                content: '';
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0.15);
                border-radius: inherit;
                z-index: 1000;
                pointer-events: none;
                transition: opacity 0.2s;
                opacity: 1;
            }
            .schedule-modal-layout::after {
                content: '';
                position: absolute;
                inset: 0;
                background: rgba(0,0,0,0);
                z-index: -1;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s, background 0.2s, z-index 0s 0.2s;
            }

            .modal-close-btn {
                transition: all .2s ease;
            }
            .modal-close-btn:hover {
                transform: rotate(90deg);
            }
            @media (max-width: 768px) {
                .schedule-modal-layout {
                    width: calc(100vw - 24px) !important;
                    height: max-content !important;
                    max-width: calc(100vw - 24px) !important;
                    max-height: 90dvh !important;
                    border-radius: 20px !important;
                    left: 50% !important;
                    top: 48% !important;
                    transform: translate(-50%, -50%) !important;
                    margin: 0 !important;
                    overflow-x: hidden !important;
                    box-sizing: border-box !important;
                }
                .schedule-modal-layout-header {
                    padding: 14px 16px !important;
                    border-radius: 20px 20px 0 0 !important;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.02) !important;
                }
                /* Single scrollable container using grid */
                .schedule-modal-scrollable-body {
                    display: grid !important;
                    grid-template-columns: 1fr 34% !important;
                    grid-template-areas:
                        "title  preview"
                        "dates  preview"
                        "platform platform" !important;
                    padding: 4vw 4vw 4vw 4vw !important;
                    gap: 1.5vw 3vw !important;
                    overflow-y: auto !important;
                    overflow-x: hidden !important;
                    box-sizing: border-box !important;
                    width: 100% !important;
                    align-items: start !important;
                }
                /* Unwrap inner elements so children participate in the grid */
                .schedule-modal-layout-body,
                .schedule-modal-layout-left {
                    display: contents !important;
                }
                /* Hide ALL section icons on mobile */
                .section-icon {
                    display: none !important;
                }
                /* Title */
                .schedule-modal-before-body {
                    grid-area: title !important;
                    display: flex !important;
                    align-items: flex-end !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                    overflow: visible !important;
                    min-height: 48px !important;
                    padding-top: 1vw !important;
                }
                .schedule-modal-before-body > div {
                    width: 100% !important;
                    overflow: visible !important;
                }
                .npm-title-input, .nsm-title-input {
                    width: 100% !important;
                    margin-left: 0 !important;
                    padding: 1vw 0 1vw 0 !important;
                    font-size: clamp(16px, 5vw, 20px) !important;
                    font-weight: 700 !important;
                    line-height: 1.2 !important;
                    background: transparent !important;
                    text-align: left !important;
                    box-sizing: border-box !important;
                    border-bottom: 2px solid var(--color-primary-light, rgba(155, 93, 229, 0.1)) !important;
                    color: var(--color-text) !important;
                }
                /* Date section */
                .npm-date-section, .nsm-date-section {
                    grid-area: dates !important;
                    overflow: visible !important;
                    box-sizing: border-box !important;
                    margin-top: 2vw !important;
                    width: 100% !important;
                }
                /* Platform section */
                .npm-platform-section, .nsm-platform-section {
                    grid-area: platform !important;
                    overflow: visible !important;
                    box-sizing: border-box !important;
                    align-self: start !important;
                    margin-top: 5vw !important;
                }
                .npm-platform-section > div > div, .nsm-platform-section > div > div {
                    background: var(--color-surface) !important;
                    border-radius: 12px !important;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04) !important;
                    border: 1px solid var(--color-bg) !important;
                    margin-bottom: 2.5vw !important;
                    padding: 3vw !important;
                }
                /* Preview */
                .schedule-modal-layout-right {
                    grid-area: preview !important;
                    width: 100% !important;
                    max-width: 100% !important;
                    height: auto !important;
                    align-self: start !important;
                    overflow: visible !important;
                    box-sizing: border-box !important;
                    margin-top: 2vw !important;
                    border-radius: 12px !important;
                }
                .schedule-modal-layout-right .nsm-content-preview,
                .schedule-modal-layout-right > div,
                #npmContentPreview, #nsmContentPreview {
                    width: 100% !important;
                    max-width: 100% !important;
                    height: auto !important;
                    min-height: 0 !important;
                    border-radius: 12px !important;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
                    background: var(--color-surface) !important;
                    position: relative !important;
                    overflow: hidden !important;
                }
                /* Remove the forced wide 16/9 aspect-ratio entirely, so it respects its native portrait 9/16! */
                
                .schedule-modal-layout-footer {
                    padding: 3vw 4vw !important;
                    border-radius: 0 0 20px 20px !important;
                }
                .schedule-modal-layout-footer button {
                   height: 40px !important;
                   padding: 0 16px !important;
                   border-radius: 10px !important;
                   font-size: clamp(12px, 3.5vw, 14px) !important;
                }
                /* Chip buttons */
                /* Chip buttons */
                .chip-row-container {
                    gap: 1.8vw !important;
                    display: flex !important;
                    flex-wrap: wrap !important;
                    width: 100% !important;
                    padding: 1vw 0 !important;
                }
                .npm-date-wrapper {
                    flex: 1 1 100% !important;
                    min-width: 100% !important;
                }
                .npm-time-tz-container {
                    flex: 1 1 100% !important;
                    min-width: 100% !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 1.8vw !important;
                }
                .npm-time-wrapper {
                   flex: 0 0 auto !important;
                }
                .npm-timezone-wrapper {
                    flex: 1 !important;
                }
                .npm-timezone-chip {
                    border: none !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    padding-left: 0 !important;
                }
                .timezone-label {
                    display: block !important;
                    margin-top: 2px !important;
                    margin-bottom: 2px !important;
                }
                .timezone-value {
                    font-size: clamp(11px, 3.2vw, 13px) !important;
                    opacity: 0.8 !important;
                }
                .timezone-arrow {
                    display: none !important;
                }
                .npm-repeat-container {
                     margin-top: 1vw !important;
                }
                .chip-button {
                    padding: 1.8vw 2vw !important;
                    font-size: clamp(10px, 3vw, 13px) !important;
                    border-radius: 10px !important;
                    min-width: 0 !important;
                    width: 100% !important;
                    justify-content: space-between !important;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.02) !important;
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
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
                @media (max-width: 360px) {
                    .schedule-modal-scrollable-body {
                        grid-template-columns: 1fr 40% !important;
                    }
                    .npm-title-input, .nsm-title-input {
                        font-size: 16px !important;
                    }
                }
            }
        `;
}

export default ScheduleModalLayout;