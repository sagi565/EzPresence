import styled, { keyframes } from 'styled-components';
import { media } from '@/styles/breakpoints';

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.82); }
  to { opacity: 1; transform: scale(1); }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  background: ${props => props.theme.mode === 'dark' ? '#1a1a1a' : '#fcfcfc'};
  transition: background 0.3s ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0.015;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  ${media.tablet} {
    padding: 24px 20px;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 800px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(40, 40, 40, 0.85)' : 'rgba(255, 255, 255, 0.98)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 56px 72px;
  box-shadow: ${props => props.theme.mode === 'dark'
    ? '0 20px 60px rgba(0, 0, 0, 0.4)'
    : '0 20px 60px rgba(155, 93, 229, 0.1)'};
  border: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(155, 93, 229, 0.1)'};
  position: relative;
  z-index: 1;

  ${media.tablet} {
    padding: 40px 24px;
    border-radius: 20px;
  }
`;

export const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;

  ${media.tablet} {
    margin-bottom: 32px;
  }
`;

export const Title = styled.h1`
  font-size: 40px;
  font-weight: 630;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
  letter-spacing: -0.5px;

  ${media.tablet} {
    font-size: 32px;
  }
`;

export const TitleHighlight = styled.span`
  font-family: "Playfair Display", serif;
  font-weight: 750;
  font-style: italic;
  background: ${props => props.theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${props => props.theme.colors.muted};
  line-height: 1.6;

  ${media.tablet} {
    font-size: 15px;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 32px;
  align-items: flex-start;

  ${media.tablet} {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const NameAndSloganColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const FormGroupStacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FormGroupRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const Required = styled.span`
  color: #ef4444;
  font-size: 18px;
`;

export const LogoCenterLabel = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  text-align: center;
  gap: 4px;
`;

export const LogoUploadArea = styled.div`
  display: flex;
  justify-content: center;
`;

export const LogoAndPickerRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
  min-height: 160px;
`;

export const PickerRightWrapper = styled.div`
  position: absolute;
  left: calc(50% + 84px);
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 160px;
`;

export const LogoPreviewContainer = styled.div`
  position: relative;
  width: 160px;
  height: 160px;
`;

export const LogoPreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  border: 3px solid ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.shadows.md};

  ${media.phone} {
    width: 140px;
    height: 140px;
  }
`;

export const RemoveLogoBtn = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.18s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  svg { display: block; }

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    transform: scale(1.1);
  }
`;

export const LogoUploadPlaceholder = styled.div<{ $isHovered?: boolean }>`
  width: 160px;
  height: 160px;
  border: 3px dashed rgba(155, 93, 229, 0.3);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.2, 0, 0.1, 0.5);
  background: ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(155, 93, 229, 0.03)'};

  ${props => props.$isHovered ? `
    border-color: ${props.theme.colors.primary}80;
    background: ${props.theme.colors.primary}14;
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(155, 93, 229, 0.15);
  ` : ``}

  ${media.phone} {
    width: 140px;
    height: 140px;
  }
`;

export const UploadIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  svg { display: block; }
`;

export const UploadText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Input = styled.input<{ $isError?: boolean }>`
  height: 52px;
  padding: 0 18px;
  border: 2px solid ${props => props.theme.colors.primary}33;
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  width: 100%;

  &:hover, &:focus {
    border-color: ${props => props.theme.colors.primary}59;
  }

  ${props => props.$isError ? `
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.05);
  ` : ``}
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const CharCountInside = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
  pointer-events: none;
`;

const arrowSvg = `url("data:image/svg+xml,%3Csvg width='14' height='9' viewBox='0 0 14 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L7 7.5L13 1.5' stroke='%239B5DE5' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

export const CategorySelect = styled.select`
  width: 100%;
  height: 52px;
  padding: 0 52px 0 20px;
  border: 2px solid ${props => props.theme.colors.primary}40;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-family: inherit;
  cursor: pointer;
  appearance: none;
  background-image: ${arrowSvg};
  background-repeat: no-repeat;
  background-position: right 20px center;

  & option {
    padding: 14px 20px;
    font-size: 15px;
    font-weight: 500;
    background: ${props => props.theme.mode === 'dark' ? '#2c2c2c' : '#ffffff'};
    color: ${props => props.theme.colors.text};
    border-bottom: 1px solid ${props => props.theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(155, 93, 229, 0.1)'};
  }
  & option:hover {
    background: ${props => props.theme.colors.primary}14;
    color: ${props => props.theme.colors.primary};
  }
  & option:checked {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}26, ${props => props.theme.colors.primary}14);
    color: ${props => props.theme.colors.primary};
    font-weight: 600;
  }
  &:hover {
    border-color: rgba(155, 93, 229, 0.5);
  }
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(155, 93, 229, 0.1);
  }
`;

export const ErrorText = styled.span`
  font-size: 13px;
  color: #ef4444;
  margin-top: 4px;
`;

export const ErrorMessageWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid #ef4444;
  border-radius: 12px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
`;

export const ErrorIcon = styled.span`
  font-size: 20px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 8px;

  ${media.phone} {
    margin-top: 16px;
  }
`;

