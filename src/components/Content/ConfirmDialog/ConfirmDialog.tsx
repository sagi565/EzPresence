import React from 'react';
import ReactDOM from 'react-dom';
import { 
  Overlay, 
  Dialog, 
  Title, 
  Message, 
  ButtonGroup, 
  Button 
} from './styles';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Overlay onClick={onCancel}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <button
            style={{ border: 'none', background: 'transparent', padding: 0 }}
            onClick={onCancel}
          >
            <Button $variant="cancel">
              {cancelText}
            </Button>
          </button>
          <button
            style={{ border: 'none', background: 'transparent', padding: 0 }}
            onClick={onConfirm}
          >
            <Button $variant="confirm">
              {confirmText}
            </Button>
          </button>
        </ButtonGroup>
      </Dialog>
    </Overlay>,
    document.body
  );
};

export default ConfirmDialog;