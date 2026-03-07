import styled from 'styled-components';
import { theme } from '@theme/theme';

export const Wrapper = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.span`
  font-size: 13px;
  color: ${theme.colors.muted};
`;

export const PasswordWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  outline: none;
  padding: 0 44px 0 12px;
  background: ${theme.colors.surface};
  font-size: 14px;
`;

export const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.muted};
`;

export const EyeIcon = styled.img`
  width: 24px;
  height: 24px;
  object-fit: contain;
`;