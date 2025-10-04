import React from 'react';
import { VideoModelType } from '@models/VideoModel';
import ModelSelector from '../ModelSelector/ModelSelector';
import NewChatButton from './NewChatButton';
import { styles } from './styles';

interface ProducerControlsProps {
  selectedModel: VideoModelType;
  onModelChange: (model: VideoModelType) => void;
  onNewChat: () => void;
}

const ProducerControls: React.FC<ProducerControlsProps> = ({
  selectedModel,
  onModelChange,
  onNewChat,
}) => {
  return (
    <div style={styles.controls}>
      <ModelSelector selectedModel={selectedModel} onModelChange={onModelChange} />
      <NewChatButton onClick={onNewChat} />
    </div>
  );
};

export default ProducerControls;