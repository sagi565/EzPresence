import styled, { keyframes, css } from 'styled-components';
// theme import removed to use dynamic props.theme

// Animations
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
`;

const celebrationPulse = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
`;

const confettiFall = keyframes`
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
`;

// Modal Shell Components
export const ModalOverlay = styled.div<{ $depth?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: ${props => props.$depth ? 2999 : 3000};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  width: 95%;
  maxWidth: 70vw;
  maxHeight: 85vh;
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  border: 2px solid ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.lg}, 0 0 22px 6px ${props => props.theme.colors.primary}33;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${fadeInUp} 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    maxWidth: 95vw;
    maxHeight: 95vh;
  }
`;

// Header Components
export const ModalHeader = styled.div`
  padding: 24px 28px;
  border-bottom: 1px solid ${props => props.theme.colors.primary}1A;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}08 0%, ${props => props.theme.colors.secondary}08 100%);

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

export const TitleGroup = styled.div`
  flex: 1;
`;

export const Subtitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 6px;
`;

export const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  background: ${props => props.theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary}14;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 18px;
  color: ${props => props.theme.colors.muted};

  &:hover {
    background: ${props => props.theme.colors.primary}26;
    transform: rotate(90deg);
  }
`;

// Body Components
export const ModalBody = styled.div`
  flex: 1;
  padding: 28px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1.618fr 1fr;
  gap: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

export const Textarea = styled.textarea<{ $error?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: 14px;
  border: 2px solid ${props => props.$error ? '#ef4444' : `${props.theme.colors.primary}26`};
  border-radius: 12px;
  background: ${props => props.theme.colors.bg}80;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s;
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  outline: none;
  animation: ${props => props.$error ? css`${shake} 0.3s ease` : 'none'};

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.bg};
  }
`;

export const HelperText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
`;

export const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ThemeOption = styled.div<{ $selected?: boolean; $error?: boolean }>`
  position: relative;
  borderRadius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 3px solid ${props => {
    if (props.$error) return '#ef4444';
    if (props.$selected) return props.theme.colors.secondary;
    return 'transparent';
  }};
  box-shadow: ${props => props.$selected ? `0 0 0 4px ${props.theme.colors.secondary}40` : '0 2px 8px rgba(0, 0, 0, 0.08)'};
  animation: ${props => props.$error ? css`${shake} 0.3s ease` : 'none'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    border-color: ${props => props.$selected ? props.theme.colors.secondary : props.theme.colors.primary};
  }
`;

export const ThemeThumbnail = styled.div`
  aspect-ratio: 9/16;
  width: 100%;
  position: relative;
`;

export const ThemeName = styled.div`
  position: absolute;
  bottom: 6px;
  left: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.95);
  padding: 5px 8px;
  border-radius: 6px;
  fontSize: 10px;
  fontWeight: 600;
  textAlign: center;
  color: ${props => props.theme.colors.text};
`;

export const LogoSelector = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const LogoOption = styled.div<{ $selected?: boolean }>`
  width: 72px;
  height: 72px;
  border: 2px solid ${props => props.$selected ? props.theme.colors.secondary : `${props.theme.colors.primary}26`};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$selected ? `${props.theme.colors.secondary}0D` : `${props.theme.colors.primary}08`};
  position: relative;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  box-shadow: ${props => props.$selected ? `0 0 0 4px ${props.theme.colors.secondary}40` : 'none'};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(155, 93, 229, 0.15);
  }
`;

export const LogoIcon = styled.div`
  font-size: 28px;
`;

export const LogoText = styled.div`
  font-size: 9px;
  font-weight: 600;
  textAlign: center;
  color: ${props => props.theme.colors.text};
`;

export const LogoSaved = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${props => props.theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
`;

export const LogoAdd = styled.div`
  color: ${props => props.theme.colors.teal};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

export const LogoAddText = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: ${props => props.theme.colors.muted};
`;

