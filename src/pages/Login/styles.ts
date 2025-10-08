import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  rowBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  rememberLabel: { fontSize: 14, color: theme.colors.muted, display: 'flex', alignItems: 'center' },
  link: { color: theme.colors.blue, textDecoration: 'none', fontWeight: 600 },
  primaryBtn: {
    height: 44,
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    color: '#fff',
    backgroundImage: theme.gradients.momentum,
    boxShadow: theme.shadows.primary,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    margin: '8px 0',
    color: theme.colors.muted,
  },
  error: {
    background: theme.colors.primaryLight,
    color: theme.colors.text,
    border: '1px solid rgba(155,93,229,0.2)',
    borderRadius: 12,
    padding: '8px 12px',
    fontSize: 14,
  },
};
