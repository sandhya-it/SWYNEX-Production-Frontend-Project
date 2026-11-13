import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

export interface NavbarProps {
  onOpenMobileMenu: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/jobs': 'Find Jobs',
  '/applications': 'My Applications',
  '/interviews': 'Interview Tracker',
  '/saved': 'Saved Jobs',
  '/analytics': 'Career Analytics',
  '/settings': 'Profile & Settings',
};

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileMenu }) => {
  const location = useLocation();

  const currentLabel = location.pathname.startsWith('/applications/')
    ? 'Application Details'
    : ROUTE_TITLES[location.pathname] || 'Workspace';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
          <Link
            to="/dashboard"
            className="hidden text-slate-500 hover:text-slate-900 sm:inline whitespace-nowrap dark:text-slate-400 dark:hover:text-slate-100"
          >
            CareerTrack
          </Link>
          <span className="hidden text-slate-300 sm:inline dark:text-slate-600" aria-hidden="true">
            /
          </span>
          {location.pathname.startsWith('/applications/') ? (
            <>
              <Link
                to="/applications"
                className="text-slate-500 hover:text-slate-900 whitespace-nowrap dark:text-slate-400 dark:hover:text-slate-100"
              >
                My Applications
              </Link>
              <span className="text-slate-300 dark:text-slate-600" aria-hidden="true">
                /
              </span>
              <span className="truncate font-medium text-slate-900 dark:text-slate-100">
                Details
              </span>
            </>
          ) : (
            <span className="truncate font-medium text-slate-900 dark:text-slate-100">
              {currentLabel}
            </span>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <ThemeToggle />
        <Link
          to="/applications?new=1"
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
        >
          <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Add Application</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>
    </header>
  );
};
