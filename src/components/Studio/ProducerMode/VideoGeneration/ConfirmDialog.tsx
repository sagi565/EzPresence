import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  ConfirmOverlay, 
  ConfirmDialogContainer, 
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
  const [hoveredButton, setHoveredButton] = useState<'cancel' | 'confirm' | null>(null);

  return (
    <>
      {ReactDOM.createPortal(
        <ConfirmOverlay onClick={onCancel} />,
        document.body
      )}
      {ReactDOM.createPortal(
        <ConfirmDialogContainer>
          <ConfirmTitle>Are you sure you want to continue?</ConfirmTitle>
          <ConfirmMessage>
            This will use credits, start video generation, and may take some time—but you'll be notified once it's ready.
          </ConfirmMessage>
          <ConfirmButtons>
            <ConfirmBtn
              $type="cancel"
              $isHovered={hoveredButton === 'cancel'}
              onClick={onCancel}
              onMouseEnter={() => setHoveredButton('cancel')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Cancel
            </ConfirmBtn>
            <ConfirmBtn
              $type="confirm"
              $isHovered={hoveredButton === 'confirm'}
              onClick={onConfirm}
              onMouseEnter={() => setHoveredButton('confirm')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              Generate
            </ConfirmBtn>
          </ConfirmButtons>
        </ConfirmDialogContainer>,
        document.body
      )}
    </>
  );
};

export default ConfirmDialog;