import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const Modal = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.3);
  width: 900px;
  height: 600px;
  position: relative;
  animation: ${scaleIn} 0.3s ease-out;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.12);
    color: #111827;
    transform: rotate(90deg);
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

export const MediaSection = styled.div`
  flex: 1 1 60%;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 600px;
  min-height: 600px;
`;

export const Media = styled.div<{ $isVideo?: boolean }>`
  max-width: 100%;
  max-height: 100%;
  
  img, video {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const MediaPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  color: #666;
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
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

export const TitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0;
  flex: 1;
  word-break: break-word;
`;

export const RenameInput = styled.input`
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  max-width: 180px;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;
  border-bottom: 2px solid ${theme.colors.primary};
  border-radius: 8px 8px 0 0;
  outline: none;
  transition: background 0.2s ease;
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
    background: ${theme.colors.primary}1A;
    font-size: 16px;
    &:hover {
      background: ${theme.colors.primary}33;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px ${theme.colors.primary}26;
    }
  `}

  ${props => props.$type === 'favorite' && css`
    background: ${props.$active ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 0, 0, 0.05)'};
    backdrop-filter: blur(10px);
    border: 2px solid ${props.$active ? 'rgba(239, 68, 68, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
    font-size: 22px;
    &:hover {
      transform: scale(1.1);
      background: ${props.$active ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
      border-color: ${props.$active ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 0, 0, 0.2)'};
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
`;

export const MetadataContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 16px;
`;

export const MetaItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MetaLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
`;

export const MetaValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
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
    background: ${theme.colors.blue};
    color: white;
    box-shadow: 0 4px 12px ${theme.colors.blue}4D;
    &:hover {
      background: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px ${theme.colors.blue}66;
    }
  `}

  ${props => props.$variant === 'delete' && css`
    background: transparent;
    color: #ef4444;
    border: 2px solid #ef4444;
    &:hover {
      background: #ef4444;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }
  `}
`;
