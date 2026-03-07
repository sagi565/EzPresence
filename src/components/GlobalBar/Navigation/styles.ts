import styled from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

export const Nav = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(155, 93, 229, 0.1);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: ${theme.shadows.primary};

  ${media.phone} {
    padding: 10px 16px;
  }
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  ${media.tablet} {
    gap: 16px;
  }
`;

export const Logo = styled.a`
  font-size: 24px;
  font-weight: 800;
  background: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  letter-spacing: -0.5px;
  cursor: pointer;

  ${media.phone} {
    font-size: 20px;
    
    .logo-presence {
      display: none;
    }
  }
`;

export const NavCenter = styled.div`
  display: flex;
  gap: 8px;
  background: transparent;
  padding: 4px;
  border-radius: 12px;

  ${media.tablet} {
    display: flex;
    gap: 4px;
  }
`;

export const NavItemWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

export const NavBtn = styled.a<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  color: ${props => props.$active ? '#fff' : theme.colors.muted};
  background: ${props => props.$active ? theme.gradients.momentum : 'transparent'};
  font-size: 14px;
  box-shadow: ${props => props.$active ? '0 4px 12px rgba(155, 93, 229, 0.3)' : 'none'};

  .nav-icon {
    font-size: 16px;
  }

  .nav-label {
    display: block;
  }

  &:hover {
    ${props => !props.$active && `
      transform: translateY(-1px);
      color: ${theme.colors.primary};
    `}
  }

  ${media.tablet} {
    padding: 10px;
    
    .nav-label {
      display: none;
    }
    
    .nav-icon {
      font-size: 18px;
    }
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  ${media.phone} {
    gap: 8px;
  }
`;

export const IconBtn = styled.button<{ $variant?: 'danger' | 'default', $hovered?: boolean }>`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: ${props => 
    props.$hovered 
      ? (props.$variant === 'danger' ? '#fee2e2' : 'rgba(155, 93, 229, 0.08)') 
      : 'transparent'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 20px;
  color: ${props => 
    props.$hovered 
      ? (props.$variant === 'danger' ? '#ef4444' : theme.colors.primary) 
      : theme.colors.muted
  };
  transform: ${props => props.$hovered ? 'translateY(-1px)' : 'none'};
  box-shadow: ${props => (props.$hovered && props.$variant === 'danger') ? '0 2px 4px rgba(239, 68, 68, 0.1)' : 'none'};

  ${media.phone} {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
`;

export const Avatar = styled.button<{ $hovered?: boolean, $bgColor?: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  text-transform: uppercase;
  background: ${props => props.$bgColor || theme.colors.primary};
  cursor: default;
  transition: transform 0.2s;
  ${props => props.$hovered && `transform: scale(1.05);`}

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  ${media.phone} {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
`;

export const ComingSoonBadge = styled.span`
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  font-size: 8px;
  font-weight: 800;
  border-radius: 6px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
  white-space: nowrap;
  pointer-events: none;
  border: none;
  z-index: 10;
`;