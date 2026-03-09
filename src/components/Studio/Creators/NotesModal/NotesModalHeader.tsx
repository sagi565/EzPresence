import React from 'react';
import { ModalHeader, TitleGroup, Subtitle, Title, CloseBtn } from './styles';

interface NotesModalHeaderProps {
  onClose: () => void;
}

const NotesModalHeader: React.FC<NotesModalHeaderProps> = ({ onClose }) => {
  return (
    <ModalHeader>
      <TitleGroup>
        <Subtitle>Creators • Notes</Subtitle>
        <Title>Write Your Thoughts</Title>
      </TitleGroup>
      <CloseBtn onClick={onClose}>✕</CloseBtn>
    </ModalHeader>
  );
};

export default NotesModalHeader;