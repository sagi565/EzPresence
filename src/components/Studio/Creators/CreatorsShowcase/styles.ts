import styled, { keyframes, css } from 'styled-components';
// theme import removed to use dynamic props.theme

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
`;

export const ShowcaseContainer = styled.div`
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: none;
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.colors.primary}4D transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary}4D;
    border-radius: 10px;
  }
`;

export const SlideSection = styled.section<{ $isMobile?: boolean }>`
  height: 100%;
  min-height: 600px;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 100px 60px 80px;
  position: relative;
  box-sizing: border-box;

  ${props => props.$isMobile && css`
    padding: 24px 20px;
    min-height: 100%;
    justify-content: center;
  `}
`;

export const SlideContent = styled.div<{ $isMobile?: boolean }>`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 80px;
  align-items: center;
  maxWidth: 1400px;
  width: 100%;
  margin: 0 auto;

  ${props => props.$isMobile && css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    text-align: center;
    max-height: 100%;
    margin: auto 0;
  `}
`;

export const PreviewContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PreviewDisplay = styled.div<{ $isActive: boolean; $type: string; $isMobile?: boolean }>`
  width: 340px;
  height: calc(340px * 16 / 9);
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  transform: translateY(0);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.$type === 'atlas' && css`background: linear-gradient(135deg, #dea86bff 0%, #b5762eff 100%);`}
  ${props => props.$type === 'frames' && css`background: linear-gradient(135deg, #25c99f 0%, #0b8b6e 100%);`}
  ${props => props.$type === 'notes' && css`background: linear-gradient(135deg, #ff8ec6 0%, #df4790 100%);`}
  ${props => props.$type === 'picasso' && css`background: linear-gradient(135deg, #6f9cff 0%, #3356f7 100%);`}
  ${props => props.$type === 'vision' && css`background: linear-gradient(135deg, #a78bfa 0%, #6d28d9 40%, #1e1b4b 100%);`}

  ${props => props.$isActive && css`
    transform: translateY(-10px) scale(1.02);
    box-shadow: 0 35px 70px rgba(0, 0, 0, 0.2);
  `}

  ${props => props.$isMobile && css`
    width: auto;
    height: clamp(220px, 40vh, 340px);
    aspect-ratio: 9 / 16;
    border-radius: 16px;
  `}
`;

export const PreviewVideo = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
`;

export const PreviewDot = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.teal};
  border-radius: 50%;
  box-shadow: 0 0 8px ${props => props.theme.colors.teal}99;
  animation: ${pulse} 2s infinite;
  z-index: 2;
`;

export const TagBadge = styled.span<{ $id?: string; $inVideo?: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  background: rgba(30, 20, 10, 0.52);
  color: #fde8c0;
  backdrop-filter: blur(6px);
`;

export const CreatorDetails = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 24px;

  ${props => props.$isMobile && css`
    gap: 12px;
    align-items: center;
  `}
`;

export const CreatorSubtitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: ${props => props.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const TitleRow = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  
  ${props => props.$isMobile && css`
    position: relative;
    justify-content: center;
    width: 100%;
  `}
`;

export const CreatorTitle = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '24px' : 'clamp(3rem, 5vw, 4rem)'};
  font-weight: 800;
  background: ${props => props.theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1.5px;
  line-height: 1;
  margin: 0;
`;

export const CreatorDescription = styled.p<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '13px' : '17px'};
  line-height: 1.7;
  color: ${props => props.theme.colors.muted};
  max-width: 600px;
  margin: 0;

  ${props => props.$isMobile && css`
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

export const CreatorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: inherit;
`;

export const Pill = styled.span<{ $type?: 'video' | 'image' | 'credits'; $isInline?: boolean }>`
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  ${props => props.$type === 'video' && css`
    background: ${props.theme.colors.blue}1A;
    color: ${props.theme.colors.blue};
    border-color: ${props.theme.colors.blue}4D;
  `}

  ${props => props.$type === 'image' && css`
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
    border-color: rgba(251, 191, 36, 0.3);
  `}

  ${props => props.$type === 'credits' && css`
    background: ${props.theme.colors.teal}1A;
    color: ${props.theme.colors.teal};
    border-color: ${props.theme.colors.teal}4D;
  `}

  ${props => props.$isInline && css`
    @media (max-width: 768px) {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      padding: 6px 10px;
      font-size: 11px;
      height: fit-content;
    }
  `}

  @media (max-width: 768px) {
    padding: 6px 14px;
    font-size: 12px;
  }
`;

export const CreatorActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  justify-content: inherit;
`;

export const Button = styled.button<{ $primary?: boolean }>`
  padding: 16px 32px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;

  ${props => props.$primary ? css`
    background: ${props.theme.gradients.innovator};
    color: white;
    box-shadow: 0 8px 24px rgba(155, 93, 229, 0.3);
    border: none;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(155, 93, 229, 0.4);
    }
  ` : css`
    background: transparent;
    color: ${props.theme.colors.primary};
    border-color: ${props.theme.colors.primary};

    &:hover {
      background: ${props.theme.colors.primary}14;
      transform: translateY(-2px);
    }
  `}

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 12px;
  }
`;