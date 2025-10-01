import React from 'react';
import { styles } from './styles';

interface ConfirmationDialogProps {
  price: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ price, onConfirm, onCancel }) => {
  return (
    <>
      <div style={{ ...styles.focusOverlay, zIndex: 2999 }} onClick={onCancel} />
      <div style={styles.confirmDialog}>
        <div style={styles.confirmTitle}>Are you sure you want to continue?</div>
        <div style={styles.confirmMessage}>
          This will use {price.toLocaleString()} credits, start video generation, and may take some time—but you'll be notified once it's ready.
        </div>
        <div style={styles.confirmButtons}>
          <button style={{ ...styles.confirmBtn, ...styles.confirmBtnCancel }} onClick={onCancel}>
            Cancel
          </button>
          <button style={{ ...styles.confirmBtn, ...styles.confirmBtnProceed }} onClick={onConfirm}>
            Generate
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmationDialog;