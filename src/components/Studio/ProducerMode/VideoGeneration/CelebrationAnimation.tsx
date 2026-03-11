import React, { useEffect, useState } from 'react';
import { 
  CelebrationWrapper, 
  CelebrationContent, 
  CelebrationIcon, 
  CelebrationText, 
  ConfettiPiece 
} from './styles';

const CelebrationAnimation: React.FC = () => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: string; size: string; color: string }>>([]);

  useEffect(() => {
    const colors = ['#9b5de5', '#3b82f6', '#ec4899', '#2563eb', '#14b8a6'];
    const newConfetti = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.8}s`,
      size: `${Math.random() * 10 + 6}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <CelebrationWrapper>
      <CelebrationContent>
        <CelebrationIcon>🎉</CelebrationIcon>
        <CelebrationText>Video Created!</CelebrationText>
      </CelebrationContent>
      {confetti.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          $left={piece.left}
          $delay={piece.delay}
          $size={piece.size}
          $color={piece.color}
        />
      ))}
    </CelebrationWrapper>
  );
};

export default CelebrationAnimation;