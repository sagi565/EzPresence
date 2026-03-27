// import { theme } from '@/theme/theme'; // Removed direct theme import to use CSS variables instead
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
    // Input Styles
    titleInput: {
        width: 'calc(70% - 28px)',
        border: 'none',
        borderBottom: '1px solid rgba(155, 155, 155, 0.2)',
        outline: 'none',
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--color-text)',
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
        border: '1.5px solid var(--color-bg)',
        borderRadius: '8px',
        background: 'var(--color-surface)',
        fontSize: '14px',
        fontWeight: 500,
        color: 'var(--color-text)',
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
        color: 'var(--color-muted)',
    },

    chipArrow: {
        fontSize: '10px',
        color: 'var(--color-muted)',
        marginLeft: '10px',
        flexShrink: 0,
    },

    // Platform Accordion Styles
    platformSection: {
        borderRadius: '12px',
        border: '1.5px solid rgba(var(--color-text-rgb, 255,255,255), 0.08)',
        borderLeftWidth: '3px',
        overflow: 'visible',
        transition: 'all .25s cubic-bezier(.4,0,.2,1)',
        marginBottom: '12px',
        background: 'var(--color-surface)',
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
        color: 'var(--color-text)',
    },

    platformUsername: {
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--color-muted)',
    },

    platformToggle: {
        width: '18px',
        height: '18px',
        borderRadius: '5px',
        border: '1.5px solid var(--color-bg)',
        background: 'var(--color-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all .18s',
    },

    platformToggleSelected: {
        background: 'var(--color-primary)',
        borderColor: 'var(--color-primary)',
        color: '#fff',
    },

    platformBody: {
        padding: '14px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '14px',
        borderTop: '1px solid rgba(var(--color-text-rgb, 255,255,255), 0.05)',
        background: 'rgba(var(--color-text-rgb, 255,255,255), 0.02)',
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
        color: 'var(--color-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        opacity: 0.9,
    },

    fieldInput: {
        width: '100%',
        padding: '10px 14px',
        border: '1.5px solid rgba(var(--color-text-rgb, 255,255,255), 0.1)',
        borderRadius: '10px',
        fontSize: '13.5px',
        fontFamily: 'inherit',
        color: 'var(--color-text)',
        background: 'rgba(var(--color-text-rgb, 255,255,255), 0.02)',
        outline: 'none',
        transition: 'all .2s ease',
        boxSizing: 'border-box' as const,
    },

    // Radio Group
    radioGroup: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap' as const,
    },

    radioPill: {
        padding: '6px 14px',
        border: '1.5px solid rgba(var(--color-text-rgb, 255,255,255), 0.1)',
        borderRadius: '20px',
        background: 'var(--color-surface)',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--color-muted)',
        cursor: 'pointer',
        transition: 'all .18s',
    },

    radioPillActive: {
        borderColor: 'var(--color-primary)',
        background: 'var(--color-bg)',
        color: 'var(--color-primary)',
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
        color: 'var(--color-text)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },

    toggleSwitch: {
        position: 'relative' as const,
        width: '38px',
        height: '22px',
        background: 'var(--color-bg)',
        borderRadius: '11px',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0,
    },

    toggleSwitchOn: {
        background: 'var(--color-primary)',
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
        background: 'var(--color-surface)',
        color: 'var(--color-muted)',
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
        background: 'linear-gradient(135deg, #9b5de5 0%, #fbbf24 100%)',
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
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
        style = document.createElement('style');
        style.id = styleId;
        document.head.appendChild(style);
    }
    style.textContent = `
      .npm-title-input:hover {
        border-bottom: 1px solid #b796df !important;
      }
      .npm-title-input:focus {
        border-bottom: 2.5px solid var(--color-primary) !important;
      }
      .npm-field-input:focus {
        border-color: var(--color-primary) !important;
        background: rgba(var(--color-primary-rgb, 155, 93, 229), 0.05) !important;
        box-shadow: 0 0 0 4px rgba(var(--color-primary-rgb, 155, 93, 229), 0.1) !important;
      }
      .npm-field-input::placeholder {
        color: rgba(var(--color-text-rgb, 255, 255, 255), 0.35) !important;
      }
      body.dark-mode .npm-field-label {
        color: rgba(255, 255, 255, 0.9) !important;
      }
      body.dark-mode .npm-field-input {
        border-color: rgba(255, 255, 255, 0.15) !important;
        background: rgba(255, 255, 255, 0.04) !important;
      }
      body.dark-mode .npm-field-input:focus {
        border-color: var(--color-primary) !important;
        background: rgba(255, 255, 255, 0.06) !important;
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
         .npm-title-input, .nsm-title-input {
             width: 85% !important;
             margin-left: 0 !important;
             padding: 0 0 6px 0 !important;
             font-size: 20px !important;
             box-sizing: border-box !important;
         }
         #npmContentPreview {
             width: 100% !important;
             max-width: 100% !important;
             height: auto !important;
             min-height: 180px !important;
             margin: 0 !important;
             box-sizing: border-box !important;
         }
         .time-picker, .date-picker, .timezone-selector, .repeat-selector {
             position: fixed !important;
             top: 50% !important;
             left: 50% !important;
             transform: translate(-50%, -50%) !important;
             z-index: 2000 !important;
         }
         .npm-draft-btn, .npm-schedule-btn {
             padding: 8px 16px !important;
             font-size: 13px !important;
             border-radius: 8px !important;
         }
      }
    `;
}
