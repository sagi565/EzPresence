import { theme } from '@/theme/theme';
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    // Input Styles
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

    // Section Styles
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

    // Chip Styles
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

    // Platform Accordion Styles
    platformSection: {
        borderRadius: '12px',
        border: '1.5px solid rgba(0,0,0,.06)',
        borderLeftWidth: '3px',
        overflow: 'visible',
        transition: 'all .25s cubic-bezier(.4,0,.2,1)',
        marginBottom: '12px',
        background: '#fff',
    },

    platformHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        cursor: 'pointer',
        userSelect: 'none' as const,
        borderTopRightRadius: '10px',
        borderBottomRightRadius: '10px',
        transition: 'background .15s',
    },

    platformHeaderContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },

    platformIcon: {
        width: '22px',
        height: '22px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 900,
        color: '#fff',
    },

    platformInfo: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1px',
    },

    platformName: {
        fontSize: '13.5px',
        fontWeight: 400,
        color: theme.colors.text,
    },

    platformUsername: {
        fontSize: '11px',
        fontWeight: 600,
        color: theme.colors.muted,
    },

    platformToggle: {
        width: '18px',
        height: '18px',
        borderRadius: '5px',
        border: '1.5px solid rgba(0,0,0,.15)',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .18s',
    },

    platformToggleSelected: {
        background: theme.colors.primary,
        borderColor: theme.colors.primary,
        color: '#fff',
    },

    platformBody: {
        padding: '14px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '14px',
        borderTop: '1px solid rgba(0,0,0,.06)',
        background: 'rgba(0,0,0,.02)',
    },

    // Form Fields
    field: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '5px',
    },

    fieldLabel: {
        fontSize: '12px',
        fontWeight: 600,
        color: theme.colors.muted,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },

    fieldInput: {
        width: '100%',
        padding: '8px 12px',
        border: '1.5px solid rgba(0, 0, 0, .1)',
        borderRadius: '8px',
        fontSize: '13px',
        fontFamily: 'inherit',
        color: theme.colors.text,
        background: '#fff',
        outline: 'none',
        transition: 'all .18s',
    },

    // Radio Group
    radioGroup: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap' as const,
    },

    radioPill: {
        padding: '6px 14px',
        border: '1.5px solid rgba(0, 0, 0, .1)',
        borderRadius: '20px',
        background: '#fff',
        fontSize: '12px',
        fontWeight: 500,
        color: theme.colors.muted,
        cursor: 'pointer',
        transition: 'all .18s',
    },

    radioPillActive: {
        borderColor: theme.colors.primary,
        background: 'rgba(155, 93, 229, .1)',
        color: theme.colors.primary,
        fontWeight: 600,
    },

    // Toggle Switch
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
        position: 'relative' as const,
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
        position: 'absolute' as const,
        top: '2px',
        left: '2px',
        width: '18px',
        height: '18px',
        background: '#fff',
        borderRadius: '50%',
        transition: 'transform .2s',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
    },

    // Footer Buttons
    draftBtn: {
        padding: '10px 22px',
        borderRadius: '10px',
        border: 'none',
        background: '#fff',
        color: theme.colors.muted,
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0, 0, 0, .08)',
        transition: 'all .18s',
    },

    scheduleBtn: {
        padding: '10px 28px',
        borderRadius: '10px',
        border: 'none',
        background: theme.gradients.innovator,
        color: '#fff',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 3px 12px rgba(155, 93, 229, .25)',
        transition: 'all .2s',
    },
};

// Add global hover styles
if (typeof document !== 'undefined') {
    const styleId = 'new-post-modal-global-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      .npm-title-input:hover {
        border-bottom: 1px solid #b796df !important;
      }
      .npm-title-input:focus {
        border-bottom: 2.5px solid ${theme.colors.primary} !important;
      }
      .new-post-modal-wrapper {
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
         .npm-title-input {
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
