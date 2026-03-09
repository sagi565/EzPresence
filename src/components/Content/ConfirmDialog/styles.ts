import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';

export const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Dialog = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  z-index: 3501;
  max-width: 400px;
  width: 90%;
  text-align: center;
  animation: ${scaleIn} 0.2s ease-out;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${theme.colors.text};
`;

export const Message = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${theme.colors.muted};
  margin-bottom: 24px;
  white-space: pre-line;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const Button = styled.button<{ $variant: 'cancel' | 'confirm'; $isHovered?: boolean }>`
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.$variant === 'cancel' && css`
    background: rgba(107, 114, 128, 0.1);
    color: #666;
    &:hover {
      background: rgba(107, 114, 128, 0.2);
    }
  `}

  ${props => props.$variant === 'confirm' && css`
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }
  `}
`;