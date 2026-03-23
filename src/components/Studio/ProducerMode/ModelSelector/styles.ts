import styled, { css } from 'styled-components';
// import { theme } from '@theme/theme'; // Removed direct import to use dynamic ThemeProvider instead

export const SelectorContainer = styled.div`
  position: relative;
  display: inline-block;
`;

export const ModelButton = styled.button<{ $type: 'veo3' | 'veo2'; $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border: 2px solid rgba(155, 93, 229, 0.2);
  border-radius: 12px;
  font-weight: 550;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 140px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  color: ${props => props.theme.colors.text};
  background: transparent;

  ${props => props.$type === 'veo3' ? css`
    background: linear-gradient(135deg, rgba(155, 93, 229, 0.1) 0%, rgba(251, 191, 36, 0.1) 30%, rgba(245, 158, 11, 0.1) 70%, rgba(217, 119, 6, 0.1) 100%);
    &:hover {
      box-shadow: 0 6px 25px rgba(251, 191, 36, 0.5), 0 0 20px rgba(155, 93, 229, 0.4);
      transform: translateY(-2px);
    }
  ` : css`
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%);
    &:hover {
      box-shadow: 0 6px 25px rgba(59, 130, 246, 0.4), 0 0 20px rgba(236, 72, 153, 0.3);
      transform: translateY(-2px);
    }
  `}

  ${props => props.$isOpen && css`
    transform: translateY(-2px);
  `}
`;

export const Arrow = styled.span<{ $isOpen: boolean }>`
  margin-left: auto;
  transition: transform 0.3s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 360px;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 15px 35px rgba(155, 93, 229, 0.2);
  z-index: 100;
  
  /* Animation */
  opacity: ${props => props.$isOpen ? 1 : 0};
  transform: ${props => props.$isOpen ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const Option = styled.div<{ $selected: boolean; $type: 'veo3' | 'veo2' }>`
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 6px;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  ${props => props.$type === 'veo3' ? css`
    background: linear-gradient(135deg, rgba(155, 93, 229, 0.1) 0%, rgba(251, 191, 36, 0.1) 30%, rgba(245, 158, 11, 0.1) 70%, rgba(217, 119, 6, 0.1) 100%);
    color: ${props => props.theme.colors.text};
    border-color: rgba(251, 191, 36, 0.3);

    &:hover {
      background: linear-gradient(135deg, rgba(155, 93, 229, 0.25) 0%, rgba(251, 191, 36, 0.25) 30%, rgba(245, 158, 11, 0.25) 70%, rgba(217, 119, 6, 0.25) 100%);
    }

    ${props.$selected && css`
      background: linear-gradient(135deg, rgba(155, 93, 229, 0.2) 0%, rgba(251, 191, 36, 0.2) 30%, rgba(245, 158, 11, 0.2) 70%, rgba(217, 119, 6, 0.2) 100%);
      border-color: #fbbf24;
    `}
  ` : css`
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%);
    color: ${props => props.theme.colors.text};

    &:hover {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.13) 0%, rgba(147, 51, 234, 0.13) 50%, rgba(236, 72, 153, 0.13) 100%);
    }

    ${props.$selected && css`
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(147, 51, 234, 0.2) 50%, rgba(236, 72, 153, 0.2) 100%);
      border-color: #9333ea;
    `}
  `}
`;

export const OptionTitle = styled.div`
  font-weight: 700;
  margin-bottom: 4px;
  fontSize: 15px;
`;

export const OptionDesc = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.muted};
  line-height: 1.4;
`;