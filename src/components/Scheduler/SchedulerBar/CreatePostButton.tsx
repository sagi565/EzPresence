import React, { useState } from 'react';
import { CreateBtnContainer, CreateBtn } from './styles';
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
  return (
    <CreateBtnContainer>
      <CreateBtn
        $isHovered={hoveredBtn}
        onClick={() => setShowDropdown(!showDropdown)}
        onMouseEnter={() => setHoveredBtn(true)}
        onMouseLeave={() => setHoveredBtn(false)}
      >
        Create
      </CreateBtn>
      <CreateDropdown
        isOpen={showDropdown}
        onClose={() => setShowDropdown(false)}
        onSelect={handleSelect}
      />
    </CreateBtnContainer>
  );
};

export default CreatePostButton;