export const SubmitBtn = styled.button<{ $isSubmitting?: boolean; $isHovered?: boolean; $isActive?: boolean }>`
  flex: 2;
  height: 56px;
  border: none;
  border-radius: 14px;
  background: ${props => props.theme.gradients.innovator};
  color: white;
  font-size: 17px;
  font-weight: 700;
  cursor: ${props => props.$isSubmitting ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(155, 93, 229, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  transform: ${props => props.$isActive ? 'translateY(0)' : props.$isHovered ? 'translateY(-1px)' : 'scale(1)'};
  opacity: ${props => props.$isSubmitting ? 0.7 : 1};

  ${props => props.$isActive ? `box-shadow: 0 4px 12px rgba(155, 93, 229, 0.2);` : ``}
`;

export const BackButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  border-radius: 50%;
  background: transparent;
  border: none;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;

  &:hover {
    background: ${props => props.theme.colors.primary}1A;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  ${media.tablet} {
    top: 16px;
    right: 16px;
  }

  ${media.phone} {
    top: 12px;
    right: 12px;
    width: 40px;
    height: 40px;
    background: ${props => props.theme.colors.primary}0D;
  }
`;

export const Ripple = styled.span`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  animation: ${ripple} 0.6s ease-out;
  pointer-events: none;
`;

export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(155, 93, 229, 0.2);
  border-top-color: ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 20px;
  color: ${props => props.theme.colors.primary};
  font-weight: 500;
`;

export const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: ${props => props.theme.mode === 'dark' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(20, 184, 166, 0.05)'};
  border: 2px solid #14b8a6;
  border-radius: 12px;
  color: #14b8a6;
  font-size: 14px;
  font-weight: 500;
  animation: contentFadeIn 0.3s ease-out;

  span:first-child {
    font-size: 20px;
  }
`;

/* ===== Logo suggestion card ===== */

export const SuggestionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 14px;
  background: ${props => props.theme.mode === 'dark'
    ? 'rgba(155, 93, 229, 0.08)'
    : 'rgba(155, 93, 229, 0.05)'};
  border: 1px solid ${props => props.theme.colors.primary}26;
  box-shadow: 0 2px 12px ${props => props.theme.colors.primary}10;
  animation: ${slideUp} 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

export const SuggestionAvatar = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${props => props.theme.colors.primary}40;
  }
`;

export const SuggestionPlatformBadge = styled.img`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.surface};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
`;

export const SuggestionText = styled.div`
  flex: 1;
  min-width: 0;

  p {
    margin: 0;
    font-size: 12px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  span {
    font-size: 11px;
    color: ${props => props.theme.colors.muted};
    font-weight: 400;
  }
`;

export const SuggestionActions = styled.div`
  display: flex;
  gap: 6px;
  flex-shrink: 0;
`;

export const SuggestionAcceptBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: ${props => props.theme.colors.primary};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s, filter 0.15s;
  box-shadow: 0 2px 8px ${props => props.theme.colors.primary}44;
  svg { display: block; }

  &:hover {
    filter: brightness(1.1);
    transform: scale(1.08);
  }
`;

export const SuggestionDeclineBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.colors.primary}30;
  background: transparent;
  color: ${props => props.theme.colors.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  svg { display: block; }

  &:hover {
    background: ${props => props.theme.mode === 'dark'
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.04)'};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.primary}55;
  }
`;

/* ===== Logo suggestion modal overlay ===== */

export const SuggestionOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  animation: ${fadeIn} 0.18s ease;
`;

export const SuggestionModal = styled.div`
  background: ${props => props.theme.mode === 'dark' ? 'rgba(38, 38, 38, 0.97)' : 'rgba(255, 255, 255, 0.98)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 32px 28px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22), 0 4px 16px rgba(155, 93, 229, 0.12);
  border: 1px solid ${props => props.theme.colors.primary}28;
  animation: ${scaleIn} 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
  max-width: 276px;
  width: 90%;
`;

export const SuggestionModalAvatar = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 4px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${props => props.theme.colors.primary}55;
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}28;
  }
`;

export const SuggestionModalBadge = styled.img`
  position: absolute;
  bottom: -1px;
  right: -1px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2.5px solid ${props => props.theme.colors.surface};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

export const SuggestionModalTitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

export const SuggestionModalSub = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.muted};
  text-align: center;
  margin-top: -2px;
`;

export const SuggestionModalActions = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  margin-top: 10px;
`;

export const SuggestionModalAcceptBtn = styled.button`
  flex: 1;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: ${props => props.theme.gradients.innovator};
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  box-shadow: 0 4px 14px ${props => props.theme.colors.primary}40;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px ${props => props.theme.colors.primary}50;
  }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

export const SuggestionModalDeclineBtn = styled.button`
  flex: 1;
  height: 44px;
  border: 1.5px solid ${props => props.theme.colors.primary}30;
  border-radius: 12px;
  background: transparent;
  color: ${props => props.theme.colors.muted};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;

  &:hover {
    background: ${props => props.theme.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.primary}55;
  }
`;
