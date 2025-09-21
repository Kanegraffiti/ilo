export type Theme = 'light' | 'dark' | 'system';

export function getInitialTheme(reqCookie?: string): Theme {
  if (!reqCookie) return 'system';
  const match = /(?:^|;\s*)ilo-theme=(dark|light)/.exec(reqCookie);
  return match ? (match[1] as Theme) : 'system';
}

export function isDark(theme: Theme): boolean {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

export function setThemeCookie(theme: Theme) {
  if (typeof document === 'undefined') return;
  const value = theme === 'system' ? '' : theme;
  document.cookie = `ilo-theme=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  if (theme === 'system') {
    delete root.dataset.theme;
  } else {
    root.dataset.theme = theme;
  }

  try {
    window.localStorage.setItem('ilo-theme', theme);
  } catch (error) {
    // Ignore write errors (e.g., private browsing)
  }

  setThemeCookie(theme);
}
