import styled, { css } from 'styled-components';
import { theme } from '@theme/theme';

export const PageContainer = styled.div`
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const StudioContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ProducerContainer = styled.div`
  width: 80%;
  maxWidth: 80vw;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
  overflow: hidden;

  @media (max-width: 768px) {
    width: 95%;
    maxWidth: 95vw;
    padding: 16px;
  }
`;

export const DefaultContent = styled.div`
  padding: 40px 24px;
  height: calc(100vh - 76px);
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const ContentHeader = styled.div`
  textAlign: center;
  marginBottom: 40px;
`;

export const ContentTitle = styled.h1`
  font-size: 48px;
  font-weight: 800;
  background: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

export const ContentSubtitle = styled.p`
  font-size: 18px;
  color: ${theme.colors.muted};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const StudioFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FeatureCard = styled.div<{ $isPremium?: boolean }>`
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(155, 93, 229, 0.1);
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  ${props => props.$isPremium && css`
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
    border-color: ${theme.colors.secondary};
  `}

  &:hover {
    transform: translateY(-5px);
    border-color: ${theme.colors.primary};
    background: white;
  }
`;

export const FeatureIcon = styled.span`
  font-size: 64px;
  margin-bottom: 20px;
  display: block;
`;

export const FeatureTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text};
  margin-bottom: 12px;
`;

export const FeatureDescription = styled.p`
  color: ${theme.colors.muted};
  line-height: 1.6;
`;

export const CreatorsContainer = styled.div`
  height: calc(100vh - 76px);
  overflow: hidden;
  position: relative;
`;