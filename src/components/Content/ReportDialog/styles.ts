import styled, { keyframes } from 'styled-components';

const scaleIn = keyframes`
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 99999;
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Dialog = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
  z-index: 100000;
  max-width: 500px;
  width: 100%;
  animation: ${scaleIn} 0.2s ease-out;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const Description = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};
  margin: 0 0 20px 0;
`;

export const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid ${({ theme }) => theme.colors.border || 'rgba(0,0,0,0.12)'};
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}22;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.muted};
    opacity: 0.6;
  }
`;

export const CharCount = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.muted};
  text-align: right;
  margin-top: 4px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

export const CancelButton = styled.button`
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  border: none;
  background: rgba(107, 114, 128, 0.08);
  color: ${({ theme }) => theme.colors.muted};
  transition: all 0.2s;

  &:hover {
    background: rgba(107, 114, 128, 0.16);
  }
`;

export const SubmitButton = styled.button<{ $loading?: boolean }>`
  padding: 10px 22px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: ${({ $loading }) => $loading ? 'not-allowed' : 'pointer'};
  border: none;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  opacity: ${({ $loading }) => $loading ? 0.7 : 1};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
  }
`;

export const SuccessBanner = styled.div`
  text-align: center;
  padding: 12px 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #16a34a;
`;
