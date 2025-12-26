import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@auth/AuthProvider';
import { useBrands } from '@hooks/useBrands';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { brands, loading: brandsLoading } = useBrands();
  const location = useLocation();
  const [shouldRedirectToBrandCreation, setShouldRedirectToBrandCreation] = useState(false);
  
  // Wait for both auth and brands to finish loading
  useEffect(() => {
    if (!authLoading && !brandsLoading && user && user.emailVerified) {
      // Check if user has no brands and is not already on the create brand page
      const hasBrands = brands && brands.length > 0;
      const isOnCreateBrandPage = location.pathname === '/create-your-first-brand';
      
      if (!hasBrands && !isOnCreateBrandPage) {
        setShouldRedirectToBrandCreation(true);
      } else {
        setShouldRedirectToBrandCreation(false);
      }
    }
  }, [authLoading, brandsLoading, user, brands, location.pathname]);
  
  // Show loading spinner while checking auth and brands
  if (authLoading || brandsLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(155, 93, 229, 0.2)',
          borderTopColor: '#9b5de5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: 500 }}>Loading...</p>
      </div>
    );
  }
  
  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Logged in but email not verified - redirect to verification pending page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  // Redirect to brand creation if no brands (unless already on that page)
  if (shouldRedirectToBrandCreation) {
    return <Navigate to="/create-your-first-brand" replace />;
  }
  
  // Logged in, verified, and has brands (or on brand creation page) - allow access
  return children;
};

export default ProtectedRoute;