import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

export const celebrate = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${theme.colors.primary}B3;
  }
  30% {
    transform: scale(1.3);
    box-shadow: 0 0 20px 10px ${theme.colors.primary}66;
  }
  50% {
    transform: scale(1.1);
  }
  70% {
    transform: scale(1.2);
    box-shadow: 0 0 30px 15px ${theme.colors.primary}00;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 ${theme.colors.primary}00;
  }
`;

export const ScrollNavContainer = styled.nav`
  position: fixed;
  right: -220px;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  z-index: 100;
  width: 600px;
  padding: 80px 0 24px 0;
  pointer-events: none;

  ${media.phone} {
    right: 0px;
    transform: scale(0.9);
    transform-origin: right center;
    width: 80px;
  }
`;

export const DotsContainer = styled.div<{ $height: string; $scrollable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  overflow: ${props => props.$scrollable ? 'auto' : 'visible'};
  pointer-events: auto;
  height: ${props => props.$height};
  width: 100%;
  overflow-x: visible;
  scrollbar-width: none;
  ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ScrollItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 5px;
  width: 100%;
  gap: 12px;
`;

export const ScrollLabel = styled.span<{ $visible?: boolean }>`
  position: absolute;
  right: 64px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: ${props => props.$visible ? 'translateX(0)' : 'translateX(8px)'};
  transition: all 0.2s ease;
  pointer-events: none;
  text-align: right;
  background: white;
  padding: 4px 10px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  ${media.phone} {
    font-size: 14px;
    background: rgba(255, 255, 255, 0.95);
    padding: 6px 12px;
    right: 52px;
  }

  .nav-grad-text {
    display: inline-block;
    font-weight: 800;
    background: ${theme.gradients.innovator};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  ${media.phone} {
    right: 56px;
    opacity: 1 !important;
    transform: translateX(0) !important;
  }
`;

export const ScrollDot = styled.div<{ 
  $isSystem?: boolean; 
  $isActive?: boolean; 
  $isHovered?: boolean; 
  $isDropTarget?: boolean; 
  $isInvalidDropTarget?: boolean;
  $isItemDragging?: boolean;
  $isCelebrating?: boolean;
  $isDragging?: boolean;
}>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  border: 2px solid transparent;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
  cursor: grab;
  z-index: 2;

  ${props => props.$isSystem ? css`
    background: ${theme.colors.secondary}1A;
    border-color: ${theme.colors.secondary}4D;
  ` : css`
    background: ${theme.colors.primary}1A;
    border-color: ${theme.colors.primary}4D;
  `}

  ${props => props.$isItemDragging && !props.$isDropTarget && css`
    opacity: 0.6;
  `}

  ${props => props.$isHovered && !props.$isActive && !props.$isDragging && css`
    transform: scale(1.15);
    background: ${props.$isSystem ? `${theme.colors.secondary}33` : `${theme.colors.primary}33`};
    border-color: ${props.$isSystem ? `${theme.colors.secondary}80` : `${theme.colors.primary}80`};
  `}

  ${props => props.$isActive && css`
    background: ${props.$isSystem ? `${theme.colors.secondary}40` : `${theme.colors.primary}40`};
    border-color: ${props.$isSystem ? `${theme.colors.secondary}BF` : `${theme.colors.primary}BF`};
    box-shadow: 0 0 18px ${props.$isSystem ? `${theme.colors.secondary}73` : `${theme.colors.primary}73`};
    transform: scale(1.18);
  `}

  ${props => props.$isDropTarget && css`
    width: 52px;
    height: 52px;
    opacity: 1;
    background: ${props.$isSystem ? `${theme.colors.secondary}4D` : `${theme.colors.primary}4D`};
    border-color: ${props.$isSystem ? `${theme.colors.secondary}B3` : `${theme.colors.primary}B3`};
    box-shadow: 0 0 24px ${props.$isSystem ? `${theme.colors.secondary}80` : `${theme.colors.primary}80`};
  `}

  ${props => props.$isInvalidDropTarget && css`
    opacity: 0.3;
    filter: grayscale(1);
    cursor: not-allowed;
  `}

  ${props => props.$isCelebrating && css`
    animation: ${celebrate} 0.6s ease-out;
  `}

  ${props => props.$isDragging && css`
    z-index: 9999;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    transform: scale(1.1);
  `}
`;

export const ScrollIcon = styled.span`
  font-size: 18px;
  transition: transform 0.2s ease;
  pointer-events: none;
`;

export const ScrollLine = styled.div<{ $hidden?: boolean }>`
  position: absolute;
  left: 50%;
  top: 64px;
  width: 2px;
  height: 40px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 1px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(-50%);
  transform-origin: top;
  
  ${props => props.$hidden && css`
    height: 0px;
    opacity: 0;
  `}
`;

export const ScrollArrow = styled.button<{ $visible?: boolean; $isHovered?: boolean; $side?: 'up' | 'down' }>`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s ease;
  border-radius: 50%;
  background: transparent;
  border: none;
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
  opacity: ${props => props.$visible ? 1 : 0};

  ${props => props.$isHovered && css`
    background: ${theme.colors.primary}1A;
    color: ${theme.colors.primary};
  `}
`;

export const ContextMenu = styled.div<{ $top: number; $left: number }>`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 6px;
  z-index: 2000;
  min-width: 200px;
`;

export const ContextMenuItem = styled.button<{ $isHovered?: boolean }>`
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
  font-size: 14px;
  font-weight: 500;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;

  ${props => props.$isHovered && css`
    background: rgba(239, 68, 68, 0.1);
  `}
`;

export const DroppableListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ContextMenuButton = styled.button`
  border: none;
  background: transparent;
  width: 100%;
  padding: 0;
`;