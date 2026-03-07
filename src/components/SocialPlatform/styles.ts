import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const SocialSection = styled.div`
  padding: 28px 32px;
  margin-top: 16px;
  background: rgba(155, 93, 229, 0.03);
  border-radius: 16px;
  border: 2px solid rgba(155, 93, 229, 0.15);

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
  color: ${theme.colors.text};
  margin: 0 0 6px 0;
`;

export const SocialSubtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.muted};
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
  border: 2px solid rgba(0,0,0,0.06);
  background: white;
  width: 100%;
  box-sizing: border-box;
`;

const ShimmerBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
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
