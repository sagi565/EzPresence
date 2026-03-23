import styled, { keyframes, css } from 'styled-components';
import { media } from '@/styles/breakpoints';

export const poofImplode = keyframes`
  0%   { opacity: 1;   transform: scale(1);    filter: blur(0px);  max-height: 100vh; }
  40%  { opacity: 0.6; transform: scale(0.97); filter: blur(1px);  max-height: 100vh; }
  75%  { opacity: 0.1; transform: scale(0.93); filter: blur(3px);  max-height: 100vh; }
  90%  { opacity: 0;   transform: scale(0.90); filter: blur(4px);  max-height: 100vh; }
  100% { opacity: 0;   transform: scale(0.90); filter: blur(4px);  max-height: 0; padding-top: 0; padding-bottom: 0; }
`;

export const poofParticleAnim = keyframes`
  0%   { transform: translate(0, 0) scale(1);                                              opacity: 0; }
  10%  { opacity: 1; }
  80%  { transform: translate(var(--pdx), var(--pdy)) scale(0.5);                          opacity: 0.3; }
  100% { transform: translate(calc(var(--pdx)*1.05), calc(var(--pdy)*1.05)) scale(0);      opacity: 0; }
`;

export const Container = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ContentArea = styled.div<{ $isDraggingList?: boolean; $isReorderScrolling?: boolean }>`
  flex: 1;
  height: auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: ${props => (props.$isDraggingList || props.$isReorderScrolling) ? 'none' : 'y mandatory'};
  scroll-behavior: smooth;
  WebkitOverflowScrolling: touch;
  overscroll-behavior-y: none;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.primary}33 transparent;
  padding-right: 100px;

  ${media.tablet} {
    padding-right: 0;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}33;
    border-radius: 3px;
  }
`;

export const ListSection = styled.div<{ $isDeleting?: boolean }>`
  min-height: 100%;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 60px 48px 60px 80px;
  flex-shrink: 0;
  position: relative;
  
  ${props => props.$isDeleting && css`
    animation: ${poofImplode} 0.85s ease-in-out forwards;
    overflow: visible;
    pointer-events: none;
    transform-origin: center center;
  `}

  ${media.phone} {
    padding: 50px 10px 80px 10px;
    align-items: flex-start;
    justify-content: flex-start;
    min-height: 100%; /* Ensure each list has full screen space on mobile */
  }
`;

export const ListWrapper = styled.div`
  width: 100%;
  max-width: 1600px;
`;

export const AddListButtonWrapper = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  padding: 0 24px;
  
  ${media.phone} {
    width: 100%;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0 24px;
  }
`;

export const AddListButton = styled.button`
  padding: 16px 32px;
  background: ${props => props.theme.colors.surface}F2;
  border: 2px dashed ${props => props.theme.colors.primary}4D;
  border-radius: 12px;
  color: ${props => props.theme.colors.primary};
  font-weight: 600;
  fontSize: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: ${props => props.theme.shadows.md};
  backdrop-filter: blur(10px);

  &:hover {
    background: ${props => props.theme.colors.primary}1A;
    border-color: ${props => props.theme.colors.primary}66;
    transform: translateY(-2px);
  }

  ${media.phone} {
    width: 100%;
    padding: 10px 16px;
    font-size: 14px;
    border-radius: 10px;
  }
`;

// Poof Particles
export const PoofContainer = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 99;
  overflow: visible;
`;

export const Particle = styled.div<{ 
  $top: string; 
  $left: string; 
  $size: number; 
  $color: string; 
  $duration: number; 
  $delay: number;
}>`
  position: absolute;
  top: ${props => props.$top};
  left: ${props => props.$left};
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  margin-left: ${props => -props.$size / 2}px;
  margin-top: ${props => -props.$size / 2}px;
  border-radius: 50%;
  background: ${props => props.$color};
  animation: ${poofParticleAnim} ${props => props.$duration}ms ${props => props.$delay}ms ease-out both;
  z-index: 101;
`;

// Drag Previews
export const ItemPreview = styled.div`
  width: 140px;
  aspect-ratio: 9/16;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px ${props => props.theme.colors.primary}66;
  transform: rotate(-2deg) scale(1.05);
  cursor: grabbing;
  background: ${props => props.theme.colors.bg};
  position: relative;
  opacity: 0.9;
  border: 2px solid ${props => props.theme.colors.primary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${media.phone} {
    width: 100px;
  }
`;

export const EmptyPreview = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: ${props => props.theme.colors.primary}0D;
`;

export const PreviewTitle = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 14px 10px 8px 10px;
  background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%);
  color: white;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
  z-index: 2;
`;

export const ListPreview = styled.div<{ $isSystem?: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$isSystem ? `${props.theme.colors.secondary}1A` : `${props.theme.colors.primary}1A`};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.md};
  font-size: 20px;
  cursor: grabbing;
  border: 2px solid ${props => props.$isSystem ? `${props.theme.colors.secondary}66` : `${props.theme.colors.primary}66`};
`;