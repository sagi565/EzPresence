import React from 'react';
import ReactDOM from 'react-dom';
import { Sparkles } from 'lucide-react';
import {
  ConfirmOverlay,
  ConfirmDialogContainer,
  ConfirmIconWrap,
  ConfirmTitle,
  ConfirmMessage,
  ConfirmButtons,
  ConfirmBtn
} from './styles';

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ onConfirm, onCancel }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <ConfirmOverlay onClick={onCancel} />,
        document.body
      )}
      {ReactDOM.createPortal(
        <ConfirmDialogContainer>
          <ConfirmIconWrap>
            <Sparkles size={22} />
          </ConfirmIconWrap>
          <ConfirmTitle>Are you sure you want to continue?</ConfirmTitle>
          <ConfirmMessage>
            This will use credits, start video generation, and may take some time—but you'll be notified once it's ready.
          </ConfirmMessage>
          <ConfirmButtons>
            <ConfirmBtn $variant="cancel" onClick={onCancel}>Cancel</ConfirmBtn>
            <ConfirmBtn $variant="confirm" onClick={onConfirm}>Generate</ConfirmBtn>
          </ConfirmButtons>
        </ConfirmDialogContainer>,
        document.body
      )}
    </>
  );
};

export default ConfirmDialog;
