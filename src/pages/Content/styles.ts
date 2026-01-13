import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  contentArea: {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    scrollSnapType: 'y proximity',
    scrollBehavior: 'smooth',
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(155, 93, 229, 0.3) transparent',
    msOverflowStyle: 'auto',
    paddingRight: '100px',
  },
  listSection: {
    minHeight: '100vh',
    scrollSnapAlign: 'center',
    scrollSnapStop: 'normal',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to left side
    padding: '60px 48px 60px 80px', // Increased left padding to 80px
  },
  listWrapper: {
    width: '100%',
    maxWidth: '1600px',
  },
  addListButtonContainer: {
    marginTop: '48px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  addListButtonHover: {
    background: 'rgba(155, 93, 229, 0.1)',
    borderColor: 'rgba(155, 93, 229, 0.4)',
    opacity: 1,
    transform: 'translateY(-2px)',
  },
  addListButtonWrapper: {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 999,
    padding: '0 24px',
  },
  addListButton: {
    padding: '16px 32px',
    background: 'rgba(255, 255, 255, 0.95)',
    border: '2px dashed',
    borderColor: 'rgba(155, 93, 229, 0.3)',
    borderRadius: '12px',
    color: theme.colors.primary,
    fontWeight: 600,
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
  },
};