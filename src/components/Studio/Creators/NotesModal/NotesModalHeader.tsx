import React, { useState } from 'react';
import { styles } from './styles';

interface NotesModalHeaderProps {
  onClose: () => void;
}

const NotesModalHeader: React.FC<NotesModalHeaderProps> = ({ onClose }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={styles.modalHeader}>
      <div style={styles.modalTitleGroup}>
        <div style={styles.modalSubtitle}>Write Your Thoughts</div>
        <h2 style={styles.modalTitle}>Notes</h2>
      </div>
      <button
        style={{
          ...styles.closeBtn,
          ...(isHovered ? styles.closeBtnHover : {}),
        }}
        onClick={onClose}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        ✕
      </button>
    </div>
  );
};

export default NotesModalHeader;