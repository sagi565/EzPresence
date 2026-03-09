import React, { useEffect, useRef } from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType } from '@models/VideoModel';
import MessageBubble from './MessageBubble';
import IdeaCard from '../IdeaCard/IdeaCard';
import { ChatMessages as MessagesContainer, IdeasList } from './styles';

interface Message {
  sender: 'user' | 'agent';
  text?: string;
  ideas?: VideoIdea[];
  isLoading?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  selectedModel: VideoModelType;
  onUpdateIdea: (ideaId: string, updates: Partial<VideoIdea>) => void;
  onGenerateVideo: (params: any) => Promise<boolean>;
  isGenerating: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  selectedModel,
  onUpdateIdea,
  onGenerateVideo,
  isGenerating,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <MessagesContainer>
      {messages.map((msg, idx) => {
        if (msg.isLoading) {
          return (
            <MessageBubble 
              key={idx}
              sender="agent" 
              text={
                <div style={{ display: 'inline-flex', gap: '4px' }}>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              } 
            />
          );
        }

        if (msg.ideas && msg.ideas.length > 0) {
          return (
            <MessageBubble 
              key={idx}
              sender="agent" 
              text={
                <>
                  {msg.text && <div>{msg.text}</div>}
                  <IdeasList>
                    {msg.ideas.map((idea) => (
                      <IdeaCard
                        key={idea.id}
                        idea={idea}
                        selectedModel={selectedModel}
                        onUpdate={onUpdateIdea}
                        onGenerate={onGenerateVideo}
                        isGenerating={isGenerating}
                      />
                    ))}
                  </IdeasList>
                </>
              }
            />
          );
        }

        return (
          <MessageBubble 
            key={idx}
            sender={msg.sender} 
            text={msg.text || ''} 
          />
        );
      })}
      <div ref={messagesEndRef} />
    </MessagesContainer>
  );
};

export default ChatMessages;