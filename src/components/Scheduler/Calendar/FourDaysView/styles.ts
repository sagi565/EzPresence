import styled from 'styled-components';
import { theme } from '@theme/theme';

export const Container = styled.div`
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

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

export const HeaderRow = styled.div`
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

export const TimeHeader = styled.div`
  background: white;
  padding: 12px 8px;
  font-weight: 600;
  font-size: 14px;
  color: ${theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 8px 4px;
    font-size: 11px;
  }
`;

export const DayHeader = styled.div<{ $isToday?: boolean }>`
  background: ${props => props.$isToday ? 'rgba(155, 93, 229, 0.1)' : 'white'};
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  transition: all 0.2s;
  ${props => props.$isToday && `
    border-bottom: 3px solid ${theme.colors.primary};
    color: ${theme.colors.primary};
  `}
  
  @media (max-width: 768px) {
    padding: 8px 4px;
  }
`;

export const DayName = styled.div`
  font-size: 12px;
  color: ${theme.colors.muted};
  margin-bottom: 4px;
  
  @media (max-width: 768px) {
    font-size: 10px;
    margin-bottom: 2px;
  }
`;

export const DayDate = styled.div`
  font-size: 14px;
  color: ${theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 11px;
  }
`;

export const BodyContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const TimeRow = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(4, 1fr);
  gap: 1px;
  background: rgba(107, 114, 128, 0.1);
  min-height: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 50px repeat(4, 1fr);
  }
`;

export const TimeLabel = styled.div`
  background: white;
  padding: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${theme.colors.muted};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-top: 1px solid rgba(107, 114, 128, 0.1);
  
  @media (max-width: 768px) {
    padding: 4px;
    font-size: 10px;
  }
`;

export const DayCell = styled.div<{ $isToday?: boolean; $isPast?: boolean; $isHovered?: boolean; $isDragOver?: boolean }>`
  background: ${props => 
    props.$isPast ? 'rgba(249, 250, 251, 0.5)' : 
    props.$isHovered ? (props.$isToday ? 'rgba(155, 93, 229, 0.08)' : 'rgba(155, 93, 229, 0.02)') :
    props.$isToday ? 'rgba(155, 93, 229, 0.05)' : 
    'white'};
    
  padding: 4px;
  position: relative;
  min-height: 60px;
  max-height: 60px;
  transition: all 0.2s;
  cursor: ${props => props.$isPast ? 'default' : 'pointer'};
  overflow: visible;

  border-top: ${props => props.$isHovered && !props.$isPast ? '1px dashed rgba(155, 93, 229, 0.4)' : '1px solid rgba(107, 114, 128, 0.1)'};
  border-right: ${props => props.$isHovered && !props.$isPast && !props.$isToday ? '1px dashed rgba(155, 93, 229, 0.4)' : '1px solid rgba(107, 114, 128, 0.1)'};
  border-bottom: ${props => props.$isHovered && !props.$isPast ? '1px dashed rgba(155, 93, 229, 0.4)' : '1px solid transparent'};
  border-left: ${props => props.$isHovered && !props.$isPast && !props.$isToday ? '1px dashed rgba(155, 93, 229, 0.4)' : '1px solid transparent'};

  ${props => props.$isToday && `
    border-left: 2px solid ${theme.colors.primary};
    border-right: 2px solid ${theme.colors.primary};
  `}
`;

export const PostContainer = styled.div`
  display: flex;
  gap: 4px;
  height: 100%;
`;

export const OverflowIndicator = styled.div`
  position: absolute;
  bottom: 4px;
  right: 6px;
  background: rgba(155, 93, 229, 0.1);
  color: ${theme.colors.primary};
  border: 1px solid rgba(155, 93, 229, 0.3);
  border-radius: 10px;
  padding: 1px 6px;
  font-size: 9px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    bottom: 2px;
    right: 2px;
    padding: 1px 4px;
  }
`;

export const TimeIndicatorContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 10;
`;

export const TimeIndicatorDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #d32f2f;
  border: 2px solid white;
  position: absolute;
  left: -5px;
  z-index: 11;
  box-shadow: 0 2px 4px rgba(211, 47, 47, 0.4);
`;

export const TimeIndicatorLine = styled.div`
  width: 100%;
  height: 3px;
  background: #d32f2f;
  box-shadow: 0 1px 3px rgba(211, 47, 47, 0.3);
`;

export const PostCard = styled.div<{ $isHalf?: boolean }>`
  background: ${theme.colors.surface};
  border-radius: 6px;
  padding: 4px 6px;
  font-size: 10px;
  box-shadow: ${theme.shadows.sm};
  transition: all 0.2s;
  border-left: 3px solid ${theme.colors.primary};
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  ${props => props.$isHalf && `
    width: calc(50% - 2px);
  `}

  &:hover {
    transform: translateX(2px);
    box-shadow: 0 2px 6px rgba(155, 93, 229, 0.15);
  }
  
  @media (max-width: 768px) {
    padding: 2px 4px;
  }
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
`;

export const PostLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

export const PostRight = styled.div`
  margin-left: auto;
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const StatusIndicator = styled.div<{ $status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
  
  background: ${props => props.$status === 'SUCCESS' ? '#22c55e' : props.$status === 'FAILED' ? '#ef4444' : 'white'};
  border: ${props => props.$status === 'SCHEDULED' ? '1.7px solid black' : props.$status === 'DRAFT' ? '2.2px dotted #4b5563' : 'none'};
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    width: 6px;
    height: 6px;
  }
`;

export const BlackTooltip = styled.div`
  position: absolute;
  bottom: 17px;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.text};
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;
`;

export const PostTime = styled.span`
  font-weight: 600;
  color: ${theme.colors.text};
  white-space: nowrap;
  font-size: 9px;
  
  @media (max-width: 768px) {
    font-size: 7px;
  }
`;

export const MediaIcon = styled.span`
  font-size: 10px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

export const PostTitleWrapper = styled.div`
  font-weight: 700;
  color: ${theme.colors.text};
  font-size: 10px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 8px;
  }
`;

export const PlatformIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  
  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
  }
`;

export const BadgeWrapper = styled.div<{ $platform: string }>`
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  font-weight: 900;
  font-size: 8px;
  color: white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  letter-spacing: 0.2px;
  
  background: ${props => props.$platform === 'yt' ? '#ff0033' 
    : props.$platform === 'ig' ? theme.gradients.vibe 
    : props.$platform === 'tt' ? theme.colors.text 
    : theme.colors.blue};
    
  @media (max-width: 768px) {
    width: 10px;
    height: 10px;
    font-size: 6px;
  }
`;