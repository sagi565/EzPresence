import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: center;
`;

export const EmailDisplay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(155, 93, 229, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(155, 93, 229, 0.15);
`;

export const EmailIcon = styled.span`
  font-size: 24px;
`;

export const EmailText = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const Instructions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const InstructionText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${theme.colors.muted};
  margin: 0;
  text-align: left;
`;

export const NoteText = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: ${theme.colors.primary};
  margin: 12px 0 0 0;
  padding: 12px;
  background: rgba(155, 93, 229, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(155, 93, 229, 0.15);
`;

export const SuccessMessage = styled.div`
  background: rgba(20, 184, 166, 0.1);
  color: ${theme.colors.teal};
  border: 1px solid rgba(20, 184, 166, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 500;
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ResendButton = styled.button`
  height: 44px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #fff;
  background-image: ${theme.gradients.innovator};
  box-shadow: ${theme.shadows.primary};
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 15px;
  font-weight: 600;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const LogoutButton = styled.button`
  height: 44px;
  border: 2px solid rgba(155, 93, 229, 0.2);
  border-radius: 12px;
  cursor: pointer;
  color: ${theme.colors.muted};
  background: transparent;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
`;

export const CheckingStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-top: 12px;
  font-size: 13px;
  color: ${theme.colors.muted};
`;

export const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(155, 93, 229, 0.2);
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;  