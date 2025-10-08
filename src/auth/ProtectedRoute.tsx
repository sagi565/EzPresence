import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@auth/AuthProvider';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // you can swap for a spinner if you like
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
