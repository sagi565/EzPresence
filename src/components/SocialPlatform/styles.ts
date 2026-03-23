import styled, { keyframes } from 'styled-components';
// theme import removed to use dynamic props.theme
import { media } from '@/styles/breakpoints';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const SocialSection = styled.div`
  padding: 28px 32px;
  margin-top: 16px;
  background: ${props => props.theme.colors.bg === '#0a0e17' ? 'rgba(155, 93, 229, 0.05)' : 'rgba(155, 93, 229, 0.03)'};
  border-radius: 16px;
  border: 2px solid ${props => props.theme.colors.primary}26;

  ${media.phone} {
    padding: 20px 16px;
  }
`;

export const SocialHeader = styled.div`
  margin-bottom: 20px;
`;

export const SocialTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  font-family: 'Figtree, ui-sans-serif, system-ui, sans-serif';
  font-style: italic;
  color: ${props => props.theme.colors.text};
  margin: 0 0 6px 0;
`;

export const SocialSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.muted};
  opacity: ${props => props.theme.colors.bg === '#0a0e17' ? 0.9 : 1};
  margin: 0;
`;

export const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  ${media.phone} {
    grid-template-columns: 1fr;
  }
`;

export const SkeletonCardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  border: 2px solid ${props => props.theme.colors.primary}12;
  background: ${props => props.theme.colors.surface};
  width: 100%;
  box-sizing: border-box;
`;

const ShimmerBase = styled.div`
  background: linear-gradient(90deg, 
    ${props => props.theme.colors.bg} 25%, 
    ${props => props.theme.colors.surface} 50%, 
    ${props => props.theme.colors.bg} 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
  border-radius: 8px;
`;

export const SkeletonCircle = styled(ShimmerBase)`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const SkeletonTextWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SkeletonTextBar = styled(ShimmerBase)`
  height: 13px;
  width: 70%;
  border-radius: 6px;
`;
