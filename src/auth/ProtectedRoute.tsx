//
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@auth/AuthProvider';
import { useBrands } from '@/hooks/brands/useBrands';
import { useUserProfile } from '@/hooks/user/useUserProfile';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, notFound: profileNotFound } = useUserProfile();
  const { hasBrands, loading: brandsLoading } = useBrands();
  
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
  const isLoading = 
    authLoading || 
    (user && profileLoading) || 
    (user && profile && brandsLoading);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setRedirectPath('/login');
      return;
    }

    if (!user.emailVerified) {
      setRedirectPath('/verify-email');
      return;
    }

    if (profileLoading) return;

    // Only redirect if explicitly Not Found (404), otherwise wait/retry
    if (!profile) {
      if (profileNotFound) {
        setRedirectPath('/tell-us-who-you-are');
      }
      return;
    }

    if (brandsLoading) return;

    if (!hasBrands) {
      setRedirectPath('/create-your-first-brand');
      return;
    }

    setRedirectPath(null);

  }, [authLoading, profileLoading, brandsLoading, user, profile, hasBrands, profileNotFound]);
  
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
        background: 'linear-gradient(135deg, #f9fafb 0%, rgba(155, 93, 229, 0.03) 50%, #f9fafb 100%)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(155, 93, 229, 0.2)',
          borderTopColor: '#9b5de5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: 500 }}>
          Loading...
        </p>
      </div>
    );
  }
  
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

export default ProtectedRoute;