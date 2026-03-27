import styled from 'styled-components';
import { media } from '@/styles/breakpoints';

export const Container = styled.div`
  position: relative;
  flex-shrink: 0;

  ${media.phone} {
    position: absolute;
    left: 50%;
    top: 8px;
    transform: translateX(-50%);
    z-index: 10;
  }
`;

export const Selector = styled.div<{ $isHovered: boolean }>`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.surface}E6;
  border: 2px solid ${props => props.$isHovered ? props.theme.colors.primary : props.theme.colors.secondary};
  border-radius: 16px;
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  white-space: nowrap;
  width: 220px;
  outline: none;
  box-shadow: ${props => props.$isHovered ? '0 8px 25px rgba(251, 191, 36, 0.3)' : 'none'};
  transform: ${props => props.$isHovered ? 'translateY(-2px)' : 'none'};

  @media (max-width: 1050px) {
    width: 180px;
    padding: 5px 10px;
    border-radius: 12px;
  }

  ${media.phone} {
    width: 140px;
    padding: 2px 8px;
    border-radius: 8px;
    height: 34px;
  }
`;

export const TenantName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 15px;
  flex: 1;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 1050px) {
    font-size: 14px;
  }
`;

export const BrandIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${props => props.theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
  flex-shrink: 0;
  margin-left: 10px;

  @media (max-width: 1050px) {
    width: 36px;
    height: 36px;
    font-size: 18px;
    margin-left: 8px;
  }

  ${media.phone} {
    width: 26px;
    height: 26px;
    font-size: 14px;
    border-radius: 6px;
    margin-left: 6px;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 220px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.mode === 'dark' ? `${props.theme.colors.primary}40` : `${props.theme.colors.primary}1A`};
  border-radius: 12px;
  padding: 8px;
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${media.phone} {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 24px 24px 0 0;
    padding: 16px 20px;
    padding-bottom: env(safe-area-inset-bottom, 32px);
    border: none;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
    gap: 12px;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
`;

export const MobileHandle = styled.div`
  display: none;
  ${media.phone} {
    display: block;
    width: 40px;
    height: 5px;
    background: ${props => props.theme.mode === 'dark' ? `${props.theme.colors.primary}66` : `${props.theme.colors.primary}33`};
    border-radius: 5px;
    margin: 0 auto 12px;
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
    font-size: 18px;
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
    background: ${props => props.theme.mode === 'dark' ? `${props.theme.colors.primary}40` : `${props.theme.colors.primary}1A`};
    border: none;
    color: ${props => props.theme.colors.primary};
    font-size: 18px;
    cursor: pointer;
  }
`;

export const Scrim = styled.div`
  display: none;
  ${media.phone} {
    display: block;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    z-index: 1999;
  }
`;

export const Option = styled.button<{ $isActive?: boolean; $isHovered?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: ${props =>
    props.$isActive
      ? 'rgba(251, 191, 36, 0.2)'
      : props.$isHovered
        ? props.theme.colors.primaryLight
        : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.$isActive ? '#d97706' : props.theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
  text-align: left;

  ${media.tablet} {
    padding: 8px 10px;
    font-size: 13px;
    gap: 8px;
  }

  ${media.phone} {
    padding: 14px 16px;
    font-size: 15px;
    background: ${props => props.$isActive ? 'rgba(155, 93, 229, 0.08)' : 'rgba(0,0,0,0.02)'};
    border-radius: 12px;
  }
`;

export const OptIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${props => props.theme.mode === 'dark' ? `${props.theme.colors.primary}33` : `${props.theme.colors.primary}14`};
  font-size: 18px;
  flex-shrink: 0;

  ${media.tablet} {
    width: 24px;
    height: 24px;
    font-size: 15px;
  }
`;

export const AddBrandBtn = styled.button<{ $isHovered?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$isHovered ? props.theme.colors.teal : props.theme.colors.muted};
  border-top: 1px solid ${props => props.theme.mode === 'dark' ? `${props.theme.colors.primary}66` : `${props.theme.colors.primary}33`};
  margin-top: 4px;
  border-left: none;
  border-right: none;
  border-bottom: none;
  background: ${props => props.$isHovered ? 'rgba(20, 184, 166, 0.05)' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  ${media.tablet} {
    gap: 8px;
  }

  ${media.phone} {
    padding: 14px 16px;
    font-size: 14px;
    margin-top: 8px;
    background: rgba(20, 184, 166, 0.05);
    border-radius: 12px;
  }
`;

export const AddIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 14px;
  background: rgba(20, 184, 166, 0.1);
  border-radius: 8px;
  flex-shrink: 0;
`;

export const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;