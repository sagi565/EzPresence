import React from 'react';
import { Container, GoogleBtn, FacebookBtn, Icon } from './styles';
import { useAuth } from '@auth/AuthProvider';

const SocialButtons: React.FC = () => {
  const { signInGoogle, signInFacebook } = useAuth();

  return (
    <Container>
      <GoogleBtn
        type="button"
        onClick={(e) => {
          e.preventDefault();
          signInGoogle();
        }}
      >
        <Icon src="/icons/social/google.png" alt="Google" />
        Continue with Google
      </GoogleBtn>
      <FacebookBtn
        type="button"
        onClick={(e) => {
          e.preventDefault();
          signInFacebook();
        }}
      >
        <Icon src="/icons/social/facebook.png" alt="Facebook" />
        Continue with Facebook
      </FacebookBtn>
    </Container>
  );
};

export default SocialButtons;
