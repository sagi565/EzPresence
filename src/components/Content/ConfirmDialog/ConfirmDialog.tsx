import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles';

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
  const [hoveredButton, setHoveredButton] = useState<'cancel' | 'confirm' | null>(null);

  if (!isOpen) return null;

  const cancelStyle = {
    ...styles.btn,
    ...styles.btnCancel,
    ...(hoveredButton === 'cancel' ? styles.btnCancelHover : {}),
  };

  const confirmStyle = {
    ...styles.btn,
    ...styles.btnConfirm,
    ...(hoveredButton === 'confirm' ? styles.btnConfirmHover : {}),
  };

  return ReactDOM.createPortal(
    <div style={styles.overlay} onClick={onCancel}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.title}>{title}</div>
        <div style={styles.message}>{message}</div>
        <div style={styles.buttonGroup}>
          <button
            style={cancelStyle}
            onClick={onCancel}
            onMouseEnter={() => setHoveredButton('cancel')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {cancelText}
          </button>
          <button
            style={confirmStyle}
            onClick={onConfirm}
            onMouseEnter={() => setHoveredButton('confirm')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;