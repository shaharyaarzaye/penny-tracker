import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/providers/ThemeProvider';

const primaryFont = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PennyTracker | Smart Expense Manager',
  description: 'Track your spending beautifully.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${primaryFont.className} bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--tw-colors-neutral-900)',
                color: '#fff',
                borderRadius: '1rem',
                border: '1px solid var(--tw-colors-neutral-800)',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                padding: '16px'
              },
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
