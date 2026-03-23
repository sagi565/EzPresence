import styled from 'styled-components';
// theme import removed to use dynamic props.theme

export const DateNavContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.primary}33;
  border-radius: 16px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  box-shadow: 0 4px 16px ${props => props.theme.colors.primary}1A;
  
  @media (max-width: 768px) {
    padding: 8px 10px;
    gap: 4px;
    border-radius: 12px;
  }
`;

export const DateLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DateControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    gap: 4px;
    flex: 1;
  }
`;

export const NavArrowBtn = styled.button<{ $isHovered?: boolean }>`
  background: ${props => props.$isHovered ? `${props.theme.colors.primary}1A` : 'transparent'};
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
  color: ${props => props.theme.colors.muted};
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  position: relative;

  @media (max-width: 768px) {
    padding: 6px;
  }
`;

export const MonthYearDisplayContainer = styled.div<{ $isHovered?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  min-width: 180px;
  justify-content: center;
  background: ${props => props.$isHovered ? `${props.theme.colors.primary}1A` : 'transparent'};

  @media (max-width: 768px) {
    font-size: 13px;
    min-width: auto;
    padding: 4px 6px;
    gap: 4px;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: ${props => props.theme.colors.primary}1A;
  border-radius: 10px;
  padding: 4px;

  @media (max-width: 768px) {
    padding: 2px;
    border-radius: 8px;
  }
`;

export const ViewBtn = styled.button<{ $isActive?: boolean }>`
  width: 40px;
  height: 36px;
  border: none;
  background: ${props => props.$isActive ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$isActive ? 'white' : props.theme.colors.muted};
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  outline: none;
  ${props => props.$isActive && `box-shadow: 0 4px 12px ${props.theme.colors.primary}40;`}

  @media (max-width: 768px) {
    width: 32px;
    height: 28px;
    font-size: 14px;
    border-radius: 6px;
  }
`;

export const TooltipDesc = styled.div<{ $isTop?: boolean }>`
  position: absolute;
  bottom: ${props => props.$isTop ? 'auto' : '-32px'};
  top: ${props => props.$isTop ? '-32px' : 'auto'};
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.colors.text};
  color: ${props => props.theme.colors.bg};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1000;
`;

export const CreateBtnContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const CreateBtn = styled.button<{ $isHovered?: boolean }>`
  background: ${props => props.theme.gradients.innovator};
  color: white;
  border: 0px solid transparent;
  padding: 10px 16px;
  border-radius: 12px;
  font-weight: bold;
  letter-spacing: 0.6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  font-size: 14px;
  outline: none;
  ${props => props.$isHovered && `
    transform: scale(1.07);
    box-shadow: 0 6px 20px ${props.theme.colors.primary}66;
  `}

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 8px;
    letter-spacing: 0px;
  }
`;

export const DropdownMenu = styled.div<{ $isFixed?: boolean; $top?: number; $left?: number }>`
  ${props => props.$isFixed ? `
    position: fixed;
    top: ${props.$top}px;
    left: ${props.$left}px;
    z-index: 1750;
    animation: dropdownAppear 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  ` : `
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 8px;
    z-index: 100;
  `}
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 8px;
  min-width: 200px;
  border: 1px solid ${props => props.theme.colors.primary}1A;
`;

export const DropdownItemRow = styled.div<{ $isHovered?: boolean; $isAi?: boolean }>`
  padding: 12px 16px;
  border-radius: 8px;
  cursor: ${props => props.$isAi ? 'default' : 'pointer'};
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  ${props => props.$isHovered && !props.$isAi && `
    background: ${props.theme.gradients.balance};
    color: white;
  `}
  ${props => props.$isAi && `
    opacity: 0.6;
    position: relative;
  `}
`;

export const AiBadge = styled.span`
  font-size: 9px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  padding: 2px 8px;
  border-radius: 6px;
  margin-left: auto;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
`;

export const MiniCalWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: ${props => props.theme.shadows.lg};
  padding: 16px;
  z-index: 100;
  border: 1px solid ${props => props.theme.colors.primary}1A;
  min-width: 280px;
`;

export const MiniCalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const MiniCalNavBtn = styled.button`
  background: transparent;
  border: none;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  padding: 4px 8px;
  color: ${props => props.theme.colors.primary};
  transition: all 0.2s;
  border-radius: 6px;
  outline: none;
`;

export const MiniCalMonthYear = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const MiniCalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 30px);
  gap: 4px;
  justify-content: center;
`;

export const MiniCalDayHeader = styled.div`
  font-weight: bold;
  font-size: 10px;
  text-align: center;
  color: ${props => props.theme.colors.muted};
`;

export const MiniCalDay = styled.div<{ $isToday?: boolean; $isHovered?: boolean }>`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
  
  ${props => props.$isToday && `
    background: ${props.theme.colors.primary}26;
    color: ${props.theme.colors.primary};
    font-weight: bold;
    border: 2px solid ${props.theme.colors.primary};
  `}
  
  ${props => props.$isHovered && !props.$isToday && `
    background: ${props.theme.colors.secondary};
    color: white;
  `}
`;