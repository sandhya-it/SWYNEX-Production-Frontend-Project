import React from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { ToastNotification } from './components/common/ToastNotification';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CareerProvider } from './context/CareerContext';
import { ApplicationDetailsPage } from './pages/ApplicationDetailsPage';
import { CareerAnalyticsPage } from './pages/CareerAnalyticsPage';
import { DashboardPage } from './pages/DashboardPage';
import { FindJobsPage } from './pages/FindJobsPage';
import { InterviewTrackerPage } from './pages/InterviewTrackerPage';
import { LandingPage } from './pages/LandingPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { SavedJobsPage } from './pages/SavedJobsPage';

const WorkspaceShell: React.FC = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

export default function App() {
  return (
    <CareerProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />

          <Route element={<WorkspaceShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<FindJobsPage />} />
            <Route path="/applications" element={<MyApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailsPage />} />
            <Route path="/interviews" element={<InterviewTrackerPage />} />
            <Route path="/saved" element={<SavedJobsPage />} />
            <Route path="/analytics" element={<CareerAnalyticsPage />} />
            <Route path="/settings" element={<ProfileSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastNotification />
      </BrowserRouter>
    </CareerProvider>
  );
}
