export function checkStorageAvailability(): boolean {
  try {
    const testKey = '__careertrack_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function safeReadStorage<T>(key: string, fallback: T): { value: T; error: string | null } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { value: fallback, error: 'Browser storage is unavailable.' };
    }
    const raw = window.localStorage.getItem(key);
    if (raw === null) {
      return { value: fallback, error: null };
    }
    const parsed = JSON.parse(raw) as T;
    return { value: parsed, error: null };
  } catch {
    return { value: fallback, error: 'Unable to read browser storage data.' };
  }
}

export function safeWriteStorage<T>(key: string, value: T): { ok: boolean; error: string | null } {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { ok: false, error: 'Browser storage is unavailable.' };
    }
    window.localStorage.setItem(key, JSON.stringify(value));
    return { ok: true, error: null };
  } catch {
    return {
      ok: false,
      error: 'Browser storage is unavailable or full. Changes remain active only for this session.',
    };
  }
}

export function safeRemoveStorage(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage removal errors gracefully
  }
}
