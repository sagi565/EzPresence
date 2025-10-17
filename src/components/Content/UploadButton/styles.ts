import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  uploadButton: {
    flexShrink: 0,
    border: '2px dashed rgba(155, 93, 229, 0.3)',
    background: 'rgba(155, 93, 229, 0.05)',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  uploadButtonVideo: {
    width: '240px',
    height: '400px',
  },
  uploadButtonImage: {
    width: '320px',
    height: '180px',
  },
  uploadButtonHover: {
    borderColor: theme.colors.primary,
    background: 'rgba(155, 93, 229, 0.1)',
    transform: 'scale(1.05)',
  },
  uploadIcon: {
    fontSize: '48px',
    color: theme.colors.primary,
  },
};