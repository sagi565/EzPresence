import React, { useEffect, useState } from 'react';
import { styles } from './styles';

const CelebrationAnimation: React.FC = () => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: string; size: string; color: string }>>([]);

  useEffect(() => {
    const colors = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-pink)', 'var(--color-blue)', 'var(--color-teal)'];
    const newConfetti = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 0.5}s`,
      size: `${Math.random() * 10 + 5}px`,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);
  }, []);

  return (
    <div style={styles.celebrationContainer}>
      <div style={styles.celebrationContent}>
        <div style={styles.celebrationIcon}>🎉</div>
        <div style={styles.celebrationText}>Video Created!</div>
      </div>
      {confetti.map((piece) => (
        <div
          key={piece.id}
          style={{
            ...styles.confetti,
            left: piece.left,
            animationDelay: piece.delay,
            width: piece.size,
            height: piece.size,
            background: piece.color,
          }}
        />
      ))}
    </div>
  );
};

export default CelebrationAnimation;