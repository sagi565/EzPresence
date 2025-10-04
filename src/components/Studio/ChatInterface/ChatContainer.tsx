import React, { useState } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType } from '@models/VideoModel';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { styles } from './styles';

interface ChatContainerProps {
  ideas: VideoIdea[];
  isLoading: boolean;
  selectedModel: VideoModelType;
  onGenerateIdeas: (prompt: string) => Promise<VideoIdea[]>;
  onUpdateIdea: (ideaId: string, updates: Partial<VideoIdea>) => void;
  onGenerateVideo: (params: any) => Promise<boolean>;
  isGenerating: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  ideas,
  isLoading,
  selectedModel,
  onGenerateIdeas,
  onUpdateIdea,
  onGenerateVideo,
  isGenerating,
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([]);
  const [isInitialState, setIsInitialState] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (isInitialState) {
      setIsInitialState(false);
      setIsExpanded(true);
    }

    setMessages(prev => [...prev, { sender: 'user', text: message }]);
    await onGenerateIdeas(message);
  };

  const containerStyle = {
    ...styles.chatContainer,
    ...(isInitialState ? styles.chatContainerInitial : {}),
    ...(isExpanded ? styles.chatContainerExpanded : {}),
  };

  return (
    <div style={containerStyle}>
      {isInitialState ? (
        <>
          <h1 style={styles.initialTitle}>Let's make a video</h1>
          <div style={styles.initialInputArea}>
            <ChatInput onSend={handleSendMessage} isInitial={true} />
          </div>
        </>
      ) : (
        <>
          <ChatHeader />
          <ChatMessages
            messages={messages}
            ideas={ideas}
            isLoading={isLoading}
            selectedModel={selectedModel}
            onUpdateIdea={onUpdateIdea}
            onGenerateVideo={onGenerateVideo}
            isGenerating={isGenerating}
          />
          <ChatInput onSend={handleSendMessage} isInitial={false} />
        </>
      )}
    </div>
  );
};

export default ChatContainer;