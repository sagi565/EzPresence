import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  uploadButton: {
    flexShrink: 0,
    width: '280px',
    height: '480px',
    border: '2px dashed rgba(155, 93, 229, 0.35)',
    background: 'rgba(155, 93, 229, 0.04)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    outline: 'none',
    userSelect: 'none',
  },
  uploadButtonHover: {
    borderColor: theme.colors.primary,
    background: 'rgba(155, 93, 229, 0.09)',
    transform: 'scale(1.015)',
    boxShadow: '0 8px 32px rgba(155, 93, 229, 0.15)',
  },
  uploadButtonDragOver: {
    borderColor: theme.colors.primary,
    borderWidth: '3px',
    borderStyle: 'solid',
    background: 'rgba(155, 93, 229, 0.14)',
    transform: 'scale(1.02)',
    boxShadow: '0 0 0 4px rgba(155, 93, 229, 0.15), 0 12px 40px rgba(155, 93, 229, 0.25)',
  },

  // Pulsing ring overlay shown during drag-over
  dragRing: {
    position: 'absolute',
    inset: 0,
    borderRadius: '16px',
    pointerEvents: 'none',
    animation: 'uploadDragPulse 1.2s ease-in-out infinite',
    background:
      'radial-gradient(ellipse at center, rgba(155, 93, 229, 0.18) 0%, transparent 70%)',
  },

  uploadInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '24px',
    pointerEvents: 'none',
    zIndex: 1,
  },

  uploadIconWrapper: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: 'rgba(155, 93, 229, 0.1)',
    border: '2px solid rgba(155, 93, 229, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.25s ease',
    marginBottom: '4px',
  },
  uploadIconWrapperActive: {
    background: 'rgba(155, 93, 229, 0.2)',
    border: '2px solid rgba(155, 93, 229, 0.6)',
    transform: 'scale(1.1)',
  },

  uploadIcon: {
    fontSize: '32px',
    color: theme.colors.primary,
    fontWeight: 300,
    lineHeight: 1,
    display: 'block',
  },

  uploadTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 600,
    color: theme.colors.primary,
    textAlign: 'center',
    letterSpacing: '0.01em',
  },

  uploadSubtitle: {
    margin: 0,
    fontSize: '12px',
    fontWeight: 400,
    color: theme.colors.muted,
    textAlign: 'center',
    lineHeight: 1.5,
  },
};

// Inject keyframes once
if (typeof document !== 'undefined') {
  const styleId = 'upload-drag-keyframes';
  if (!document.getElementById(styleId)) {
    const tag = document.createElement('style');
    tag.id = styleId;
    tag.textContent = `
      @keyframes uploadDragPulse {
        0%, 100% { opacity: 0.6; transform: scale(1); }
        50%       { opacity: 1;   transform: scale(1.04); }
      }
    `;
    document.head.appendChild(tag);
  }
}