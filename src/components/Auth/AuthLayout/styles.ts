import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

type S = Record<string, CSSProperties>;

export const styles: S = {
  shell: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
  },
  centerPane: {
    flex: '0 1 95%',  
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePane: {
    flex: '0 1 75%', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.md,
    padding: 28,
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 24,
    zIndex: 10,
  },
  brand: {
    fontSize: 40,
    fontWeight: 900,
    backgroundImage: theme.gradients.innovator,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textDecoration: 'none',
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    backgroundImage: theme.gradients.innovator,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: 12,
  },
  subtitle: {
    color: theme.colors.muted,
    marginBottom: 20,
  },
  formArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  footer: {
    marginTop: 16,
    color: theme.colors.muted,
    fontSize: 14,
  },
  heroImg: {
    height: '100%',
    width: 'auto',
    objectFit: 'cover',
    userSelect: 'none',
  },
};
