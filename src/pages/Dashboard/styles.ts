import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';

export const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const ShimmerBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e4e4e4 50%, #f0f0f0 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  border-radius: 8px;
`;

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${theme.gradients.background};
`;

export const DashboardContent = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    padding: 20px 16px 40px;
    gap: 20px;
  }
`;

export const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 480px) {
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 12px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

export const TitleGradient = styled.span`
  background: ${theme.gradients.momentum};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const FilterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

export const TimeRangeWrapper = styled.div`
  display: flex;
  gap: 3px;
  background: white;
  border-radius: ${theme.borderRadius.full};
  padding: 4px;
  box-shadow: ${theme.shadows.sm};
  overflow-x: auto;
  
  /* Hide scrollbar but keep functionality */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const TimeRangeButton = styled.button<{ $active: boolean; $hovered: boolean }>`
  padding: 6px 14px;
  border-radius: ${theme.borderRadius.full};
  border: none;
  background: ${props => props.$active
    ? theme.gradients.momentum
    : props.$hovered ? '#f3f4f6' : 'transparent'};
  color: ${props => props.$active ? 'white' : props.$hovered ? theme.colors.text : theme.colors.muted};
  font-weight: ${props => props.$active ? 700 : 500};
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(155,93,229,0.35)' : 'none'};
  @media (max-width: 400px) {
    padding: 6px 10px;
    font-size: 12px;
  }
`;

export const KPISection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const ChartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;

  @media (max-width: 480px) {
    justify-content: center;
    text-align: center;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin: 0;

  @media (max-width: 480px) {
    text-align: center;
    width: 100%;
  }
`;

export const ViewAllButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.primary};
  font-weight: 700;
  font-size: 14px;
  padding: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
`;

// --- Skeleton Components ---

export const ChartSkeletonContainer = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: 24px;
  box-shadow: ${theme.shadows.md};
`;

export const SkeletonRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

export const ShimmerPill = styled(ShimmerBase)<{ $width: number; $height: number }>`
  width: ${props => props.$width}px;
  height: ${props => props.$height}px;
  border-radius: 20px;
`;

export const ChartAreaSkeleton = styled.div`
  position: relative;
  height: 280px;
`;

export const YAxisSkeleton = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 36px;
`;

export const YTickSkeleton = styled(ShimmerBase)`
  width: 28px;
  height: 10px;
`;

export const GridSkeleton = styled.div`
  margin-left: 44px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const GridLineSkeleton = styled.div`
  height: 1px;
  background: #f3f4f6;
  width: 100%;
`;

export const ChartOverlaySkeleton = styled.div`
  position: absolute;
  inset: 0 0 24px 44px;
  background: linear-gradient(180deg, rgba(155,93,229,0.07) 0%, transparent 100%);
  border-radius: 4px;
`;

export const XAxisSkeleton = styled.div`
  position: absolute;
  bottom: 0;
  left: 44px;
  right: 0;
  display: flex;
  justify-content: space-between;
`;

export const XTickSkeleton = styled(ShimmerBase)`
  width: 36px;
  height: 10px;
`;

export const MetricSkeletonContainer = styled.div`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  padding: 20px 24px;
  box-shadow: ${theme.shadows.md};
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

export const SkeletonTopStrip = styled(ShimmerBase)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 8px 8px 0 0;
`;

export const SkeletonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SkeletonIconBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SkeletonIcon = styled(ShimmerBase)`
  width: 38px;
  height: 38px;
  border-radius: 10px;
`;

export const SkeletonText = styled(ShimmerBase)<{ $width: string | number; $height: number }>`
  width: ${props => typeof props.$width === 'number' ? `${props.$width}px` : props.$width};
  height: ${props => props.$height}px;
`;

export const SkeletonBadge = styled(ShimmerBase)`
  width: 48px;
  height: 22px;
  border-radius: 20px;
`;

export const PlatformTabsSkeletonContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const PlatformTabSkeletonCard = styled.div<{ $width: number }>`
  width: ${props => props.$width}px;
  height: 58px;
  border-radius: ${theme.borderRadius.md};
  position: relative;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  flex-shrink: 0;
`;

export const PlatformTabSkeletonShimmer = styled(ShimmerBase)`
  position: absolute;
  inset: 0;
  border-radius: ${theme.borderRadius.md};
`;
