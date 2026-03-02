import React, { useState } from 'react';
import { styles } from './styles';
import CreateDropdown from './CreateDropdown';

interface CreatePostButtonProps {
  onCreateStory?: () => void;
  onCreatePost?: () => void;
}

const CreatePostButton: React.FC<CreatePostButtonProps> = ({ onCreateStory, onCreatePost }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const handleSelect = (type: 'post' | 'story' | 'ai') => {
    setShowDropdown(false);
    if (type === 'story') {
      onCreateStory?.();
    } else if (type === 'post') {
      onCreatePost?.();
    } else {
      alert('AI Series feature coming soon!');
    }
  };

  const buttonStyle = {
    ...styles.createBtn,
    ...(hoveredBtn ? {
      transform: 'scale(1.07)',
      boxShadow: '0 6px 20px rgba(251, 191, 36, 0.4)',
    } : {}),
  };

  return (
    <div style={styles.createButton}>
      <button
        style={buttonStyle}
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseEnter={() => setHoveredBtn(true)}
        onMouseLeave={() => setHoveredBtn(false)}
      >
        Create
      </button>
      <CreateDropdown
        isOpen={showDropdown}
        onClose={() => setShowDropdown(false)}
        onSelect={handleSelect}
      />
    </div>
  );
};

export default CreatePostButton;