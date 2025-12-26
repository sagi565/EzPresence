import { CSSProperties } from 'react';
import { theme } from '@theme/theme';

export const socialCardStyles: Record<string, CSSProperties> = {
  card: {
    position: 'relative',
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    border: '2px solid',
    borderColor: 'rgba(155, 93, 229, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  },
  cardHoveredConnected: {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 12px 32px rgba(155, 93, 229, 0.2)',
    borderColor: 'rgba(155, 93, 229, 0.3)',
  },
  cardHoveredDisconnected: {
    transform: 'translateY(-6px)',
    boxShadow: '0 10px 28px rgba(155, 93, 229, 0.15)',
    borderColor: 'rgba(155, 93, 229, 0.25)',
  },
  cardAnimating: {
    animation: 'cardPulse 0.6s ease-out',
  },
  gradientOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.4s',
    borderRadius: '20px',
  },
  topSection: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    width: '100%',
  },
  nameSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
    alignItems: 'flex-end',
  },
  iconContainer: {
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    zIndex: 1,
  },
  iconContainerHovered: {
    transform: 'scale(1.08) rotate(3deg)',
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.25)',
  },
  icon: {
    width: '32px',
    height: '32px',
    objectFit: 'contain',
  },
  iconEmoji: {
    fontSize: '28px',
  },
  platformName: {
    fontSize: '16px',
    fontWeight: 700,
    color: theme.colors.text,
    margin: 0,
    textAlign: 'right',
  },
  connectedBadge: {
    fontSize: '10px',
    fontWeight: 600,
    color: '#10B981',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(16, 185, 129, 0.1)',
    padding: '4px 8px',
    borderRadius: '12px',
  },
  accountName: {
    fontSize: '13px',
    color: theme.colors.muted,
    margin: 0,
    fontWeight: 500,
  },
  notConnectedText: {
    fontSize: '13px',
    color: theme.colors.muted,
    margin: 0,
  },
  actionButton: {
    padding: '10px 20px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontFamily: 'inherit',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40px',
  },
  connectButton: {
    color: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  connectButtonHovered: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
  },
  disconnectButton: {
    color: '#EF4444',
    border: '2px solid',
    borderColor: '#EF4444',
    background: 'transparent',
  },
  disconnectButtonHovered: {
    background: '#FEE2E2',
    transform: 'scale(1.02)',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '3px solid',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  animatedBorder: {
    position: 'absolute',
    inset: '-2px',
    borderRadius: '20px',
    padding: '2px',
    opacity: 0.2,
    animation: 'borderPulse 3s ease-in-out infinite',
    pointerEvents: 'none',
  },
};

// Add keyframe animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes cardPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @keyframes borderPulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.4; }
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

if (!document.head.querySelector('style[data-social-card-animations]')) {
  styleSheet.setAttribute('data-social-card-animations', 'true');
  document.head.appendChild(styleSheet);
}