import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useLocation } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie-consent';

const slideUp = keyframes`
  from { transform: translate(-50%, 100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const slideDown = keyframes`
  from { transform: translate(-50%, 0); opacity: 1; }
  to { transform: translate(-50%, 100%); opacity: 0; }
`;

const BannerWrapper = styled.div<{ $hiding: boolean }>`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1000000;
  width: calc(100% - 48px);
  max-width: 680px;
  animation: ${({ $hiding }) => ($hiding ? slideDown : slideUp)} 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

const BannerCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.muted}33;
  border-radius: 20px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 28px;
  box-shadow: ${props => props.theme.colors.bg === '#0a0e17' 
    ? '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)' 
    : '0 10px 40px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 18px;
    padding: 24px;
  }
`;

const CookieIcon = styled.span`
  font-size: 32px;
  flex-shrink: 0;
`;

const TextBlock = styled.div`
  flex: 1;
`;

const Title = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0 0 4px 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.muted};
  margin: 0;
  line-height: 1.6;

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
  }
`;

const AcceptButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px ${props => props.theme.colors.primary}40;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px ${props => props.theme.colors.primary}60;
  }
`;

const DeclineButton = styled.button`
  background: transparent;
  color: ${props => props.theme.colors.muted};
  border: 1px solid ${props => props.theme.colors.muted}60;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.primary}0D;
    border-color: ${props => props.theme.colors.primary}40;
    color: ${props => props.theme.colors.primary};
  }
`;

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);
  const location = useLocation();

  const isLegalPage = ['/privacy-policy', '/terms-of-service'].includes(location.pathname);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    setHiding(true);
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible || isLegalPage) return null;

  return (
    <BannerWrapper $hiding={hiding}>
      <BannerCard>
        <CookieIcon>🍪</CookieIcon>
        <TextBlock>
          <Title>We use cookies</Title>
          <Description>
            We use essential cookies to keep you logged in and remember your preferences.
            Optional analytics help us improve EZpresence.{' '}
            <a href="/privacy-policy">Learn more</a>
          </Description>
        </TextBlock>
        <ButtonGroup>
          <DeclineButton onClick={() => dismiss('declined')}>
            Decline
          </DeclineButton>
          <AcceptButton onClick={() => dismiss('accepted')}>
            Accept All
          </AcceptButton>
        </ButtonGroup>
      </BannerCard>
    </BannerWrapper>
  );
};

export default CookieBanner;
