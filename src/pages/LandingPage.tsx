import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Compass,
  ShieldCheck,
} from 'lucide-react';
import { Footer } from '../components/layout/Footer';

const ILLUSTRATIVE_STORIES = [
  {
    name: 'Ananya Deshmukh',
    role: 'Final-Year Computer Science Student',
    org: 'Pune Institute of Computer Technology',
    quote:
      'Before CareerTrack, I lost track of 20+ internship deadlines across spreadsheets and browser tabs. Moving everything into the 6-stage Kanban board and interview calendar helped me prepare for 5 technical rounds without missing a single follow-up.',
  },
  {
    name: 'Marcus Alvarez',
    role: 'Junior Frontend Engineer',
    org: 'Remote Product Team (Austin, TX)',
    quote:
      'Searching Remotive directly inside CareerTrack and converting saved roles into tracked applications cut my daily job-search admin time in half. Having conversion analytics showed me which job categories gave me the highest interview callback rate.',
  },
  {
    name: 'Nadia Benali',
    role: 'Product Design Graduate',
    org: 'University of Waterloo Alumni',
    quote:
      'Keeping meeting links, portfolio notes, and countdown timers attached to each interview eliminated last-minute scrambling before remote portfolio reviews, leading to two final-round offers in six weeks.',
  },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Strict 3-zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xs dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="font-display text-xl font-bold tracking-tight text-[#0b162c] whitespace-nowrap shrink-0 dark:text-white"
          >
            CareerTrack
          </Link>

          <nav aria-label="Landing navigation" className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            <a href="#features" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 dark:hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 dark:hover:text-white">
              How It Works
            </a>
            <a href="#benefits" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 dark:hover:text-white">
              Benefits
            </a>
            <Link to="/jobs" className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 dark:hover:text-white">
              Find Jobs
            </Link>
          </nav>

          <div className="shrink-0">
            <Link
              to="/dashboard"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-[#0b162c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0 dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-white py-14 sm:py-20 lg:py-24 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-6">
              <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
                Your Career. Your Progress. Your Next Opportunity.
              </p>
              <h1
                className="mt-3 font-display font-bold tracking-tight text-[#0b162c] text-balance dark:text-white"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
              >
                Your Next Career Move Starts Here.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                Discover opportunities, organize applications, prepare for interviews, and take control of your career journey with CareerTrack.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Link
                  to="/dashboard"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Compass className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span>Explore Opportunities</span>
                </Link>
              </div>
            </div>

            {/* Dashboard Preview Illustration */}
            <div className="lg:col-span-6">
              <div
                aria-label="CareerTrack workspace preview"
                className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between border-b border-slate-200 bg-[#0b162c] px-4 py-3 text-xs text-slate-300 dark:border-slate-800">
                  <span className="font-display font-semibold text-white">CareerTrack Workspace</span>
                  <span>Dashboard · Pipeline · Interviews</span>
                </div>

                <div className="space-y-4 p-5">
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: 'Applications', val: '18' },
                      { label: 'In Review', val: '7' },
                      { label: 'Interviews', val: '4' },
                      { label: 'Offers', val: '2' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950"
                      >
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</p>
                        <p className="mt-1 font-display text-xl font-bold text-slate-900 tabular-nums dark:text-white">
                          {stat.val}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                    <div className="rounded-lg border border-slate-200 bg-white p-3.5 sm:col-span-3 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Pipeline Distribution
                      </p>
                      <div className="mt-4 flex h-24 items-end gap-2.5">
                        {[
                          { h: '70%', label: 'Applied', color: 'bg-slate-400' },
                          { h: '52%', label: 'Review', color: 'bg-blue-600' },
                          { h: '38%', label: 'Shortlist', color: 'bg-indigo-600' },
                          { h: '45%', label: 'Interview', color: 'bg-amber-500' },
                          { h: '22%', label: 'Offer', color: 'bg-emerald-600' },
                        ].map((bar) => (
                          <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5">
                            <div className="flex h-16 w-full items-end">
                              <div className={`w-full rounded-t ${bar.color}`} style={{ height: bar.h }} />
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">{bar.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-3.5 sm:col-span-2 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Next Interview
                      </p>
                      <div className="mt-3 space-y-2 text-xs">
                        <p className="font-medium text-slate-900 dark:text-white">Frontend Intern</p>
                        <p className="text-slate-500 dark:text-slate-400">CloudScale · Technical Round</p>
                        <p className="font-mono text-[11px] font-medium text-blue-600 tabular-nums dark:text-blue-400">
                          In 1d 4h · Online
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Everything required to run an organized job search
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
              Built for students, graduates, and job seekers who want real visibility over every role, deadline, and interview stage.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-12">
            <div className="rounded-xl border border-slate-200 bg-white p-6 md:col-span-7 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">01.</span>
                <Compass className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Remote Job Discovery via Remotive API
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Search remote roles by keyword, company, or skill. Filter by category, employment type, and location, inspect formatted descriptions safely, bookmark openings, and send any role directly to your application tracker.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 md:col-span-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">02.</span>
                <Briefcase className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Table &amp; Drag-and-Drop Kanban
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Switch effortlessly between a searchable data table and a 6-column Kanban board covering Applied, Under Review, Shortlisted, Interview Scheduled, Offer Received, and Rejected.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 md:col-span-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">03.</span>
                <CalendarClock className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Interview Schedule &amp; Countdowns
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Track upcoming interview rounds in both list and monthly calendar layouts with countdown timers, video links, and preparation notes.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 md:col-span-7 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">04.</span>
                <BarChart3 className="h-5 w-5 text-slate-400" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-slate-900 dark:text-white">
                Real-Data Career Analytics
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Every chart, conversion rate, and category breakdown is calculated directly from your stored applications—with clear empty states when starting fresh and one-click JSON export and import.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              How CareerTrack Works
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  step: '01. Discover & Save',
                  desc: 'Query real remote job listings from Remotive, review requirements and salary info, and bookmark promising roles.',
                },
                {
                  step: '02. Track Every Stage',
                  desc: 'Add roles to My Applications with one click, record follow-up dates, and move cards across pipeline stages as you hear back.',
                },
                {
                  step: '03. Prepare & Analyze',
                  desc: 'Schedule interview rounds with countdown reminders and monitor your conversion rate across categories in Career Analytics.',
                },
              ].map((item) => (
                <div key={item.step} className="border-t border-slate-200 pt-5 dark:border-slate-800">
                  <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                    {item.step}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits & Illustrative Testimonials */}
        <section id="benefits" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
                Built for clarity, speed, and data ownership
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Your job search workspace runs directly in your browser with automatic LocalStorage persistence and portable JSON backups.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-200">
                {[
                  'No mandatory account creation or paywall to start tracking',
                  'Duplicate prevention on both saved jobs and application entries',
                  'Safe sanitized rendering of external job descriptions',
                  'Full light and dark theme support with accessible controls',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  Candidate Workflow Examples
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Illustrative sample stories
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {ILLUSTRATIVE_STORIES.map((story) => (
                  <article
                    key={story.name}
                    className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      "{story.quote}"
                    </p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {story.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {story.role} · {story.org}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
