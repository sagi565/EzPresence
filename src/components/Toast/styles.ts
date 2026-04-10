import styled, { keyframes } from 'styled-components';
import { ToastType } from '@context/ToastContext';

const slideIn = keyframes`
  from {
    transform: translateX(110%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const shrink = keyframes`
  from { width: 100%; }
  to   { width: 0%; }
`;

const typeConfig: Record<ToastType, { border: string; icon: string; iconBg: string }> = {
  error:   { border: '#ef4444', icon: '✕',  iconBg: 'rgba(239,68,68,0.15)' },
  success: { border: '#22c55e', icon: '✓',  iconBg: 'rgba(34,197,94,0.15)' },
  info:    { border: '#3b82f6', icon: 'ℹ',  iconBg: 'rgba(59,130,246,0.15)' },
};

export const ToastStack = styled.div`
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
`;

export const ToastCard = styled.div<{ $type: ToastType }>`
  pointer-events: all;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 300px;
  max-width: 380px;
  padding: 14px 16px;
  border-radius: 12px;
  background: #1e1e2e;
  border-left: 3px solid ${({ $type }) => typeConfig[$type].border};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  overflow: hidden;
  position: relative;
`;

export const IconBubble = styled.div<{ $type: ToastType }>`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $type }) => typeConfig[$type].iconBg};
  color: ${({ $type }) => typeConfig[$type].border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  margin-top: 1px;
`;

export const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #f1f1f1;
  line-height: 1.3;
`;

export const Message = styled.div`
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
  line-height: 1.4;
`;

export const CloseBtn = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  font-size: 14px;
  line-height: 1;
  padding: 2px;
  margin-top: 1px;
  transition: color 0.15s;

  &:hover {
    color: #e5e7eb;
  }
`;

export const ProgressBar = styled.div<{ $type: ToastType; $duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: ${({ $type }) => typeConfig[$type].border};
  opacity: 0.5;
  animation: ${shrink} ${({ $duration }) => $duration}ms linear forwards;
`;
