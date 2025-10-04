import React, { useState } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType } from '@models/VideoModel';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { styles } from './styles';

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
        text: 'הנה כמה רעיונות שעלו לי לראש:',
        ideas: newIdeas 
      }];
    });
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
          <div style={styles.initialChatInputArea}>
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
    </div>
  );
};

export default ChatContainer;