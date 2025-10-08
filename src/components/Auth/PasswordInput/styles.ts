import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

type S = Record<string, CSSProperties>;

export const styles: S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    position: 'relative',
  },
  label: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  inputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.08)',
    padding: '0 12px',
    fontSize: 16,
    background: theme.colors.surface,
    outline: 'none',
  },
  toggleBtn: {
    position: 'absolute',
    right: 12,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
};