import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import AuthField from '@components/Auth/AuthField/AuthField';
import SocialButtons from '@components/Auth/SocialButtons/SocialButtons';
import { styles } from './styles';
import { useAuth } from '@auth/AuthProvider';
import PasswordInput from '@components/Auth/PasswordInput/PasswordInput';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { signInEmail, user } = useAuth();
  const nav = useNavigate();

  if (user) {
    return <Navigate to="/scheduler" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await signInEmail(email, password);
      nav('/scheduler');
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Log In"
      subtitle="Manage your network presence effortlessly"
      footer={
        <span>
          Don’t have an account?{' '}
          <Link to="/signup" style={styles.link}>
            Sign up
          </Link>
        </span>
      }
    >
      <form style={styles.form} onSubmit={onSubmit}>
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

        <Link to="/forgot-password" style={styles.forgotLink}>
          Forgot Password?
        </Link>

        {err && <div style={styles.error}>{err}</div>}

        <button style={styles.primaryBtn} disabled={submitting} type="submit">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>

        {/* Divider line + or in middle */}
        <div style={styles.orContainer}>
          <div style={styles.line} />
          <span style={styles.orText}>or</span>
          <div style={styles.line} />
        </div>

        <SocialButtons />
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
