'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out');
      window.location.href = '/login';
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-neutral-50/90 dark:bg-neutral-950/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 py-5 lg:px-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">{title}</h1>
          {subtitle && <p className="text-xs text-neutral-500 mt-1 uppercase tracking-wider hidden sm:block">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white uppercase tracking-widest transition-colors py-2"
            >
              {theme === 'dark' ? 'LIGHT' : 'DARK'}
            </button>
          )}
          
          <span className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 hidden sm:block"></span>

          <button
            onClick={handleLogout}
            className="text-xs font-bold text-neutral-500 hover:text-red-500 uppercase tracking-widest transition-colors py-2"
          >
            LOGOUT
          </button>
        </div>
      </div>
    </header>
  );
}
