import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Unable to load data',
  message,
  onRetry,
  retryLabel = 'Try Again',
}) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50/70 p-5 sm:flex-row sm:items-center dark:border-red-900/60 dark:bg-red-950/30"
    >
      <div className="flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
          <AlertCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-red-900 dark:text-red-200">{title}</h3>
          <p className="mt-1 text-sm text-red-800/90 dark:text-red-300/90">{message}</p>
        </div>
      </div>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
