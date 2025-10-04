import React, { useState } from 'react';
import { styles } from './styles';

interface ChatInputProps {
  onSend: (message: string) => void;
  isInitial: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isInitial }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const inputStyle = {
    ...styles.chatInput,
    ...(isFocused ? styles.chatInputFocus : {}),
  };

  const buttonStyle = {
    ...styles.chatSendBtn,
    ...(isButtonHovered ? styles.chatSendBtnHover : {}),
  };

  const containerStyle = isInitial ? styles.initialChatInputArea : styles.chatInputArea;

  return (
    <div style={containerStyle}>
      <button
        style={buttonStyle}
        onClick={handleSend}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        ⬆️
      </button>
      <input
        type="text"
        style={inputStyle}
        placeholder="שתף את הרעיון שלך לסרטון..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
};

export default ChatInput;