import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { media } from '@/styles/breakpoints';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const DropdownContainer = styled.div`
  position: fixed;
  top: 70px;
  right: 24px;
  width: 320px;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  border: none;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2001;
  animation: ${fadeIn} 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top right;

  ${media.phone} {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 92%;
    max-height: 85vh;
    border-radius: 24px;
    border: none;
    padding: 24px;
    overflow-y: auto;
    gap: 24px;
    background: ${props => props.theme.colors.surface}F2;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    
    /* Simple fade in instead of slide */
    animation: fadeInModal 0.3s ease-out;
  }

  @keyframes fadeInModal {
    from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
`;

export const MobileHandle = styled.div`
  display: none;
  ${media.phone} {
    display: block;
    width: 40px;
    height: 5px;
    background: ${props => props.theme.colors.primary}33;
    border-radius: 5px;
    margin: 0 auto 8px;
  }
`;

export const MobileHeader = styled.div`
  display: none;
  ${media.phone} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
`;

export const MobileTitle = styled.h2`
  display: none;
  ${media.phone} {
    display: block;
    font-size: 20px;
    font-weight: 800;
    color: ${props => props.theme.colors.text};
    margin: 0;
  }
`;

export const CloseButton = styled.button`
  display: none;
  ${media.phone} {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(155, 93, 229, 0.1);
    border: none;
    color: ${props => props.theme.colors.primary};
    font-size: 18px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      background: rgba(155, 93, 229, 0.2);
      transform: rotate(90deg);
    }
  }
`;

export const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.primary}1A;
`;

export const ProfileAvatar = styled.div<{ $bgColor?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.$bgColor || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;

  .name {
    font-weight: 700;
    font-size: 16px;
    color: ${props => props.theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email {
    font-size: 13px;
    color: ${props => props.theme.colors.muted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;

  ${media.phone} {
    font-size: 13px;
    margin-bottom: 16px;
  }
`;

export const BrandsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 4px;

  ${media.phone} {
    max-height: none;
    gap: 12px;
  }
  
  /* Custom Scrollbar for sleek look */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(155, 93, 229, 0.2);
    border-radius: 4px;
  }
`;

export const BrandItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.$active ? `${props.theme.colors.primary}14` : 'transparent'};
  border: none;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(155, 93, 229, 0.05);
  }

  .brand-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    object-fit: cover;
    background: ${props => props.theme.colors.primaryLight};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.colors.primary};
    font-size: 14px;
    font-weight: bold;
  }

  .brand-name {
    flex: 1;
    font-weight: 600;
    font-size: 14px;
    color: ${props => props.theme.colors.text};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    ${media.phone} {
      font-size: 15px;
    }
  }

  ${media.phone} {
    padding: 12px 14px;
  }
`;

export const BrandActions = styled.div`
  display: flex;
  gap: 8px;

  button {
    background: transparent;
    border: none;
    color: ${props => props.theme.colors.muted};
    cursor: pointer;
    font-size: 16px;
    padding: 6px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    ${media.phone} {
      font-size: 18px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.03);
    }

    &:hover {
      background: ${props => props.theme.colors.primary}1A;
      color: ${props => props.theme.colors.primary};
    }

    &.delete:hover {
      background: #fee2e2;
      color: #ef4444;
    }
  }
`;

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;

  ${media.phone} {
    padding: 16px;
  }

  &:hover {
    background: rgba(155, 93, 229, 0.05);
  }

  .toggle-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
    font-size: 14px;

    ${media.phone} {
      font-size: 15px;
    }
  }
`;

export const ThemeIconContainer = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const AnimatedIcon = styled.div<{ $active: boolean; $direction: 'up' | 'down'; $color?: string }>`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.$active ? 1 : 0};
  transform: ${props => props.$active 
    ? 'translateY(0) scale(1)' 
    : props.$direction === 'up' 
      ? 'translateY(-20px) scale(0.5)' 
      : 'translateY(20px) scale(0.5)'};
  color: ${props => props.$color || props.theme.colors.primary};
`;

export const SwitchToggle = styled.div<{ $isOn: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  background: ${props => props.$isOn ? props.theme.colors.primary : props.theme.colors.muted};
  border-radius: 12px;
  transition: all 0.3s;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.$isOn ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: transparent;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: #ef4444;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  ${media.phone} {
    padding: 16px;
    font-size: 15px;
    background: rgba(239, 68, 68, 0.05);
    border: none;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
    color: #ef4444;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0; 
  left: 0; 
  right: 0; 
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 3000; /* Higher than dropdown */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const SimpleModal = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 32px;
  border-radius: 28px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
  position: relative;
  z-index: 3001;

  ${media.phone} {
    padding: 24px 20px;
    border-radius: 24px;
  }

  h3 {
    margin: 0;
    color: ${props => props.theme.colors.text};
    font-size: 20px;
  }

  p {
    margin: 0;
    color: ${props => props.theme.colors.muted};
    line-height: 1.5;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 14px;
    border: 2px solid ${props => props.theme.colors.primary}1A;
    border-radius: ${props => props.theme.borderRadius.md};
    background: ${props => props.theme.colors.bg};
    color: ${props => props.theme.colors.text};
    outline: none;
    font-size: 15px;
    
    &:focus {
      border-color: ${props => props.theme.colors.primary};
    }
  }

  .actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 8px;

    button {
      padding: 12px 20px;
      border-radius: ${props => props.theme.borderRadius.md};
      font-weight: 700;
      cursor: pointer;
      border: none;
      font-size: 14px;
      flex: 1;
    }
    .cancel {
      background: rgba(0,0,0,0.05);
      color: ${props => props.theme.colors.muted};
      &:hover { background: rgba(0,0,0,0.1); }
    }
    .save {
      background: ${props => props.theme.colors.primary};
      color: white;
      &:hover { opacity: 0.9; }
    }
    .delete {
      background: #ef4444;
      color: white;
      &:hover { opacity: 0.9; }
    }
  }
`;

export const LegalLinksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.colors.primary}0D;

  .separator {
    color: ${props => props.theme.colors.muted};
    font-size: 10px;
    opacity: 0.5;
  }
`;

export const LegalLink = styled(Link)`
  font-size: 12px;
  color: ${props => props.theme.colors.muted};
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.colors.primary};
    text-decoration: underline;
  }
`;

export const Scrim = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  z-index: 2000;
  ${media.phone} {
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
  }
`;
