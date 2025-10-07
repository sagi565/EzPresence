import React, { useState, useEffect } from 'react';
import NotesModalHeader from './NotesModalHeader';
import NotesModalBody from './NotesModalBody';
import NotesModalFooter from './NotesModalFooter';
import NotesConfirmDialog from './NotesConfirmDialog';
import NotesCelebration from './NotesCelebration';
import { styles } from './styles';

interface NotesModalProps {
  onClose: () => void;
}

interface SelectedOptions {
  theme: string | null;
  logo: string;
  sound: string;
}

const NotesModal: React.FC<NotesModalProps> = ({ onClose }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    theme: null,
    logo: 'none',
    sound: 'none',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [errors, setErrors] = useState({ text: false, theme: false });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !showConfirm) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose, showConfirm]);

  const handleGenerate = () => {
    let hasErrors = false;
    const newErrors = { text: false, theme: false };

    if (!textInput.trim()) {
      newErrors.text = true;
      hasErrors = true;
    }

    if (!selectedOptions.theme) {
      newErrors.theme = true;
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      setTimeout(() => {
        setErrors({ text: false, theme: false });
      }, 2000);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      onClose();
    }, 2000);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !showConfirm) {
      onClose();
    }
  };

  return (
    <>
      <div
        style={{
          ...styles.modalOverlay,
          ...(showConfirm ? { zIndex: 2999 } : {}),
        }}
        onClick={handleOverlayClick}
      >
        <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
          <NotesModalHeader onClose={onClose} />
          <NotesModalBody
            textInput={textInput}
            setTextInput={setTextInput}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            errors={errors}
          />
          <NotesModalFooter onGenerate={handleGenerate} />
        </div>
      </div>

      {showConfirm && (
        <NotesConfirmDialog onConfirm={handleConfirm} onCancel={handleCancel} />
      )}

      {showCelebration && <NotesCelebration />}
    </>
  );
};

export default NotesModal;