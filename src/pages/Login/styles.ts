import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

type S = Record<string, CSSProperties>;

export const styles: S = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    zIndex: 50000,
    gap: 12,
  },
  link: {
    color: theme.colors.blue,
    textDecoration: 'none',
    fontWeight: 600,
  },
  forgotLink: {
    marginTop: 4,
    marginBottom: 12,
    color: theme.colors.blue,
    textDecoration: 'none',
    fontWeight: 500,
    alignSelf: 'flex-end',
    fontSize: 14,
  },
  primaryBtn: {
    fontSize: 16,
    fontWeight: 700,
    height: 44,
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    color: '#fff',
    backgroundImage: theme.gradients.innovator,
    boxShadow: theme.shadows.primary,
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  // For the or divider
  orContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    margin: '20px 0',
  },
  line: {
    height: 1,
    background: theme.colors.muted,
    flex: 1,
  },
  orText: {
    margin: '0 12px',
    color: theme.colors.muted,
    fontSize: 14,
    whiteSpace: 'nowrap',
  },

  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
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
  },
  eyeIcon: {
    width: 20,
    height: 20,
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
