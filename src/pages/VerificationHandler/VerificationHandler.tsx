import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@lib/firebase';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import { styles } from './styles';

const VerificationHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleVerification = async () => {
      const mode = searchParams.get('mode');
      const oobCode = searchParams.get('oobCode');

      // Handle email verification
      if (mode === 'verifyEmail' && oobCode) {
        try {
          // Apply the verification code
          await applyActionCode(auth, oobCode);
          
          setStatus('success');
          
          // Wait 2 seconds to show success message, then redirect
          setTimeout(() => {
            // If user is logged in, go to app
            if (auth.currentUser) {
              navigate('/scheduler', { replace: true });
            } else {
              // If not logged in, go to login
              navigate('/login', { replace: true });
            }
          }, 2000);
        } catch (error: any) {
          console.error('Verification error:', error);
          setStatus('error');
          
          if (error.code === 'auth/expired-action-code') {
            setErrorMessage('This verification link has expired. Please request a new one.');
          } else if (error.code === 'auth/invalid-action-code') {
            setErrorMessage('This verification link is invalid or has already been used.');
          } else {
            setErrorMessage('Failed to verify email. Please try again.');
          }
          
          // Redirect to verify-email page after 3 seconds
          setTimeout(() => {
            navigate('/verify-email', { replace: true });
          }, 3000);
        }
      } else {
        // Invalid parameters
        setStatus('error');
        setErrorMessage('Invalid verification link.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleVerification();
  }, [searchParams, navigate]);

  return (
    <AuthLayout
      title={
        status === 'verifying'
          ? 'Verifying Email...'
          : status === 'success'
          ? 'Email Verified!'
          : 'Verification Failed'
      }
      subtitle={
        status === 'verifying'
          ? 'Please wait while we verify your email'
          : status === 'success'
          ? 'Your email has been successfully verified'
          : 'There was a problem verifying your email'
      }
    >
      <div style={styles.container}>
        {status === 'verifying' && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Verifying your email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={styles.successContainer}>
            <div style={styles.successIcon}>✓</div>
            <p style={styles.successText}>
              Your email has been verified successfully!
            </p>
            <p style={styles.redirectText}>
              Redirecting you to the app...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>✕</div>
            <p style={styles.errorText}>{errorMessage}</p>
            <p style={styles.redirectText}>
              Redirecting...
            </p>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerificationHandler;