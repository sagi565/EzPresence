import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import CelebrationAnimation from './CelebrationAnimation';
import { styles } from './styles';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({ onClick, isGenerating }) => {
  const [isHovered, setIsHovered] = useState(false);
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
    }, 2000);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  const buttonStyle = {
    ...styles.generateBtn,
    ...(isHovered ? styles.generateBtnHover : {}),
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
          onMouseLeave={() => setIsHovered(false)}
          disabled={isGenerating}
        >
          <span style={styles.generateBtnIcon}>▶</span>
          <span>Generate!</span>
        </button>
      </div>

      {showConfirm && (
        <ConfirmDialog
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}

      {showCelebration && <CelebrationAnimation />}
    </>
  );
};

export default GenerateButton;