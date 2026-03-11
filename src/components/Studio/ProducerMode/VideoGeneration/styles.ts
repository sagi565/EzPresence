import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';

// Animations
const shimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const celebrationPulse = keyframes`
  0% { transform: scale(1); opacity: 0; }
  15% { transform: scale(1.1); opacity: 1; }
  85% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
`;

const confettiFall = keyframes`
  0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
`;

// VideoGeneration Components - GenerateButton
export const GenerateBtnWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  width: 100%;
  margin-top: auto;
`;

export const StyledGenerateBtn = styled.button<{ $isHovered?: boolean; $isActive?: boolean }>`
  padding: 18px 24px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  border: none;
  border-radius: 14px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(155, 93, 229, 0.3), 0 3px 10px rgba(251, 191, 36, 0.25);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;

  &:disabled {
    cursor: default;
    opacity: 0.7;
    filter: grayscale(0.5);
  }

  ${props => props.$isHovered && css`
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 35px rgba(155, 93, 229, 0.5), 0 8px 20px rgba(251, 191, 36, 0.4), 0 0 30px rgba(155, 93, 229, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
    filter: brightness(1.1);
  `}

  ${props => props.$isActive && css`
    transform: translateY(-2px) scale(0.98);
    transition: all 0.1s ease;
  `}
`;

export const ShimmerBar = styled.div<{ $isHovered?: boolean }>`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.6s ease;
  ${props => props.$isHovered && css`
    left: 100%;
  `}
`;

export const BtnIcon = styled.span`
  font-size: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

// ConfirmDialog Components
export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 3500;
  backdrop-filter: blur(4px);
`;

export const ConfirmDialogContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  z-index: 3501;
  max-width: 400px;
  text-align: center;
`;

export const ConfirmTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${theme.colors.text};
`;

export const ConfirmMessage = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${theme.colors.muted};
  margin-bottom: 24px;
  white-space: pre-line;
`;

export const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const ConfirmBtn = styled.button<{ $type: 'cancel' | 'confirm'; $isHovered?: boolean }>`
  padding: 12px 24px;
  border-radius: 10px;
  fontWeight: 600;
  fontSize: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.$type === 'cancel' ? css`
    background: rgba(107, 114, 128, 0.1);
    color: ${theme.colors.muted};
    ${props.$isHovered && css`
      background: rgba(107, 114, 128, 0.15);
    `}
  ` : css`
    background: ${theme.gradients.innovator};
    color: white;
    box-shadow: 0 4px 12px rgba(155, 93, 229, 0.3);
    ${props.$isHovered && css`
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(155, 93, 229, 0.4);
    `}
  `}
`;

// Celebration Components
export const CelebrationWrapper = styled.div`
  position: fixed;
  inset: 0;
  zIndex: 4000;
  pointerEvents: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CelebrationContent = styled.div`
  textAlign: center;
  animation: ${celebrationPulse} 2s ease-out;
`;

export const CelebrationIcon = styled.div`
  fontSize: 80px;
  margin-bottom: 20px;
`;

export const CelebrationText = styled.div`
  fontSize: 32px;
  fontWeight: 800;
  background: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const ConfettiPiece = styled.div<{ $left: string; $delay: string; $size: string; $color: string }>`
  position: absolute;
  width: ${props => props.$size};
  height: ${props => props.$size};
  background: ${props => props.$color};
  left: ${props => props.$left};
  animation: ${confettiFall} 3s ease-out forwards;
  animation-delay: ${props => props.$delay};
  top: -10vh;
`;