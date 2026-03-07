import styled from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

export const Shell = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

export const Header = styled.div`
  position: absolute;
  top: 16px;
  left: 24px;
  z-index: 10;
`;

export const Brand = styled.span`
  font-size: 40px;
  font-weight: 900;
  background-image: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
`;

export const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden;

  ${media.tablet} {
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

export const CenterPane = styled.div`
  position: relative;
  flex: 0 1 110%;
  display: flex;
  z-index: 10000;
  align-items: center;
  justify-content: center;

  ${media.tablet} {
    flex: 1;
    width: 100%;
    padding: 0 20px;
  }
`;

export const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.md};
  padding: 28px;

  ${media.tablet} {
    max-width: 100%;
    padding: 24px 20px;
    box-shadow: none;
    background-color: rgba(23, 23, 23, 0.7);
    backdrop-filter: blur(10px);
  }
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: 800;
  background-image: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 12px;

  ${media.tablet} {
    font-size: 28px;
  }
`;

export const Subtitle = styled.p`
  color: ${theme.colors.muted};
  margin-bottom: 20px;

  ${media.tablet} {
    font-size: 14px;
  }
`;

export const FormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FooterArea = styled.div`
  margin-top: 16px;
  color: ${theme.colors.muted};
  font-size: 14px;

  ${media.tablet} {
    text-align: center;
  }
`;

export const ImagePane = styled.div`
  flex: 0 1 75%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  overflow: hidden;

  ${media.tablet} {
    display: none;
  }
`;

export const HeroImg = styled.img`
  height: 100%;
  width: auto;
  z-index: 5000;
  object-fit: cover;
  user-select: none;
`;
