import React, { useEffect, useState } from 'react';
import { styles } from './styles';

const CelebrationAnimation: React.FC = () => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: string; size: string }>>([]);

  useEffect(() => {
    const confettiItems = [];
    for (let i = 0; i < 20; i++) {
      confettiItems.push({
        id: i,
        left: Math.random() * 100 + '%',
        delay: Math.random() * 0.5 + 's',
        size: (Math.random() * 10 + 5) + 'px',
      });
    }
    setConfetti(confettiItems);
  }, []);

  return (
    <div style={styles.celebrationContainer}>
      <div style={styles.celebrationContent}>
        <div style={styles.celebrationIcon}>🎉</div>
        <div style={styles.celebrationText}>Video Created!</div>
      </div>
      {confetti.map((item) => (
        <div
          key={item.id}
          style={{
            ...styles.confetti,
            left: item.left,
            animationDelay: item.delay,
            width: item.size,
            height: item.size,
          }}
        />
      ))}
    </div>
  );
};

export default CelebrationAnimation;