import styled, { keyframes, css } from 'styled-components';
// theme import removed to use dynamic props.theme

// Animations
const focusAppear = keyframes`
  from { opacity: 0; transform: translate(-50%, -40%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const expandToDetail = keyframes`
  from { opacity: 0; transform: translate(-50%, -45%) scale(0.9); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

// IdeaCard Components
export const CardContainer = styled.div<{ $isHovered?: boolean }>`
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.primary}33;
  border-radius: 16px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 14px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
  position: relative;
  text-align: left;
  direction: ltr;

  ${props => props.$isHovered && css`
    transform: translateY(-4px);
    box-shadow: 0 12px 25px ${props.theme.colors.primary}26;
    border-color: ${props.theme.colors.primary};
  `}
`;

export const IdeaText = styled.span`
  display: block;
`;

// Shared Focus/Detail Components
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 2000;
  transition: opacity 0.3s ease;
`;

// IdeaFocusView Components
export const FocusedCard = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2001;
  width: 90%;
  max-width: 600px;
  background: ${props => props.theme.colors.surface};
  padding: 16px 20px;
  border-radius: 16px;
  border: 2px solid ${props => props.theme.colors.primary};
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1), 0 0 22px 6px ${props => props.theme.colors.primary}33;
  animation: ${focusAppear} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const FocusedTextArea = styled.textarea`
  min-height: 120px;
  padding: 12px;
  border: 1px solid ${props => props.theme.colors.primary}33;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  font-family: inherit;
  text-align: left;
  direction: ltr;
  background: ${props => props.theme.colors.bg};
  width: 100%;
  color: ${props => props.theme.colors.text};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const PreviewBtn = styled.button<{ $isHovered?: boolean }>`
  position: absolute;
  bottom: 28px;
  left: 28px;
  padding: 10px 20px;
  border-radius: 12px;
  background: ${props => props.theme.colors.surface}F2;
  border: 1px solid ${props => props.theme.colors.teal}33;
  color: ${props => props.theme.colors.muted};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  outline: none;

  &:disabled {
    cursor: default;
    opacity: 0.7;
  }

  ${props => props.$isHovered && css`
    background: ${props.theme.colors.teal}0D;
    color: ${props.theme.colors.muted};
    border-color: ${props.theme.colors.teal};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props.theme.colors.teal}1A;
  `}
`;

export const LoadingDotsContainer = styled.div`
  position: absolute;
  bottom: 38px;
  right: 38px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

// IdeaDetailView Components
export const DetailedModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3000;
  max-width: 900px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 0;
  background: ${props => props.theme.colors.surface};
  border: 2px solid ${props => props.theme.colors.primary};
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1), 0 0 22px 6px ${props => props.theme.colors.primary}33;
  animation: ${expandToDetail} 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const DetailedContent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const DetailedMain = styled.div`
  flex: 1;
  padding: 28px;
  overflow-y: auto;
`;

export const DetailedSidebar = styled.div`
  width: 280px;
  padding: 24px;
  background: ${props => props.theme.colors.bg}80;
  border-left: 1px solid ${props => props.theme.colors.primary}1A;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    width: 100%;
    border-left: none;
    border-top: 1px solid rgba(155, 93, 229, 0.1);
  }
`;

export const SidebarTopGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FieldLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${props => props.theme.colors.muted};
  margin-bottom: 4px;
  text-align: left;
  direction: ltr;
  font-family: inherit;
`;

export const DetailedInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.primary}26;
  border-radius: 8px;
  font-size: 13px;
  background: ${props => props.theme.colors.bg}CC;
  text-align: left;
  direction: ltr;
  outline: none;
  transition: all 0.2s;
  margin-bottom: 6px;
  color: ${props => props.theme.colors.text};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    background: #fff;
  }
`;

export const DetailedTextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.colors.primary}26;
  border-radius: 8px;
  font-size: 13px;
  background: ${props => props.theme.colors.bg}CC;
  text-align: left;
  direction: ltr;
  outline: none;
  transition: all 0.2s;
  min-height: 80px;
  resize: vertical;
  font-family: inherit;
  color: ${props => props.theme.colors.text};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    background: #fff;
  }
`;

export const DetailedSeparator = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, ${props => props.theme.colors.primary}33, transparent);
  margin: 20px 0;
`;

export const DetailedPromptContainer = styled.div`
  padding: 20px;
  background: ${props => props.theme.colors.primary}0D;
  borderRadius: 12px;
  border: 1px solid ${props => props.theme.colors.primary}1A;
  position: relative;
`;

export const DetailedPromptTitle = styled.div`
  fontWeight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 12px;
  fontSize: 16px;
  textAlign: left;
  direction: ltr;
`;

export const DetailedPromptText = styled.div`
  font-size: 15px;
  line-height: 1.7;
  color: ${props => props.theme.colors.text};
  text-align: left;
  direction: ltr;
  white-space: pre-wrap;
  padding: 16px;
  border: 2px solid ${props => props.theme.colors.primary}33;
  border-radius: 10px;
  min-height: 100px;
  background: ${props => props.theme.colors.bg};
  transition: all 0.2s;
  outline: none;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.primary}1A;
  }
`;

export const ModelBadge = styled.div<{ $type: 'veo3' | 'veo2' }>`
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid transparent;
  font-weight: 600;
  fontSize: 13px;
  textAlign: center;
  position: relative;
  overflow: hidden;

  ${props => props.$type === 'veo3' ? css`
    background: linear-gradient(135deg, rgba(155, 93, 229, 0.25) 0%, rgba(251, 191, 36, 0.25) 30%, rgba(245, 158, 11, 0.25) 70%, rgba(217, 119, 6, 0.25) 100%);
    borderColor: ${props => props.theme.colors.secondary}4D;
    color: ${props => props.theme.colors.text};
  ` : css`
    background: linear-gradient(135deg, ${props.theme.colors.primary}21 0%, ${props.theme.colors.secondary}21 50%, ${props.theme.colors.pink}21 100%);
    color: ${props.theme.colors.text};
  `}
`;

export const PriceDisplay = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, rgba(155, 93, 229, 0.03), rgba(251, 191, 36, 0.03));
  border-radius: 12px;
  border: 1px solid rgba(155, 93, 229, 0.1);
  text-align: center;
`;

export const PriceLabel = styled.div`
  fontSize: 11px;
  color: ${props => props.theme.colors.muted};
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const PriceValue = styled.div`
  fontSize: 28px;
  fontWeight: 700;
  background: ${props => props.theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PriceUnit = styled.span`
  fontSize: 14px;
  color: ${props => props.theme.colors.muted};
  fontWeight: 400;
  margin-left: 4px;
`;