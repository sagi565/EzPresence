import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-50%) translateX(-12px); }
  to { opacity: 1; transform: translateY(-50%) translateX(-8px); }
`;

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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

export const Dot = styled.div<{ $isActive: boolean; $isHovered: boolean; $isMobile?: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(155, 93, 229, 0.15);
  border: 2px solid rgba(155, 93, 229, 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  ${props => props.$isHovered && !props.$isActive && css`
    width: 36px;
    height: 36px;
    background: rgba(155, 93, 229, 0.1);
    border-color: rgba(155, 93, 229, 0.5);

    ${props.$isMobile && css`
      width: 28px;
      height: 28px;
    `}
  `}

  ${props => props.$isActive && css`
    width: 36px;
    height: 36px;
    background: ${theme.colors.secondary};
    border-color: ${theme.colors.secondary};
    box-shadow: 0 0 24px rgba(251, 191, 36, 0.4);

    ${props.$isMobile && css`
      width: 28px;
      height: 28px;
    `}
  `}
`;

export const Icon = styled.span<{ $visible: boolean; $isMobile?: boolean }>`
  position: absolute;
  font-size: ${props => props.$isMobile ? '14px' : '18px'};
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.3s ease, transform 0.3s ease;
  transform: ${props => props.$visible ? 'scale(1)' : 'scale(0.8)'};
  pointer-events: none;
`;

export const NavLine = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;
  width: 2px;
  height: 32px;
  background: rgba(155, 93, 229, 0.1);
  transform: translateX(-50%);

  @media (max-width: 768px) {
    top: 32px;
    height: 20px;
  }
`;

export const Label = styled.div<{ $isMobile?: boolean }>`
  position: absolute;
  right: 56px;
  top: 50%;
  transform: translateY(-50%) translateX(-8px);
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.text};
  background: rgba(255, 255, 255, 0.98);
  padding: 8px 14px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  white-space: nowrap;
  animation: ${fadeIn} 0.3s ease;
  pointer-events: none;

  ${props => props.$isMobile && css`
    right: 44px;
    font-size: 12px;
    padding: 6px 12px;
  `}
`;