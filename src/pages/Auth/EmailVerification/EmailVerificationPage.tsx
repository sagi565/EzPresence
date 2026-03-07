import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import { useAuth } from '@auth/AuthProvider';
import { Container, EmailDisplay, EmailIcon, EmailText, NoteText, SuccessMessage, ErrorMessage, Actions, ResendButton, LogoutButton, CheckingStatus, Spinner } from './styles';

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="We've sent a verification link to your email"
    >
      <Container>
        <EmailDisplay>
          <EmailIcon>📧</EmailIcon>
          <EmailText>{user.email}</EmailText>
        </EmailDisplay>

        <NoteText>
          Click the verification link in the email
        </NoteText>

        {resendSuccess && (
          <SuccessMessage>
            ✓ Verification email sent successfully!
          </SuccessMessage>
        )}

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <Actions>
          <ResendButton
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </ResendButton>

          <LogoutButton
            onClick={handleLogout}
          >
            Sign Out
          </LogoutButton>
        </Actions>

        <CheckingStatus>
          <Spinner />
          <span>Checking verification status...</span>
        </CheckingStatus>
      </Container>
    </AuthLayout>
  );
};

export default EmailVerificationPage;