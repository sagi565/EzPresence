import React, { useState } from 'react';
import { styles } from './styles';
import { auth } from '@lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });
      navigate('/studio');
    } catch (err: any) {
      setError(err.message || 'Sign-up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create your account</h2>

        <input
          style={styles.input}
          placeholder="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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

        <input
          style={styles.input}
          placeholder="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={styles.button}
          onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.buttonHover)}
          onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.button)}
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>

        <div style={styles.toggleText}>
          <Link to="/login" style={styles.toggleLink}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
