'use client';

import Navigation from './Navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950 font-sans pb-16 lg:pb-0">
      <Navigation />
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen relative transition-all duration-300 bg-neutral-50 dark:bg-neutral-950 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
