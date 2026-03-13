import styled, { keyframes, css } from 'styled-components';
import { theme } from '@theme/theme';

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
  scrollbar-color: rgba(155, 93, 229, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(155, 93, 229, 0.3);
    border-radius: 10px;
  }
`;

export const SlideSection = styled.section<{ $isMobile?: boolean }>`
  height: calc(100vh - 76px);
  min-height: 600px;
  scroll-snap-align: center;
  scroll-snap-stop: always;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 100px 60px 80px;
  position: relative;

  ${props => props.$isMobile && css`
    padding: 24px 20px;
    height: calc(100dvh - 130px);
    box-sizing: border-box;
    min-height: auto;
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
  width: 280px;
  height: calc(280px * 16 / 9);
  border-radius: 28px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
  transform: translateY(0);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.$type === 'show-time' && css`background: linear-gradient(135deg, #dea86bff 0%, #b5762eff 100%);`}
  ${props => props.$type === 'matrix' && css`background: linear-gradient(135deg, #25c99f 0%, #0b8b6e 100%);`}
  ${props => props.$type === 'notes' && css`background: linear-gradient(135deg, #ff8ec6 0%, #df4790 100%);`}
  ${props => props.$type === 'picasso' && css`background: linear-gradient(135deg, #6f9cff 0%, #3356f7 100%);`}

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

export const PreviewLabel = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.text};
  display: inline-flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    top: 12px;
    left: 12px;
    padding: 6px 12px;
  }
`;

export const PreviewDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${theme.colors.teal};
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(20, 184, 166, 0.6);
  animation: ${pulse} 2s infinite;
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
  color: ${theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

export const TitleRow = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  
  ${props => props.$isMobile && css`
    justify-content: center;
  `}
`;

export const CreatorTitle = styled.h1<{ $isMobile?: boolean }>`
  font-size: ${props => props.$isMobile ? '24px' : 'clamp(3rem, 5vw, 4rem)'};
  font-weight: 800;
  background: ${theme.gradients.innovator};
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
  color: ${theme.colors.muted};
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
    background: rgba(59, 130, 246, 0.1);
    color: ${theme.colors.blue};
    border-color: rgba(59, 130, 246, 0.3);
  `}

  ${props => props.$type === 'image' && css`
    background: rgba(251, 191, 36, 0.1);
    color: #d97706;
    border-color: rgba(251, 191, 36, 0.3);
  `}

  ${props => props.$type === 'credits' && css`
    background: rgba(20, 184, 166, 0.1);
    color: ${theme.colors.teal};
    border-color: rgba(20, 184, 166, 0.3);
  `}

  ${props => props.$isInline && css`
    @media (max-width: 768px) {
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
    background: ${theme.gradients.innovator};
    color: white;
    box-shadow: 0 8px 24px rgba(155, 93, 229, 0.3);
    border: none;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(155, 93, 229, 0.4);
    }
  ` : css`
    background: transparent;
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};

    &:hover {
      background: rgba(155, 93, 229, 0.08);
      transform: translateY(-2px);
    }
  `}

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 14px;
    border-radius: 12px;
  }
`;