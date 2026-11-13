import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950">
      <p className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
        Page Not Found
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        The CareerTrack route you requested does not exist or may have moved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link to="/dashboard">
          <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>Go to Dashboard</Button>
        </Link>
        <Link to="/jobs">
          <Button variant="outline" leftIcon={<Compass className="h-4 w-4" />}>
            Find Jobs
          </Button>
        </Link>
      </div>
    </div>
  );
};
