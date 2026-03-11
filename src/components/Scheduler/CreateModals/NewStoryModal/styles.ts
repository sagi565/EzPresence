import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    overlay: {
        position: 'fixed' as const,
        inset: 0,
        background: 'rgba(17, 24, 39, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1500,
        opacity: 1,
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
        width: '820px',
        maxWidth: '94vw',
        maxHeight: '88vh',
        minHeight: '520px',
        overflowY: 'auto' as const,
        padding: 0,
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

    titleInput: {
        width: 'calc(70% - 28px)',
        border: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, .1)',
        outline: 'none',
        fontSize: '22px',
        fontWeight: 700,
        color: theme.colors.text,
        padding: '16px 0 6px',
        marginLeft: '28px',
        background: 'transparent',
        fontFamily: 'inherit',
        transition: 'border-color .2s ease, border-bottom-width .15s ease',
    },

    body: {
        display: 'flex',
        gap: '24px',
        padding: '16px 28px 24px',
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
        alignItems: 'center',
        justifyContent: 'center',
    },

    section: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
    },

    sectionIcon: {
        width: '28px',
        height: '28px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '17px',
        marginTop: '4px',
        opacity: 0.65,
    },

    sectionContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px',
    },

    chipRow: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'center',
    },

    chip: {
        padding: '7px 14px',
        border: '1.5px solid rgba(0, 0, 0, .1)',
        borderRadius: '8px',
        background: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        color: theme.colors.text,
        cursor: 'pointer',
        transition: 'all .18s',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative' as const,
        userSelect: 'none' as const,
        minWidth: '200px',
    },

    chipSmall: {
        padding: '5px 10px',
        fontSize: '12px',
        color: theme.colors.muted,
        minWidth: 'auto',
    },

    chipArrow: {
        fontSize: '10px',
        color: theme.colors.muted,
        marginLeft: '10px',
        flexShrink: 0,
    },

    platformRow: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '10px',
    },

    platformBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 18px',
        border: '1.5px solid rgba(0, 0, 0, .08)',
        borderRadius: '12px',
        background: '#fff',
        fontSize: '13px',
        fontWeight: 500,
        color: theme.colors.muted,
        cursor: 'pointer',
        transition: 'all .2s ease',
        position: 'relative' as const,
        whiteSpace: 'nowrap' as const,
    },

    platformBtnSelected: {
        borderColor: theme.colors.primary,
        background: 'rgba(155, 93, 229, .08)',
        color: theme.colors.text,
    },

    platformIcon: {
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 900,
        color: '#fff',
        transition: 'all .2s',
    },

    contentPreview: {
        width: '180px',
        aspectRatio: '9/16',
        borderRadius: '14px',
        border: '2px dashed rgba(0, 0, 0, .1)',
        background: '#f8f9fb',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all .2s',
        overflow: 'hidden',
        position: 'relative' as const,
    },

    contentPlaceholder: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '6px',
        color: theme.colors.muted,
    },

    placeholderIcon: {
        fontSize: '32px',
        opacity: 0.7,
    },

    placeholderText: {
        fontSize: '11px',
        fontWeight: 500,
        textAlign: 'center' as const,
        padding: '0 8px',
    },

    contentFilled: {
        position: 'absolute' as const,
        inset: 0,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.7) 0%, rgba(236, 72, 153, 0.7) 100%)',
    },

    contentTitle: {
        fontSize: '13px',
        fontWeight: 700,
        color: '#000',
        textAlign: 'center' as const,
        padding: '6px 10px',
        textShadow: '0 1px 3px rgba(255,255,255,.8)',
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

    draftBtn: {
        padding: '10px 22px',
        border: 'none',
        borderRadius: '10px',
        background: '#fff',
        fontSize: '14px',
        fontWeight: 600,
        color: theme.colors.muted,
        cursor: 'pointer',
        transition: 'all .18s',
        boxShadow: '0 1px 4px rgba(0, 0, 0, .08)',
    },

    scheduleBtn: {
        padding: '10px 28px',
        border: 'none',
        borderRadius: '10px',
        background: theme.gradients.innovator,
        color: '#fff',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all .2s',
        boxShadow: '0 3px 12px rgba(155, 93, 229, .25)',
    },
};

// Add global hover styles
if (typeof document !== 'undefined') {
    const styleId = 'new-story-modal-global-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      .nsm-close:hover {
        background: rgba(0, 0, 0, .12) !important;
        color: ${theme.colors.text} !important;
      }
      .nsm-title-input:hover {
        border-bottom: 1px solid #b796df !important;
      }
      .nsm-title-input:focus {
        border-bottom: 2.5px solid ${theme.colors.primary} !important;
      }
      .nsm-chip:hover {
        border-color: ${theme.colors.primary} !important;
        background: rgba(155, 93, 229, .03) !important;
      }
      .nsm-platform-btn:hover {
        border-color: rgba(155, 93, 229, .2) !important;
        background: #faf8ff !important;
        color: ${theme.colors.text} !important;
      }
      .nsm-content-preview:hover {
        border-color: ${theme.colors.primary} !important;
        background: rgba(155, 93, 229, .04) !important;
      }
      .nsm-draft-btn:hover {
        color: ${theme.colors.primary} !important;
        box-shadow: 0 2px 8px rgba(155, 93, 229, .15) !important;
      }
      .nsm-schedule-btn:hover {
        transform: translateY(-1px) !important;
        box-shadow: 0 5px 18px rgba(155, 93, 229, .35) !important;
      }
      .new-story-modal-wrapper {
        transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease, filter 0.5s ease;
      }
      .shatter-animation .schedule-modal-layout {
        animation: shatter 0.6s forwards;
      }
      @keyframes shatter {
        0% { transform: scale(1) translate(0, 0) rotate(0); opacity: 1; filter: blur(0); }
        20% { transform: scale(1.02) translate(2px, -2px) rotate(1deg); filter: blur(1px); opacity: 0.9; }
        40% { transform: scale(0.95) translate(-4px, 4px) rotate(-2deg); filter: blur(2px); opacity: 0.7; }
        100% { transform: scale(0.6) translate(0, 50px) rotate(5deg); opacity: 0; filter: blur(10px); }
      }
      @media (max-width: 768px) {
         .section-icon {
             display: none !important;
         }
         .nsm-title-input {
             width: 100% !important;
             margin-left: 0 !important;
             text-align: center !important;
             font-size: 20px !important;
             padding: 10px 0 !important;
         }
         .schedule-modal-layout-left {
             align-items: center !important;
             width: 100% !important;
         }
         .schedule-modal-layout-left > div {
             width: 100% !important;
             justify-content: center !important;
             align-items: center !important;
         }
         .schedule-modal-layout-left .section-content-wrapper {
             align-items: center !important;
         }
         .chip-row-container {
             flex-wrap: nowrap !important;
             width: 100% !important;
             justify-content: space-between !important;
             gap: 4px !important;
         }
         .chip-button {
             min-width: 0 !important;
             max-width: none !important;
             padding: 6px 8px !important;
             font-size: 11px !important;
             flex: 1 !important;
         }
         .chip-arrow-icon {
             margin-left: 4px !important;
         }
         .nsm-content-preview {
             height: 140px !important;
             width: 80px !important;
             margin: 0 auto !important;
         }
         .time-picker, .date-picker, .timezone-selector, .repeat-selector {
             position: fixed !important;
             top: 50% !important;
             left: 50% !important;
             transform: translate(-50%, -50%) !important;
             z-index: 2000 !important;
         }
      }
    `;
        document.head.appendChild(style);
    }
}
