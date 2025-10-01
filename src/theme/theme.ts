export const theme = {
  colors: {
    primary: '#9b5de5',
    primaryLight: '#faf5ff',
    secondary: '#fbbf24',
    teal: '#14b8a6',
    blue: '#3b82f6',
    pink: '#ec4899',
    bg: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
  },
  gradients: {
    innovator: 'linear-gradient(135deg, #9b5de5 0%, #fbbf24 100%)',
    momentum: 'linear-gradient(135deg, #9b5de5 0%, #3b82f6 100%)',
    balance: 'linear-gradient(135deg, #9b5de5 0%, #14b8a6 100%)',
    vibe: 'linear-gradient(135deg, #9b5de5 0%, #ec4899 100%)',
    background: `linear-gradient(135deg, 
      #f9fafb 0%, 
      rgba(155, 93, 229, 0.03) 20%, 
      rgba(251, 191, 36, 0.02) 40%, 
      rgba(20, 184, 166, 0.02) 60%, 
      rgba(59, 130, 246, 0.03) 80%, 
      #f9fafb 100%)`,
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1400px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 3px rgba(155, 93, 229, 0.1)',
    md: '0 4px 20px rgba(0, 0, 0, 0.08)',
    lg: '0 10px 40px rgba(0, 0, 0, 0.15)',
    primary: '0 4px 20px rgba(155, 93, 229, 0.08)',
    secondary: '0 8px 25px rgba(251, 191, 36, 0.3)',
  },
};

export type Theme = typeof theme;