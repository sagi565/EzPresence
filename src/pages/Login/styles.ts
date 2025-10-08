import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--bg-secondary-light)',  // gentle background — a lighter variant
    color: 'var(--text-primary)',
  },
  brand: {
    fontSize: '2.4rem',
    fontWeight: 700,
    marginBottom: '32px',
    color: 'var(--accent)',
  },
  card: {
    background: 'var(--bg-primary)',
    padding: '48px 36px',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: 600,
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    background: 'var(--bg-input)',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  inputFocus: {
    borderColor: 'var(--accent)',
    boxShadow: `0 0 0 2px var(--accent-opacity)`,
  },
  button: {
    width: '100%',
    padding: '14px 16px',
    border: 'none',
    borderRadius: '8px',
    background: 'var(--accent-gradient)',  // your app’s main gradient
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, filter 0.2s ease',
  },
  buttonHover: {
    transform: 'scale(1.02)',
    filter: 'brightness(1.05)',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  toggleLink: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  error: {
    color: 'var(--danger)',
    fontSize: '0.85rem',
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'var(--border-color)',
  },
  dividerText: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    whiteSpace: 'nowrap',
  },
  socialButton: {
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'transform 0.15s ease, filter 0.15s ease',
  },
  socialHover: {
    transform: 'scale(1.02)',
    filter: 'brightness(1.1)',
  },
};
