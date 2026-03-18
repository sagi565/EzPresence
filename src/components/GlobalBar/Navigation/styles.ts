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
  gap: 12px;

  ${media.tablet} {
    padding: 10px 16px;
    gap: 8px;
  }

  ${media.phone} {
    padding: 8px 10px;
    gap: 6px;
    flex-wrap: wrap;
  }
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;

  ${media.tablet} {
    gap: 12px;
  }

  ${media.phone} {
    gap: 8px;
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
  white-space: nowrap;
  flex-shrink: 0;

  .logo-presence {
    display: inline;
  }

  ${media.phone} {
    font-size: 18px;
  }
`;

export const NavCenter = styled.div`
  display: flex;
  gap: 16px;
  background: transparent;
  padding: 4px;
  border-radius: 12px;
  flex: 1;
  justify-content: center;
  min-width: 0;

  ${media.tablet} {
    gap: 2px;
  }

  ${media.phone} {
    order: 3;
    flex: 1 1 100%;
    margin-top: 0px;
    padding-top: 0;
    justify-content: center;
    gap: 30px;
  }
`;

export const NavItemWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  min-width: 0;
`;

export const NavBtn = styled.a<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: ${props => props.$active ? theme.colors.primary : theme.colors.muted};
  background: transparent;
  font-size: 14px;
  white-space: nowrap;

  .nav-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${props => props.$active ? '38px' : '24px'};
    height: ${props => props.$active ? '38px' : '24px'};
    font-size: ${props => props.$active ? '18px' : '16px'};
    border-radius: 10px;
    flex-shrink: 0;
    line-height: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: ${props => props.$active ? theme.gradients.momentum : 'transparent'};
    box-shadow: ${props => props.$active ? '0 6px 16px rgba(155, 93, 229, 0.3)' : 'none'};
  }

  .nav-label {
    display: inline;
  }

  &:hover {
    ${props => !props.$active && `
      transform: translateY(-1px);
      color: ${theme.colors.primary};
      background: rgba(155, 93, 229, 0.06);
    `}
  }

  /* ── Medium screens: hide labels, keep emoji ── */
  @media (max-width: 1050px) {
    padding: 6px 6px;
    gap: 0;

    .nav-label {
      display: none;
    }

    .nav-icon {
      font-size: ${props => props.$active ? '18px' : '18px'};
    }
  }

  /* ── Small phones: tighter padding ── */
  ${media.phone} {
    padding: 4px;

    .nav-icon {
      width: ${props => props.$active ? '34px' : '24px'};
      height: ${props => props.$active ? '34px' : '24px'};
      font-size: ${props => props.$active ? '16px' : '17px'};
    }
  }

  /* ── PC view only styles ── */
  @media (min-width: 1051px) {
    padding: 8px 20px;
    gap: 12px;
    background: ${props => props.$active ? theme.gradients.momentum : 'transparent'};
    color: ${props => props.$active ? '#fff' : theme.colors.muted};
    box-shadow: ${props => props.$active ? '0 8px 20px rgba(155, 93, 229, 0.25)' : 'none'};

    .nav-label {
      background: none;
      -webkit-text-fill-color: initial;
      background-clip: initial;
      color: inherit;
      font-weight: 700;
    }

    .nav-icon {
      background: transparent;
      box-shadow: none;
      width: 24px;
      height: 24px;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &:hover {
      ${props => !props.$active && `
        background: rgba(155, 93, 229, 0.08);
        color: ${theme.colors.primary};
        transform: translateY(-2px);
      `}
    }
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  ${media.tablet} {
    gap: 4px;
  }

  ${media.phone} {
    gap: 2px;
  }
`;

export const IconBtn = styled.button<{ $variant?: 'danger' | 'default'; $hovered?: boolean }>`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: ${props =>
    props.$hovered
      ? props.$variant === 'danger'
        ? '#fee2e2'
        : 'rgba(155, 93, 229, 0.08)'
      : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
  color: ${props =>
    props.$hovered
      ? props.$variant === 'danger'
        ? '#ef4444'
        : theme.colors.primary
      : theme.colors.muted};
  transform: ${props => props.$hovered ? 'translateY(-1px)' : 'none'};
  box-shadow: ${props =>
    props.$hovered && props.$variant === 'danger'
      ? '0 2px 4px rgba(239, 68, 68, 0.1)'
      : 'none'};
  padding: 0;
  flex-shrink: 0;

  /* Hide notification bell on small phones to save space */
  &.hide-on-phone {
    ${media.phone} {
      display: none;
    }
  }

  ${media.phone} {
    width: 34px;
    height: 34px;
    font-size: 16px;
  }
`;

export const Avatar = styled.button<{ $hovered?: boolean; $bgColor?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  background: ${props => props.$bgColor || theme.colors.primary};
  cursor: default;
  transition: transform 0.2s;
  transform: ${props => props.$hovered ? 'scale(1.05)' : 'none'};
  flex-shrink: 0;
  overflow: hidden;
  padding: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  ${media.phone} {
    width: 34px;
    height: 34px;
    font-size: 13px;
  }
`;
