import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  margin-top: 8px;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const CancelBtn = styled.button`
  height: 40px;
  border: 2px solid rgba(155, 93, 229, 0.2);
  border-radius: 12px;
  cursor: pointer;
  color: ${theme.colors.muted};
  background: transparent;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
`;

export const ErrorText = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(155, 93, 229, 0.2);
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  font-size: 15px;
  color: ${theme.colors.muted};
  margin: 0;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  text-align: center;
`;

export const ErrorIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  border: 3px solid #ef4444;
`;

export const ErrorTextLarge = styled.p`
  font-size: 15px;
  font-weight: 500;
  color: #ef4444;
  margin: 0;
  line-height: 1.6;
`;