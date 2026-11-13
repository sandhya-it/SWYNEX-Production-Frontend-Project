import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { storageAvailable, storageError } = useCareer();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onOpenMobileMenu={() => setMobileOpen(true)} />
        {(!storageAvailable || storageError) && (
          <div
            role="status"
            className="flex items-center gap-2.5 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-xs text-amber-900 sm:px-6 lg:px-8 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {storageError ||
                'Browser LocalStorage is currently unavailable. Data is held in memory for this session only.'}
            </span>
          </div>
        )}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
