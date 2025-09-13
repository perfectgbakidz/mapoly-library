


import React, { useState, useEffect, useCallback } from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { UserDetails, LoanWithDetails, Loan } from '../types';
import * as api from '../services/api';
import { useToast } from '../hooks/useToast';
import Spinner from '../components/common/Spinner';

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
};

const statusPill = (loan: LoanWithDetails) => {
    const styles: Record<LoanWithDetails['status'], string> = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300',
        returned: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
        'on-hold': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300',
    };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // An active loan is overdue if it's not returned and past its due date.
    const isOverdue = loan.status === 'approved' && !loan.returnDate && loan.dueDate && new Date(loan.dueDate) < today;

    if (isOverdue) {
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-300">Overdue</span>;
    }
    
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[loan.status]}`}>{loan.status}</span>;
};


const UserDetailPage: React.FC = () => {
    const { id } = ReactRouterDOM.useParams<{ id: string }>();
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    const fetchUserDetails = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await api.getUserDetails(Number(id));
            setUserDetails(data);
        } catch (error) {
            addToast('Failed to fetch user details.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [id, addToast]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    if (isLoading) return <Spinner />;
    if (!userDetails) return <div className="text-center p-8">User not found.</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                 <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="shrink-0">
                         {userDetails.profilePictureUrl ? (
                            <img src={userDetails.profilePictureUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                            <div className="w-24 h-24 bg-green-700 dark:bg-green-600 rounded-full flex items-center justify-center text-white font-bold uppercase text-4xl">
                              {userDetails.name?.[0] || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="text-center sm:text-left">
                         <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-200">{userDetails.name}</h1>
                         <p className="text-md text-slate-500 dark:text-slate-400 capitalize">{userDetails.role}</p>
                         <p className="text-md text-slate-500 dark:text-slate-400">{userDetails.department}</p>
                         <p className="text-md text-slate-500 dark:text-slate-400">{userDetails.matric_no}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b dark:border-slate-700 pb-3 mb-4">Loan History ({userDetails.loans.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700 hidden md:table-header-group">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Book Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Requested</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Returned</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700 md:divide-y-0">
                            {userDetails.loans.map(loan => (
                                <tr key={loan.id} className="block md:table-row border-b md:border-none border-slate-200 dark:border-slate-700 p-4 md:p-0">
                                    <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 block md:table-cell"><span className="font-bold md:hidden">Book: </span>{loan.bookTitle}</td>
                                    <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm block md:table-cell"><span className="font-bold md:hidden">Status: </span>{statusPill(loan)}</td>
                                    <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell"><span className="font-bold md:hidden">Requested: </span>{formatDate(loan.requestDate)}</td>
                                    <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell"><span className="font-bold md:hidden">Due: </span>{formatDate(loan.dueDate)}</td>
                                    <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell"><span className="font-bold md:hidden">Returned: </span>{formatDate(loan.returnDate)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t dark:border-slate-700">
                <ReactRouterDOM.Link to="/users" className="text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 font-medium">
                    &larr; Back to All Users
                </ReactRouterDOM.Link>
            </div>
        </div>
    )
};

export default UserDetailPage;