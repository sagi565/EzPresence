import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import AuthField from '@components/Auth/AuthField/AuthField';
import { styles } from './styles';
import { useAuth } from '@auth/AuthProvider';
import PasswordInput from '@components/Auth/PasswordInput/PasswordInput';

const SignUpPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { signUpEmail, user } = useAuth();
  const nav = useNavigate();

  if (user) {
    return <Navigate to="/scheduler" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await signUpEmail(email, password, displayName);
      nav('/scheduler');
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Build your presence across networks"
      footer={
        <span>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Log in
          </Link>
        </span>
      }
    >
      <form style={styles.form} onSubmit={onSubmit}>
        <AuthField
          label="Name"
          value={displayName}
          onChange={setDisplayName}
          autoComplete="name"
        />
        <AuthField
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        {err && <div style={styles.error}>{err}</div>}

        <button style={styles.primaryBtn} disabled={submitting} type="submit">
          {submitting ? 'Creating…' : 'Sign Up'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
