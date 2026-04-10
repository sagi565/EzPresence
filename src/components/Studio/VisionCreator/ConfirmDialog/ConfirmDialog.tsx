import React from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Dialog, IconWrap, Title, Message, Buttons, Btn } from './styles';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  danger = false, onConfirm, onCancel,
}) => ReactDOM.createPortal(
  <>
    <Overlay onClick={onCancel} />
    <Dialog>
      <IconWrap $danger={danger}>
        {danger ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        )}
      </IconWrap>
      <Title>{title}</Title>
      <Message>{message}</Message>
      <Buttons>
        <Btn onClick={onCancel}>{cancelLabel}</Btn>
        <Btn $danger={danger} $primary={!danger} onClick={onConfirm}>{confirmLabel}</Btn>
      </Buttons>
    </Dialog>
  </>,
  document.body
);

export default ConfirmDialog;
