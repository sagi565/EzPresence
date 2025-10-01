import React, { useState } from 'react';
import { VideoModelType } from '@models/VideoModel';
import { useVideoIdeas } from '@hooks/useVideoIdeas';
import IdeaCard from './IdeaCard';
import { styles } from './styles';

interface ChatContainerProps {
  selectedModel: VideoModelType;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ selectedModel }) => {
  const [isInitialState, setIsInitialState] = useState(true);
  const [userInput, setUserInput] = useState('');
  const { ideas, isLoading, generateIdeas } = useVideoIdeas();

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setIsInitialState(false);
    const prompt = userInput;
    setUserInput('');

    // Generate ideas
    await generateIdeas(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        ...styles.chatContainer,
        ...(isInitialState ? styles.chatContainerInitial : {}),
        ...(!isInitialState ? styles.chatContainerExpanded : {}),
      }}
    >
      {isInitialState ? (
        <>
          <h1 style={styles.initialTitle}>Let's make a video</h1>
          <div style={styles.initialInputArea}>
            <button style={styles.sendBtn} onClick={handleSendMessage}>
              ⬆️
            </button>
            <input
              type="text"
              style={styles.chatInput}
              placeholder="Share your video idea..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </>
      ) : (
        <>
          <div style={styles.chatMessages}>
            <div style={styles.message}>
              <div style={styles.messageAvatar}>👤</div>
              <div style={styles.messageContent}>
                <div style={styles.messageText}>Create video ideas for our burger restaurant</div>
              </div>
            </div>

            <div style={styles.message}>
              <div style={{ ...styles.messageAvatar, ...styles.messageAvatarAgent }}>EZ</div>
              <div style={styles.messageContent}>
                {isLoading ? (
                  <div style={styles.messageText}>
                    <span style={styles.loadingDots}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </span>
                    Generating ideas...
                  </div>
                ) : (
                  <>
                    <div style={styles.messageText}>Here are some ideas I came up with:</div>
                    <div style={styles.ideasList}>
                      {ideas.map((idea) => (
                        <IdeaCard key={idea.id} idea={idea} selectedModel={selectedModel} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={styles.chatInputArea}>
            <button style={styles.sendBtn} onClick={handleSendMessage}>
              ⬆️
            </button>
            <input
              type="text"
              style={styles.chatInput}
              placeholder="Share your video idea..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatContainer;