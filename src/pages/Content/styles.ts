import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  contentArea: {
    padding: '32px 120px 32px 24px',
    minHeight: 'calc(100vh - 80px)',
    position: 'relative',
  },
  addListButton: {
    width: '100%',
    padding: '20px',
    background: 'rgba(0, 0, 0, 0.05)',
    border: '2px dashed rgba(0, 0, 0, 0.15)',
    borderRadius: '12px',
    color: theme.colors.muted,
    fontWeight: 500,
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '32px',
    opacity: 0.6,
  },
  addListButtonHover: {
    background: 'rgba(0, 0, 0, 0.08)',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    opacity: 1,
    transform: 'translateY(-2px)',
  },
};