import React, { useState } from 'react';
import { styles } from './styles';

interface Creator {
  id: string;
  name: string;
  icon: string;
}

interface ScrollNavigationProps {
  creators: Creator[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const ScrollNavigation: React.FC<ScrollNavigationProps> = ({
  creators,
  currentIndex,
  onNavigate,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <nav style={styles.scrollNav}>
      {creators.map((creator, index) => {
        const isActive = index === currentIndex;
        const isHovered = hoveredIndex === index;

        return (
          <div key={creator.id} style={styles.scrollItem}>
            {isHovered && (
              <div style={styles.scrollLabel}>{creator.name}</div>
            )}

            <div
              style={styles.scrollDotContainer}
              onClick={() => onNavigate(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                style={{
                  ...styles.scrollDot,
                  ...(isHovered && !isActive ? styles.scrollDotHover : {}),
                  ...(isActive ? styles.scrollDotActive : {}),
                }}
              >
                <span
                  style={{
                    ...styles.scrollIcon,
                    ...(isHovered || isActive ? styles.scrollIconVisible : {}),
                  }}
                >
                  {creator.icon}
                </span>
              </div>
            </div>

            {index < creators.length - 1 && <div style={styles.scrollLine} />}
          </div>
        );
      })}
    </nav>
  );
};

export default ScrollNavigation;