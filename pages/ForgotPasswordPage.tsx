




import React, { useState } from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import AuthSlider from '../components/auth/AuthSlider';
import * as api from '../services/api';

const Logo = () => (
    <div className="flex flex-col items-center justify-center text-slate-800 mb-4">
        <img src="https://i.imgur.com/x3A0haK.jpeg" alt="Moshood Abiola Polytechnic Logo" className="w-24" />
        <h1 className="text-xl font-bold text-green-800 dark:text-green-400 mt-2">Moshood Abiola Polytechnic Library</h1>
    </div>
);

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      await api.forgotPassword(email);
      setMessage("If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.");
    } catch (error) {
      // For security, show the same message even on error to prevent email enumeration.
      setMessage("If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-900">
      <AuthSlider />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 shadow-xl rounded-lg p-8 space-y-6">
          <Logo />
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Forgot Your Password?</h2>
            <p className="text-slate-500 dark:text-slate-400">Enter your email and we'll send you a reset link.</p>
          </div>

          {message ? (
            <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-4 rounded-md" role="alert">
              <p className="font-bold">Check your email</p>
              <p>{message}</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your account email"
                required
              />
              <div>
                <Button type="submit" className="w-full" isLoading={isLoading}>
                  Send Reset Link
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-sm">
            <p className="text-slate-600 dark:text-slate-400">
              Remembered your password?{' '}
              <ReactRouterDOM.Link to="/login" className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300">
                Sign in
              </ReactRouterDOM.Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;