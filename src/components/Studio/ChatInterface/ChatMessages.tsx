import React from 'react';
import { VideoIdea } from '@models/VideoIdea';
import { VideoModelType } from '@models/VideoModel';
import MessageBubble from './MessageBubble';
import IdeaCard from '../IdeaCard/IdeaCard';
import { styles } from './styles';

interface ChatMessagesProps {
  messages: Array<{ sender: 'user' | 'agent'; text: string }>;
  ideas: VideoIdea[];
  isLoading: boolean;
  selectedModel: VideoModelType;
  onUpdateIdea: (ideaId: string, updates: Partial<VideoIdea>) => void;
  onGenerateVideo: (params: any) => Promise<boolean>;
  isGenerating: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  ideas,
  isLoading,
  selectedModel,
  onUpdateIdea,
  onGenerateVideo,
  isGenerating,
}) => {
  return (
    <div style={styles.chatMessages}>
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} sender={msg.sender} text={msg.text} />
      ))}
      
      {isLoading && (
        <MessageBubble 
          sender="agent" 
          text={
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          } 
        />
      )}

      {!isLoading && ideas.length > 0 && (
        <MessageBubble 
          sender="agent" 
          text={
            <>
              <div>הנה כמה רעיונות שעלו לי לראש:</div>
              <div style={styles.ideasList}>
                {ideas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    selectedModel={selectedModel}
                    onUpdate={onUpdateIdea}
                    onGenerate={onGenerateVideo}
                    isGenerating={isGenerating}
                  />
                ))}
              </div>
            </>
          }
        />
      )}
    </div>
  );
};

export default ChatMessages;