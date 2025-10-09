import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@lib/firebase';
import { styles } from './styles';

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
      setErrorMessage('Invalid verification link');
      return;
    }

    if (mode === 'verifyEmail') {
      handleVerifyEmail(oobCode);
    } else {
      setStatus('error');
      setErrorMessage('Unsupported action');
    }
  }, [searchParams]);

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
    <div style={styles.container}>
      <div style={styles.card}>
        {status === 'loading' && (
          <>
            <div style={styles.spinner}></div>
            <h2 style={styles.title}>Verifying your email...</h2>
            <p style={styles.subtitle}>Please wait a moment</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.title}>Email Verified!</h2>
            <p style={styles.subtitle}>
              Your email has been successfully verified.
              <br />
              You can close this window now.
            </p>
            <div style={styles.autoCloseMessage}>
              Closing automatically...
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div style={styles.errorIcon}>✕</div>
            <h2 style={styles.title}>Verification Failed</h2>
            <p style={styles.errorText}>{errorMessage}</p>
            <button 
              style={styles.button}
              onClick={() => navigate('/verify-email')}
            >
              Go to Verification Page
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthActionPage;