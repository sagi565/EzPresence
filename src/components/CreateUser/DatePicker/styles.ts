import styled from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

const arrowSvg = `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%239B5DE5' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Required = styled.span`
  color: #ef4444;
  font-size: 16px;
`;

export const SelectGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;

  ${media.phone} {
    grid-template-columns: 0.8fr 1.4fr 0.8fr;
    gap: 12px;
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const Select = styled.div<{ $isOpen?: boolean; $isError?: boolean }>`
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 40px 0 16px;
  border: 2px solid;
  border-color: ${props => props.$isError ? '#ef4444' : props.$isOpen ? 'rgba(155, 93, 229, 0.35)' : 'rgba(155, 93, 229, 0.2)'};
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  background: ${props => props.$isError ? 'rgba(239, 68, 68, 0.03)' : 'white'};
  color: ${theme.colors.text};
  font-family: inherit;
  cursor: pointer;
  background-image: ${arrowSvg};
  background-repeat: no-repeat;
  background-position: right 14px center;
  width: 100%;

  ${media.phone} {
    padding: 0 32px 0 12px;
    background-position: right 10px center;
    font-size: 14px;
  }
`;

export const SelectedText = styled.span`
  color: ${theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  background: transparent;
  color: ${theme.colors.text};
  font-family: inherit;
  width: 100%;
  padding: 0;

  ${media.phone} {
    font-size: 14px;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid rgba(155, 93, 229, 0.15);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
`;

export const DropdownList = styled.div`
  max-height: 240px;
  overflow-y: auto;
  padding: 6px 0;
`;

export const Option = styled.div<{ $isHighlighted?: boolean; $isSelected?: boolean }>`
  padding: 10px 16px;
  font-size: 15px;
  color: ${theme.colors.text};
  cursor: pointer;
  transition: background 0.15s;
  background: ${props => props.$isSelected ? 'rgba(155, 93, 229, 0.12)' : props.$isHighlighted ? 'rgba(155, 93, 229, 0.08)' : 'transparent'};

  &:hover {
    background: rgba(155, 93, 229, 0.08);
  }

  ${media.phone} {
    font-size: 14px;
    padding: 12px 12px;
  }
`;

export const NoResults = styled.div`
  padding: 12px 16px;
  font-size: 14px;
  color: ${theme.colors.muted};
  text-align: center;
`;

export const ErrorText = styled.span`
  font-size: 13px;
  color: #ef4444;
  marginTop: 2px;
`;