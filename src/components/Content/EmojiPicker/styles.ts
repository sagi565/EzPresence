import styled, { css } from 'styled-components';

export const PickerContainer = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  padding: 20px;
  box-shadow: ${props => props.theme.shadows.lg};
  border: 1px solid ${props => props.theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  width: auto;
  min-width: 280px;
  max-width: 340px;
  z-index: 2001;
  backdrop-filter: blur(10px);
  
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: pickerFadeIn 0.3s ease-out;

  @keyframes pickerFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

export const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  padding: 4px;
`;

export const EmojiOption = styled.div<{ $isHovered?: boolean }>`
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  user-select: none;

  &:hover {
    background: ${props => props.theme.colors.primary}1A;
    transform: scale(1.15) translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}33;
  }

  ${props => props.$isHovered && css`
    background: ${props.theme.colors.primary}26;
    border-color: ${props.theme.colors.primary};
  `}

  &:active {
    transform: scale(0.95);
  }
`;