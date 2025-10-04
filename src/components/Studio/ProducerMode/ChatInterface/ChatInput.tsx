import React, { useRef, useState } from 'react';
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

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = textAreaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    const maxHeight = parseFloat(getComputedStyle(el).lineHeight || '20') * 10;
    const newHeight = Math.min(el.scrollHeight, maxHeight);

    el.style.height = newHeight + 'px';
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };
  return (
    <div style={containerStyle}>
    <button
      style={buttonStyle}
      onClick={handleSend}
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
    >
      <img
        src="/icons/up-arrow.png" 
        alt="Send"
        style={{ width: '20px', height: '20px', objectFit: 'contain' }}
      />
    </button>

      <textarea
        ref={textAreaRef}
        style={inputStyle}
        placeholder="Share your video idea..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          autoResize(e);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        rows={1}
      />
    </div>
  );
};

export default ChatInput;