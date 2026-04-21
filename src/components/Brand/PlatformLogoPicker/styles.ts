import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const PickerColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

export const ChipButton = styled.button<{ $isSelected: boolean; $isConverting: boolean }>`
  position: relative;
  width: ${props => props.$isSelected ? '34px' : '26px'};
  height: ${props => props.$isSelected ? '34px' : '26px'};
  border-radius: 50%;
  padding: 0;
  cursor: ${props => props.$isConverting ? 'wait' : 'pointer'};
  background: transparent;
  border: ${props => props.$isSelected
    ? `2.5px solid ${props.theme.colors.primary}`
    : `1px solid ${props.theme.colors.primary}33`};
  box-shadow: ${props => props.$isSelected
    ? `0 0 0 3px ${props.theme.colors.primary}22`
    : 'none'};
  transition: width 0.2s, height 0.2s, transform 0.2s, border-color 0.2s, box-shadow 0.2s;

  &:hover {
    transform: ${props => props.$isSelected ? 'none' : 'translateY(-1px)'};
    border-color: ${props => props.$isSelected
      ? props.theme.colors.primary
      : `${props.theme.colors.primary}99`};
  }
`;

export const ChipAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
`;

export const SelectedBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${props => props.theme.colors.surface};
  svg { display: block; }
`;

export const SpinnerOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
`;

export const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;
