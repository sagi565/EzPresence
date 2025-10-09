import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@auth/AuthProvider';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // you can swap for a spinner if you like
  
  // Not logged in - redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Logged in but email not verified - redirect to verification pending page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email-pending" replace />;
  }
  
  // Logged in and email verified - allow access
  return children;
};

export default ProtectedRoute;