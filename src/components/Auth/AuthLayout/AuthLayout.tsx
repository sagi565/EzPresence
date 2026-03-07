import React from 'react';
import { Shell, Header, Brand, ContentContainer, CenterPane, Card, Title, Subtitle, FormArea, FooterArea, ImagePane, HeroImg } from './styles';
import { Link } from 'react-router-dom';
import SocialsBackground from '@components/Background/SocialsBackground';
import Footer from '@components/Footer/Footer';

const AuthLayout: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ title, subtitle, children, footer }) => {
  return (
    <Shell>
      <SocialsBackground />
      <Header>
        <Link to="/">
          <Brand>EZpresence</Brand>
        </Link>
      </Header>
      <ContentContainer>
        <CenterPane>
          <Card>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            <FormArea>{children}</FormArea>
            {footer && <FooterArea>{footer}</FooterArea>}
          </Card>
          <Footer />
        </CenterPane>
        <ImagePane>
          <HeroImg
            src="/icons/login-image.png"
            alt="Auth illustration"
          />
        </ImagePane>
      </ContentContainer>
    </Shell>
  );
};

export default AuthLayout;
