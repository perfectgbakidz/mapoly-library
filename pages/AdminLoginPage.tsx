




import React, { useState, useEffect } from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import AuthSlider from '../components/auth/AuthSlider';
import Spinner from '../components/common/Spinner';

const Logo = () => (
    <div className="flex flex-col items-center justify-center text-slate-800 mb-4">
        <img src="https://i.imgur.com/x3A0haK.jpeg" alt="Moshood Abiola Polytechnic Logo" className="w-24" />
        <h1 className="text-xl font-bold text-green-800 dark:text-green-400 mt-2">Moshood Abiola Polytechnic Library</h1>
    </div>
);

const AdminLoginPage: React.FC = () => {
  const [matric_no, setMatricNo] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, user } = useAuth();
  const navigate = ReactRouterDOM.useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(matric_no, password);
  };

  if (isLoading || (!isLoading && user)) {
      return <div className="flex h-screen items-center justify-center bg-slate-100 dark:bg-slate-900"><Spinner /></div>;
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900">
      <AuthSlider />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8 space-y-6">
            <Logo />
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Administrator Portal</h2>
                <p className="text-slate-500 dark:text-slate-400">Sign in to manage the Library System</p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input 
                label="Username" 
                id="matric_no" 
                type="text" 
                value={matric_no} 
                onChange={(e) => setMatricNo(e.target.value)} 
                placeholder="Enter your username"
                required 
              />
              <Input 
                label="Password" 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter your password"
                required 
              />
              <div className="text-right text-sm">
                  <ReactRouterDOM.Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                      Forgot your password?
                  </ReactRouterDOM.Link>
              </div>
              <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Sign In as Admin
                </Button>
              </div>
            </form>
            <div className="text-center text-sm space-y-2">
                <p className="text-slate-600 dark:text-slate-400">
                    Need to create an admin account?{' '}
                    <ReactRouterDOM.Link to="/admin/register" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                        Register here
                    </ReactRouterDOM.Link>
                </p>
                 <p className="text-slate-600 dark:text-slate-400 text-xs">
                    Not an administrator?{' '}
                    <ReactRouterDOM.Link to="/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                        Go to Student Login
                    </ReactRouterDOM.Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;