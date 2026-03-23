import styled, { keyframes, css } from 'styled-components';
// theme import removed as it's now accessed via props.theme

// Animations
export const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  25% { background-position: 50% 75%; }
  50% { background-position: 100% 50%; }
  75% { background-position: 50% 25%; }
  100% { background-position: 0% 50%; }
`;

export const gradientPulse = keyframes`
  0%, 100% { background-position: 0% 50%; opacity: 0.85; }
  50% { background-position: 100% 50%; opacity: 1; }
`;

export const cardPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

export const borderPulse = keyframes`
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.4; }
`;

export const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// SocialConnectionCard Styled Components
export const CardContainer = styled.div<{ $isConnected?: boolean; $isHovered?: boolean; $isLoading?: boolean; $isAnimating?: boolean; $platformGradient?: string }>`
  position: relative;
  background: ${props => props.theme.colors.surface};
  border-radius: 20px;
  padding: 20px;
  border: 2px solid;
  border-color: rgba(155, 93, 229, 0.1);
  display: flex;
  flex-direction: column;
  gap: 14px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: ${props => props.$isAnimating ? css`${cardPulse} 0.6s ease-out` : 'none'};

  ${props => props.$isHovered && !props.$isLoading && (props.$isConnected ? css`
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 32px rgba(155, 93, 229, 0.2);
    border-color: rgba(155, 93, 229, 0.3);
  ` : css`
    transform: translateY(-6px);
    box-shadow: 0 10px 28px rgba(155, 93, 229, 0.15);
    border-color: rgba(155, 93, 229, 0.25);
  `)}
`;

export const GradientOverlay = styled.div<{ $isConnected?: boolean; $platformGradient?: string }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.4s;
  border-radius: 20px;
  background: ${props => props.$isConnected ? props.$platformGradient : 'transparent'};
  opacity: ${props => props.$isConnected ? 0.015 : 0};
`;

export const CardTopSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
`;

export const CardIconContainer = styled.div<{ $platformGradient?: string; $isHovered?: boolean; $isLoading?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
  background: ${props => props.$platformGradient};

  ${props => props.$isHovered && !props.$isLoading && css`
    transform: scale(1.08) rotate(3deg);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.25);
  `}
`;

export const CardNameSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  align-items: flex-end;
`;

export const CardPlatformName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  text-align: right;
`;

export const CardConnectedBadge = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #10B981;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
`;

export const CardAccountName = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.muted};
  margin: 0;
  font-weight: 500;
`;

export const CardNotConnectedText = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.muted};
  margin: 0;
`;

export const CardActionButton = styled.button<{ $isConnected?: boolean; $isHovered?: boolean; $isLoading?: boolean; $platformGradient?: string }>`
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  background: ${props => props.$isConnected ? 'transparent' : props.$platformGradient};
  color: ${props => props.$isConnected ? '#EF4444' : 'white'};
  box-shadow: ${props => props.$isConnected ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)'};

  ${props => props.$isConnected && css`
    border: 2px solid #EF4444;
  `}

  ${props => props.$isHovered && !props.$isLoading && (props.$isConnected ? css`
    background: #FEE2E2;
    transform: scale(1.02);
  ` : css`
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  `)}
`;

export const CardAnimatedBorder = styled.div<{ $platformGradient?: string }>`
  position: absolute;
  inset: -2px;
  border-radius: 20px;
  padding: 2px;
  opacity: 0.2;
  animation: ${borderPulse} 3s ease-in-out infinite;
  pointer-events: none;
  background: ${props => props.$platformGradient};
`;

// CompactSocialButton Styled Components
export const CompactButton = styled.button<{ $isConnected?: boolean; $isHovered?: boolean; $isLoading?: boolean; $platformPrimary?: string; $platformGradient?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  border: ${props => props.$isConnected ? 'none' : '2px solid'};
  border-color: ${props => props.$isConnected ? 'transparent' : props.$platformPrimary};
  background: ${props => props.$isConnected ? props.$platformGradient : props.theme.colors.surface};
  background-size: ${props => props.$isConnected ? '400% 400%' : 'auto'};
  animation: ${props => props.$isConnected ? css`${gradientShift} 8s ease infinite` : 'none'};
  cursor: ${props => props.$isLoading ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  transform: ${props => props.$isHovered && !props.$isLoading ? 'translateX(4px)' : 'translateX(0)'};
  box-shadow: ${props => props.$isHovered && !props.$isLoading ? '0 6px 16px rgba(155, 93, 229, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.05)'};
  width: 100%;
`;

export const CompactIconContainer = styled.div<{ $isConnected?: boolean; $isHovered?: boolean; $isLoading?: boolean; $platformGradient?: string; $hasProfilePic?: boolean }>`
  width: ${props => props.$isConnected ? '48px' : '36px'};
  height: ${props => props.$isConnected ? '48px' : '36px'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$hasProfilePic ? props.theme.colors.surface : props.$platformGradient};
  transition: all 0.3s;
  flex-shrink: 0;
  transform: ${props => props.$isHovered && !props.$isLoading ? 'rotate(5deg) scale(1.05)' : 'rotate(0) scale(1)'};
  position: relative;
  z-index: 1;
  border: ${props => props.$hasProfilePic ? `2px solid ${props.theme.colors.surface}` : 'none'};
`;

export const CompactIcon = styled.img<{ $hasProfilePic?: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: ${props => props.$hasProfilePic ? 'cover' : 'contain'};
`;

export const CompactPlatformOverlay = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.theme.colors.surface};
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CompactPlatformOverlayIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const CompactText = styled.span<{ $isConnected?: boolean }>`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.$isConnected ? 'white' : props.theme.colors.muted};
  text-align: left;
  flex: 1;
  position: relative;
  z-index: 1;
  text-shadow: ${props => props.$isConnected ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none'};
  display: flex;
  align-items: center;
`;

export const CompactDisconnectBadge = styled.span`
  background: #FEE2E2;
  color: #EF4444;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-shadow: none;
`;

export const CompactConnectedDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4ade80;
  box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
`;

export const Spinner = styled.div<{ $isConnected?: boolean; $platformPrimary?: string }>`
  width: 18px;
  height: 18px;
  border: 3px solid;
  border-color: ${props => props.$isConnected ? 'rgba(255, 255, 255, 0.3)' : `${props.$platformPrimary}33`};
  border-top-color: ${props => props.$isConnected ? 'white' : props.$platformPrimary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  position: relative;
  z-index: 1;
`;

// Shared components
export const Icon = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
`;

export const IconEmoji = styled.span`
  font-size: 28px;
`;