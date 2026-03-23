import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  z-index: 50000;
  gap: 12px;
`;

export const StyledLink = styled(Link)`
  color: ${props => props.theme.colors.blue};
  text-decoration: none;
  font-weight: 600;
`;

export const ForgotLink = styled(Link)`
  margin-top: 4px;
  margin-bottom: 12px;
  color: ${props => props.theme.colors.blue};
  text-decoration: none;
  font-weight: 500;
  align-self: flex-end;
  font-size: 14px;
`;

export const PrimaryBtn = styled.button`
  font-size: 16px;
  font-weight: 700;
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #fff;
  background-image: ${props => props.theme.gradients.innovator};
  box-shadow: ${props => props.theme.shadows.primary};
  transition: transform 0.2s, box-shadow 0.2s;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const OrContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 20px 0;
`;

export const Line = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.muted};
  flex: 1;
`;

export const OrText = styled.span`
  margin: 0 12px;
  color: ${props => props.theme.colors.muted};
  font-size: 14px;
  white-space: nowrap;
`;

export const ErrorText = styled.div`
  background: ${props => props.theme.colors.primary}1A;
  color: ${props => props.theme.colors.text};
  border: 1px solid ${props => props.theme.colors.primary}33;
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 14px;
`;

export const SuccessMessage = styled.div`
  background: ${props => props.theme.colors.teal}1A;
  color: ${props => props.theme.colors.teal};
  border: 1px solid ${props => props.theme.colors.teal}33;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
`;