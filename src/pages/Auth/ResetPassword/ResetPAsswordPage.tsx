import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@lib/firebase';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import PasswordInput from '@components/Auth/PasswordInput/PasswordInput';
import { styles } from './styles';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validating, setValidating] = useState(true);
  const [oobCode, setOobCode] = useState<string | null>(null);

  // Validate the reset code when component mounts
  useEffect(() => {
    const validateResetCode = async () => {
      const mode = searchParams.get('mode');
      const code = searchParams.get('oobCode');

      if (mode !== 'resetPassword' || !code) {
        setError('Invalid password reset link');
        setValidating(false);
        return;
      }

      try {
        // Verify the password reset code and get the email
        const userEmail = await verifyPasswordResetCode(auth, code);
        setEmail(userEmail);
        setOobCode(code);
        setValidating(false);
      } catch (err: any) {
        console.error('Error validating reset code:', err);
        
        if (err.code === 'auth/expired-action-code') {
          setError('This password reset link has expired. Please request a new one.');
        } else if (err.code === 'auth/invalid-action-code') {
          setError('This password reset link is invalid or has already been used.');
        } else {
          setError('Invalid password reset link. Please try again.');
        }
        setValidating(false);
      }
    };

    validateResetCode();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!oobCode) {
      setError('Invalid reset code');
      return;
    }

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Reset the password
      await confirmPasswordReset(auth, oobCode, password);
      
      // Show success message and redirect
      navigate('/login', { 
        state: { message: 'Password reset successfully! Please log in with your new password.' }
      });
    } catch (err: any) {
      console.error('Error resetting password:', err);
      
      if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (err.code === 'auth/expired-action-code') {
        setError('This password reset link has expired. Please request a new one.');
      } else if (err.code === 'auth/invalid-action-code') {
        setError('This password reset link is invalid or has already been used.');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (validating) {
    return (
      <AuthLayout
        title="Reset Password"
        subtitle="Validating reset link..."
      >
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Please wait...</p>
        </div>
      </AuthLayout>
    );
  }

  if (error && !oobCode) {
    return (
      <AuthLayout
        title="Invalid Link"
        subtitle="This password reset link is not valid"
      >
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>✕</div>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.primaryBtn}
            onClick={() => navigate('/forgot-password')}
          >
            Request New Reset Link
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={`Enter a new password for ${email}`}
    >
      <form style={styles.form} onSubmit={handleSubmit}>
        <PasswordInput
          label="New Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          placeholder="At least 6 characters"
        />

        <PasswordInput
          label="Confirm New Password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          placeholder="Re-enter your password"
        />

        {error && <div style={styles.error}>{error}</div>}

        <button 
          style={styles.primaryBtn} 
          disabled={submitting} 
          type="submit"
        >
          {submitting ? 'Resetting...' : 'Reset Password'}
        </button>

        <button
          type="button"
          style={styles.cancelBtn}
          onClick={() => navigate('/login')}
        >
          Cancel
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;