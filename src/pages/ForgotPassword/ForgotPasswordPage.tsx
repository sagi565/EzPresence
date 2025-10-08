import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import AuthField from '@components/Auth/AuthField/AuthField';
import { styles } from './styles';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@lib/firebase';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to send reset email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We’ll email you a reset link"
      footer={<span>Back to <Link to="/login" style={styles.link}>Login</Link></span>}
    >
      {sent ? (
        <div style={styles.notice}>
          If an account exists for <b>{email}</b>, a reset link has been sent.
        </div>
      ) : (
        <form style={styles.form} onSubmit={onSubmit}>
          <AuthField label="Email address" type="email" value={email} onChange={setEmail} autoComplete="email" />
          {err ? <div style={styles.error}>{err}</div> : null}
          <button style={styles.primaryBtn} disabled={submitting} type="submit">
            {submitting ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
