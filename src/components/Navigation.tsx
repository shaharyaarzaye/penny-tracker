'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiOutlineHome, HiOutlineClock } from 'react-icons/hi';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { href: '/expenses', label: 'History', icon: HiOutlineClock },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-64 z-40 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex-col font-sans">
        <div className="p-8">
          <h1 className="text-xl font-bold tracking-tighter  text-neutral-900 dark:text-white">PennyTracker</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold uppercase tracking-widest rounded-md transition-colors
                           ${isActive 
                             ? 'bg-neutral-900 text-white dark:bg-white dark:text-black' 
                             : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800'
                           }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex justify-around items-center h-16 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
             <Link
               key={item.href}
               href={item.href}
               className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors
                          ${isActive 
                            ? 'text-neutral-900 dark:text-white bg-neutral-200 dark:bg-neutral-800' 
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                          }`}
             >
               <Icon className="w-6 h-6" />
               <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
             </Link>
          );
        })}
      </nav>
    </>
  );
}