export const SoundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  grid-auto-rows: minmax(70px, auto);

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const SoundOption = styled.div<{ $selected?: boolean }>`
  border: 2px solid ${props => props.$selected ? props.theme.colors.secondary : `${props.theme.colors.primary}26`};
  border-radius: 8px;
  padding: 10px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$selected ? `${props.theme.colors.secondary}0D` : `${props.theme.colors.primary}08`};
  position: relative;
  min-height: 70px;
  box-shadow: ${props => props.$selected ? `0 0 0 4px ${props.theme.colors.secondary}40` : 'none'};

  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(155, 93, 229, 0.15);
  }
`;

export const SoundIcon = styled.div`
  font-size: 18px;
  color: ${props => props.theme.colors.primary};
`;

export const SoundName = styled.div`
  font-size: 9px;
  font-weight: 600;
  textAlign: center;
  color: ${props => props.theme.colors.text};
`;

export const SoundFavorite = styled.div`
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
  color: ${props => props.theme.colors.pink};
`;

export const LibraryBtn = styled.button`
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  color: ${props => props.theme.colors.primary};
  border: 2px solid ${props => props.theme.colors.primary};
  marginTop: 8px;

  &:hover {
    background: rgba(155, 93, 229, 0.08);
    transform: translateY(-1px);
  }
`;

// Footer Components
export const ModalFooter = styled.div`
  padding: 20px 28px;
  border-top: 1px solid rgba(155, 93, 229, 0.1);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(249, 250, 251, 0.5);

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

export const GenerateBtn = styled.button`
  padding: 18px 24px;
  background: ${props => props.theme.gradients.innovator};
  border: none;
  border-radius: 14px;
  color: white;
  fontWeight: 700;
  fontSize: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px ${props => props.theme.colors.primary}4D, 0 3px 10px ${props => props.theme.colors.secondary}40;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.5px;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 35px ${props => props.theme.colors.primary}80, 0 8px 20px ${props => props.theme.colors.secondary}66, 0 0 30px ${props => props.theme.colors.primary}4D;
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(-2px) scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 14px;
  }
`;

// Confirm Dialog Components
export const ConfirmOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 3001;
`;

export const ConfirmDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  z-index: 3002;
  maxWidth: 400px;
  width: 90%;
  textAlign: center;
`;

export const ConfirmTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: ${props => props.theme.colors.text};
`;

export const ConfirmMessage = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${props => props.theme.colors.muted};
  margin-bottom: 24px;
  white-space: pre-line;
`;

export const CreditsBold = styled.span`
  fontWeight: 700;
  color: ${props => props.theme.colors.text};
`;

export const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const ConfirmBtn = styled.button<{ $proceed?: boolean }>`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.$proceed ? css`
    background: ${props => props.theme.gradients.innovator};
    color: white;
    box-shadow: 0 4px 12px ${props => props.theme.colors.primary}4D;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px ${props => props.theme.colors.primary}66;
    }
  ` : css`
    background: ${props => props.theme.colors.muted}1A;
    color: ${props => props.theme.colors.muted};

    &:hover {
      background: rgba(107, 114, 128, 0.15);
    }
  `}
`;

// Celebration Components
export const CelebrationContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3005;
  pointerEvents: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CelebrationContent = styled.div`
  textAlign: center;
  animation: ${celebrationPulse} 2s ease-out;
`;

export const CelebrationIcon = styled.div`
  fontSize: 80px;
  margin-bottom: 20px;
`;

export const CelebrationText = styled.h2`
  fontSize: 32px;
  fontWeight: 800;
  background: ${props => props.theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Confetti = styled.div<{ $left: number; $delay: number; $color: string }>`
  position: absolute;
  width: 10px;
  height: 10px;
  background: ${props => props.$color};
  left: ${props => props.$left}%;
  animation: ${confettiFall} 3s ease-out forwards;
  animation-delay: ${props => props.$delay}s;
`;