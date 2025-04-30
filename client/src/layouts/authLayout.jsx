import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext.jsx';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while checking auth state
  }

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect to login if user is not authenticated
  }

  return children; // Render the protected content if user is authenticated
}