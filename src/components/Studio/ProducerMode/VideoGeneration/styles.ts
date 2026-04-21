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
const confirmFadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const confirmSlideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  animation: ${confirmFadeIn} 0.18s ease both;
`;

export const ConfirmDialogContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 9999;
  transform: translate(-50%, -50%);
  width: min(400px, 90vw);
  background: ${p => p.theme.colors.surface};
  border: 1.5px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 32px 28px 28px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(139, 92, 246, 0.08);
  animation: ${confirmSlideUp} 0.22s cubic-bezier(0.34, 1.1, 0.64, 1) both;
  text-align: center;
`;

export const ConfirmIconWrap = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  background: rgba(139, 92, 246, 0.1);
  color: #9b5de5;
`;

export const ConfirmTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${p => p.theme.colors.text};
  margin-bottom: 8px;
  letter-spacing: -0.01em;
`;

export const ConfirmMessage = styled.div`
  font-size: 14px;
  line-height: 1.65;
  color: ${p => p.theme.colors.muted};
  margin-bottom: 28px;
  white-space: pre-line;
`;

export const ConfirmButtons = styled.div`
  display: flex;
  gap: 10px;
`;

export const ConfirmBtn = styled.button<{ $variant?: 'cancel' | 'confirm' }>`
  flex: 1;
  padding: 11px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
  letter-spacing: 0.01em;

  ${p => p.$variant === 'confirm' ? css`
    background: linear-gradient(135deg, #9b5de5 0%, #7c3aed 100%);
    color: #fff;
    border: none;
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
    &:hover { box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5); transform: translateY(-1px); }
  ` : css`
    background: rgba(139, 92, 246, 0.07);
    color: ${p.theme.colors.muted};
    border: 1.5px solid rgba(139, 92, 246, 0.12);
    &:hover { background: rgba(139, 92, 246, 0.12); border-color: rgba(139, 92, 246, 0.25); }
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