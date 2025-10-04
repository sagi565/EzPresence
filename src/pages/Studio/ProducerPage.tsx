import React, { useState } from 'react';
import { VideoModelType } from '@models/VideoModel';
import { VideoIdea } from '@models/VideoIdea';
import { useVideoIdeas } from '@hooks/useVideoIdeas';
import { useVideoGeneration } from '@hooks/useVideoGeneration';
import ProducerControls from '@components/Studio/ProducerControls/ProducerControls';
import ChatContainer from '@components/Studio/ChatInterface/ChatContainer';
import { styles } from './styles';

const ProducerPage: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<VideoModelType>('Veo 3');
  const { ideas, isLoading, generateIdeas, updateIdea } = useVideoIdeas();
  const { isGenerating, generateVideo } = useVideoGeneration();

  const handleNewChat = () => {
    window.location.reload();
  };

  const handleModelChange = (model: VideoModelType) => {
    setSelectedModel(model);
  };

  return (
    <div style={styles.producerContainer}>
      <ProducerControls
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        onNewChat={handleNewChat}
      />
      <ChatContainer
        ideas={ideas}
        isLoading={isLoading}
        selectedModel={selectedModel}
        onGenerateIdeas={generateIdeas}
        onUpdateIdea={updateIdea}
        onGenerateVideo={generateVideo}
        isGenerating={isGenerating}
      />
    </div>
  );
};

export default ProducerPage;