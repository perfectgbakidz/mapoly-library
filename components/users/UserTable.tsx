


import React from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { User } from '../../types';
import Button from '../common/Button';

interface UserTableProps {
  users: User[];
  onDelete: (id: number) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-700 hidden md:table-header-group">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Matric No / Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700 md:divide-y-0">
          {users.map((user) => (
            <tr key={user.id} className="block md:table-row border-b md:border-none border-slate-200 dark:border-slate-700 p-4 md:p-0">
              <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 block md:table-cell">
                 <span className="font-bold md:hidden">Name: </span>
                 <ReactRouterDOM.Link to={`/users/${user.id}`} className="hover:text-green-700 dark:hover:text-green-400 hover:underline">{user.name}</ReactRouterDOM.Link>
              </td>
              <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell">
                <span className="font-bold md:hidden">Matric/ID: </span>{user.matric_no}
              </td>
              <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell">
                <span className="font-bold md:hidden">Department: </span>{user.department}
              </td>
              <td className="px-6 py-2 md:py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell">
                <span className="font-bold md:hidden">Role: </span>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300' : 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300'
                }`}>
                    {user.role}
                </span>
              </td>
              <td className="px-6 py-2 md:py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 block md:table-cell">
                <Button variant="danger" onClick={() => onDelete(user.id)} className="text-xs px-2 py-1">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        </div>
    </div>
  );
};

export default UserTable;