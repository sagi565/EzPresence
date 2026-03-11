import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

export const SchedulerContainer = styled.div`
  max-width: 88vw;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;

  @media (max-width: 768px) {
    max-width: 100vw;
    padding: 12px;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
`;

export const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid;
  border-color: rgba(155, 93, 229, 0.2);
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingText = styled.p`
  font-size: 16px;
  color: ${theme.colors.muted};
  font-weight: 500;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
  padding: 40px;
`;

export const ErrorIcon = styled.div`
  font-size: 64px;
`;

export const ErrorTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin: 0;
`;

export const ErrorText = styled.p`
  font-size: 16px;
  color: #ef4444;
  text-align: center;
  max-width: 500px;
  line-height: 1.6;
`;

export const RetryButton = styled.button`
  padding: 12px 24px;
  background: ${theme.gradients.innovator};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: ${theme.shadows.primary};

  &:hover {
    transform: translateY(-2px);
  }
`;

export const CalendarLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: ${theme.shadows.md};
`;

export const CalendarErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: ${theme.shadows.md};
`;