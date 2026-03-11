import React, { useState } from 'react';
import ConfirmDialog from './ConfirmDialog';
import CelebrationAnimation from './CelebrationAnimation';
import { GenerateBtnWrapper, StyledGenerateBtn, ShimmerBar, BtnIcon } from './styles';

interface GenerateButtonProps {
  onClick: () => void;
  isGenerating: boolean;
  onClose?: () => void;
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
      if (onClose) {
        onClose();
      }
    }, 2000);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <GenerateBtnWrapper>
        <StyledGenerateBtn
          $isHovered={isHovered}
          $isActive={isActive}
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
          <ShimmerBar $isHovered={isHovered} />
          <BtnIcon>▶</BtnIcon>
          <span>Generate!</span>
        </StyledGenerateBtn>
      </GenerateBtnWrapper>

      {showConfirm && (
        <ConfirmDialog onConfirm={handleConfirm} onCancel={handleCancel} />
      )}

      {showCelebration && <CelebrationAnimation />}
    </>
  );
};

export default GenerateButton;