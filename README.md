# CareerTrack — Smart Job & Internship Management Platform

**Tagline:** *Your Career. Your Progress. Your Next Opportunity.*

CareerTrack is a responsive, production-ready career management dashboard built with React, Vite, Tailwind CSS, Recharts, and the Remotive Public Remote Jobs API. It helps students, fresh graduates, and job seekers discover remote opportunities, organize applications across a 6-stage Kanban pipeline, schedule interviews with countdown reminders, and track analytics directly from browser-local storage.

---

## Features

- **Public Landing Page (`/`)**: Value proposition, workspace preview, numbered capabilities, workflow breakdown, and illustrative candidate stories.
- **Personalized Dashboard (`/dashboard`)**: Real-time summary metrics calculated from stored applications and interviews, pipeline status chart, recent applications, upcoming interview countdowns, quick actions, activity timeline, and recommended remote roles.
- **Find Remote Jobs (`/jobs`)**:
  - Live integration with the official Remotive Remote Jobs API (`https://remotive.com/api/remote-jobs`).
  - Search by title, keywords, company name, or skills with `AbortController` request cancellation.
  - Filter by job category, employment type, worldwide/anywhere remote status, and location, plus sorting and pagination.
  - Safe DOMParser-based HTML rendering (`src/utils/sanitizeHtml.tsx`) without `dangerouslySetInnerHTML`.
  - 6-hour LocalStorage + in-memory response caching to respect Remotive API rate guidelines.
  - Explicit error states (offline network, 403, 404, 429, 5xx, invalid JSON) with retry support.
- **My Applications (`/applications` & `/applications/:id`)**:
  - Full CRUD (Add, Edit, Delete with confirmation dialog) across 6 stages: `Applied`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Offer Received`, `Rejected`.
  - Switch between a searchable **Table View** and a drag-and-drop **Kanban Board** (with keyboard-accessible status selectors).
  - Duplicate prevention and dedicated **Application Details** page with linked interviews.
- **Interview Tracker (`/interviews`)**:
  - Schedule, edit, complete, and delete interviews (`Online`, `In-person`, `Phone`) with countdown timers and preparation notes.
  - Switch between **List View** (Upcoming / Completed / All) and **Monthly Calendar View**.
- **Saved Jobs (`/saved`)**: Bookmark remote opportunities, search/filter bookmarks, inspect full descriptions, and convert saved jobs into tracked applications.
- **Career Analytics (`/analytics`)**: Real Recharts visualizations (Status Bar Chart, Category Pie Chart, Monthly Activity Line Chart) plus calculated Interview Conversion Rate and Offer Rate with clean zero-data empty states.
- **Profile & Settings (`/settings`)**: Candidate profile preferences, Light/Dark theme toggle, validated JSON Export & Import backup tools, and selective data clearing.

---

## Technology Stack

- **Frontend Framework**: React 19, TypeScript, Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 with CSS design tokens (`src/styles/tokens.css`) and `.dark` theme support
- **Icons**: Lucide React
- **Charts**: Recharts
- **State & Persistence**: React Context API + custom hooks (`useJobs`, `useApplications`, `useSavedJobs`, `useInterviews`, `useLocalStorage`, `useTheme`) backed by browser `LocalStorage`

---

## API Integration Documentation

CareerTrack integrates directly with the **Remotive Public Remote Jobs API**:

- **Base Endpoint**: `https://remotive.com/api/remote-jobs`
- **Search Query Example**: `https://remotive.com/api/remote-jobs?search=frontend&limit=60`

### Compliance & Reliability Measures
- Validates HTTP status codes (`404`, `429`, `403`, `5xx`) and JSON response shape before rendering.
- Cancels overlapping in-flight requests using `AbortController`.
- Caches responses per query for 6 hours to avoid excessive polling.
- Credits Remotive as the listing source, links back to each original Remotive URL, and notes the up-to-24-hour listing delay per Remotive's public API terms.

---

## Project Structure

```text
src/
  components/
    applications/    # ApplicationCard, ApplicationForm, ApplicationTable, KanbanBoard, StatusBadge
    common/          # Button, ConfirmationDialog, ErrorMessage, Input, LoadingSkeleton, Modal, Pagination, Select, ThemeToggle, ToastNotification
    dashboard/       # ActivityTimeline, AnalyticsChart, EmptyState, StatCard
    interviews/      # InterviewCalendar, InterviewCard, InterviewForm
    jobs/            # JobCard, JobDetails, JobFilters, JobSearchBar, SaveJobButton
    layout/          # DashboardLayout, Footer, Navbar, PageHeader, Sidebar
  context/           # CareerContext.tsx
  hooks/             # useApplications, useInterviews, useJobs, useLocalStorage, useSavedJobs, useTheme
  pages/             # LandingPage, DashboardPage, FindJobsPage, MyApplicationsPage, ApplicationDetailsPage, InterviewTrackerPage, SavedJobsPage, CareerAnalyticsPage, ProfileSettingsPage, NotFoundPage
  services/          # jobApi.ts
  styles/            # tokens.css
  types/             # career.ts
  utils/             # formatters.ts, sanitizeHtml.tsx, storage.ts
  App.tsx
  main.tsx
```

---

## Local Installation & Development

```bash
# 1. Install dependencies
npm install

# 2. Start development server on port 3000
npm run dev

# 3. Type-check
npm run lint

# 4. Build for production
npm run build
```

---

## Vercel Deployment Guide

CareerTrack is pre-configured for zero-backend static SPA deployment on **Vercel** via `vercel.json`:

- **Framework Preset**: `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **SPA Routing**: Configured via `vercel.json` rewrites (`/(.*) -> /index.html`) so direct visits or browser refreshes on routes like `/jobs`, `/applications`, or `/analytics` resolve properly.

### Deploy Steps
1. Push the repository to GitHub.
2. Import the repository in the Vercel Dashboard.
3. Keep the default Vite settings (`npm run build` / `dist`) and click **Deploy**.

---

## Screenshots

- *Landing Page*: Hero section, interactive dashboard preview, numbered capabilities, and workflow guide.
- *Dashboard*: Live stat cards, application status bar chart, upcoming interview countdowns, and Remotive recommendations.
- *Find Jobs*: Search bar, category/type/location filters, job cards, and safe sanitized job description modal.
- *My Applications*: Searchable data table and 6-column drag-and-drop Kanban board.
- *Interview Tracker*: List countdown cards and interactive monthly calendar view.
- *Career Analytics*: Status bar chart, category donut chart, and monthly trend line chart.
