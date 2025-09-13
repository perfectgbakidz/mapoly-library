

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from '../common/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="relative flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
           <div 
              className="absolute inset-0 bg-cover bg-center z-0" 
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop)', 
              }}
            ></div>
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 z-0"></div>
            <div className="relative z-10">
              {children}
            </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;