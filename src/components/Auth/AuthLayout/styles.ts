import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: '100vh',
    display: 'grid',
    gridTemplateColumns: 'minmax(340px, 520px) 1fr',
    background: theme.gradients.background,
  },
  leftPane: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 24px',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    padding: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    backgroundImage: theme.gradients.momentum,
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    marginBottom: 8,
  },
  subtitle: { color: theme.colors.muted, marginBottom: 20 },
  formArea: { display: 'flex', flexDirection: 'column', gap: 12 },
  footer: { marginTop: 16, color: theme.colors.muted, fontSize: 14 },
  rightPane: {
    position: 'relative',
    background: theme.gradients.innovator,
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  heroImg: {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
    userSelect: 'none',
  },
};
