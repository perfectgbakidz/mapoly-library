


import React from 'react';
// FIX: Changed react-router-dom import to namespace import to fix module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { SOCIAL_LINKS } from '../../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 body-font z-20">
      <div className="container px-5 py-4 mx-auto flex items-center sm:flex-row flex-col">
        <p className="text-sm text-slate-500 dark:text-slate-400 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-slate-200 dark:sm:border-slate-700 sm:py-2 sm:mt-0 mt-4">
          © 2024 Moshood Abiola Polytechnic —
          <a href="https://twitter.com/mapolyinfo" className="text-slate-600 dark:text-slate-300 ml-1" rel="noopener noreferrer" target="_blank">@mapolyinfo</a>
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <ReactRouterDOM.Link to="/terms" className="text-sm text-slate-500 hover:text-green-600 dark:hover:text-green-400">Terms & Conditions</ReactRouterDOM.Link>
            <ReactRouterDOM.Link to="/privacy" className="text-sm text-slate-500 hover:text-green-600 dark:hover:text-green-400">Privacy Policy</ReactRouterDOM.Link>
        </nav>
        <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            {SOCIAL_LINKS.map(link => (
                <a key={link.name} href={link.href} className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 ml-3">
                    {link.icon}
                </a>
            ))}
        </span>
      </div>
    </footer>
  );
};

export default Footer;