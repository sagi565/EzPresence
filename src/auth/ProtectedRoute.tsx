import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@auth/AuthProvider';
import { useBrands } from '@/hooks/brands/useBrands';
import { useUserProfile } from '@/hooks/user/useUserProfile';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  // We use the raw 'profile' object to check for existence (null = 404/Not Found)
  const { profile, loading: profileLoading } = useUserProfile();
  const { hasBrands, loading: brandsLoading } = useBrands();
  
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
  // Calculate a combined loading state to prevent flashing redirects
  // We only care about brand loading if the profile actually exists
  const isLoading = 
    authLoading || 
    (user && profileLoading) || 
    (user && profile && brandsLoading);

  useEffect(() => {
    // 1. Wait for Auth to initialize
    if (authLoading) return;

    // 2. Not Logged In -> Redirect to Login
    if (!user) {
      setRedirectPath('/login');
      return;
    }

    // 3. Email Not Verified -> Redirect to Verification
    if (!user.emailVerified) {
      setRedirectPath('/verify-email');
      return;
    }

    // 4. Wait for Profile to load
    if (profileLoading) return;

    // 5. Missing Profile (API 404) -> Redirect to Create User
    if (!profile) {
      setRedirectPath('/tell-us-who-you-are');
      return;
    }

    // 6. Wait for Brands to load (Only if profile exists)
    if (brandsLoading) return;

    // 7. No Brands found -> Redirect to Create Brand
    if (!hasBrands) {
      setRedirectPath('/create-your-first-brand');
      return;
    }

    // 8. All checks passed -> Stay on current protected route
    setRedirectPath(null);

  }, [authLoading, profileLoading, brandsLoading, user, profile, hasBrands]);
  
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
          {authLoading ? 'Verifying session...' : 
           profileLoading ? 'Checking profile...' : 
           'Loading brands...'}
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