import React from 'react';
import { styles } from './styles';

interface MessageBubbleProps {
  sender: 'user' | 'agent';
  text: React.ReactNode;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ sender, text }) => {
  const avatarStyle = {
    ...styles.messageAvatar,
    ...(sender === 'agent' ? styles.messageAvatarAgent : styles.messageAvatarUser),
  };

  return (
    <div style={styles.message}>
      <div style={avatarStyle}>
        {sender === 'agent' ? 'EZ' : '👤'}
      </div>
      <div style={styles.messageContent}>
        <div style={styles.messageText}>{text}</div>
      </div>
    </div>
  );
};

export default MessageBubble;