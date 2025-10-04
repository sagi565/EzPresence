import React, { useState } from 'react';
import { styles } from './styles';

interface ConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ onConfirm, onCancel }) => {
  const [hoveredButton, setHoveredButton] = useState<'cancel' | 'confirm' | null>(null);

  const cancelStyle = {
    ...styles.confirmBtn,
    ...styles.confirmBtnCancel,
    ...(hoveredButton === 'cancel' ? styles.confirmBtnCancelHover : {}),
  };

  const confirmStyle = {
    ...styles.confirmBtn,
    ...styles.confirmBtnProceed,
    ...(hoveredButton === 'confirm' ? styles.confirmBtnProceedHover : {}),
  };

  return (
    <>
      <div style={styles.confirmOverlay} onClick={onCancel} />
      <div style={styles.confirmDialog}>
        <div style={styles.confirmTitle}>Are you sure you want to continue?</div>
        <div style={styles.confirmMessage}>
          This will use credits, start video generation, and may take some time—but you'll be notified once it's ready.
        </div>
        <div style={styles.confirmButtons}>
          <button
            style={cancelStyle}
            onClick={onCancel}
            onMouseEnter={() => setHoveredButton('cancel')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Cancel
          </button>
          <button
            style={confirmStyle}
            onClick={onConfirm}
            onMouseEnter={() => setHoveredButton('confirm')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            Generate
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;