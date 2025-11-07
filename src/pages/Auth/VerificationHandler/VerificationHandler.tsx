import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import { useAuth } from '@auth/AuthProvider';
import { styles } from './styles';

const EmailVerificationPage: React.FC = () => {
  const { user, refreshUser, resendVerificationEmail, logout } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Poll for email verification every 3 seconds
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If already verified, redirect
    if (user.emailVerified) {
      navigate('/scheduler');
      return;
    }

    const interval = setInterval(async () => {
      await refreshUser();
    }, 3000);

    return () => clearInterval(interval);
  }, [user, navigate, refreshUser]);

  // Redirect when verified
  useEffect(() => {
    if (user?.emailVerified) {
      navigate('/scheduler');
    }
  }, [user?.emailVerified, navigate]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setError(null);
    setResendSuccess(false);

    try {
      await resendVerificationEmail();
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  const handleBack = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We've sent a verification link to your email"
    >
      <div style={styles.container}>
        <div style={styles.emailDisplay}>
          <span style={styles.emailIcon}>📧</span>
          <span style={styles.email}>{user.email}</span>
        </div>

        <p style={styles.instructions}>
          Click the verification link in your email to continue.
          <br />
          Check your spam folder if you don't see it.
        </p>

        {resendSuccess && (
          <div style={styles.successMessage}>
            ✓ Verification email sent successfully!
          </div>
        )}

        {error && (
          <div style={styles.errorMessage}>
            {error}
          </div>
        )}

        <div style={styles.checkingStatus}>
          <div style={styles.spinner}></div>
          <span>Checking verification status...</span>
        </div>

        <div style={styles.actions}>
          <button
            style={styles.resendButton}
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Email'}
          </button>

          <button
            style={styles.backButton}
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default EmailVerificationPage;