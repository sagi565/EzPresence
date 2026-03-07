import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';

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
  right: 20px;
  top: 68px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 0;
  zIndex: 100;
  padding: 24px 60px 24px 24px;
  pointer-events: none;
`;

export const DotsContainer = styled.div<{ $height: string; $scrollable: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
  overflow: ${props => props.$scrollable ? 'auto' : 'visible'};
  padding: 0 28px 0 0;
  pointer-events: auto;
  height: ${props => props.$height};
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
  align-items: flex-end;
  transition: transform 0.3s ease;
  transform: none;
`;

export const ScrollItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  padding: 32px 0;
  gap: 12px;
  minWidth: 200px;
`;

export const ScrollLabel = styled.span<{ $visible?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: ${props => props.$visible ? 'translateX(0)' : 'translateX(8px)'};
  transition: all 0.2s ease;
  pointer-events: none;
  padding-right: 4px;

  .nav-grad-text {
    display: inline-block;
    font-weight: 800;
    background: ${theme.gradients.innovator};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
  flexShrink: 0;
  cursor: grab;
  zIndex: 2;

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
    zIndex: 9999;
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
  right: 21px;
  top: 76px;
  width: 2px;
  height: 64px;
  background: rgba(0, 0, 0, 0.08);
  borderRadius: 1px;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transformOrigin: top;
  
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
  margin: 4px 0;
  cursor: pointer;
  color: #9ca3af;
  transition: all 0.2s ease;
  borderRadius: 50%;
  background: transparent;
  border: none;
  alignSelf: flex-end;
  marginRight: 28px;
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
  borderRadius: 12px;
  boxShadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  padding: 6px;
  zIndex: 2000;
  minWidth: 140px;
`;

export const ContextMenuItem = styled.button<{ $isHovered?: boolean }>`
  padding: 10px 14px;
  borderRadius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
  fontSize: 14px;
  fontWeight: 500;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: none;
  width: 100%;
  textAlign: left;

  ${props => props.$isHovered && css`
    background: rgba(239, 68, 68, 0.1);
  `}
`;