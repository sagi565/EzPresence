import styled from 'styled-components';
import { theme } from '@theme/theme';

export const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
`;

export const NewChatBtn = styled.button`
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #374151;
  border-radius: 12px;
  color: #374151;
  fontWeight: 400;
  fontSize: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    background: rgba(55, 65, 81, 0.05);
    border-color: #111827;
    color: #111827;
  }
`;