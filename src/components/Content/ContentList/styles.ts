import styled, { css } from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

export const ListContainer = styled.div<{ $isMobile?: boolean }>`
  position: relative;
  overflow: visible;
  height: 100%;
  width: 100%;
  min-height: 540px;

  ${props => props.$isMobile && css`
    min-height: auto;
  `}
`;

export const ListHeader = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.$isMobile ? '6px' : '20px'};
  margin-bottom: 12px;
`;

export const ListIcon = styled.div<{ $isEditable?: boolean; $isHovered?: boolean; $isEditMode?: boolean; $isMobile?: boolean }>`
  font-size: 56px;
  flex-shrink: 0;
  transition: all 0.2s ease;
  padding: 8px;
  border-radius: 12px;
  border: 2px dashed transparent;
  background: transparent;

  ${props => props.$isEditable && css`
    cursor: pointer;
  `}

  ${props => props.$isHovered && css`
    border-color: ${theme.colors.primary}80;
    background: ${theme.colors.primary}0D;
  `}

  ${props => props.$isEditMode && css`
    border-color: ${theme.colors.primary};
    background: ${theme.colors.primary}1A;
  `}

  ${props => props.$isMobile && css`
    font-size: 44px;
    padding: 6px;
  `}
`;

export const ListTitleGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ListTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ListTitle = styled.h2<{ $isMobile?: boolean }>`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin: 0;

  ${props => props.$isMobile && css`
    font-size: 26px; /* Larger title for mobile */
  `}
`;

export const ListTitleClickable = styled.div<{ $isHovered?: boolean }>`
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;
  border: 2px dashed transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;

  ${props => props.$isHovered && css`
    border-color: ${theme.colors.primary}80;
    background: ${theme.colors.primary}0D;
  `}
`;

export const ListTitleEditable = styled.input<{ $isFocused?: boolean; $isMobile?: boolean }>`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.text};
  background: transparent;
  border: 2px dashed transparent;
  padding: 6px 10px;
  border-radius: 10px;
  outline: none;
  max-width: 550px;
  transition: all 0.3s ease;

  ${props => props.$isFocused && css`
    background: white;
    border-color: ${theme.colors.primary};
    box-shadow: 0 4px 20px ${theme.colors.primary}40;
  `}

  ${props => props.$isMobile && css`
    font-size: 26px;
    max-width: 250px;
  `}
`;

export const ListSubtitle = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: ${theme.colors.muted};
  margin: 0;
`;

export const BrandGradient = styled.span`
  font-weight: 800;
  background: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const ActionButton = styled.button<{ $type: 'delete' | 'save'; $visible?: boolean; $isHovered?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: ${props => props.$visible ? 'inline-flex' : 'none'};
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  padding: 0;
  align-self: center;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid;

  ${props => props.$type === 'delete' && css`
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;

    ${props.$isHovered && css`
      background: #ef4444;
      border-color: #dc2626;
      color: white;
      transform: scale(1.08);
      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
    `}
  `}

  ${props => props.$type === 'save' && css`
    background: rgba(34, 197, 94, 0.1);
    border-color: rgba(34, 197, 94, 0.2);
    color: #22c55e;

    ${props.$isHovered && css`
      background: #22c55e;
      border-color: #16a34a;
      color: white;
      transform: scale(1.08);
      box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
    `}
  `}
`;

export const ListScrollWrapper = styled.div<{ $isDropTarget?: boolean; $isInvalidDropTarget?: boolean }>`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: visible;
  padding: 16px 8px;
  scroll-behavior: smooth;
  scrollbar-width: none;
  ms-overflow-style: none;
  align-items: flex-start;
  border-radius: 16px;
  transition: all 0.3s ease;

  &::-webkit-scrollbar {
    display: none;
  }

  ${media.phone} {
    padding: 24px 12px;
    gap: 16px;
  }

  ${props => props.$isDropTarget && css`
    background-color: ${theme.colors.primary}1A;
    border: 3px dashed ${theme.colors.primary}80;
    box-shadow: inset 0 0 30px ${theme.colors.primary}1A;
    transform: scale(1.01);
  `}

  ${props => props.$isInvalidDropTarget && css`
    opacity: 0.5;
    filter: grayscale(0.5);
    cursor: not-allowed;
  `}
`;

export const ScrollArrow = styled.button<{ $side: 'left' | 'right'; $visible?: boolean; $isHovered?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 120px;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  border: none;
  color: white;
  font-size: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, background 0.2s ease;
  z-index: 10;
  border-radius: 8px;
  ${props => props.$side === 'left' ? 'left: 8px;' : 'right: 8px;'}

  ${props => props.$isHovered && css`
    opacity: 1 !important;
    background: rgba(0, 0, 0, 0.25);
  `}
`;

export const DraggableItemWrapper = styled.div<{ $isBeingDragged: boolean; $isDragging: boolean }>`
  opacity: ${props => props.$isBeingDragged ? 0 : 1};
  cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
  transition: opacity 0.15s ease;
`;