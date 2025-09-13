


import React from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { Book } from '../../types';
import Button from '../common/Button';

interface BookTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  isActionsAllowed: boolean;
}

const BookTable: React.FC<BookTableProps> = ({ books, onEdit, onDelete, isActionsAllowed }) => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700 hidden md:table-header-group">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">ISBN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Availability</th>
              {isActionsAllowed && <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700 md:divide-y-0">
            {books.map((book) => (
              <tr key={book.id} className="block md:table-row border-b md:border-none border-slate-200 dark:border-slate-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200 block md:table-cell">
                    <span className="font-bold md:hidden">Title: </span>
                    <ReactRouterDOM.Link to={`/books/${book.id}`} className="hover:text-green-700 dark:hover:text-green-400 hover:underline">{book.title}</ReactRouterDOM.Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell">
                    <span className="font-bold md:hidden">Author: </span>{book.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell">
                    <span className="font-bold md:hidden">ISBN: </span>{book.isbn}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 block md:table-cell">
                  <span className="font-bold md:hidden">Availability: </span>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.availableQuantity > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'}`}>
                      {book.availableQuantity} / {book.quantity} Available
                  </span>
                </td>
                {isActionsAllowed && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 block md:table-cell">
                    <Button variant="secondary" onClick={() => onEdit(book)} className="text-xs px-2 py-1">Edit</Button>
                    <Button variant="danger" onClick={() => onDelete(book.id)} className="text-xs px-2 py-1">Delete</Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookTable;