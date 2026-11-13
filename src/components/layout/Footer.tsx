import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-8 sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <Link
            to="/"
            className="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white"
          >
            CareerTrack
          </Link>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Your Career. Your Progress. Your Next Opportunity. · Remote listings sourced from{' '}
            <a
              href="https://remotive.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Remotive
            </a>
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
          <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white">
            Dashboard
          </Link>
          <Link to="/jobs" className="hover:text-slate-900 dark:hover:text-white">
            Find Jobs
          </Link>
          <Link to="/applications" className="hover:text-slate-900 dark:hover:text-white">
            Applications
          </Link>
          <Link to="/interviews" className="hover:text-slate-900 dark:hover:text-white">
            Interviews
          </Link>
          <Link to="/analytics" className="hover:text-slate-900 dark:hover:text-white">
            Analytics
          </Link>
          <a
            href="mailto:support@careertrack.app"
            className="hover:text-slate-900 dark:hover:text-white"
          >
            support@careertrack.app
          </a>
        </div>
      </div>
    </footer>
  );
};
