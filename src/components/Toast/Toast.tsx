import React from 'react';
import { createPortal } from 'react-dom';
import { ToastItem } from '@context/ToastContext';
import { ToastStack, ToastCard, IconBubble, Body, Title, Message, CloseBtn, ProgressBar } from './styles';

const DURATION = 4500;

const TITLES: Record<string, string> = {
  error:   'Something went wrong',
  success: 'Done!',
  info:    'Heads up',
};

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <ToastStack>
      {toasts.map(toast => (
        <ToastCard key={toast.id} $type={toast.type}>
          <IconBubble $type={toast.type}>
            {toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'i'}
          </IconBubble>
          <Body>
            <Title>{TITLES[toast.type]}</Title>
            <Message>{toast.message}</Message>
          </Body>
          <CloseBtn onClick={() => onDismiss(toast.id)} aria-label="Dismiss">✕</CloseBtn>
          <ProgressBar $type={toast.type} $duration={DURATION} />
        </ToastCard>
      ))}
    </ToastStack>,
    document.body
  );
};

export default ToastContainer;
