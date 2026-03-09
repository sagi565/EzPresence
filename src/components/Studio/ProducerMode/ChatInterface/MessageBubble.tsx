import React from 'react';
import { 
  MessageRow, 
  MessageAvatar, 
  MessageContent, 
  MessageText 
} from './styles';

interface MessageBubbleProps {
  sender: 'user' | 'agent';
  text: React.ReactNode;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text }) => {
  const isAgent = sender === 'agent';

  return (
    <MessageRow>
      <MessageAvatar $isAgent={isAgent}>
        {isAgent ? 'EZ' : '👤'}
      </MessageAvatar>
      <MessageContent>
        <MessageText>{text}</MessageText>
      </MessageContent>
    </MessageRow>
  );
};

export default MessageBubble;