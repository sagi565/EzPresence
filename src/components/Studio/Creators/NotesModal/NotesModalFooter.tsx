import React from 'react';
import { ModalFooter, GenerateBtn } from './styles';

interface NotesModalFooterProps {
  onGenerate: () => void;
}

const NotesModalFooter: React.FC<NotesModalFooterProps> = ({ onGenerate }) => {
  return (
    <ModalFooter>
      <GenerateBtn onClick={onGenerate}>
        ✨ Generate Reel
      </GenerateBtn>
    </ModalFooter>
  );
};

export default NotesModalFooter;