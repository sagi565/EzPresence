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
  input: {
    height: 44,
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.08)',
    outline: 'none',
    padding: '0 12px',
    background: theme.colors.surface,
  },
};
