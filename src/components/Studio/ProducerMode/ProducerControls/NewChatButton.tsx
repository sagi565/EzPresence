import React from 'react';
import { NewChatBtn } from './styles';

interface NewChatButtonProps {
  onClick: () => void;
}

const NewChatButton: React.FC<NewChatButtonProps> = ({ onClick }) => {
  return (
    <NewChatBtn onClick={onClick}>
      ➕ New Chat
    </NewChatBtn>
  );
};

export default NewChatButton;