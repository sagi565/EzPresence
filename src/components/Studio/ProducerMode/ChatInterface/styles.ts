import styled, { keyframes, css } from 'styled-components';
// theme import removed to use dynamic props.theme

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ChatContainer = styled.div<{ $isInitial?: boolean; $isExpanded?: boolean }>`
  flex: 1;
  background: ${props => props.theme.colors.surface}CC;
  border: 2px solid ${props => props.theme.colors.primary}1A;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  direction: ltr;
  margin-inline: 15px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.$isInitial && css`
    justify-content: center;
    align-items: center;
    gap: 24px;
    padding: 40px 24px;
    text-align: center;
  `}

  ${props => props.$isExpanded && css`
    transform: scale(1.02);
    box-shadow: 0 20px 40px rgba(155, 93, 229, 0.15);
  `}

  @media (max-width: 768px) {
    margin-inline: 10px;
    border-radius: 16px;
  }
`;

export const InitialTitle = styled.h2`
  font-size: 40px;
  font-weight: 700;
  background: ${props => props.theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const InitialChatInputArea = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  direction: ltr;
  max-width: none;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

export const ChatHeader = styled.div`
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.primary}1A;
  background: ${props => props.theme.colors.surface}E6;
  display: none;
`;

export const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 16px;
    gap: 16px;
  }
`;

export const MessageRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  animation: ${fadeInUp} 0.4s ease;
  direction: ltr;
`;

export const MessageAvatar = styled.div<{ $isAgent?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  margin-top: -9px;

  ${props => props.$isAgent ? css`
    background: ${props.theme.gradients.innovator};
    color: #fff;
    font-weight: 700;
    font-size: 16px;
  ` : css`
    background: ${props.theme.colors.primary}1A;
  `}

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
  }
`;

export const MessageContent = styled.div`
  flex: 1;
  textAlign: left;
  min-width: 0;
`;

export const MessageText = styled.div`
  font-size: 14px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
  direction: ltr;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

export const LoadingDots = styled.div`
  display: inline-flex;
  gap: 4px;
  align-items: center;
  margin-right: 8px;
`;

export const IdeasList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

export const ChatInputArea = styled.div`
  padding: 20px;
  background: ${props => props.theme.colors.surface}F2;
  border-top: 1px solid ${props => props.theme.colors.primary}1A;
  display: flex;
  gap: 12px;
  align-items: center;
  direction: ltr;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 8px;
  }
`;

export const ChatInput = styled.textarea<{ $isFocused?: boolean }>`
  flex: 1;
  padding: 16px 24px;
  border: 1px solid ${props => props.theme.colors.primary}1A;
  border-radius: 25px;
  font-size: 15px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.theme.colors.bg}CC;
  backdrop-filter: blur(10px);
  text-align: left;
  direction: ltr;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
  white-space: pre-wrap;
  overflow-y: hidden;
  resize: none;
  line-height: 22px;
  font-family: inherit;
  font-weight: 500;

  ${props => props.$isFocused && css`
    background: ${props.theme.colors.surface}F2;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08), 0 0 0 3px ${props.theme.colors.primary}1A;
    transform: translateY(-1px);
  `}

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

export const ChatSendBtn = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9b5de5 0%, #3b82f6 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.05);
    background: linear-gradient(135deg, #b084f6 0%, #5c9bf8 100%);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;