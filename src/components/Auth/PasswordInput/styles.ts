import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

type S = Record<string, CSSProperties>;

export const styles: S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.08)',
    outline: 'none',
    padding: '0 44px 0 12px', // Extra padding on right for eye button
    background: theme.colors.surface,
    fontSize: 14, // Smaller font size for password input
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.muted,
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
};