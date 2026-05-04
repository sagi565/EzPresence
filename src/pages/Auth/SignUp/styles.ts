import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.blue};
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export const FooterText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const PrimaryBtn = styled.button`
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #fff;
  background-image: ${props => props.theme.gradients.innovator};
  box-shadow: ${props => props.theme.shadows.primary};
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 16px;
  font-weight: 700;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const Separator = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: 16px 0;
  color: ${props => props.theme.colors.muted};
`;

export const ErrorText = styled.div`
  background: ${props => props.theme.colors.primary}1A;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.primary}33;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
`;
