

import React from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Spinner from '../common/Spinner';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: Array<'admin' | 'student'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = ReactRouterDOM.useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Spinner /></div>;
  }

  if (!user) {
    return <ReactRouterDOM.Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!allowedRoles.includes(user.role!)) {
     // Redirect unauthorized users to their respective dashboards or login
    const fallbackPath = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return <ReactRouterDOM.Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;