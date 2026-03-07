import styled, { keyframes } from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
  overflow-x: hidden;

  ${media.tablet} {
    padding: 24px 20px;
  }
`;

export const Content = styled.div`
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 56px 72px;
  box-shadow: 0 20px 60px rgba(155, 93, 229, 0.15);
  border: 2px solid rgba(200, 200, 200, 0.3);
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
  color: ${theme.colors.text};
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
  background: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  font-size: 16px;
  color: ${theme.colors.muted};
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
  color: ${theme.colors.text};
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
  color: ${theme.colors.text};
  text-align: center;
  gap: 4px;
`;

export const LogoUploadArea = styled.div`
  display: flex;
  justify-content: center;
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
  border: 3px solid ${theme.colors.primary};
  box-shadow: ${theme.shadows.md};
`;

export const RemoveLogoBtn = styled.button`
  position: absolute;
  top: -12px;
  right: -12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #ef4444;
  border: 3px solid white;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
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
  background: rgba(155, 93, 229, 0.03);

  ${props => props.$isHovered ? `
    border-color: rgba(155, 93, 229, 0.6);
    background: rgba(155, 93, 229, 0.08);
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(155, 93, 229, 0.15);
  ` : ``}
`;

export const UploadIcon = styled.span`
  font-size: 48px;
`;

export const UploadText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.primary};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Input = styled.input<{ $isError?: boolean }>`
  height: 52px;
  padding: 0 18px;
  border: 2px solid rgba(155, 93, 229, 0.2);
  border-radius: 12px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  background: white;
  color: ${theme.colors.text};
  font-family: inherit;
  width: 100%;

  &:hover, &:focus {
    border-color: rgba(155, 93, 229, 0.35);
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
  color: ${theme.colors.muted};
  pointer-events: none;
`;

const arrowSvg = `url("data:image/svg+xml,%3Csvg width='14' height='9' viewBox='0 0 14 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L7 7.5L13 1.5' stroke='%239B5DE5' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;

export const CategorySelect = styled.select`
  width: 100%;
  height: 52px;
  padding: 0 52px 0 20px;
  border: 2px solid rgba(155, 93, 229, 0.25);
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: ${theme.colors.text};
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
    background: white;
    color: #333;
    border-bottom: 1px solid rgba(155, 93, 229, 0.1);
  }
  & option:hover {
    background: rgba(155, 93, 229, 0.08);
    color: ${theme.colors.primary};
  }
  & option:checked {
    background: linear-gradient(135deg, rgba(155, 93, 229, 0.15), rgba(155, 93, 229, 0.08));
    color: ${theme.colors.primary};
    font-weight: 600;
  }
  &:hover {
    border-color: rgba(155, 93, 229, 0.5);
  }
  &:focus {
    border-color: ${theme.colors.primary};
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
`;

export const SubmitBtn = styled.button<{ $isSubmitting?: boolean; $isHovered?: boolean; $isActive?: boolean }>`
  flex: 2;
  height: 56px;
  border: none;
  border-radius: 14px;
  background: ${theme.gradients.innovator};
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
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: transparent;
  border: none;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9b5de5;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
  border-radius: 50%;

  &:hover {
    background: rgba(155, 93, 229, 0.1);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  ${media.tablet} {
    top: 16px;
    right: 16px;
  }
`;