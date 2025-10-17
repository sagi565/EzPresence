import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(2px)',
    zIndex: 2000,
  },
  picker: {
    position: 'fixed',
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
    border: '2px solid var(--color-primary)',
    maxWidth: '280px',
    zIndex: 2001,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '8px',
  },
  option: {
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '2px solid transparent',
  },
  optionHover: {
    background: 'rgba(155, 93, 229, 0.1)',
    borderColor: 'var(--color-primary)',
    transform: 'scale(1.1)',
  },
};