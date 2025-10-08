import React from 'react';
import { styles } from './styles';
import { useAuth } from '@auth/AuthProvider';

const SocialButtons: React.FC = () => {
  const { signInGoogle, signInFacebook } = useAuth();

  return (
    <div style={styles.container}>
      <button
        type="button"
        style={{ ...styles.btn, ...styles.googleBtn }}
        onClick={(e) => {
          e.preventDefault();
          signInGoogle();
        }}
      >
        <img src="/icons/social/google.png" alt="Google" style={styles.icon} />
        Continue with Google
      </button>
      <button
        type="button"
        style={{ ...styles.btn, ...styles.facebookBtn }}
        onClick={(e) => {
          e.preventDefault();
          signInFacebook();
        }}
      >
        <img src="/icons/social/facebook.png" alt="Facebook" style={styles.icon} />
        Continue with Facebook
      </button>
    </div>
  );
};

export default SocialButtons;
