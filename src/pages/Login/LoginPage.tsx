import React, { useState } from 'react';
import { styles } from './styles';
import { auth, googleProvider, facebookProvider } from '@lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/studio');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = async (provider: any) => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, provider);
      navigate('/studio');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign in to your account</h2>

        <input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
          onClick={handleEmailLogin}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div style={styles.toggleText}>
          <Link to="/signup" style={styles.toggleLink}>
            Don’t have an account? Sign up
          </Link>
        </div>

        <div style={styles.dividerContainer}>
          <div style={styles.dividerLine} />
          <div style={styles.dividerText}>or continue with</div>
          <div style={styles.dividerLine} />
        </div>

        <button
          style={{ ...styles.socialButton, background: '#DB4437' }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.socialHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.socialButton)}
          onClick={() => handleSocial(googleProvider)}
        >
          Continue with Google
        </button>

        <button
          style={{ ...styles.socialButton, background: '#1877F2' }}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.socialHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.socialButton)}
          onClick={() => handleSocial(facebookProvider)}
        >
          Continue with Facebook
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
