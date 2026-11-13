import { useCallback, useEffect, useState } from 'react';
import { checkStorageAvailability, safeReadStorage, safeWriteStorage } from '../utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storageAvailable] = useState<boolean>(() => checkStorageAvailability());
  const [storageError, setStorageError] = useState<string | null>(() =>
    storageAvailable ? null : 'Browser storage is unavailable. Your data will persist only during this session.'
  );

  const [storedValue, setStoredValue] = useState<T>(() => {
    const { value, error } = safeReadStorage<T>(key, initialValue);
    if (error) {
      setStorageError(error);
    }
    return value;
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const nextValue = value instanceof Function ? value(prev) : value;
        const { error } = safeWriteStorage(key, nextValue);
        setStorageError(error);
        return nextValue;
      });
    },
    [key]
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch {
          // Ignore malformed cross-tab updates
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [storedValue, setValue, { storageAvailable, storageError }] as const;
}
