import styled, { css, createGlobalStyle } from 'styled-components';

export const GlobalDrawerStyles = createGlobalStyle`
  body.content-dragging .content-drawer {
    z-index: 2000 !important;
  }
  body.content-dragging .new-story-modal,
  body.content-dragging .new-post-modal {
    z-index: 1300 !important;
  }
`;

export const DrawerContainer = styled.div<{ $isOpen: boolean; $isPicking?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.colors.surface}D9;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 24px 24px 0 0;
  box-shadow: ${props => props.theme.mode === 'dark' 
    ? `0 -2px 10px rgba(0, 0, 0, 0.4)` 
    : `0 -4px 30px ${props.theme.colors.primary}26`};
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  transform: translateY(calc(100% - 70px));

  ${({ $isOpen }) => $isOpen && css`
    transform: translateY(0);
  `}

  ${({ $isPicking }) => $isPicking && css`
    z-index: 1700 !important;
    .content-drawer-handle {
      cursor: pointer;
      pointer-events: auto;
    }
  `}

  @media (max-width: 768px) {
    transform: translateY(calc(100% - 60px)) !important;
    ${({ $isOpen }) => $isOpen && css`
      transform: translateY(0) !important;
    `}
  }
`;

export const DrawerHandle = styled.div`
  background: transparent;
  padding: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid ${props => props.theme.colors.primary}0D;
  border-radius: 24px 24px 0 0;

  @media (max-width: 768px) {
    padding: 8px !important;
  }
`;

export const DrawerArrow = styled.span<{ $isOpen: boolean }>`
  font-size: 16px;
  color: ${props => props.theme.colors.muted};
  transition: all 0.3s;

  ${({ $isOpen, theme }) => $isOpen && css`
    transform: rotate(180deg);
    color: ${theme.colors.primary};
  `}
`

export const DrawerTitle = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px !important;
  }
`;

export const DrawerContent = styled.div`
  height: 385px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    height: 275px !important;
  }
`;

export const DrawerInner = styled.div`
  padding: 16px 24px;
  display: flex;
  gap: 0;
  height: 100%;

  @media (max-width: 768px) {
    padding: 8px 0 !important;
    flex-direction: column !important;
    gap: 12px !important;
    overflow: hidden !important;
  }
`;

export const DrawerControls = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding-right: 16px;

  @media (max-width: 768px) {
    padding: 0 12px !important;
    width: 100vw !important;
    box-sizing: border-box !important;
  }
`;

export const SearchBar = styled.input`
  width: 100%;
  max-width: 300px;
  padding: 8px 14px;
  border: 2px solid ${props => props.theme.colors.primaryLight};
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  background-color: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.text};

  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }

  @media (max-width: 768px) {
    max-width: 100% !important;
  }
`;

export const ContentList = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  overflow-y: hidden;
  flex-wrap: nowrap;
  padding-bottom: 20px;
  align-items: flex-start;

  @media (max-width: 768px) {
    width: 100vw !important;
    box-sizing: border-box !important;
    padding-right: 24px !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch !important;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;

    &::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

export const EmptyState = styled.div`
  padding: 20px;
  font-size: 13px;
  color: ${props => props.theme.colors.muted};
`;

export const ListsContainer = styled.div`
  width: 280px;
  flex-shrink: 0;
  background: ${props => props.theme.colors.surface};
  border-left: 1px solid ${props => props.theme.colors.primary}1A;
  display: flex;
  flex-direction: column;
  gap: 0px;
  overflow-y: auto;
  max-height: 100%;
  padding-left: 0;

  @media (max-width: 768px) {
    width: 100vw !important;
    box-sizing: border-box !important;
    border-left: none !important;
    border-top: 1px solid ${props => props.theme.colors.primary}1A !important;
    display: flex !important;
    flex-direction: row !important;
    max-height: 48px !important;
    overflow-x: auto !important;
    overflow-y: hidden !important;
    flex-wrap: nowrap !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 0 !important;
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;

    &::-webkit-scrollbar {
      display: none !important;
    }
  }
`;

export const ListPill = styled.button<{ $isActive: boolean; $isAllActive?: boolean }>`
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.primary}0D;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  transition: all 0.2s;
  width: 100%;
  text-align: left;
  border-radius: 0;

  ${({ $isActive, theme }) => $isActive && css`
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.primary};
    border-left: 3px solid ${theme.colors.primary};
  `}

  ${({ $isAllActive, theme }) => $isAllActive && css`
    background: ${theme.mode === 'dark' 
      ? `linear-gradient(135deg, ${theme.colors.primary}40 0%, ${theme.colors.pink}40 100%)` 
      : 'linear-gradient(135deg, #fbcfe8 0%, #ddd6fe 100%)'};
    color: ${theme.mode === 'dark' ? '#ffffff' : '#6d28d9'};
    border-left: 4px solid ${theme.mode === 'dark' ? theme.colors.primary : '#6d28d9'};
    font-weight: 700;
  `}

  @media (max-width: 768px) {
    padding: 8px 12px !important;
    border-bottom: none !important;
    border-right: 1px solid ${props => props.theme.colors.primary}1A !important;
    width: auto !important;
    white-space: nowrap !important;
    flex: 0 0 auto !important;

    ${({ $isActive, theme }) => $isActive && css`
      border-left: none !important;
      border-bottom: 3px solid ${theme.colors.primary} !important;
    `}

    ${({ $isAllActive, theme }) => $isAllActive && css`
      border-left: none !important;
      border-bottom: 4px solid ${theme.mode === 'dark' ? theme.colors.primary : '#6d28d9'} !important;
    `}
  }
`;

export const ListSeparator = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.primary}1A;
  margin: 4px 0;
`;

export const ListPillIcon = styled.span`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

export const CardContainer = styled.div<{ $isDragging?: boolean; $isHovered?: boolean }>`
  flex-shrink: 0;
  width: 140px;
  height: 249px;
  background: ${props => props.theme.colors.surface};
  padding: 6px;
  cursor: pointer;
  position: relative;
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.sm};
  border: 1px solid ${props => props.theme.colors.primary}1A;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $isHovered, $isDragging, theme }) => $isHovered && !$isDragging && css`
    transform: translateY(-4px);
    box-shadow: 0 8px 20px ${theme.colors.primary}40;
  `}

  ${({ $isDragging }) => $isDragging && css`
    cursor: grabbing;
    opacity: 0;
    transition: none;
  `}

  @media (max-width: 768px) {
    width: 80px !important;
    height: 142px !important;
    padding: 4px !important;
  }
`;

export const ThumbnailContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.bg};
  position: relative;
  overflow: hidden;
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
`;

export const FallbackIcon = styled.span`
  font-size: 24px;
`;

export const CardTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 12px 6px 4px 6px;
  text-align: left;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  z-index: 2;
  pointer-events: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 9px !important;
    padding: 6px 4px 2px 4px !important;
  }
`;

export const DragPreview = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 80px;
  aspect-ratio: 9/16;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid ${props => props.theme.colors.primary};
  background: ${props => props.theme.colors.bg};
  box-shadow: ${props => props.theme.shadows.lg};
  transform: translate(${({ $x }) => $x - 40}px, ${({ $y }) => $y - 80}px) rotate(-2deg) scale(1);
  pointer-events: none;
  z-index: 9999;
  opacity: 0.95;
`;

export const DragFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: ${props => props.theme.colors.primary}0D;
`;

export const DragTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 10px 8px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  color: white;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  z-index: 2;
`;
