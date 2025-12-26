import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@auth/AuthProvider';
import { useBrands } from '@hooks/useBrands';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { brands, loading: brandsLoading, error: brandsError, hasBrands } = useBrands();
  const location = useLocation();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
  // Determine redirect path based on auth and brand state
  useEffect(() => {
    // Still loading, don't decide yet
    if (authLoading) {
      setRedirectPath(null);
      return;
    }
    
    // Not logged in
    if (!user) {
      setRedirectPath('/login');
      return;
    }
    
    // Logged in but email not verified
    if (!user.emailVerified) {
      setRedirectPath('/verify-email');
      return;
    }
    
    // Still loading brands
    if (brandsLoading) {
      setRedirectPath(null);
      return;
    }
    
    // Check if on create brand page
    const isOnCreateBrandPage = location.pathname === '/create-your-first-brand';
    
    // If brands failed to load with an error (like network timeout)
    // Allow access to the page but show error state there
    if (brandsError && !isOnCreateBrandPage) {
      // We'll let the page handle the error display
      setRedirectPath(null);
      return;
    }
    
    // User is verified, check if they have brands
    if (!hasBrands && !isOnCreateBrandPage) {
      // No brands, redirect to create brand page
      setRedirectPath('/create-your-first-brand');
      return;
    }
    
    // Has brands and trying to access create brand page - redirect to scheduler
    if (hasBrands && isOnCreateBrandPage) {
      setRedirectPath('/scheduler');
      return;
    }
    
    // All good, no redirect needed
    setRedirectPath(null);
  }, [authLoading, brandsLoading, user, hasBrands, brandsError, location.pathname]);
  
  // Show loading spinner while checking auth and brands
  if (authLoading || (brandsLoading && user?.emailVerified)) {
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
        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: 500 }}>
          {authLoading ? 'Checking authentication...' : 'Loading your brands...'}
        </p>
      </div>
    );
  }
  
  // Handle redirects
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // All checks passed, render children
  return children;
};

export default ProtectedRoute;