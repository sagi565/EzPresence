import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  uploadButton: {
    flexShrink: 0,
    border: '3px dashed',
    borderColor: 'rgba(155, 93, 229, 0.3)',
    background: 'rgba(155, 93, 229, 0.05)',
    borderRadius: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  // All upload buttons now use vertical format (shorts/reels ratio)
  uploadButtonVideo: {
    width: '280px',
    height: '480px',
  },
  // Keeping for backwards compatibility but same dimensions
  uploadButtonImage: {
    width: '280px',
    height: '480px',
  },
  uploadButtonHover: {
    borderColor: theme.colors.primary,
    background: 'rgba(155, 93, 229, 0.1)',
    transform: 'scale(1.02)',
  },
  uploadIcon: {
    fontSize: '64px',
    color: theme.colors.primary,
  },
};