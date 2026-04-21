import React from 'react';
import ReactDOM from 'react-dom';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Overlay, Dialog, IconWrap, Title, Message, ButtonGroup, Button } from './styles';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  danger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <Overlay onClick={onCancel} />
      <Dialog>
        <IconWrap $danger={danger}>
          {danger ? <Trash2 size={22} /> : <AlertTriangle size={22} />}
        </IconWrap>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button $danger={danger} $primary={!danger} onClick={onConfirm}>{confirmText}</Button>
        </ButtonGroup>
      </Dialog>
    </>,
    document.body
  );
};

export default ConfirmDialog;
