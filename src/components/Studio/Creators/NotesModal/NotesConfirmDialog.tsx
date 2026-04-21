import React from 'react';
import ReactDOM from 'react-dom';
import { Sparkles } from 'lucide-react';
import {
  ConfirmOverlay,
  ConfirmDialog,
  ConfirmIconWrap,
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
      {ReactDOM.createPortal(
        <ConfirmOverlay onClick={onCancel} />,
        document.body
      )}
      {ReactDOM.createPortal(
        <ConfirmDialog>
          <ConfirmIconWrap>
            <Sparkles size={22} />
          </ConfirmIconWrap>
          <ConfirmTitle>Ready to generate?</ConfirmTitle>
          <ConfirmMessage>
            This will use <CreditsBold>200 credits</CreditsBold> from your account.{' '}
            The process usually takes 2-3 minutes.{'\n\n'}You can find the result in your Content page once finished.
          </ConfirmMessage>
          <ConfirmButtons>
            <ConfirmBtn onClick={onCancel}>Cancel</ConfirmBtn>
            <ConfirmBtn $proceed onClick={onConfirm}>Proceed</ConfirmBtn>
          </ConfirmButtons>
        </ConfirmDialog>,
        document.body
      )}
    </>
  );
};

export default NotesConfirmDialog;
