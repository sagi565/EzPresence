import React, { useState } from 'react';
import { styles } from './styles';

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    ...styles.newChatBtn,
    ...(isHovered ? styles.newChatBtnHover : {}),
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      ➕ New Chat
    </button>
  );
};

export default NewChatButton;