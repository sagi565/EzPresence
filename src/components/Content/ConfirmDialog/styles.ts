import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99999,
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialog: {
    background: 'white',
    borderRadius: '16px',
    padding: '28px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.2)',
    zIndex: 3501,
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
    animation: 'scaleIn 0.2s ease-out',
  },
  title: {
    fontSize: '18px',
    fontWeight: 700,
    marginBottom: '12px',
    color: theme.colors.text || '#333',
  },
  message: {
    fontSize: '14px',
    lineHeight: 1.6,
    color: theme.colors.muted || '#666',
    marginBottom: '24px',
    whiteSpace: 'pre-line',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
  },
  btn: {
    padding: '10px 24px',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    border: 'none',
    borderColor: 'transparent',
  },
  btnCancel: {
    background: 'rgba(107, 114, 128, 0.1)',
    color: '#666',
  },
  btnCancelHover: {
    background: 'rgba(107, 114, 128, 0.2)',
  },
  btnConfirm: {
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', // Red gradient for delete
    color: 'white',
    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
  },
  btnConfirmHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
  },
};