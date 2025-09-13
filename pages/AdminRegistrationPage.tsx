


import React, { useState, useEffect } from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import AuthSlider from '../components/auth/AuthSlider';
import Spinner from '../components/common/Spinner';

const Logo = () => (
    <div className="flex flex-col items-center justify-center text-slate-800 mb-4">
        <img src="public/logo.jpeg" alt="Moshood Abiola Polytechnic Logo" className="w-24" />
        <h1 className="text-xl font-bold text-green-800 mt-2">Moshood Abiola Polytechnic Library</h1>
    </div>
);

const AdminRegistrationPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        matric_no: '',
        department: '',
        password: '',
        admin_code: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register, isLoading, user } = useAuth();
    const { addToast } = useToast();
    const navigate = ReactRouterDOM.useNavigate();

    useEffect(() => {
        if (!isLoading && user) {
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
        }
    }, [user, isLoading, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            addToast('Passwords do not match.', 'error');
            return;
        }
        await register({ ...formData, role: 'admin' });
    };

    if (isLoading || (!isLoading && user)) {
      return <div className="flex h-screen items-center justify-center bg-slate-100"><Spinner /></div>;
    }

    return (
       <div className="min-h-screen flex bg-slate-100">
         <AuthSlider />
         <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 space-y-6">
                <Logo />
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800">Administrator Registration</h1>
                    <p className="text-slate-500">Create a new administrator account</p>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input label="Full Name" id="name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Username" id="matric_no" name="matric_no" value={formData.matric_no} onChange={handleChange} required />
                    <Input label="Department" id="department" name="department" value={formData.department} onChange={handleChange} required />
                    <Input label="Password" id="password" name="password" type="password" value={formData.password} onChange={handleChange} required />
                    <Input label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <Input label="Admin Code" id="admin_code" name="admin_code" placeholder="Enter the secret admin code" value={formData.admin_code} onChange={handleChange} required />

                    <div className="pt-2">
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Register Admin Account
                        </Button>
                    </div>
                </form>
                <div className="text-center text-sm">
                    <p className="text-slate-600">
                        Already have an admin account?{' '}
                        <ReactRouterDOM.Link to="/admin/login" className="font-medium text-green-600 hover:text-green-500">
                            Sign in here
                        </ReactRouterDOM.Link>
                    </p>
                </div>
            </div>
         </div>
       </div>
    );
};

export default AdminRegistrationPage;