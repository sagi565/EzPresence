import React, { useEffect, useState } from 'react';
import { CelebrationContainer, CelebrationContent, CelebrationIcon, CelebrationText, Confetti } from './styles';

const NotesCelebration: React.FC = () => {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    const colors = ['#9b5de5', '#f15bb5', '#fee440', '#00bbf9', '#00f5d4'];
    const newPieces = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setPieces(newPieces);
  }, []);

  return (
    <CelebrationContainer>
      {pieces.map((piece) => (
        <Confetti
          key={piece.id}
          $left={piece.left}
          $delay={piece.delay}
          $color={piece.color}
        />
      ))}
      <CelebrationContent>
        <CelebrationIcon>✨</CelebrationIcon>
        <CelebrationText>Generating Real Magic...</CelebrationText>
      </CelebrationContent>
    </CelebrationContainer>
  );
};

export default NotesCelebration;