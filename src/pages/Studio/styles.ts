import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  studioContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  producerContainer: {
    width: '80%',
    maxWidth: '80vw',
    margin: '0 auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 80px)',
  },
  defaultContent: {
    padding: '40px 24px',
    minHeight: '100vh',
  },
  contentHeader: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  contentTitle: {
    fontSize: '48px',
    fontWeight: 800,
    background: theme.gradients.innovator,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '16px',
    letterSpacing: '-1px',
  },
  contentSubtitle: {
    fontSize: '18px',
    color: theme.colors.muted,
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  studioFeatures: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(155, 93, 229, 0.1)', 
    borderColor: 'rgba(155, 93, 229, 0.1)',    
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  featureCardPremium: {
    boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
    borderColor: theme.colors.secondary,
  },
  featureIcon: {
    fontSize: '64px',
    marginBottom: '20px',
    display: 'block',
  },
  featureTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: theme.colors.text,
    marginBottom: '12px',
  },
  featureDescription: {
    color: theme.colors.muted,
    lineHeight: 1.6,
  },
};