'use client';
import { useExpenseStore, PeriodFilter } from '@/store/expenseStore';

const periods: { value: PeriodFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: '7 Days' },
  { value: 'month', label: '30 Days' },
  { value: 'all', label: 'All Time' },
];

export default function PeriodFilterBar() {
  const { periodFilter, setPeriodFilter, fetchExpenses } = useExpenseStore();

  const handleChange = (period: PeriodFilter) => {
    setPeriodFilter(period);
    setTimeout(() => fetchExpenses(), 0);
  };

  return (
    <div className="flex p-1 bg-neutral-200/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-xl w-fit border border-neutral-200 dark:border-neutral-800 shadow-inner">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => handleChange(period.value)}
          className={`px-4 py-1.5 text-sm font-semibold transition-all rounded-lg
                     ${periodFilter === period.value
                       ? 'bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white shadow-sm'
                       : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-neutral-800/50 bg-transparent'
                     }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
