import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ripple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  overflow-x: hidden;

  ${media.tablet} {
    padding: 24px 20px;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 720px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  padding: 56px 64px;
  box-shadow: 0 24px 64px rgba(155, 93, 229, 0.15);
  border: 2px solid rgba(200, 200, 200, 0.3);
  position: relative;
  z-index: 1;
  animation: ${fadeInUp} 0.5s ease-out;

  ${media.tablet} {
    padding: 40px 24px;
    border-radius: 20px;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 44px;

  ${media.tablet} {
    margin-bottom: 32px;
  }
`;

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 800;
  background: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 14px;
  letter-spacing: -0.5px;
  text-align: center;

  br {
    display: none;
  }

  ${media.tablet} {
    font-size: 32px;
    
    br {
      display: block;
    }
  }
`;

export const Subtitle = styled.p`
  font-size: 17px;
  color: ${theme.colors.muted};
  line-height: 1.6;

  ${media.tablet} {
    font-size: 15px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 48px;

  ${media.tablet} {
    gap: 32px;
  }

  & select {
    transition: border-color 0.2s ease;
  }
  
  & select:hover {
    border-color: rgba(155, 93, 229, 0.35);
  }
  
  & select:focus {
    border-color: rgba(155, 93, 229, 0.4);
    outline: none;
  }
  
  & select option {
    padding: 12px 16px;
    background: white;
    color: #111827;
  }
  
  & select option:checked {
    background: rgba(155, 93, 229, 0.1);
    color: #9b5de5;
  }

  & [style*="overflow"] {
    scrollbar-width: thin;
    scrollbar-color: rgba(155, 93, 229, 0.3) transparent;
  }
  
  & [style*="overflow"]::-webkit-scrollbar {
    width: 6px;
  }
  
  & [style*="overflow"]::-webkit-scrollbar-track {
    background: transparent;
  }
  
  & [style*="overflow"]::-webkit-scrollbar-thumb {
    background: rgba(155, 93, 229, 0.3);
    border-radius: 3px;
  }
  
  & [style*="overflow"]::-webkit-scrollbar-thumb:hover {
    background: rgba(155, 93, 229, 0.5);
  }
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 36px;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(239, 68, 68, 0.08);
  border: 2px solid #ef4444;
  border-radius: 14px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
`;

export const ErrorIcon = styled.span`
  font-size: 20px;
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(20, 184, 166, 0.08);
  border: 2px solid #14b8a6;
  border-radius: 14px;
  color: #14b8a6;
  font-size: 14px;
  font-weight: 500;
`;

export const SuccessIcon = styled.span`
  font-size: 20px;
`;

export const Actions = styled.div`
  display: flex;
  margin-top: 12px;
`;

export const SubmitBtn = styled.button<{ $isSubmitting?: boolean; $isHovered?: boolean; $isActive?: boolean }>`
  flex: 1;
  height: 56px;
  border: none;
  border-radius: 14px;
  background: ${theme.gradients.innovator};
  color: white;
  font-size: 17px;
  font-weight: 700;
  cursor: ${props => props.$isSubmitting ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(155, 93, 229, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  transform: ${props => props.$isActive ? 'translateY(0)' : props.$isHovered ? 'translateY(-1px)' : 'scale(1)'};
  opacity: ${props => props.$isSubmitting ? 0.7 : 1};
  
  ${props => props.$isActive ? `box-shadow: 0 4px 12px rgba(155, 93, 229, 0.2);` : ``}
`;

export const Ripple = styled.span`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: ${ripple} 0.6s ease-out;
  pointer-events: none;
`;

export const Spinner = styled.span<{ $logout?: boolean }>`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;

  ${props => props.$logout && `
    border-color: rgba(239, 68, 68, 0.3);
    border-top-color: #ef4444;
  `}
`;

export const PrivacyNote = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${theme.colors.muted};
  margin-top: 8px;

  ${media.tablet} {
    font-size: 13px;
  }
`;

export const LogoutButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: transparent;
  border: none;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ef4444;
  cursor: pointer;
  z-index: 50;
  border-radius: 50%;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
  }

  ${media.tablet} {
    top: 16px;
    right: 16px;
  }
`;