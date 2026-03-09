import React, { useState } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType } from '@models/VideoModel';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { ChatContainer as StyledContainer } from './styles';

interface Message {
  sender: 'user' | 'agent';
  text?: string;
  ideas?: VideoIdea[];
  isLoading?: boolean;
}

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialState, setIsInitialState] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (isInitialState) {
      setIsInitialState(false);
      setIsExpanded(true);
    }

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: message }]);
    
    // Add loading message
    setMessages(prev => [...prev, { sender: 'agent', isLoading: true }]);
    
    // Generate ideas
    const newIdeas = await onGenerateIdeas(message);
    
    // Replace loading message with ideas
    setMessages(prev => {
      const withoutLoading = prev.filter(m => !m.isLoading);
      return [...withoutLoading, { 
        sender: 'agent', 
        text: 'Here are some ideas that came to my mind',
        ideas: newIdeas 
      }];
    });
  };

  return (
    <StyledContainer $isInitial={isInitialState} $isExpanded={isExpanded}>
      {isInitialState ? (
        <>
          <h1 style={{ fontSize: '40px', fontWeight: 700, margin: 0 }}>Let's make a video</h1>
          <div style={{ width: '100%', maxWidth: 'none' }}>
            <ChatInput onSend={handleSendMessage} isInitial={true} />
          </div>
        </>
      ) : (
        <>
          <ChatMessages
            messages={messages}
            selectedModel={selectedModel}
            onUpdateIdea={onUpdateIdea}
            onGenerateVideo={onGenerateVideo}
            isGenerating={isGenerating}
          />
          <ChatInput onSend={handleSendMessage} isInitial={false} />
        </>
      )}
    </StyledContainer>
  );
};

export default ChatContainer;