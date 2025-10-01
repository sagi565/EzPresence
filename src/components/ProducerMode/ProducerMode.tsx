import React, { useState } from 'react';
import ModelSelector from './ModelSelector';
import ChatContainer from './ChatContainer';
import { VideoModelType } from '@models/VideoModel';
import { styles } from './styles';

const ProducerMode: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<VideoModelType>('Veo 3');

  const handleNewChat = () => {
    if (window.confirm('Start a new chat? This will clear the current conversation.')) {
      window.location.reload();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.controls}>
        <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
        <button style={styles.newChatBtn} onClick={handleNewChat}>
          ➕ New Chat
        </button>
      </div>

      <ChatContainer selectedModel={selectedModel} />
    </div>
  );
};

export default ProducerMode;