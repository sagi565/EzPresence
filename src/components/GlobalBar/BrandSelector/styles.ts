import styled from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

export const Container = styled.div`
  position: relative;
`;

export const Selector = styled.div<{ $isHovered: boolean }>`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid ${props => props.$isHovered ? theme.colors.primary : theme.colors.secondary};
  border-radius: 16px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  white-space: nowrap;
  width: 225px;
  outline: none !important;
  box-shadow: ${props => props.$isHovered ? '0 8px 25px rgba(251, 191, 36, 0.3)' : 'none'};
  transform: ${props => props.$isHovered ? 'translateY(-2px)' : 'none'};

  ${media.tablet} {
    width: 160px;
    padding: 6px 12px;
    border-radius: 12px;
  }

  ${media.phone} {
    width: auto;
    min-width: 44px;
    padding: 4px;
    border-radius: 10px;
    justify-content: center;
  }
`;

export const TenantName = styled.span`
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 15px;
  flex: 1;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${media.phone} {
    display: none;
  }
`;

export const BrandIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${theme.colors.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.2);
  flex-shrink: 0;
  margin-left: 12px;

  ${media.phone} {
    margin-left: 0;
    width: 32px;
    height: 32px;
    font-size: 16px;
    border-radius: 6px;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 225px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid ${theme.colors.secondary};
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 10px 25px rgba(251, 191, 36, 0.15);
  z-index: 2000;

  ${media.tablet} {
    width: 200px;
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
        ? theme.colors.primaryLight 
        : 'transparent'
  };
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.$isActive ? '#d97706' : theme.colors.text};
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none !important;

  ${media.tablet} {
    padding: 8px 10px;
    font-size: 13px;
    gap: 8px;
  }
`;

export const OptIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(155, 93, 229, 0.08);
  font-size: 18px;

  ${media.tablet} {
    width: 24px;
    height: 24px;
    font-size: 16px;
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
  color: ${props => props.$isHovered ? theme.colors.teal : theme.colors.muted};
  border-top: 1px solid rgba(251, 191, 36, 0.2);
  margin-top: 4px;
  border-left: none;
  border-right: none;
  border-bottom: none;
  background: ${props => props.$isHovered ? 'rgba(20, 184, 166, 0.05)' : 'transparent'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none !important;

  ${media.tablet} {
    gap: 8px;
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
`;

export const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
`;