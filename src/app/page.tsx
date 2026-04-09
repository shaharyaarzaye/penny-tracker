import Link from 'next/link';
import { HiArrowRight } from 'react-icons/hi';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">

      <header className="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center z-10 sticky top-0 bg-white dark:bg-black">
        <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">PennyTracker</h1>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition">Sign In</Link>
          <Link href="/register" className="px-5 py-2 text-sm font-semibold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-80 transition flex items-center gap-2">
            Get Started <HiArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center px-6 text-center max-w-4xl mx-auto w-full z-10 py-20">
        
        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.1] mb-6">
          Absolute control over your <span className="text-neutral-500 dark:text-neutral-400">financial reality.</span>
        </h2>
        
        <p className="text-neutral-500 dark:text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
          Stripped down expense tracking. Pure logic. Minimal distractions. Beautiful analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/register" className="px-8 py-4 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold rounded-2xl hover:opacity-80 transition-all w-full sm:w-auto text-center">
            Open Dashboard
          </Link>
          <form action="/api/auth/login" method="POST" className="w-full sm:w-auto">
             <input type="hidden" name="isGuest" value="true" />
             <button type="submit" className="px-8 py-4 bg-transparent text-neutral-900 dark:text-white font-semibold border border-neutral-200 dark:border-neutral-800 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all w-full text-center">
               Explore Sandbox
             </button>
          </form>
        </div>
      </main>

    </div>
  );
}
