import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { useAuth } from '@auth/AuthProvider';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import { styles } from './styles';

const VerifyEmailPendingPage: React.FC = () => {
  const { user, logout, checkEmailVerification } = useAuth();
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  // Auto-redirect if email becomes verified
  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/scheduler', { replace: true });
    }
  }, [user?.emailVerified, navigate]);

  const handleResendEmail = async () => {
    if (!auth.currentUser) return;
    
    setSending(true);
    setError('');
    
    try {
      await sendEmailVerification(auth.currentUser, {
        url: window.location.origin + '/scheduler',
        handleCodeInApp: false,
      });
      setSent(true);
      setTimeout(() => setSent(false), 5000);
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError('Failed to send verification email. Please try again.');
      }
    } finally {
      setSending(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const handleCheckVerification = async () => {
    setChecking(true);
    setError('');
    
    const isVerified = await checkEmailVerification();
    
    if (isVerified) {
      navigate('/scheduler', { replace: true });
    } else {
      setError('Email not yet verified. Please check your inbox and click the verification link.');
      setTimeout(() => setError(''), 5000);
    }
    
    setChecking(false);
  };

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We've sent a verification link to your email"
    >
      <div style={styles.container}>
        <div style={styles.emailInfo}>
          <div style={styles.icon}>📧</div>
          <p style={styles.emailText}>
            We sent a verification email to:
          </p>
          <p style={styles.emailAddress}>{user?.email}</p>
        </div>

        <div style={styles.instructions}>
          <p style={styles.instructionText}>
            Please check your inbox and click the verification link to activate your account.
          </p>
          <p style={styles.note}>
            Don't see the email? Check your spam folder.
          </p>
          <p style={styles.autoDetectNote}>
            ✨ Your verification will be detected automatically
          </p>
        </div>

        {sent && (
          <div style={styles.successNotice}>
            ✓ Verification email sent! Please check your inbox.
          </div>
        )}

        {error && (
          <div style={styles.errorNotice}>
            {error}
          </div>
        )}

        <div style={styles.actions}>
          <button
            style={styles.primaryButton}
            onClick={handleCheckVerification}
            disabled={checking}
          >
            {checking ? (
              <>
                <span className="loading-dots" style={{ marginRight: '8px' }}>
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
                Checking...
              </>
            ) : (
              "I've Verified My Email"
            )}
          </button>

          <button
            style={styles.secondaryButton}
            onClick={handleResendEmail}
            disabled={sending || sent}
          >
            {sending ? 'Sending...' : sent ? 'Email Sent!' : 'Resend Verification Email'}
          </button>

          <button
            style={styles.textButton}
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPendingPage;