import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';

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

// Month View Skeleton Styles
export const MonthGridWrapper = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: ${theme.shadows.md};
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  height: 720px;
  
  @media (max-width: 768px) {
    padding: 8px;
    height: auto;
    min-height: 600px;
  }
`;

export const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  margin-bottom: 1px;
  background: ${theme.colors.surface};
  border-radius: 12px 12px 0 0;
  overflow: hidden;
`;

export const DayHeaderCell = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  
  @media (max-width: 768px) {
    padding: 8px 4px;
  }
`;

export const DayHeaderTextSkeleton = styled(ShimmerBase)`
  width: 40%;
  height: 16px;
  border-radius: 4px;
`;

export const MonthBodyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: ${theme.colors.surface};
  flex: 1;
`;

export const MonthDayCell = styled.div<{ $isOtherMonth?: boolean }>`
  background: ${props => props.$isOtherMonth ? 'rgba(245, 245, 250, 0.6)' : 'white'};
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    padding: 4px;
  }
`;

export const DayNumberSkeleton = styled(ShimmerBase)`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-bottom: 4px;
`;

export const PostSkeleton = styled(ShimmerBase)`
  width: 100%;
  height: 24px;
  border-radius: 6px;
`;

// 4 Days View Skeleton Styles
export const FourDaysContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: ${theme.shadows.md};
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 720px;
  overflow: hidden;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    padding: 8px;
    height: auto;
    min-height: 600px;
  }
`;

export const FourDaysGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export const FourDaysHeaderRow = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(4, 1fr);
  gap: 1px;
  background: rgba(107, 114, 128, 0.1);
  border-radius: 12px 12px 0 0;
  overflow: hidden;
  margin-bottom: 1px;
  
  @media (max-width: 768px) {
    grid-template-columns: 50px repeat(4, 1fr);
  }
`;

export const FourDaysTimeHeader = styled.div`
  background: white;
  padding: 12px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FourDaysTimeHeaderTextSkeleton = styled(ShimmerBase)`
  width: 40px;
  height: 16px;
  border-radius: 4px;
`;

export const FourDaysDayHeader = styled.div`
  background: white;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

export const FourDaysDayNameSkeleton = styled(ShimmerBase)`
  width: 30px;
  height: 12px;
  border-radius: 4px;
`;

export const FourDaysDayDateSkeleton = styled(ShimmerBase)`
  width: 50px;
  height: 16px;
  border-radius: 4px;
`;

export const FourDaysBodyContainer = styled.div`
  flex: 1;
  overflow-y: hidden;
`;

export const FourDaysTimeRow = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(4, 1fr);
  gap: 1px;
  background: rgba(107, 114, 128, 0.1);
  min-height: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 50px repeat(4, 1fr);
  }
`;

export const FourDaysTimeLabel = styled.div`
  background: white;
  padding: 8px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-top: 1px solid rgba(107, 114, 128, 0.1);
`;

export const FourDaysTimeLabelSkeleton = styled(ShimmerBase)`
  width: 40px;
  height: 14px;
  border-radius: 4px;
`;

export const FourDaysDayCell = styled.div`
  background: white;
  padding: 4px;
  min-height: 60px;
  max-height: 60px;
  border-top: 1px solid rgba(107, 114, 128, 0.1);
  border-right: 1px solid rgba(107, 114, 128, 0.1);
`;

export const FourDaysPostSkeleton = styled(ShimmerBase)`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`;
