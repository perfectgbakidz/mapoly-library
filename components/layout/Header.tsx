


import React from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { ADMIN_NAV_ITEMS, USER_NAV_ITEMS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Button from '../common/Button';

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = ReactRouterDOM.useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = user?.role === 'admin' ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;
  
  const currentNavItem = navItems.find(item => location.pathname.startsWith(item.href) && (item.href !== '/' && !item.href.endsWith('dashboard')));
  const defaultNavItem = navItems[0];
  const pageTitle = currentNavItem ? currentNavItem.name : (defaultNavItem ? defaultNavItem.name : 'Dashboard');


  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm p-4 flex justify-between items-center z-20 border-b border-transparent dark:border-slate-700">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="text-slate-600 dark:text-slate-300 md:hidden mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">{pageTitle}</h1>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <span className="text-slate-600 dark:text-slate-300 hidden sm:block">Welcome, {user?.name || 'User'}</span>
        
         <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full text-slate-500 dark:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          )}
        </button>

        {user?.profilePictureUrl ? (
            <img src={user.profilePictureUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
        ) : (
            <div className="w-10 h-10 bg-green-700 dark:bg-green-600 rounded-full flex items-center justify-center text-white font-bold uppercase">
              {user?.name?.[0] || 'U'}
            </div>
        )}

        <Button onClick={logout} variant="secondary" className="text-sm px-3 py-1.5">Logout</Button>
      </div>
    </header>
  );
};

export default Header;