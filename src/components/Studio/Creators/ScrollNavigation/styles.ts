import styled, { keyframes, css } from 'styled-components';

export const NavContainer = styled.nav<{ $isMobile?: boolean }>`
  position: fixed;
  right: ${props => props.$isMobile ? '20px' : '40px'};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: ${props => props.$isMobile ? '24px' : '32px'};
  z-index: 100;

  ${props => props.$isMobile && css`
    right: 15px;
    gap: 20px;
  `}
`;

export const NavItem = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DotContainer = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

export const Dot = styled.div<{ $isActive: boolean; $isHovered: boolean; $isMobile?: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}0D;
  border: 2px solid transparent;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;

  ${props => props.$isHovered && !props.$isActive && css`
    transform: scale(1.15);
    background: ${props.theme.colors.primary}33;
    border-color: ${props.theme.colors.primary}80;
  `}

  ${props => props.$isActive && css`
    background: ${props.theme.colors.primary}40;
    border-color: ${props.theme.colors.primary}BF;
    box-shadow: 0 0 18px ${props.theme.colors.primary}73;
    transform: scale(1.18);
  `}

  ${props => props.$isMobile && css`
    width: 36px;
    height: 36px;
  `}
`;

export const Icon = styled.span<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '16px' : '18px'};
  transition: transform 0.2s ease;
  pointer-events: none;
`;

export const NavLine = styled.div`
  position: absolute;
  top: 44px;
  left: 50%;
  width: 2px;
  height: 32px;
  background: ${props => props.theme.mode === 'dark' ? `${props.theme.colors.primary}4D` : `${props.theme.colors.primary}1A`};
  transform: translateX(-50%);

  @media (max-width: 768px) {
    top: 36px;
    height: 20px;
  }
`;

export const Label = styled.div<{ $isMobile?: boolean }>`
  position: absolute;
  right: 64px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  background: ${props => props.theme.colors.surface};
  padding: 4px 10px;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.sm};
  white-space: nowrap;
  pointer-events: none;

  ${props => props.$isMobile && css`
    right: 56px;
    font-size: 12px;
    padding: 6px 12px;
  `}
`;