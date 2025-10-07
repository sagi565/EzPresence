import React, { useState } from 'react';
import { styles } from './styles';

interface NotesModalFooterProps {
  onGenerate: () => void;
}

const NotesModalFooter: React.FC<NotesModalFooterProps> = ({ onGenerate }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  return (
    <div style={styles.modalFooter}>
      <button
        style={{
          ...styles.generateBtn,
          ...(isHovered ? styles.generateBtnHover : {}),
          ...(isActive ? styles.generateBtnActive : {}),
        }}
        onClick={onGenerate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsActive(false);
        }}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
      >
        Generate!
      </button>
    </div>
  );
};

export default NotesModalFooter;