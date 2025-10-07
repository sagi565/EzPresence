import React, { useState } from 'react';
import { styles } from './styles';

interface NotesConfirmDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const NotesConfirmDialog: React.FC<NotesConfirmDialogProps> = ({
  onConfirm,
  onCancel,
}) => {
  const [hoveredBtn, setHoveredBtn] = useState<'cancel' | 'proceed' | null>(null);

  return (
    <>
      <div style={styles.confirmOverlay} onClick={onCancel} />
      <div style={styles.confirmDialog}>
        <div style={styles.confirmTitle}>Are you sure you want to continue?</div>
        <div style={styles.confirmMessage}>
          This will use <span style={styles.creditsBold}>200 credits</span>, start video
          generation, and may take some time—but you'll be notified once it's ready.
        </div>
        <div style={styles.confirmButtons}>
          <button
            style={{
              ...styles.confirmBtn,
              ...styles.confirmBtnCancel,
              ...(hoveredBtn === 'cancel' ? styles.confirmBtnCancelHover : {}),
            }}
            onClick={onCancel}
            onMouseEnter={() => setHoveredBtn('cancel')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.confirmBtn,
              ...styles.confirmBtnProceed,
              ...(hoveredBtn === 'proceed' ? styles.confirmBtnProceedHover : {}),
            }}
            onClick={onConfirm}
            onMouseEnter={() => setHoveredBtn('proceed')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            Generate
          </button>
        </div>
      </div>
    </>
  );
};

export default NotesConfirmDialog;