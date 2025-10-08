import React from 'react';
import { styles } from './styles';
import { useAuth } from '@auth/AuthProvider';

const SocialButtons: React.FC = () => {
  const { signInGoogle } = useAuth();

  return (
    <div style={styles.row}>
      <button style={styles.socialBtn} onClick={signInGoogle}>
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default SocialButtons;
