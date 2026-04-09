'use client';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
}

export default function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
         <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</p>
         {icon && <div className="text-neutral-400">{icon}</div>}
      </div>
      <p className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">{value}</p>
      {subtitle && <p className="text-xs text-neutral-400 mt-2 font-medium">{subtitle}</p>}
    </div>
  );
}
