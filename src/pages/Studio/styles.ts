import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: '40px 24px',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 800,
    background: theme.gradients.innovator,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '16px',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '18px',
    color: theme.colors.muted,
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: 1.6,
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.9)',
    border: '2px solid rgba(155, 93, 229, 0.1)',
    borderRadius: '20px',
    padding: '32px',
    textAlign: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  featureCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(155, 93, 229, 0.15)',
    borderColor: theme.colors.primary,
  },
  featureCardPremium: {
    boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
    borderColor: theme.colors.secondary,
  },
  featureCardPremiumHover: {
    boxShadow: '0 0 30px rgba(251, 191, 36, 0.6), 0 20px 40px rgba(155, 93, 229, 0.15)',
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
  placeholderContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 'calc(100vh - 100px)',
    padding: '40px',
    gap: '24px',
  },
  placeholderTitle: {
    fontSize: '36px',
    fontWeight: 700,
    color: theme.colors.text,
  },
  placeholderText: {
    fontSize: '18px',
    color: theme.colors.muted,
    textAlign: 'center',
    maxWidth: '500px',
  },
  backButton: {
    padding: '12px 24px',
    background: theme.gradients.innovator,
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 12px rgba(155, 93, 229, 0.3)',
  },
};