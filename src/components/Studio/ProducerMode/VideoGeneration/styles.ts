import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  generateBtn: {
    padding: '18px 24px', // Slightly smaller padding
    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
    border: 'none',
    borderRadius: '14px', // Slightly less rounded
    color: 'white',
    fontWeight: 700,
    fontSize: '15px', // Slightly smaller
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow:
      '0 6px 20px rgba(155, 93, 229, 0.3), 0 3px 10px rgba(251, 191, 36, 0.25)',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.5px',
    direction: 'ltr',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginTop: 'auto', // Push to bottom
    width: '100%',
  },

  // For the shimmering ::before effect — render as an extra <span style={styles.generateBtnBefore}/>
  generateBtnBefore: {
    content: "''",
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.6s ease',
  },

  // Hover state
  generateBtnHover: {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow:
      '0 12px 35px rgba(155, 93, 229, 0.5), 0 8px 20px rgba(251, 191, 36, 0.4), 0 0 30px rgba(155, 93, 229, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    filter: 'brightness(1.1)',
  },

  // Active state
  generateBtnActive: {
    transform: 'translateY(-2px) scale(0.98)',
    transition: 'all 0.1s ease',
  },
  generateBtnIcon: {
    fontSize: '20px',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
  },
  confirmOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 3000,
  },
  confirmDialog: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
    zIndex: 3001,
    maxWidth: '400px',
    textAlign: 'center',
  },
  confirmTitle: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '16px',
    color: theme.colors.text,
  },
  confirmMessage: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: theme.colors.muted,
    marginBottom: '24px',
    whiteSpace: 'pre-line',
  },
  confirmButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  confirmBtn: {
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
  },
  confirmBtnCancel: {
    background: 'rgba(107, 114, 128, 0.1)',
    color: theme.colors.muted,
  },
  confirmBtnCancelHover: {
    background: 'rgba(107, 114, 128, 0.15)',
  },
  confirmBtnProceed: {
    background: theme.gradients.innovator,
    color: 'white',
    boxShadow: '0 4px 12px rgba(155, 93, 229, 0.3)',
  },
  confirmBtnProceedHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(155, 93, 229, 0.4)',
  },
  celebrationContainer: {
    position: 'fixed',
    inset: 0,
    zIndex: 4000,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  celebrationContent: {
    textAlign: 'center',
    animation: 'celebrationPulse 2s ease-out',
  },
  celebrationIcon: {
    fontSize: '80px',
    marginBottom: '20px',
  },
  celebrationText: {
    fontSize: '32px',
    fontWeight: 800,
    background: theme.gradients.innovator,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  confetti: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    background: theme.colors.secondary,
    animation: 'confettiFall 3s ease-out forwards',
  },
};