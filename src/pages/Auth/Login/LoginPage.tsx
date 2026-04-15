import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import AuthField from '@components/Auth/AuthField/AuthField';
import SocialButtons from '@components/Auth/SocialButtons/SocialButtons';
import { Form, StyledLink, ForgotLink, PrimaryBtn, OrContainer, Line, OrText, ErrorText, SuccessMessage } from './styles';
import { useAuth } from '@auth/AuthProvider';
import PasswordInput from '@components/Auth/PasswordInput/PasswordInput';

// Map Firebase auth errors to friendly messages (login)
function mapLoginError(err: any): string {
  const code = (typeof err?.code === 'string' ? err.code : '').toLowerCase();
  const msg  = (typeof err?.message === 'string' ? err.message : '').toLowerCase();

  // Firebase may mask wrong email/password as "invalid-credential"
  if (
    code.includes('invalid-credential') ||
    code.includes('wrong-password') ||
    code.includes('user-not-found') ||
    msg.includes('invalid-credential')
  ) {
    return 'Incorrect email or password. Please try again.';
  }

  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Please wait a moment and try again.';
  if (code.includes('network-request-failed')) return 'Network issue. Please check your connection and try again.';

  return 'Something went wrong. Please try again later.';
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signInEmail, user } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  // Check if there's a success message from password reset
  useEffect(() => {
    const state = location.state as { message?: string };
    if (state?.message) {
      setSuccessMessage(state.message);
      // Clear the message after 7 seconds
      setTimeout(() => setSuccessMessage(null), 7000);
      // Clear the location state
      nav(location.pathname, { replace: true });
    }
  }, [location, nav]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await signInEmail(email, password);
      nav('/');
    } catch (e: any) {
      setErr(mapLoginError(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Log In"
      subtitle="Manage your network presence effortlessly"
      footer={
        <span>
          Don't have an account?{' '}
          <StyledLink to="/signup">
            Sign up
          </StyledLink>
        </span>
      }
    >
      <Form onSubmit={onSubmit}>
        {successMessage && (
          <SuccessMessage>
            ✓ {successMessage}
          </SuccessMessage>
        )}

        <AuthField
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <ForgotLink to="/forgot-password">
          Forgot Password?
        </ForgotLink>

        {err && <ErrorText>{err}</ErrorText>}

        <PrimaryBtn disabled={submitting} type="submit">
          {submitting ? 'Signing in…' : 'Sign in'}
        </PrimaryBtn>

        {/* Divider line + or in middle */}
        <OrContainer>
          <Line />
          <OrText>or</OrText>
          <Line />
        </OrContainer>

        <SocialButtons />
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;