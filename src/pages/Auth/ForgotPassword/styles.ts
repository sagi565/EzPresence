import styled from 'styled-components';
import { theme } from '@theme/theme';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledLink = styled.span`
  color: ${theme.colors.blue};
  text-decoration: none;
  font-weight: 600;
`;

export const PrimaryBtn = styled.button`
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #fff;
  background-image: ${theme.gradients.innovator};
  box-shadow: ${theme.shadows.primary};
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 16px;
  font-weight: 700;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const NoticeText = styled.div`
  background: ${theme.colors.primaryLight};
  color: ${theme.colors.text};
  border: 1px solid rgba(155, 93, 229, 0.25);
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
`;

export const ErrorText = styled.div`
  background: ${theme.colors.primaryLight};
  color: ${theme.colors.text};
  border: 1px solid rgba(155, 93, 229, 0.2);
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
`;
