import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import CelebrationAnimation from './CelebrationAnimation';
import { styles } from './styles';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  onClose?: () => void;  // Add this prop
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isGenerating, onClose }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    onClick();
    setShowCelebration(true);
    setTimeout(() => {
      setShowCelebration(false);
      // Close the dialog after celebration
      if (onClose) {
        onClose();
      }
    }, 2000);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  // merge base + hover + active styles
  const buttonStyle = {
    ...styles.generateBtn,
    ...(isHovered ? styles.generateBtnHover : {}),
    ...(isActive ? styles.generateBtnActive : {}),
  };

  // shimmering bar (like ::before)
  const beforeStyle = {
    ...styles.generateBtnBefore,
    left: isHovered ? '100%' : '-100%',
  };

  return (
    <>
      <div
        className="generate-button-wrapper"
        style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px' }}
      >
        <button
          style={buttonStyle}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setIsActive(false);
          }}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          disabled={isGenerating}
        >
          <span style={beforeStyle} />
          <span style={styles.generateBtnIcon}>▶</span>
          <span>Generate!</span>
        </button>
      </div>

      {showConfirm && (
        <ConfirmDialog onConfirm={handleConfirm} onCancel={handleCancel} />
      )}

      {showCelebration && <CelebrationAnimation />}
    </>
  );
};

export default GenerateButton;