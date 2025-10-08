import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

type S = Record<string, CSSProperties>;

export const styles: S = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  link: {
    color: theme.colors.blue,
    textDecoration: 'none',
    fontWeight: 600,
  },
  primaryBtn: {
    height: 44,
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    color: '#fff',
    backgroundImage: theme.gradients.innovator,
    boxShadow: theme.shadows.primary,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  notice: {
    background: theme.colors.primaryLight,
    color: theme.colors.text,
    border: '1px solid rgba(155, 93, 229, 0.25)',
    borderRadius: 12,
    padding: '12px 14px',
    fontSize: 14,
  },
  error: {
    background: theme.colors.primaryLight,
    color: theme.colors.text,
    border: '1px solid rgba(155, 93, 229, 0.2)',
    borderRadius: 12,
    padding: '8px 12px',
    fontSize: 14,
  },
};
