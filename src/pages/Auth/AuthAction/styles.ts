import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeInScale = keyframes`
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.gradients.background};
  padding: 24px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 48px;
  box-shadow: ${theme.shadows.lg};
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 2px solid ${theme.colors.primary};

  ${media.tablet} {
    padding: 32px 20px;
    max-width: 100%;
    width: auto;
    margin: 0 16px;
    box-shadow: none;
  }
`;

export const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(155, 93, 229, 0.2);
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto 24px;
`;

export const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${theme.gradients.balance};
  color: white;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: ${fadeInScale} 0.5s ease;
`;

export const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  font-size: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  animation: ${fadeInScale} 0.5s ease;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  background-image: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;

  ${media.tablet} {
    font-size: 24px;
  }
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${theme.colors.muted};
  line-height: 1.6;
  margin-bottom: 24px;

  ${media.tablet} {
    font-size: 15px;
  }
`;

export const ErrorText = styled.p`
  font-size: 15px;
  color: #ef4444;
  line-height: 1.6;
  margin-bottom: 24px;
`;

export const AutoCloseMessage = styled.p`
  font-size: 13px;
  color: ${theme.colors.muted};
  font-style: italic;
  margin-top: 16px;
`;

export const Button = styled.button`
  padding: 14px 28px;
  background: ${theme.gradients.innovator};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: ${theme.shadows.primary};
`;