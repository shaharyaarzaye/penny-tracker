'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Account mapped for ${data.user.username}`);
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Registration failed');
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
           <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">Register</h1>
           <p className="text-neutral-500 text-sm font-medium">Create your secure financial space.</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
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
            {isLoading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm font-medium text-neutral-500 mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          Already a user? <Link href="/login" className="text-neutral-900 dark:text-white font-semibold">Log in</Link>
        </p>
      </div>
    </div>
  );
}
