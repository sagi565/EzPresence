import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import AuthField from '@components/Auth/AuthField/AuthField';
import SocialButtons from '@components/Auth/SocialButtons/SocialButtons';
import { styles } from './styles';
import { useAuth } from '@auth/AuthProvider';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { signUpEmail, user } = useAuth();
  const nav = useNavigate();

  if (user) return <Navigate to="/scheduler" replace />;

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
      title="Create your account"
      subtitle="Start scheduling across platforms"
      footer={<span>Already have an account? <Link to="/login" style={styles.link}>Log in</Link></span>}
    >
      <form style={styles.form} onSubmit={onSubmit}>
        <AuthField label="Name" value={displayName} onChange={setDisplayName} placeholder="Your name" />
        <AuthField label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email" />
        <AuthField label="Password" type="password" value={password} onChange={setPassword} autoComplete="new-password" />
        {err ? <div style={styles.error}>{err}</div> : null}
        <button style={styles.primaryBtn} disabled={submitting} type="submit">
          {submitting ? 'Creating…' : 'Sign up'}
        </button>
        <div style={styles.divider}><span>or</span></div>
        <SocialButtons />
      </form>
    </AuthLayout>
  );
};

export default SignUpPage;
