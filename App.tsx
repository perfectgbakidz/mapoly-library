

import React from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { ToastProvider } from './context/ToastContext';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminRegistrationPage from './pages/AdminRegistrationPage';
import AdminDashboardPage from './pages/DashboardPage';
import UserDashboardPage from './pages/UserDashboardPage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage'; // New Import
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage'; // New Import
import BorrowReturnPage from './pages/BorrowReturnPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import LoanValidatorPage from './pages/LoanValidatorPage';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <ReactRouterDOM.Routes>
      <ReactRouterDOM.Route path="/login" element={<LoginPage />} />
      <ReactRouterDOM.Route path="/register" element={<RegistrationPage />} />
      <ReactRouterDOM.Route path="/admin/login" element={<AdminLoginPage />} />
      <ReactRouterDOM.Route path="/admin/register" element={<AdminRegistrationPage />} />
      <ReactRouterDOM.Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <ReactRouterDOM.Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      
      <ReactRouterDOM.Route 
        path="/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'student']}>
            <DashboardLayout>
              <ReactRouterDOM.Routes>
                <ReactRouterDOM.Route path="/" element={user?.role === 'admin' ? <ReactRouterDOM.Navigate to="/admin/dashboard" /> : <ReactRouterDOM.Navigate to="/dashboard" />} />
                
                {/* Shared Routes */}
                <ReactRouterDOM.Route path="/books" element={<ProtectedRoute allowedRoles={['admin', 'student']}><BooksPage /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/books/:id" element={<ProtectedRoute allowedRoles={['admin', 'student']}><BookDetailPage /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/borrow-return" element={<ProtectedRoute allowedRoles={['admin', 'student']}><BorrowReturnPage /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/settings" element={<ProtectedRoute allowedRoles={['admin', 'student']}><ProfileSettingsPage /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/privacy" element={<ProtectedRoute allowedRoles={['admin', 'student']}><PrivacyPolicyPage /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/terms" element={<ProtectedRoute allowedRoles={['admin', 'student']}><TermsPage /></ProtectedRoute>} />

                {/* User Routes */}
                <ReactRouterDOM.Route path="/dashboard" element={<ProtectedRoute allowedRoles={['student']}><UserDashboardPage /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <ReactRouterDOM.Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboardPage /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><UsersPage /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/users/:id" element={<ProtectedRoute allowedRoles={['admin']}><UserDetailPage /></ProtectedRoute>} />
                <ReactRouterDOM.Route path="/admin/validate-loan" element={<ProtectedRoute allowedRoles={['admin']}><LoanValidatorPage /></ProtectedRoute>} />

                {/* Redirect any other paths */}
                <ReactRouterDOM.Route path="*" element={<ReactRouterDOM.Navigate to={user?.role === 'admin' ? "/admin/dashboard" : "/dashboard"} />} />
              </ReactRouterDOM.Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </ReactRouterDOM.Routes>
  );
};


const App: React.FC = () => {
  return (
    <ToastProvider>
      <ReactRouterDOM.HashRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ReactRouterDOM.HashRouter>
    </ToastProvider>
  );
};

export default App;