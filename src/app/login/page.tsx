'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent, isGuest: boolean = false) => {
    e.preventDefault();
    if (!isGuest && (!username.trim() || !password.trim())) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isGuest ? { isGuest: true } : { username, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Welcome back, ${data.user.username}`);
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch {
      toast.error('Network error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black">
      
      <div className="w-full max-w-sm p-8 bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm">
        <div className="text-center mb-8">
           <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">Login</h1>
           <p className="text-neutral-500 text-sm font-medium">Log in to track your expenses.</p>
        </div>
        
        <form onSubmit={(e) => handleLogin(e, false)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded-xl text-neutral-900 dark:text-white transition-all shadow-sm"
              required
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">Password</label>
             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 rounded-xl text-neutral-900 dark:text-white transition-all shadow-sm"
               required
             />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 bg-neutral-900 text-white dark:bg-white dark:text-black font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
          <span className="px-3 text-neutral-400">or</span>
          <div className="h-px bg-neutral-200 dark:bg-neutral-800 flex-1" />
        </div>

        <button
           type="button"
           onClick={(e) => handleLogin(e, true)}
           disabled={isLoading}
           className="w-full py-3 mt-6 bg-transparent border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shadow-sm disabled:opacity-50"
        >
           Preview as Guest
        </button>
        
        <p className="text-center text-sm font-medium text-neutral-500 mt-6">
          Don't have an account? <Link href="/register" className="text-neutral-900 dark:text-white font-semibold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
