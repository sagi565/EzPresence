import styled, { css } from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

export const UploadButtonContainer = styled.div<{ $isHovered?: boolean }>`
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

  ${media.phone} {
    width: 100px;
    height: 180px;
    border-radius: 12px;
  }

  ${props => props.$isHovered && css`
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primary}1A;
    transform: scale(1.02);
  `}
`;

export const UploadIcon = styled.div`
  font-size: 64px;
  color: ${theme.colors.primary};

  ${media.phone} {
    font-size: 32px;
  }
`;