import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

type S = Record<string, CSSProperties>;

export const styles: S = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 24,
  },
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid rgba(155, 93, 229, 0.2)',
    borderTopColor: theme.colors.primary,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: {
    fontSize: 16,
    color: theme.colors.muted,
    margin: 0,
  },
  successContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(20, 184, 166, 0.1)',
    color: theme.colors.teal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    border: '3px solid',
    borderColor: theme.colors.teal,
  },
  successText: {
    fontSize: 18,
    fontWeight: 600,
    color: theme.colors.text,
    margin: 0,
  },
  redirectText: {
    fontSize: 14,
    color: theme.colors.muted,
    margin: 0,
    marginTop: 8,
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 48,
    fontWeight: 'bold',
    border: '3px solid #ef4444',
  },
  errorText: {
    fontSize: 16,
    fontWeight: 500,
    color: '#ef4444',
    margin: 0,
    maxWidth: 400,
    lineHeight: 1.6,
  },
};