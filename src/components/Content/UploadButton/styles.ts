import styled, { css } from 'styled-components';
import { theme } from '@theme/theme';

export const UploadButtonContainer = styled.div<{ $isHovered?: boolean; $isMobile?: boolean }>`
  flex-shrink: 0;
  border: 3px dashed rgba(155, 93, 229, 0.3);
  background: rgba(155, 93, 229, 0.05);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: 280px;
  height: 480px;

  ${props => props.$isMobile && css`
    width: 70px;
    height: 124px;
    border-radius: 8px;
  `}

  ${props => props.$isHovered && css`
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primary}1A;
    transform: scale(1.02);
  `}
`;

export const UploadIcon = styled.div<{ $isMobile?: boolean }>`
  font-size: 64px;
  color: ${theme.colors.primary};

  ${props => (props as any).$isMobile && css`
    font-size: 24px;
  `}
`;