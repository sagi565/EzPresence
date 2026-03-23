import styled, { keyframes, css } from 'styled-components';
// import { theme } from '@theme/theme'; // Removed to use props.theme

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const scaleIn = keyframes`
  from { transform: scale(0.97); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export const slideUp = keyframes`
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease-out;

  @media (max-width: 768px) {
    align-items: flex-end;
    background: rgba(0, 0, 0, 0.6);
  }
`;

export const Modal = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 24px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
  width: 900px;
  height: 600px;
  position: relative;
  animation: ${scaleIn} 0.3s ease-out;

  @media (max-width: 768px) {
    width: 100%;
    height: 100dvh;
    max-height: 100dvh;
    border-radius: 0;
    animation: ${slideUp} 0.35s cubic-bezier(0.32, 0.72, 0, 1);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

export const DragHandle = styled.div`
  display: none;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}0D;
  border: none;
  color: ${props => props.theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    transform: rotate(90deg);
  }

  @media (max-width: 768px) {
    display: flex;
    top: max(16px, env(safe-area-inset-top));
    right: 16px;
    width: 36px;
    height: 36px;
    background: ${props => props.theme.colors.surface}CC;
    backdrop-filter: blur(8px);
    box-shadow: ${props => props.theme.shadows.md};
    border: 1px solid ${props => props.theme.colors.primary}0D;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 100%;
    flex: 1;
    overflow: hidden;
  }
`;

export const MediaSection = styled.div`
  flex: 1 1 60%;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
  min-height: 600px;

  @media (max-width: 768px) {
    flex: 0 0 55%;
    height: 55%;
    min-height: unset;
    width: 100%;
    background: #0a0a0a;
  }
`;

export const Media = styled.div<{ $isVideo?: boolean }>`
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  img, video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    height: 100%;
    padding: 10px;
    
    img, video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
  }
`;

export const MediaPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.bg};
  color: ${props => props.theme.colors.muted};
`;

export const InfoSection = styled.div`
  flex: 1 1 40%;
  padding: 72px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 360px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 600px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}1A;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
    flex: 1;
    height: auto;
    padding: 24px 20px;
    gap: 20px;
    background: ${props => props.theme.colors.surface};
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    margin-top: -32px;
    z-index: 2;
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  flex: 1;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 24px;
    letter-spacing: -0.5px;
    color: ${props => props.theme.colors.text};
  }
`;

export const RenameInput = styled.input`
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  max-width: 180px;
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  padding: 4px 8px;
  background: ${props => props.theme.colors.primary}08;
  border: 1px solid transparent;
  border-bottom: 2px solid ${props => props.theme.colors.primary};
  border-radius: 8px 8px 0 0;
  outline: none;
  transition: background 0.2s ease;

  @media (max-width: 768px) {
    font-size: 18px;
    max-width: 100%;
  }
`;

export const IconButton = styled.button<{ $type?: 'edit' | 'favorite' | 'save' | 'cancel' | 'download'; $active?: boolean; $isHovered?: boolean }>`
  width: ${props => props.$type === 'favorite' ? '44px' : '36px'};
  height: ${props => props.$type === 'favorite' ? '44px' : '36px'};
  border-radius: ${props => props.$type === 'favorite' ? '50%' : '10px'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  padding: 0;

  ${props => props.$type === 'edit' && css`
    background: ${props.theme.colors.primary}1A;
    font-size: 16px;
    color: ${props.theme.colors.primary};
    &:hover {
      background: ${props.theme.colors.primary}33;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${props.theme.colors.primary}26;
    }
  `}

  ${props => props.$type === 'favorite' && css`
    background: ${props.$active ? 'rgba(239, 68, 68, 0.15)' : `${props.theme.colors.primary}1A`};
    backdrop-filter: blur(10px);
    border: 2px solid ${props.$active ? 'rgba(239, 68, 68, 0.3)' : `${props.theme.colors.primary}33`};
    font-size: 22px;
    color: ${props.$active ? '#ef4444' : props.theme.colors.muted};
    &:hover {
      transform: scale(1.1);
      background: ${props.$active ? 'rgba(239, 68, 68, 0.2)' : `${props.theme.colors.primary}33`};
      border-color: ${props.$active ? 'rgba(239, 68, 68, 0.4)' : `${props.theme.colors.primary}66`};
    }
  `}

  ${props => props.$type === 'save' && css`
    background: rgba(34, 197, 94, 0.15);
    color: #16a34a;
    &:hover { background: rgba(34, 197, 94, 0.25); }
  `}

  ${props => props.$type === 'cancel' && css`
    background: rgba(239, 68, 68, 0.15);
    color: #dc2626;
    &:hover { background: rgba(239, 68, 68, 0.25); }
  `}

  @media (max-width: 768px) {
    width: ${props => props.$type === 'favorite' ? '48px' : '40px'};
    height: ${props => props.$type === 'favorite' ? '48px' : '40px'};
    min-width: unset;
    min-height: unset;
    
    ${props => props.$type === 'favorite' && css`
      position: absolute;
      top: -100px;
      right: 20px;
      background: ${props => props.theme.colors.surface};
      box-shadow: ${props => props.theme.shadows.md};
      border: 1px solid ${props => props.theme.colors.primary}1A;
    `}
  }
`;

export const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${props => props.theme.colors.bg};
  border-radius: 16px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px;
    border-radius: 14px;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
`;

export const MetaLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.colors.muted};

  @media (max-width: 768px) {
    font-size: 13px;
    font-weight: 500;
    color: #6b7280;
    flex-shrink: 0;
  }
`;

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};

  @media (max-width: 768px) {
    font-size: 13px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    text-align: right;
  }
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;

  @media (max-width: 768px) {
    flex-direction: row;
    gap: 10px;
    margin-top: 4px;
    padding: 16px 0 max(20px, env(safe-area-inset-bottom));
    position: sticky;
    background: ${props => props.theme.colors.surface}D9;
    backdrop-filter: blur(20px);
    border-top: 1px solid ${props => props.theme.colors.primary}0D;
    /* Fade edge */
    &::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(to bottom, transparent, ${props => props.theme.colors.surface});
      pointer-events: none;
    }
  }
`;

export const ActionButton = styled.button<{ $variant: 'download' | 'delete'; $isHovered?: boolean }>`
  padding: 14px 20px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  ${props => props.$variant === 'download' && css`
    background: ${props.theme.colors.blue};
    color: white;
    box-shadow: 0 4px 12px ${props.theme.colors.blue}4D;
    &:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px ${props.theme.colors.blue}66;
    }
  `}

  ${props => props.$variant === 'delete' && css`
    background: #ef4444;
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    border: none;
    &:hover {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.45);
    }
  `}

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 14px;
    border-radius: 14px;
    &:hover { transform: none; }
    &:active { transform: scale(0.97); }

    ${props => props.$variant === 'download' && css`
      flex: 1;
    `}

    ${props => props.$variant === 'delete' && css`
      flex: 0 0 auto;
      width: 50px;
      height: 50px;
      padding: 0;
      border-radius: 14px;
      font-size: 18px;
    `}
  }
`;