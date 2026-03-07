import styled from 'styled-components';
import { theme } from '@theme/theme';
import { media } from '@/styles/breakpoints';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

export const Content = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 40px;
  position: relative;
  z-index: 1;

  ${media.phone} {
    padding: 24px 16px;
  }
`;

export const GreetingSection = styled.div`
  margin-bottom: 40px;
  text-align: left;

  ${media.phone} {
    margin-bottom: 24px;
  }
`;

export const Greeting = styled.h1`
  font-size: 48px;
  font-weight: 800;
  color: ${theme.colors.text};
  margin-bottom: 8px;
  letter-spacing: -1px;
  font-family: 'Figtree, ui-sans-serif, system-ui, sans-serif';

  ${media.phone} {
    font-size: 32px;
  }
`;

export const NameHighlight = styled.span`
  background: ${theme.gradients.innovator};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const Subtitle = styled.p`
  font-size: 18px;
  color: ${theme.colors.muted};

  ${media.phone} {
    font-size: 16px;
  }
`;

export const GridContainer = styled.div`
  background: white;
  border-radius: 28px;
  padding: 32px;
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(155, 93, 229, 0.08);

  ${media.phone} {
    padding: 20px;
    border-radius: 16px;
  }
`;
