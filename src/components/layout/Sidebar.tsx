import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  BarChart3,
  Bookmark,
  Briefcase,
  CalendarClock,
  Compass,
  LayoutDashboard,
  Settings,
  X,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

export interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/jobs', label: 'Find Jobs', icon: Compass },
  { to: '/applications', label: 'My Applications', icon: Briefcase },
  { to: '/interviews', label: 'Interview Tracker', icon: CalendarClock },
  { to: '/saved', label: 'Saved Jobs', icon: Bookmark },
  { to: '/analytics', label: 'Career Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Profile & Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { applications, savedJobs, interviews, profile } = useCareer();

  const upcomingCount = interviews.filter((i) => !i.completed).length;

  const getBadgeCount = (path: string): number | null => {
    if (path === '/applications' && applications.length > 0) return applications.length;
    if (path === '/saved' && savedJobs.length > 0) return savedJobs.length;
    if (path === '/interviews' && upcomingCount > 0) return upcomingCount;
    return null;
  };

  const navContent = (
    <div className="flex h-full flex-col bg-[#0b162c] text-slate-100">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
        <Link
          to="/"
          onClick={onCloseMobile}
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          CareerTrack
        </Link>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white lg:hidden cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav aria-label="Workspace navigation" className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => {
          const count = getBadgeCount(to);
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex min-h-10 items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{label}</span>
                  </span>
                  {count !== null && (
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          to="/settings"
          onClick={onCloseMobile}
          className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/8"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600/20 font-display text-sm font-semibold text-blue-300">
            {(profile.fullName || 'CT').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {profile.fullName || 'Personal Workspace'}
            </p>
            <p className="truncate text-xs text-slate-400">
              {profile.headline || 'Local browser profile'}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200 dark:border-slate-800 lg:block">
        <div className="sticky top-0 h-screen">{navContent}</div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 w-72 max-w-[85vw] shadow-xl">{navContent}</div>
        </div>
      )}
    </>
  );
};
