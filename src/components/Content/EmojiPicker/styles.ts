import styled, { css } from 'styled-components';
import { theme } from '@theme/theme';

export const PickerContainer = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 2px solid ${theme.colors.primary};
  width: auto;
  max-width: 320px;
  z-index: 2001;
`;

export const EmojiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
`;

export const EmojiOption = styled.div<{ $isHovered?: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;

  ${props => props.$isHovered && css`
    background: ${theme.colors.primary}1A;
    border-color: ${theme.colors.primary};
    transform: scale(1.1);
  `}
`;