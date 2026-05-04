import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import AuthLayout from '@components/Auth/AuthLayout/AuthLayout';
import AuthField from '@components/Auth/AuthField/AuthField';
import { Form, StyledLink, PrimaryBtn, ErrorText, FooterText } from './styles';
import { useAuth } from '@auth/AuthProvider';
import PasswordInput from '@components/Auth/PasswordInput/PasswordInput';
import { ArrowRight } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { signUpEmail, user } = useAuth();
  const nav = useNavigate();

  // If already logged in and verified, redirect to scheduler
  if (user && user.emailVerified) {
    return <Navigate to="/scheduler" replace />;
  }

  // If logged in but not verified, redirect to pending page
  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      await signUpEmail(email, password, displayName);
      // After successful signup, redirect to verification pending page
      nav('/verify-email');
    } catch (e: any) {
      setErr(e?.message ?? 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Sign Up"
      subtitle="Build your presence across networks"
      footer={
        <FooterText>
          Already have an account?{' '}
          <StyledLink to="/login">
            Log in <ArrowRight size={16} />
          </StyledLink>
        </FooterText>
      }
    >
      <Form onSubmit={onSubmit}>
        <AuthField
          label="Name"
          value={displayName}
          onChange={setDisplayName}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />

        {err && <ErrorText>{err}</ErrorText>}

        <PrimaryBtn disabled={submitting} type="submit">
          {submitting ? 'Creating…' : 'Sign Up'}
        </PrimaryBtn>
      </Form>
    </AuthLayout>
  );
};

export default SignUpPage;