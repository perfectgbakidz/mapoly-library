

import React, { useState, useEffect, useCallback } from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import * as api from '../../services/api';
import { Loan, Book, User } from '../../types';
import Spinner from '../common/Spinner';
import { useToast } from '../../hooks/useToast';

interface Activity {
  id: string;
  type: 'loan_request' | 'loan_approved' | 'loan_rejected' | 'book_returned';
  timestamp: Date;
  text: React.ReactNode;
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
    const icons = {
        loan_request: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
        loan_approved: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
        loan_rejected: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
        book_returned: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l4 4m-4-4l4-4m6 9v1a4 4 0 01-4 4H8a4 4 0 01-4-4v-1" /></svg>
        ),
    };
    return <div className="flex-shrink-0 pt-0.5">{icons[type]}</div>;
}


const RecentActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    const processActivities = useCallback((loans: Loan[], books: Book[], users: User[]) => {
        const bookMap = new Map(books.map(b => [b.id, b.title]));
        const userMap = new Map(users.map(u => [u.id, u.name]));
        
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        const generatedActivities: Activity[] = [];

        loans.forEach(loan => {
            // Loan requests today
            if (loan.requestDate === todayStr) {
                generatedActivities.push({
                    id: `loan-${loan.id}-req`,
                    type: 'loan_request',
                    timestamp: new Date(loan.requestDate),
                    text: (
                        <>
                            New loan request from <ReactRouterDOM.Link to={`/users/${loan.userId}`} className="font-semibold text-green-700 hover:underline">{userMap.get(loan.userId) || 'Unknown User'}</ReactRouterDOM.Link> for <ReactRouterDOM.Link to={`/books/${loan.bookId}`} className="font-semibold text-green-700 hover:underline">{bookMap.get(loan.bookId) || 'Unknown Book'}</ReactRouterDOM.Link>.
                        </>
                    )
                });
            }
            // Loan approvals today
            if (loan.approvalDate && loan.approvalDate.startsWith(todayStr)) {
                 generatedActivities.push({
                    id: `loan-${loan.id}-appr`,
                    type: 'loan_approved',
                    timestamp: new Date(loan.approvalDate),
                    text: (
                         <>
                            Loan for <ReactRouterDOM.Link to={`/books/${loan.bookId}`} className="font-semibold text-green-700 hover:underline">{bookMap.get(loan.bookId) || 'Unknown Book'}</ReactRouterDOM.Link> approved for <ReactRouterDOM.Link to={`/users/${loan.userId}`} className="font-semibold text-green-700 hover:underline">{userMap.get(loan.userId) || 'Unknown User'}</ReactRouterDOM.Link>.
                        </>
                    )
                });
            }
            // Book returns today
            if (loan.returnDate && loan.returnDate.startsWith(todayStr)) {
                 generatedActivities.push({
                    id: `loan-${loan.id}-ret`,
                    type: 'book_returned',
                    timestamp: new Date(loan.returnDate),
                    text: (
                         <>
                           <ReactRouterDOM.Link to={`/books/${loan.bookId}`} className="font-semibold text-green-700 hover:underline">{bookMap.get(loan.bookId) || 'Unknown Book'}</ReactRouterDOM.Link> was returned by <ReactRouterDOM.Link to={`/users/${loan.userId}`} className="font-semibold text-green-700 hover:underline">{userMap.get(loan.userId) || 'Unknown User'}</ReactRouterDOM.Link>.
                        </>
                    )
                });
            }
        });
        
        // Due to API limitations (lack of timestamps for book/user creation), activities are limited to loans.
        const sortedActivities = generatedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setActivities(sortedActivities.slice(0, 10)); // Show latest 10 activities for today

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [loans, books, users] = await Promise.all([
                    api.getLoans(),
                    api.getBooks(),
                    api.getUsers()
                ]);
                processActivities(loans, books, users);
            } catch (error) {
                addToast("Failed to fetch recent activities.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [addToast, processActivities]);

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity (Today)</h3>
                <Spinner />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Activity (Today)</h3>
            {activities.length > 0 ? (
                <ul className="space-y-4">
                    {activities.map(activity => (
                        <li key={activity.id} className="flex items-start space-x-3">
                            <ActivityIcon type={activity.type} />
                            <div className="flex-1">
                                <p className="text-sm text-slate-700">{activity.text}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-slate-500 text-center py-4">No new activity today.</p>
            )}
        </div>
    );
};

export default RecentActivityFeed;