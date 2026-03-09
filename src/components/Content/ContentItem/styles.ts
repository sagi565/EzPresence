import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

export const favoriteClick = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const ItemContainer = styled.div<{ $isDragging?: boolean; $isHovered?: boolean; $isUploading?: boolean }>`
  position: relative;
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-radius 0.3s ease, box-shadow 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  user-select: none;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin: 8px;
  width: 280px;
  height: 480px;

  ${media.phone} {
    width: 100px;
    height: 180px;
    margin: 4px;
    border-radius: 12px;
  }

  ${props => props.$isHovered && !props.$isUploading && !props.$isDragging && css`
    transform: scale(1.03) translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    z-index: 10;
  `}

  ${props => props.$isDragging && css`
    opacity: 1;
    cursor: grabbing;
    border-radius: 16px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 9999;
    background-color: transparent;
    margin: 0;
    transition: none;
  `}
`;

export const MediaContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const MediaCover = styled.img<{ $isVisible?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$isVisible !== false ? 1 : 0};
`;

export const VideoCover = styled.video<{ $isVisible?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
  transition: opacity 0.3s ease;
  opacity: ${props => props.$isVisible ? 1 : 0};
`;

export const GradientOverlay = styled.div<{ $isVisible?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
`;

export const ActionsContainer = styled.div<{ $isVisible?: boolean }>`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 20;
`;

export const ActionButton = styled.button<{ $active?: boolean; $isHovered?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.$active ? 'rgba(239, 68, 68, 0.85)' : 'rgba(0, 0, 0, 0.4)'};
  backdrop-filter: blur(10px);
  border: 1.5px solid ${props => props.$active ? 'rgba(239, 68, 68, 0.5)' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: white;
  transition: all 0.2s ease;
  padding: 0;
  
  ${props => props.$active && css`
    animation: ${favoriteClick} 0.4s cubic-bezier(0.4, 0.0, 0.2, 1);
  `}

  ${props => props.$isHovered && !props.$active && css`
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.6);
    border-color: rgba(255, 255, 255, 0.4);
  `}
`;

export const MoreOptionsButton = styled.button<{ $isVisible?: boolean; $isHovered?: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  z-index: 20;
  color: rgba(255, 255, 255, 0.9);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease, background 0.3s ease, transform 0.3s ease;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  ${props => props.$isHovered && css`
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  `}
`;

export const MenuDropdown = styled.div`
  position: absolute;
  top: 48px;
  right: 12px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 6px;
  z-index: 100;
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  animation: ${fadeIn} 0.2s ease;
`;

export const MenuItem = styled.button<{ $variant?: 'default' | 'delete'; $isHovered?: boolean }>`
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  text-align: left;
  width: 100%;
  transition: all 0.2s;

  ${props => props.$isHovered && (props.$variant === 'delete' ? css`
    background: rgba(239, 68, 68, 0.08);
    color: #ef4444;
  ` : css`
    background: ${theme.colors.primary}14;
    color: ${theme.colors.primary};
  `)}
`;

export const ContentTitle = styled.div<{ $isVisible?: boolean }>`
  position: absolute;
  bottom: 28px;
  left: 16px;
  right: 16px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 3;
  pointer-events: none;
  text-shadow: 0 2px 8px rgba(0,0,0,0.5);
`;

export const ContentDate = styled.div<{ $isVisible?: boolean }>`
  position: absolute;
  bottom: 10px;
  left: 16px;
  right: 16px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 11px;
  font-weight: 500;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 3;
  pointer-events: none;
`;

export const RenameContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
  z-index: 25;
`;

export const RenameInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid ${theme.colors.primary};
  background: white;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  outline: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 10;
`;

export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;