import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import AuthField from '@components/Auth/AuthField/AuthField';
import SocialButtons from '@components/Auth/SocialButtons/SocialButtons';
import { styles } from './styles';
import { useAuth } from '@auth/AuthProvider';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { signInEmail, user } = useAuth();
  const nav = useNavigate();

  if (user) return <Navigate to="/scheduler" replace />;

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
      title="Welcome back"
      subtitle="Please enter your details"
      footer={
        <span>
          Don’t have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
        </span>
      }
    >
      <form style={styles.form} onSubmit={onSubmit}>
        <AuthField label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} autoComplete="current-password" />
        <div style={styles.rowBetween}>
          <label style={styles.rememberLabel}>
            <input type="checkbox" style={{ marginRight: 8 }} /> Remember for 30 days
          </label>
          <Link to="/forgot-password" style={styles.link}>Forgot password</Link>
        </div>
        {err ? <div style={styles.error}>{err}</div> : null}
        <button style={styles.primaryBtn} disabled={submitting} type="submit">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
        <div style={styles.divider}><span>or</span></div>
        <SocialButtons />
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
