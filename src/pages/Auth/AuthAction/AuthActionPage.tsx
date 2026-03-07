import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { Container, Card, Spinner, SuccessIcon, ErrorIcon, Title, Subtitle, ErrorText, AutoCloseMessage, Button } from './styles';

const AuthActionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (!mode || !oobCode) {
      setStatus('error');
      setErrorMessage('Invalid action link');
      return;
    }

    // Handle different action modes
    if (mode === 'verifyEmail') {
      handleVerifyEmail(oobCode);
    } else if (mode === 'resetPassword') {
      // Redirect to the reset password page with the code
      navigate(`/reset-password?mode=resetPassword&oobCode=${oobCode}`, { replace: true });
    } else {
      setStatus('error');
      setErrorMessage('Unsupported action');
    }
  }, [searchParams, navigate]);

  const handleVerifyEmail = async (oobCode: string) => {
    try {
      // Apply the verification code
      await applyActionCode(auth, oobCode);
      
      // Reload the user to get updated emailVerified status
      if (auth.currentUser) {
        await auth.currentUser.reload();
      }
      
      setStatus('success');
      
      // Close this tab after 2 seconds, or redirect if it's the only tab
      setTimeout(() => {
        // Try to close the window (works if opened via window.open)
        window.close();
        
        // If window.close didn't work (main tab), redirect to app
        setTimeout(() => {
          navigate('/scheduler');
        }, 100);
      }, 2000);
      
    } catch (error: any) {
      console.error('Verification error:', error);
      setStatus('error');
      
      if (error.code === 'auth/invalid-action-code') {
        setErrorMessage('This verification link is invalid or has already been used.');
      } else if (error.code === 'auth/expired-action-code') {
        setErrorMessage('This verification link has expired. Please request a new one.');
      } else {
        setErrorMessage('Failed to verify email. Please try again.');
      }
    }
  };

  return (
    <Container>
      <Card>
        {status === 'loading' && (
          <>
            <Spinner />
            <Title>Processing...</Title>
            <Subtitle>Please wait a moment</Subtitle>
          </>
        )}
        
        {status === 'success' && (
          <>
            <SuccessIcon>✓</SuccessIcon>
            <Title>Email Verified!</Title>
            <Subtitle>
              Your email has been successfully verified.
              <br />
              You can close this window now.
            </Subtitle>
            <AutoCloseMessage>
              Closing automatically...
            </AutoCloseMessage>
          </>
        )}
        
        {status === 'error' && (
          <>
            <ErrorIcon>✕</ErrorIcon>
            <Title>Action Failed</Title>
            <ErrorText>{errorMessage}</ErrorText>
            <Button onClick={() => navigate('/login')}>
              Go to Login
            </Button>
          </>
        )}
      </Card>
    </Container>
  );
};

export default AuthActionPage;