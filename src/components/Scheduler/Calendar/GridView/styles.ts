import styled from 'styled-components';
import { theme } from '@theme/theme';

export const CalendarGridWrapper = styled.div`
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

export const CalendarHeaderRow = styled.div`
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
  text-align: center;
  font-weight: 600;
  color: #4b5563;
  background: white;
  font-size: 14px;
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 8px 4px;
    
    /* Hide full names and show truncated on mobile via JS, but we can also use CSS text-overflow */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const CalendarBodyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: ${theme.colors.surface};
  flex: 1;
  
  /* grid-template-rows is applied dynamically inline */
`;

export const CalendarDayCell = styled.div<{ 
  $isOtherMonth?: boolean; 
  $isPast?: boolean; 
  $isToday?: boolean; 
  $isDragOver?: boolean;
}>`
  background: ${props => props.$isOtherMonth ? 'rgba(245, 245, 250, 0.6)' 
    : props.$isPast ? 'rgba(249, 250, 251, 0.5)' 
    : props.$isDragOver ? 'rgba(155, 93, 229, 0.1)' 
    : props.$isToday ? 'rgba(155, 93, 229, 0.05)' 
    : 'white'};
    
  border: ${props => props.$isDragOver ? '2px dashed rgba(155, 93, 229, 0.6)'
    : props.$isToday ? '2px solid rgba(155, 93, 229, 0.2)'
    : '1px solid transparent'};
    
  padding: 8px;
  position: relative;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100px;
  
  &:hover {
    background: ${props => props.$isDragOver ? 'rgba(155, 93, 229, 0.1)' : 
      props.$isPast || props.$isToday ? undefined : 'rgba(155, 93, 229, 0.02)'};
    border: ${props => props.$isDragOver ? '2px dashed rgba(155, 93, 229, 0.6)' : 
      props.$isPast || props.$isToday ? undefined : '1px dashed rgba(155, 93, 229, 0.4)'};
  }
  
  @media (max-width: 768px) {
    padding: 4px;
    min-height: 80px;
  }
`;

export const DayNumber = styled.div<{ $isToday?: boolean; $isOtherMonth?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$isOtherMonth ? '#c0c0c8' : theme.colors.text};
  text-align: center;
  margin-bottom: ${props => props.$isOtherMonth ? '4px' : '6px'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const DayCircle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  background-color: ${theme.colors.primary};
  color: white;
  border-radius: 50%;
  margin: 0 auto;
  line-height: 1;
`;

export const MonthLabel = styled.span`
  display: block;
  font-size: 10px;
  font-weight: 500;
  color: #b0b0bc;
  text-align: center;
  letter-spacing: 0.02em;
  margin-top: 1px;
  line-height: 1.2;
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

export const PostItemContainer = styled.div`
  background: ${theme.colors.surface};
  border-radius: 6px;
  padding: 6px 8px;
  margin-bottom: 4px;
  font-size: 11px;
  box-shadow: ${theme.shadows.sm};
  cursor: pointer;
  transition: all 0.2s;
  min-width: 0;
  border-left: 3px solid transparent;
  
  @media (max-width: 768px) {
    padding: 4px 6px;
    margin-bottom: 2px;
  }
`;

export const PostFirstLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
`;

export const PostLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

export const PostRight = styled.div`
  margin-left: auto;
  display: flex;
  gap: 3px;
  align-items: center;
`;

export const StatusIndicator = styled.div<{ $status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  cursor: pointer;
  
  background: ${props => props.$status === 'SUCCESS' ? '#22c55e' : props.$status === 'FAILED' ? '#ef4444' : 'white'};
  border: ${props => props.$status === 'SCHEDULED' ? '1.7px solid black' : props.$status === 'DRAFT' ? '2.2px dotted #4b5563' : 'none'};
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

export const BlackTooltip = styled.div`
  position: absolute;
  top: -30px;
  transform: translateX(-37%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
`;

export const PostTime = styled.span`
  font-weight: 600;
  color: ${theme.colors.text};
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

export const MediaIcon = styled.div`
  font-size: 12px;
  
  @media (max-width: 768px) {
    display: none; /* Hide on mobile to save space */
  }
`;

export const PostTitleWrapper = styled.div`
  font-weight: 700;
  color: ${theme.colors.text};
  font-size: 11px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (max-width: 768px) {
    font-size: 9px;
  }
`;

export const PlatformIcon = styled.img`
  width: 14px;
  height: 14px;
  object-fit: contain;
  
  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
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
  letter-spacing: 0.1px;
  
  background: ${props => props.$platform === 'yt' ? '#ff0033' 
    : props.$platform === 'ig' ? theme.gradients.vibe 
    : props.$platform === 'tt' ? theme.colors.text 
    : theme.colors.blue};
    
  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
    font-size: 7px;
  }
`;