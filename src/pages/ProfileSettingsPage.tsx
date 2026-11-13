import React, { useEffect, useRef, useState } from 'react';
import { Download, Info, Trash2, Upload } from 'lucide-react';
import { Button } from '../components/common/Button';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { PageHeader } from '../components/layout/PageHeader';
import { useCareer } from '../context/CareerContext';
import { useJobs } from '../hooks/useJobs';
import { UserProfile } from '../types/career';
import { validateCareerImportPayload } from '../utils/formatters';

function arrayToCsv(items: string[]): string {
  return items.join(', ');
}

function csvToArray(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export const ProfileSettingsPage: React.FC = () => {
  const {
    profile,
    updateProfile,
    clearApplicationsData,
    clearSavedJobsData,
    exportCareerData,
    importCareerData,
    addToast,
  } = useCareer();
  const { clearSearchHistory, searchHistory } = useJobs(10);

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [headline, setHeadline] = useState(profile.headline);
  const [interestsText, setInterestsText] = useState(arrayToCsv(profile.careerInterests));
  const [skillsText, setSkillsText] = useState(arrayToCsv(profile.skills));
  const [locationsText, setLocationsText] = useState(arrayToCsv(profile.preferredLocations));
  const [employmentType, setEmploymentType] = useState(profile.preferredEmploymentType || 'Any');
  const [emailError, setEmailError] = useState('');

  const [confirmAction, setConfirmAction] = useState<
    null | 'applications' | 'saved' | 'history'
  >(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setHeadline(profile.headline);
    setInterestsText(arrayToCsv(profile.careerInterests));
    setSkillsText(arrayToCsv(profile.skills));
    setLocationsText(arrayToCsv(profile.preferredLocations));
    setEmploymentType(profile.preferredEmploymentType || 'Any');
  }, [profile]);

  const handleProfileSave = (event: React.FormEvent) => {
    event.preventDefault();
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setEmailError('');

    const nextProfile: UserProfile = {
      fullName: fullName.trim(),
      email: email.trim(),
      headline: headline.trim(),
      careerInterests: csvToArray(interestsText),
      skills: csvToArray(skillsText),
      preferredLocations: csvToArray(locationsText),
      preferredEmploymentType: employmentType,
    };
    updateProfile(nextProfile);
  };

  const handleExportJson = () => {
    const payload = exportCareerData();
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `careertrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'JSON backup downloaded');
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const validation = validateCareerImportPayload(parsed);
      if (validation.valid === false) {
        addToast('error', 'Import failed', validation.error);
        return;
      }
      importCareerData(validation.data);
    } catch {
      addToast('error', 'Invalid JSON file', 'Could not parse the selected file as valid JSON.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile & Settings"
        subtitle="Configure your personal career preferences, workspace appearance, and portable JSON backups."
      />

      {/* Transparent Local Workspace Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <div>
          <p className="font-semibold">Browser-Local Personal Workspace</p>
          <p className="mt-0.5 text-xs leading-relaxed text-blue-800/90 dark:text-blue-300/90">
            CareerTrack stores your profile, applications, interviews, and saved jobs locally in your browser&apos;s LocalStorage. There is no multi-user authentication or remote cloud synchronization. Use the JSON export below whenever you want to back up or transfer your data to another device.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Profile Form */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            Candidate Profile
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Keep your target roles, skills, and location preferences handy.
          </p>

          <form onSubmit={handleProfileSave} className="mt-5 space-y-4" noValidate>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                placeholder="e.g. Priya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                error={emailError}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Input
              label="Professional Headline"
              placeholder="e.g. Final-Year CS Student · React & TypeScript Developer"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />

            <Input
              label="Career Interests (comma-separated)"
              placeholder="e.g. Frontend Engineering, Product Design, Developer Tools"
              value={interestsText}
              onChange={(e) => setInterestsText(e.target.value)}
            />

            <Input
              label="Skills (comma-separated)"
              placeholder="e.g. React, TypeScript, Tailwind CSS, Node.js, SQL"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Preferred Job Locations (comma-separated)"
                placeholder="e.g. Remote, Worldwide, Europe"
                value={locationsText}
                onChange={(e) => setLocationsText(e.target.value)}
              />
              <Select
                label="Preferred Employment Type"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                options={[
                  { label: 'Any Employment Type', value: 'Any' },
                  { label: 'Full Time', value: 'Full Time' },
                  { label: 'Internship', value: 'Internship' },
                  { label: 'Contract', value: 'Contract' },
                  { label: 'Part Time', value: 'Part Time' },
                ]}
              />
            </div>

            <div className="pt-2">
              <Button type="submit">Save Profile</Button>
            </div>
          </form>
        </section>

        {/* Appearance & Data Controls */}
        <div className="space-y-6 lg:col-span-5">
          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Appearance
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Switch between light and dark interface themes.
            </p>
            <div className="mt-4">
              <ThemeToggle showLabel />
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Backup &amp; Restore (JSON)
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Export all workspace records as JSON or restore from a validated CareerTrack backup file.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <Button
                variant="outline"
                onClick={handleExportJson}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Upload className="h-4 w-4" />}
              >
                Import JSON
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImportFile}
                className="sr-only"
                aria-label="Import CareerTrack JSON backup file"
              />
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              Data Cleanup
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Clear specific datasets stored in your browser. Confirmations are required before deletion.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction('applications')}
                leftIcon={<Trash2 className="h-3.5 w-3.5 text-red-600" />}
                className="justify-start"
              >
                Clear Application Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction('saved')}
                leftIcon={<Trash2 className="h-3.5 w-3.5 text-red-600" />}
                className="justify-start"
              >
                Clear Saved Jobs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmAction('history')}
                leftIcon={<Trash2 className="h-3.5 w-3.5 text-red-600" />}
                className="justify-start"
              >
                Clear Search History ({searchHistory.length})
              </Button>
            </div>
          </section>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction === 'applications') clearApplicationsData();
          if (confirmAction === 'saved') clearSavedJobsData();
          if (confirmAction === 'history') {
            clearSearchHistory();
            addToast('info', 'Search history and job cache cleared');
          }
        }}
        title="Confirm Data Removal"
        message={
          confirmAction === 'applications'
            ? 'This will permanently delete all tracked applications from this browser.'
            : confirmAction === 'saved'
            ? 'This will remove all bookmarked jobs from Saved Jobs.'
            : 'This will clear your recent job search terms and cached API responses.'
        }
        confirmLabel="Clear Data"
      />
    </div>
  );
};
