import React, { useRef, useState } from 'react';
import { ChatInputArea, ChatInput as StyledInput, ChatSendBtn } from './styles';

interface ChatInputProps {
  onSend: (message: string) => void;
  isInitial: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, isInitial }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
      }
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const el = textAreaRef.current;
    if (!el) return;

    el.style.height = 'auto';
    const maxHeight = parseFloat(getComputedStyle(el).lineHeight || '22') * 10;
    const newHeight = Math.min(el.scrollHeight, maxHeight);

    el.style.height = newHeight + 'px';
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  return (
    <ChatInputArea style={isInitial ? { width: '100%', background: 'transparent', border: 'none', padding: 0 } : {}}>
      <ChatSendBtn 
        onClick={handleSend}
        disabled={!message.trim()}
      >
        <img
          src="/icons/up-arrow.png" 
          alt="Send"
          style={{ width: '20px', height: '20px', objectFit: 'contain' }}
        />
      </ChatSendBtn>

      <StyledInput
        ref={textAreaRef}
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
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        $isFocused={isFocused}
        rows={1}
      />
    </ChatInputArea>
  );
};

export default ChatInput;