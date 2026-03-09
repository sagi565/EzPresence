import React from 'react';
import { 
  ConfirmOverlay, 
  ConfirmDialog, 
  ConfirmTitle, 
  ConfirmMessage, 
  CreditsBold, 
  ConfirmButtons, 
  ConfirmBtn 
} from './styles';

interface NotesConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const NotesConfirmDialog: React.FC<NotesConfirmDialogProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <ConfirmOverlay onClick={onCancel} />
      <ConfirmDialog>
        <ConfirmTitle>Ready to generate?</ConfirmTitle>
        <ConfirmMessage>
          This will use <CreditsBold>200 credits</CreditsBold> from your account. 
          The process usually takes 2-3 minutes.
          {"\n\n"}You can find the result in your Content page once finished.
        </ConfirmMessage>
        <ConfirmButtons>
          <ConfirmBtn onClick={onCancel}>
            Cancel
          </ConfirmBtn>
          <ConfirmBtn $proceed onClick={onConfirm}>
            Proceed
          </ConfirmBtn>
        </ConfirmButtons>
      </ConfirmDialog>
    </>
  );
};

export default NotesConfirmDialog;